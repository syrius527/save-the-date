"use client";

import { useRef } from "react";

// 게스트 스냅의 주인공: 크고 명확한 사진 업로드 영역
export default function PhotoPicker({
  count,
  disabled,
  onFiles,
}: {
  count: number;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        // HEIC를 accept에서 빼면 iOS 사진 앱이 JPEG로 변환해 준다
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%",
          padding: "18px 12px",
          borderRadius: 12,
          border: "1.5px dashed var(--sub)",
          background: "none",
          color: "var(--sub)",
          fontSize: 13,
          lineHeight: 1.6,
          cursor: "pointer",
        }}
      >
        📷{" "}
        {count > 0
          ? `${count}장 담김 — 눌러서 더 추가하기`
          : "본식에서 찍은 사진을 올려주세요"}
        {count === 0 && (
          <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85 }}>
            여러 장 가능 · 원본 화질 그대로 저장돼요
          </div>
        )}
      </button>
    </>
  );
}
