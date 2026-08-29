"use client";

import { useRef, useState } from "react";
import { copyText } from "@/lib/copy";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = async () => {
    await copyText(text);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      onClick={onClick}
      style={{
        flex: "none",
        border: "1px solid var(--line)",
        background: "var(--bg)",
        borderRadius: 8,
        padding: "7px 12px",
        fontSize: 11.5,
        cursor: "pointer",
        color: "var(--ink)",
      }}
    >
      {copied ? "복사됨 ✓" : "복사"}
    </button>
  );
}
