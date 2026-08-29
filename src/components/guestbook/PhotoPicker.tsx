"use client";

import { useRef } from "react";

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
          flex: 1,
          textAlign: "center",
          padding: "11px 0",
          borderRadius: 10,
          border: "1px dashed var(--sub)",
          background: "none",
          fontSize: 12,
          color: "var(--sub)",
          cursor: "pointer",
        }}
      >
        📎 사진 첨부{count > 0 ? ` (${count}장)` : ""}
      </button>
    </>
  );
}
