"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "로그인에 실패했어요");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했어요");
      setPending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f3ec",
        padding: 20,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 340,
          background: "#fffdf8",
          border: "1px solid #e3dccf",
          borderRadius: 16,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "#3b3630" }}>
          관리자 로그인
        </div>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="비밀키"
          autoFocus
          style={{
            border: "1px solid #e3dccf",
            borderRadius: 10,
            padding: "11px 13px",
            fontSize: 16,
            background: "#f7f3ec",
            color: "#3b3630",
          }}
        />
        {error && (
          <div style={{ fontSize: 12, color: "#b0503f" }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={pending || !key}
          style={{
            padding: "12px 0",
            borderRadius: 10,
            border: "none",
            background: "#5c6f5a",
            color: "#fff",
            fontSize: 13.5,
            cursor: "pointer",
            opacity: pending || !key ? 0.55 : 1,
          }}
        >
          {pending ? "확인 중…" : "입장"}
        </button>
      </form>
    </div>
  );
}
