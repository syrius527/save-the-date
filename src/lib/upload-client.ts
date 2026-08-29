import { ALLOWED_TYPES, MAX_FILE_BYTES, SIGN_BATCH_MAX } from "@/lib/validation";

export interface PendingUpload {
  id: string;
  file: File;
  previewUrl: string;
  width: number | null;
  height: number | null;
  progress: number; // 0..1
  status: "signing" | "uploading" | "done" | "error";
  key: string | null;
}

export interface FileRejection {
  name: string;
  reason: string;
}

// HEIC 매직바이트 스니핑 — 변환/압축은 하지 않고 안내 후 거부한다
async function looksLikeHeic(file: File): Promise<boolean> {
  try {
    const buf = new Uint8Array(await file.slice(0, 24).arrayBuffer());
    const ascii = Array.from(buf)
      .map((b) => String.fromCharCode(b))
      .join("");
    return /ftyp(heic|heix|hevc|heif|mif1)/.test(ascii);
  } catch {
    return false;
  }
}

export async function validateFiles(
  files: File[],
): Promise<{ accepted: File[]; rejected: FileRejection[] }> {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) {
      rejected.push({
        name: f.name,
        reason: "사진 한 장당 25MB까지 올릴 수 있어요.",
      });
      continue;
    }
    const typeOk = (ALLOWED_TYPES as readonly string[]).includes(f.type);
    if (!typeOk) {
      const heic = f.type === "image/heic" || f.type === "image/heif" ||
        (f.type === "" && (await looksLikeHeic(f)));
      rejected.push({
        name: f.name,
        reason: heic
          ? "HEIC 형식은 지원되지 않아요. '사진' 앱에서 선택하거나 JPEG로 저장 후 올려주세요."
          : "JPEG · PNG · WebP 사진만 올릴 수 있어요.",
      });
      continue;
    }
    accepted.push(f);
  }
  return { accepted, rejected };
}

export function readDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

async function signBatch(
  files: File[],
): Promise<{ key: string; url: string }[]> {
  const res = await fetch("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `업로드 준비 실패 (${res.status})`);
  }
  const body = (await res.json()) as {
    uploads: { key: string; url: string }[];
  };
  return body.uploads;
}

// fetch는 업로드 진행률을 못 잡는다(업로드 스트림은 Safari 미지원) → XHR
function xhrPut(
  url: string,
  file: File,
  onProgress: (frac: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`업로드 실패 (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("네트워크 오류로 업로드에 실패했어요"));
    // File 객체를 그대로 전송 — 재인코딩/압축 없음, 원본 바이트 보존
    xhr.send(file);
  });
}

const CONCURRENCY = 3;
const MAX_ATTEMPTS = 3;

export class UploadPool {
  items: PendingUpload[] = [];
  private active = 0;
  private queue: string[] = [];

  constructor(private onChange: (items: PendingUpload[]) => void) {}

  private emit() {
    this.onChange([...this.items]);
  }

  private patch(id: string, patch: Partial<PendingUpload>) {
    const it = this.items.find((i) => i.id === id);
    if (!it) return;
    Object.assign(it, patch);
    this.emit();
  }

  async add(files: File[]) {
    const newItems: PendingUpload[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      width: null,
      height: null,
      progress: 0,
      status: "signing",
      key: null,
    }));
    this.items.push(...newItems);
    this.emit();

    // 치수는 백그라운드로 읽는다 (썸네일 박스 안정화용, 실패해도 무방)
    for (const it of newItems) {
      readDimensions(it.file).then((d) => {
        if (d) this.patch(it.id, { width: d.width, height: d.height });
      });
    }

    // 배치 서명 후 업로드 큐에 투입
    for (let i = 0; i < newItems.length; i += SIGN_BATCH_MAX) {
      const chunk = newItems.slice(i, i + SIGN_BATCH_MAX);
      try {
        const signed = await signBatch(chunk.map((c) => c.file));
        chunk.forEach((c, j) => {
          this.patch(c.id, { key: signed[j].key, status: "uploading" });
          (c as PendingUpload & { signedUrl?: string }).signedUrl =
            signed[j].url;
          this.queue.push(c.id);
        });
      } catch {
        chunk.forEach((c) => this.patch(c.id, { status: "error" }));
      }
    }
    this.pump();
  }

  remove(id: string) {
    const it = this.items.find((i) => i.id === id);
    if (it) URL.revokeObjectURL(it.previewUrl);
    this.items = this.items.filter((i) => i.id !== id);
    this.queue = this.queue.filter((q) => q !== id);
    this.emit();
    // 이미 업로드된 객체는 cron이 미클레임 티켓으로 정리한다
  }

  retry(id: string) {
    const it = this.items.find((i) => i.id === id);
    if (!it || it.status !== "error") return;
    this.patch(id, { status: "uploading", progress: 0 });
    this.queue.push(id);
    this.pump();
  }

  clear() {
    this.items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    this.items = [];
    this.queue = [];
    this.emit();
  }

  get busy(): boolean {
    return this.items.some(
      (i) => i.status === "signing" || i.status === "uploading",
    );
  }

  get failed(): PendingUpload[] {
    return this.items.filter((i) => i.status === "error");
  }

  private pump() {
    while (this.active < CONCURRENCY && this.queue.length > 0) {
      const id = this.queue.shift()!;
      this.active++;
      this.run(id).finally(() => {
        this.active--;
        this.pump();
      });
    }
  }

  private async run(id: string) {
    const it = this.items.find((i) => i.id === id) as
      | (PendingUpload & { signedUrl?: string })
      | undefined;
    if (!it) return;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        let url = it.signedUrl;
        // 재시도 시 서명 만료 대비 새 URL 발급
        if (attempt > 1 || !url) {
          const [signed] = await signBatch([it.file]);
          it.key = signed.key;
          url = signed.url;
          it.signedUrl = signed.url;
        }
        await xhrPut(url!, it.file, (frac) =>
          this.patch(id, { progress: frac }),
        );
        this.patch(id, { status: "done", progress: 1 });
        return;
      } catch {
        if (attempt === MAX_ATTEMPTS) this.patch(id, { status: "error" });
        else await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }
}
