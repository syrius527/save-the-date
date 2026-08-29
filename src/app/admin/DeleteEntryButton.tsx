"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteEntryButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    if (pending) return;
    if (!confirm("이 방명록 글과 사진을 모두 삭제할까요?")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/guestbook/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.error ?? "삭제에 실패했어요");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      style={{
        border: "1px solid #ddb9b0",
        background: "#fbf1ee",
        color: "#a34632",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 12,
        cursor: "pointer",
        opacity: pending ? 0.55 : 1,
      }}
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}
