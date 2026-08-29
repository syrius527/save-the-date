"use client";

import type { PendingUpload } from "@/lib/upload-client";

export default function UploadProgress({
  items,
  onRemove,
  onRetry,
}: {
  items: PendingUpload[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((it) => (
        <div key={it.id} style={{ position: "relative", width: 60, height: 60 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.previewUrl}
            alt=""
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              objectFit: "cover",
              display: "block",
              opacity: it.status === "done" ? 1 : 0.55,
            }}
          />
          {(it.status === "uploading" || it.status === "signing") && (
            <div
              style={{
                position: "absolute",
                left: 4,
                right: 4,
                bottom: 5,
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,.55)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(it.progress * 100)}%`,
                  height: "100%",
                  background: "var(--accent)",
                  transition: "width .2s",
                }}
              />
            </div>
          )}
          {it.status === "error" && (
            <button
              onClick={() => onRetry(it.id)}
              aria-label="다시 시도"
              style={{
                position: "absolute",
                inset: 0,
                border: "none",
                borderRadius: 8,
                background: "rgba(140,40,30,.55)",
                color: "#fff",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ⟳
            </button>
          )}
          <button
            onClick={() => onRemove(it.id)}
            aria-label="사진 제거"
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "none",
              background: "var(--ink)",
              color: "var(--bg)",
              fontSize: 11,
              lineHeight: 1,
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
