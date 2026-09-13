"use client";

import { useState } from "react";
import type { Variant } from "@/lib/variant";
import { RSVP_DONE_EVENT, RSVP_DONE_KEY } from "@/components/shell/RsvpFab";

// RSVP 입력 폼 본체 — 파트(RsvpSection)와 모달(RsvpModal)에서 함께 쓴다.
// 카드 테두리·배경은 부모가 맡고, 여기서는 입력 스택만 그린다.
const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "11px 13px",
  fontSize: 16, // iOS 포커스 줌 방지
  background: "var(--bg)",
  color: "var(--ink)",
};

function Pill({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "11px 0",
        borderRadius: 10,
        fontSize: 13,
        cursor: "pointer",
        border: `1px solid ${selected ? "var(--accent)" : "var(--line)"}`,
        background: selected ? "var(--accent)" : "var(--bg)",
        color: selected ? "#fff" : "var(--sub)",
        fontWeight: selected ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

export default function RsvpForm({
  variant,
  onSubmitted,
}: {
  variant: Variant;
  onSubmitted: () => void;
}) {
  const [side, setSide] = useState<"groom" | "bride">("groom");
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [headcount, setHeadcount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side,
          attending,
          name: name.trim(),
          relation: relation.trim(),
          headcount,
          variant,
          website: "",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error ?? "전달에 실패했어요. 잠시 후 다시 시도해주세요.",
        );
      }
      try {
        localStorage.setItem(RSVP_DONE_KEY, "1");
      } catch {}
      // 하단 플로팅 CTA·모달 트리거가 즉시 반응하도록 알림
      window.dispatchEvent(new Event(RSVP_DONE_EVENT));
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "전달에 실패했어요");
    } finally {
      setSubmitting(false);
    }
  };

  const stepBtn: React.CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "1px solid var(--line)",
    background: "var(--bg2)",
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1,
    color: "var(--ink)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Pill selected={side === "groom"} label="신랑측" onClick={() => setSide("groom")} />
        <Pill selected={side === "bride"} label="신부측" onClick={() => setSide("bride")} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Pill selected={attending} label="참석" onClick={() => setAttending(true)} />
        <Pill selected={!attending} label="불참" onClick={() => setAttending(false)} />
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="대표자 성함"
        maxLength={20}
        style={inputStyle}
      />
      <input
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        placeholder="신랑·신부와의 관계 (예: 친구, 회사 동료)"
        maxLength={30}
        style={inputStyle}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid var(--line)",
          borderRadius: 10,
          padding: "8px 13px",
          background: "var(--bg)",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--sub)" }}>동행 인원 (본인 포함)</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setHeadcount((c) => Math.max(1, c - 1))} aria-label="인원 줄이기" style={stepBtn}>
            −
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: "center" }}>
            {headcount}
          </span>
          <button onClick={() => setHeadcount((c) => Math.min(10, c + 1))} aria-label="인원 늘리기" style={stepBtn}>
            +
          </button>
        </div>
      </div>
      {error && <div style={{ fontSize: 11.5, color: "#b0503f" }}>{error}</div>}
      <button
        onClick={submit}
        disabled={!name.trim() || submitting}
        style={{
          padding: "13px 0",
          borderRadius: 10,
          border: "none",
          background: "var(--accent)",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: 1,
          opacity: !name.trim() || submitting ? 0.55 : 1,
        }}
      >
        {submitting ? "전달하는 중…" : "전달하기"}
      </button>
    </div>
  );
}
