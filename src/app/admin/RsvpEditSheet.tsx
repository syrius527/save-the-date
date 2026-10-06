"use client";

import { useEffect, useId, useState } from "react";
import type { RsvpRow } from "./RsvpTable";
import { BADGE, fmt, variantLabel, type BadgeKind } from "./rsvp-ui";

type Mode = "create" | "edit";
type Pending = null | "save" | "delete";

const inputStyle: React.CSSProperties = {
  border: "1px solid #e3dccf",
  borderRadius: 10,
  padding: "11px 13px",
  fontSize: 16, // iOS 포커스 줌 방지
  background: "#fff",
  color: "#3b3630",
  width: "100%",
  boxSizing: "border-box",
};

const btnBase: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  fontSize: 13,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const outlineBtn: React.CSSProperties = {
  ...btnBase,
  border: "1px solid #e3dccf",
  background: "#fffdf8",
  color: "#3b3630",
};

const primaryBtn: React.CSSProperties = {
  ...btnBase,
  border: "1px solid #3b3630",
  background: "#3b3630",
  color: "#fff",
  fontWeight: 600,
};

const stepBtn: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: "50%",
  border: "1px solid #e3dccf",
  background: "#f7f3ec",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
  color: "#3b3630",
  padding: 0,
};

// 비활성 버튼은 흐리게 — disabled 속성과 함께 써서 눌림 자체를 막는다
const dim = (disabled: boolean): React.CSSProperties =>
  disabled ? { opacity: 0.5, cursor: "default" } : {};

// 선택된 Pill은 표의 배지 색을 그대로 써서 표와 시트의 색 언어를 맞춘다
function Pill({
  kind,
  selected,
  disabled,
  onClick,
}: {
  kind: BadgeKind;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const c = BADGE[kind];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{
        flex: 1,
        padding: "11px 0",
        borderRadius: 10,
        fontSize: 13,
        cursor: "pointer",
        border: `1px solid ${selected ? c.fg : "#e3dccf"}`,
        background: selected ? c.bg : "#fffdf8",
        color: selected ? c.fg : "#8a8177",
        fontWeight: selected ? 600 : 400,
      }}
    >
      {c.label}
    </button>
  );
}

