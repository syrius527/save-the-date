"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FONT } from "@/lib/constants";
import type { GuestbookEntryDTO, GuestbookPage } from "@/lib/types";
import {
  UploadPool,
  validateFiles,
  type FileRejection,
  type PendingUpload,
} from "@/lib/upload-client";
import Lightbox, { type LightboxItem } from "../ui/Lightbox";
import PhotoPicker from "../guestbook/PhotoPicker";
import UploadProgress from "../guestbook/UploadProgress";

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "11px 13px",
  fontSize: 16, // iOS 포커스 줌 방지 최소 크기
  background: "var(--bg)",
  color: "var(--ink)",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

// 게스트 스냅: 사진이 히어로, 이름·메시지는 캡션
const THUMBS_SHOWN = 6;

function EntryCard({
  entry,
  onOpenPhoto,
}: {
  entry: GuestbookEntryDTO;
  onOpenPhoto: (photoIndex: number) => void;
}) {
  const extra = entry.photos.length - THUMBS_SHOWN;
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "13px 14px 12px",
      }}
    >
      {entry.photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: 5,
          }}
        >
          {entry.photos.slice(0, THUMBS_SHOWN).map((p, i) => (
            <button
              key={p.key}
              onClick={() => onOpenPhoto(i)}
              aria-label="사진 크게 보기"
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 8,
                overflow: "hidden",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: "var(--line)",
              }}
            >
              <Image
                src={p.url}
                alt=""
                fill
                sizes="(max-width: 430px) 30vw, 120px"
                style={{ objectFit: "cover" }}
              />
              {i === THUMBS_SHOWN - 1 && extra > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(20,18,16,.55)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  +{extra}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: entry.photos.length > 0 ? 10 : 0,
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{entry.name}</div>
        <div style={{ fontSize: 10.5, color: "var(--sub)" }}>
          {formatDate(entry.createdAt)}
        </div>
      </div>
      {entry.message && (
        <div
          style={{
            fontSize: 12.5,
            lineHeight: 1.65,
            marginTop: 4,
            whiteSpace: "pre-wrap",
            color: "var(--sub)",
          }}
        >
          {entry.message}
        </div>
      )}
    </div>
  );
}

export default function GuestbookSection({
  initialEntries,
  initialCursor,
}: {
  initialEntries: GuestbookEntryDTO[];
  initialCursor: string | null;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [cursor, setCursor] = useState(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — 사람은 비워둠
  const [uploads, setUploads] = useState<PendingUpload[]>([]);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{
    items: LightboxItem[];
    index: number;
  } | null>(null);

  const poolRef = useRef<UploadPool | null>(null);
  const pool = () => (poolRef.current ??= new UploadPool(setUploads));

  const onFiles = async (files: File[]) => {
    const { accepted, rejected } = await validateFiles(files);
    setRejections(rejected);
    if (accepted.length) pool().add(accepted);
  };

  const uploading = uploads.some(
    (u) => u.status === "signing" || u.status === "uploading",
  );
  const hasFailed = uploads.some((u) => u.status === "error");
  const doneCount = uploads.filter(
    (u) => u.status === "done" && u.key,
  ).length;
  // 사진이 메인, 메시지는 덤 — 둘 중 하나만 있으면 등록 가능
  const canSubmit =
    name.trim().length > 0 &&
    (doneCount > 0 || msg.trim().length > 0) &&
    !uploading &&
    !hasFailed &&
    !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: msg.trim(),
          website,
          photos: uploads
            .filter((u) => u.status === "done" && u.key)
            .map((u) => ({ key: u.key!, width: u.width, height: u.height })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error ?? "등록에 실패했어요. 잠시 후 다시 시도해주세요.",
        );
      }
      const entry = (await res.json()) as GuestbookEntryDTO;
      setEntries((es) => [entry, ...es]);
      setName("");
      setMsg("");
      pool().clear();
      setRejections([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "등록에 실패했어요");
    } finally {
      setSubmitting(false);
    }
  };

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/guestbook?cursor=${encodeURIComponent(cursor)}`,
      );
      if (res.ok) {
        const body = (await res.json()) as GuestbookPage;
        setEntries((es) => [...es, ...body.entries]);
        setCursor(body.nextCursor);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const openPhotos = (entry: GuestbookEntryDTO, photoIndex: number) => {
    setLightbox({
      items: entry.photos.map((p) => ({
        kind: "remote",
        fullUrl: p.url,
        alt: `${entry.name}님이 남긴 사진`,
      })),
      index: photoIndex,
    });
  };

  return (
    <section
      data-idx={7}
      data-screen-label="Guestbook"
      className="snapSection"
      style={{ padding: "var(--sec-pt-lg) 26px var(--sec-pb)" }}
    >
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 12,
            letterSpacing: 5,
            color: "var(--accent)",
          }}
        >
          GUEST SNAP
        </div>
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 19,
            fontWeight: 500,
            margin: "12px 0 8px",
          }}
        >
          게스트 스냅
        </h2>
        <p
          style={{
            fontSize: 12.5,
            color: "var(--sub)",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          하객님의 렌즈에 담긴 오늘의 저희를 남겨주세요.
          <br />
          축하 한마디는 덤이에요.
        </p>
      </div>

      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <PhotoPicker
          count={uploads.length}
          disabled={submitting}
          onFiles={onFiles}
        />
        <UploadProgress
          items={uploads}
          onRemove={(id) => pool().remove(id)}
          onRetry={(id) => pool().retry(id)}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="성함"
          maxLength={20}
          style={inputStyle}
        />
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="축하 한마디 (선택)"
          rows={2}
          maxLength={500}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
        />
        {/* honeypot: 화면 밖 숨김, 봇만 채운다 */}
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: -9999, width: 1, height: 1 }}
        />
        {rejections.length > 0 && (
          <div style={{ fontSize: 11.5, color: "#b0503f", lineHeight: 1.6 }}>
            {rejections.map((r, i) => (
              <div key={i}>
                {r.name}: {r.reason}
              </div>
            ))}
          </div>
        )}
        {error && (
          <div style={{ fontSize: 11.5, color: "#b0503f" }}>{error}</div>
        )}
        <button
          onClick={submit}
          disabled={!canSubmit}
          style={{
            padding: "12px 0",
            borderRadius: 10,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: canSubmit ? "pointer" : "default",
            opacity: canSubmit ? 1 : 0.55,
          }}
        >
          {submitting
            ? "올리는 중…"
            : uploading
              ? "사진 올리는 중…"
              : "올리기"}
        </button>
        {hasFailed && (
          <div style={{ fontSize: 11.5, color: "#b0503f" }}>
            실패한 사진이 있어요. ⟳ 버튼으로 다시 시도하거나 ×로 제거해주세요.
          </div>
        )}
      </div>

      <div
        className="innerScroll"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 16,
          maxHeight: "32dvh",
        }}
      >
        {entries.length === 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--sub)",
              padding: "22px 0",
            }}
          >
            아직 올라온 사진이 없어요. 오늘의 첫 순간을 남겨주세요!
          </div>
        )}
        {entries.map((e) => (
          <EntryCard
            key={e.id}
            entry={e}
            onOpenPhoto={(i) => openPhotos(e, i)}
          />
        ))}
        {cursor && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              padding: "10px 0",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--bg2)",
              color: "var(--sub)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {loadingMore ? "불러오는 중…" : "이전 스냅 더 보기"}
          </button>
        )}
      </div>

      {lightbox && (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndex={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
        />
      )}
    </section>
  );
}
