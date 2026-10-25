import { NextRequest, NextResponse } from "next/server";
import {
  ALLOWED_TYPES,
  guestbookPostSchema,
  MAX_FILE_BYTES,
} from "@/lib/validation";
import { headObject, publicUrl, r2Configured } from "@/lib/storage/r2";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { fetchGuestbookPage } from "@/lib/guestbook-data";
import { ipHashOf } from "@/lib/request";
import { chunk } from "@/lib/chunk";
import type { GuestbookEntryDTO } from "@/lib/types";

export const runtime = "nodejs";

// `.in()` 키 목록은 URL로 가므로 100개씩, insert 본문은 500행씩 나눠 보낸다
const KEY_CHUNK = 100;
const ROW_CHUNK = 500;
// headObject 동시 요청 수 — 수백 장도 함수 타임아웃 안에 끝나도록
const HEAD_CONCURRENCY = 25;

type Db = ReturnType<typeof supabaseAdmin>;

// 이번 요청이 클레임한 티켓만 되돌린다 — 실패 후 같은 사진으로 다시 올릴 수 있게
async function unclaim(db: Db, keys: string[]) {
  for (const part of chunk(keys, KEY_CHUNK)) {
    try {
      await db
        .from("upload_tickets")
        .update({ claimed: false })
        .in("object_key", part);
    } catch {
      // 되돌리기 실패는 원래 오류 응답을 막지 않는다
    }
  }
}

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;
  const page = await fetchGuestbookPage(cursor, 10);
  return NextResponse.json(page);
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "방명록이 아직 준비되지 않았어요" },
      { status: 503 },
    );
  }
  const parsed = guestbookPostSchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }
  const { name, message, website, photos } = parsed.data;
  if (website) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const ipHash = ipHashOf(req);
  const db = supabaseAdmin();
  // 이번 요청이 클레임한 키 — 이후 어떤 단계에서 실패해도 되돌린다
  const claimedKeys: string[] = [];

  if (photos.length > 0) {
    if (!r2Configured()) {
      return NextResponse.json(
        { error: "사진 업로드가 아직 준비되지 않았어요" },
        { status: 503 },
      );
    }
    const keys = photos.map((p) => p.key);
    // 티켓 클레임 (미클레임 상태였던 키만) — 재사용/위조 키 차단
    let claimFailed = false;
    for (const part of chunk(keys, KEY_CHUNK)) {
      const { data, error } = await db
        .from("upload_tickets")
        .update({ claimed: true })
        .in("object_key", part)
        .eq("claimed", false)
        .select("object_key");
      if (data) claimedKeys.push(...data.map((t) => t.object_key as string));
      if (error || !data || data.length !== part.length) {
        claimFailed = true;
        break;
      }
    }
    if (claimFailed) {
      await unclaim(db, claimedKeys);
      return NextResponse.json(
        { error: "사진 정보가 유효하지 않아요. 다시 첨부해주세요." },
        { status: 400 },
      );
    }
    // 실제 객체 검증 (서명 헤더 강제에 더한 벨트&브레이스)
    // headObject는 일시적 네트워크 오류에도 null을 주므로 지우지 않고 클레임만 되돌린다
    // (끝내 등록되지 않은 객체는 일일 cron이 미클레임 티켓과 함께 정리)
    for (const batch of chunk(keys, HEAD_CONCURRENCY)) {
      const heads = await Promise.all(batch.map((k) => headObject(k)));
      const bad = heads.some(
        (h) =>
          !h ||
          h.size > MAX_FILE_BYTES ||
          !(ALLOWED_TYPES as readonly string[]).includes(h.contentType),
      );
      if (bad) {
        await unclaim(db, claimedKeys);
        return NextResponse.json(
          { error: "사진 확인에 실패했어요. 잠시 후 다시 올리기를 눌러주세요." },
          { status: 502 },
        );
      }
    }
  }

  const { data: entry, error: entryErr } = await db
    .from("guestbook_entries")
    .insert({ name, message, ip_hash: ipHash })
    .select("id, name, message, created_at")
    .single();
  if (entryErr || !entry) {
    await unclaim(db, claimedKeys);
    return NextResponse.json(
      { error: "등록에 실패했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  if (photos.length > 0) {
    const rows = photos.map((p, i) => ({
      entry_id: entry.id,
      object_key: p.key,
      content_type: "image/" + (p.key.endsWith(".png") ? "png" : p.key.endsWith(".webp") ? "webp" : "jpeg"),
      size_bytes: 0, // 실측치는 headObject 검증으로 갈음 (표시용 아님)
      width: p.width,
      height: p.height,
      sort_order: i,
    }));
    let photoErr: unknown = null;
    for (const part of chunk(rows, ROW_CHUNK)) {
      const { error } = await db.from("guestbook_photos").insert(part);
      if (error) {
        photoErr = error;
        break;
      }
    }
    if (photoErr) {
      // 이미 들어간 사진 행은 cascade로 함께 지워진다
      await db.from("guestbook_entries").delete().eq("id", entry.id);
      await unclaim(db, claimedKeys);
      return NextResponse.json(
        { error: "사진 저장에 실패했어요. 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }

  const dto: GuestbookEntryDTO = {
    id: entry.id,
    name: entry.name,
    message: entry.message,
    createdAt: entry.created_at,
    photos: photos.map((p) => ({
      key: p.key,
      url: publicUrl(p.key),
      width: p.width,
      height: p.height,
    })),
  };
  return NextResponse.json(dto, { status: 201 });
}