export default function RsvpEditSheet({
  mode,
  row,
  onClose,
  onSaved,
  onDeleted,
}: {
  mode: Mode;
  row?: RsvpRow;
  onClose: () => void;
  onSaved: (row: RsvpRow, mode: Mode) => void;
  onDeleted: (id: string) => void;
}) {
  const titleId = useId();
  const [side, setSide] = useState<"groom" | "bride">(row?.side ?? "groom");
  const [attending, setAttending] = useState(row?.attending ?? true);
  const [name, setName] = useState(row?.name ?? "");
  const [relation, setRelation] = useState(row?.relation ?? "");
  const [headcount, setHeadcount] = useState(row?.headcount ?? 1);
  const [pending, setPending] = useState<Pending>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = pending !== null;
  const isEdit = mode === "edit" && row !== undefined;

  // 바뀐 게 없으면 저장할 이유가 없다 — 공백만 다른 경우도 변경 없음으로 본다
  const changed =
    !isEdit ||
    side !== row.side ||
    attending !== row.attending ||
    name.trim() !== row.name ||
    relation.trim() !== (row.relation ?? "") ||
    headcount !== row.headcount;
  const canSave = changed && name.trim().length > 0 && !busy;

  // 시트가 떠 있는 동안 뒤 페이지 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc로 닫기 — 요청 중에는 결과를 받기 전에 닫히지 않도록 무시
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const request = async (
    url: string,
    method: "POST" | "PATCH" | "DELETE",
    fallback: string,
  ) => {
    const res = await fetch(url, {
      method,
      headers: method === "DELETE" ? undefined : { "Content-Type": "application/json" },
      body:
        method === "DELETE"
          ? undefined
          : JSON.stringify({
              side,
              attending,
              name: name.trim(),
              relation: relation.trim(),
              headcount,
            }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error ?? fallback);
    return body;
  };

  const save = async () => {
    if (!canSave) return;
    setPending("save");
    setError(null);
    try {
      const body = isEdit
        ? await request(`/api/admin/rsvp/${row.id}`, "PATCH", "저장에 실패했어요")
        : await request("/api/admin/rsvp", "POST", "추가에 실패했어요");
      onSaved(body.row as RsvpRow, mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청에 실패했어요");
      setPending(null);
    }
  };

  const remove = async () => {
    if (!isEdit || busy) return;
    setPending("delete");
    setError(null);
    try {
      await request(`/api/admin/rsvp/${row.id}`, "DELETE", "삭제에 실패했어요");
      onDeleted(row.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했어요");
      setPending(null);
      setConfirmDelete(false);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 글자 확정용이라 저장으로 보지 않는다
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      save();
    }
  };

  const sourceLabel =
    row?.variant === "manual" ? "직접 추가" : `${variantLabel(row?.variant ?? "")} 링크`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(59,54,48,.35)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fffdf8",
          color: "#3b3630",
          borderRadius: "16px 16px 0 0",
          padding: "18px 18px calc(18px + env(safe-area-inset-bottom))",
          maxHeight: "92dvh",
          overflowY: "auto",
          boxSizing: "border-box",
          boxShadow: "0 -6px 24px rgba(59,54,48,.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3 id={titleId} style={{ fontSize: 15.5, margin: 0 }}>
              {isEdit ? "응답 수정" : "응답 직접 추가"}
            </h3>
            {isEdit && (
              <div style={{ fontSize: 11.5, color: "#8a8177", marginTop: 4 }}>
                접수 {fmt.format(new Date(row.created_at))} · {sourceLabel}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="닫기"
            style={{
              border: "none",
              background: "transparent",
              fontSize: 22,
              lineHeight: 1,
              color: "#8a8177",
              cursor: "pointer",
              padding: "2px 4px",
              ...dim(busy),
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Pill kind="groom" selected={side === "groom"} disabled={busy} onClick={() => setSide("groom")} />
            <Pill kind="bride" selected={side === "bride"} disabled={busy} onClick={() => setSide("bride")} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Pill kind="yes" selected={attending} disabled={busy} onClick={() => setAttending(true)} />
            <Pill kind="no" selected={!attending} disabled={busy} onClick={() => setAttending(false)} />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onEnter}
            placeholder="대표자 성함"
            aria-label="성함"
            maxLength={20}
            autoFocus={!isEdit}
            disabled={busy}
            style={inputStyle}
          />
          <input
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            onKeyDown={onEnter}
            placeholder="신랑·신부와의 관계 (예: 친구, 회사 동료)"
            aria-label="관계"
            maxLength={30}
            disabled={busy}
            style={inputStyle}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #e3dccf",
              borderRadius: 10,
              padding: "8px 13px",
              background: "#fff",
            }}
          >
            <span style={{ fontSize: 13, color: "#8a8177" }}>동행 인원 (본인 포함)</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                type="button"
                onClick={() => setHeadcount((c) => Math.max(1, c - 1))}
                disabled={busy || headcount <= 1}
                aria-label="인원 줄이기"
                style={{ ...stepBtn, ...dim(busy || headcount <= 1) }}
              >
                −
              </button>
              <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: "center" }}>
                {headcount}
              </span>
              <button
                type="button"
                onClick={() => setHeadcount((c) => Math.min(10, c + 1))}
                disabled={busy || headcount >= 10}
                aria-label="인원 늘리기"
                style={{ ...stepBtn, ...dim(busy || headcount >= 10) }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ fontSize: 11.5, color: "#b0503f", marginTop: 10 }}>{error}</div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 18,
          }}
        >
          {isEdit && confirmDelete ? (
            // 실수 삭제 방지: 확인 중에는 푸터 전체를 확인 줄로 바꾼다 (confirm() 대신)
            <>
              <span style={{ fontSize: 12.5, color: "#a34632" }}>정말 삭제할까요?</span>
              <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={busy}
                  style={{ ...outlineBtn, ...dim(busy) }}
                >
                  취소
                </button>
                {/* 파괴적 동작은 오른쪽 끝에 */}
                <button
                  type="button"
                  onClick={remove}
                  disabled={busy}
                  style={{
                    ...btnBase,
                    border: "1px solid #a34632",
                    background: "#a34632",
                    color: "#fff",
                    fontWeight: 600,
                    ...dim(busy),
                  }}
                >
                  {pending === "delete" ? "삭제 중…" : "삭제"}
                </button>
              </div>
            </>
          ) : (
            <>
              {isEdit && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={busy}
                  style={{
                    ...btnBase,
                    padding: "10px 4px",
                    border: "none",
                    background: "transparent",
                    color: "#a34632",
                    ...dim(busy),
                  }}
                >
                  삭제
                </button>
              )}
              <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  style={{ ...outlineBtn, ...dim(busy) }}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={!canSave}
                  style={{ ...primaryBtn, ...dim(!canSave) }}
                >
                  {isEdit
                    ? pending === "save"
                      ? "저장 중…"
                      : "저장"
                    : pending === "save"
                      ? "추가 중…"
                      : "추가"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
