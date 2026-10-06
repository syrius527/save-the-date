"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RsvpEditSheet from "./RsvpEditSheet";
import { BADGE, fmt, variantLabel } from "./rsvp-ui";

export interface RsvpRow {
  id: string;
  side: "groom" | "bride";
  attending: boolean;
  name: string;
  relation: string | null;
  headcount: number;
  variant: string;
  created_at: string;
}

type AttendFilter = "all" | "yes" | "no";
type SideFilter = "all" | "groom" | "bride";

type SheetState = null | { mode: "create" } | { mode: "edit"; row: RsvpRow };

function Badge({ kind }: { kind: keyof typeof BADGE }) {
  const c = BADGE[kind];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        color: c.fg,
        background: c.bg,
        whiteSpace: "nowrap",
      }}
    >
      {c.label}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 13px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        border: `1px solid ${active ? "#3b3630" : "#e3dccf"}`,
        background: active ? "#3b3630" : "#fffdf8",
        color: active ? "#fff" : "#8a8177",
      }}
    >
      {children}
    </button>
  );
}

export default function RsvpTable({ rows }: { rows: RsvpRow[] }) {
  const router = useRouter();
  const [attend, setAttend] = useState<AttendFilter>("all");
  const [side, setSide] = useState<SideFilter>("all");
  const [sheet, setSheet] = useState<SheetState>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 저장 직후 표를 바로 바꾸기 위한 로컬 사본 — 서버 refresh로 새 rows가 오면 그걸로 교체
  const [prevRows, setPrevRows] = useState(rows);
  const [local, setLocal] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setLocal(rows);
  }

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  // 성공 후: 로컬 즉시 반영 → 시트 닫기 → 상단 집계 카드(서버 컴포넌트) 갱신
  const onSaved = (row: RsvpRow, mode: "create" | "edit") => {
    if (mode === "create") {
      setLocal((cur) => [row, ...cur]);
      showToast("추가했어요");
    } else {
      setLocal((cur) => cur.map((r) => (r.id === row.id ? row : r)));
      showToast("저장했어요");
    }
    setSheet(null);
    router.refresh();
  };

  const onDeleted = (id: string) => {
    setLocal((cur) => cur.filter((r) => r.id !== id));
    showToast("삭제했어요");
    setSheet(null);
    router.refresh();
  };

  const filtered = useMemo(
    () =>
      local.filter(
        (r) =>
          (attend === "all" || (attend === "yes") === r.attending) &&
          (side === "all" || r.side === side),
      ),
    [local, attend, side],
  );
  const headcount = filtered.reduce((s, r) => s + r.headcount, 0);

  return (
    <div
      style={{
        background: "#fffdf8",
        border: "1px solid #e3dccf",
        borderRadius: 14,
        padding: 16,
        marginTop: 12,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <Chip active={attend === "all"} onClick={() => setAttend("all")}>전체</Chip>
        <Chip active={attend === "yes"} onClick={() => setAttend("yes")}>참석</Chip>
        <Chip active={attend === "no"} onClick={() => setAttend("no")}>불참</Chip>
        <span style={{ width: 1, height: 18, background: "#e3dccf", margin: "0 6px" }} />
        <Chip active={side === "all"} onClick={() => setSide("all")}>전체</Chip>
        <Chip active={side === "groom"} onClick={() => setSide("groom")}>신랑측</Chip>
        <Chip active={side === "bride"} onClick={() => setSide("bride")}>신부측</Chip>
        <button
          onClick={() => setSheet({ mode: "create" })}
          style={{
            marginLeft: "auto",
            padding: "6px 13px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid #e3dccf",
            background: "#fffdf8",
            color: "#3b3630",
            whiteSpace: "nowrap",
          }}
        >
          + 직접 추가
        </button>
      </div>
      {/* 모바일에선 수정 열이 가로 스크롤 밖이라 행 탭으로 열린다는 걸 알려준다 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 12,
          color: "#8a8177",
          margin: "10px 2px 6px",
        }}
      >
        <span>
          {filtered.length}건 · 합계 <b style={{ color: "#3b3630" }}>{headcount}명</b>
        </span>
        <span style={{ fontSize: 11.5 }}>행을 누르면 수정할 수 있어요</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12.5,
            minWidth: 540,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#8a8177" }}>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>측</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>참석</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>성함</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>관계</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>인원</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>링크</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>시각</th>
              <th style={{ padding: "6px 8px", whiteSpace: "nowrap" }} aria-label="수정" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 14, color: "#8a8177" }}>
                  {local.length === 0 ? "아직 응답이 없습니다." : "조건에 맞는 응답이 없습니다."}
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="rsvp-row"
                onClick={() => setSheet({ mode: "edit", row: r })}
                style={{ borderTop: "1px solid #efe9dd", cursor: "pointer" }}
              >
                <td style={{ padding: "7px 8px" }}>
                  <Badge kind={r.side} />
                </td>
                <td style={{ padding: "7px 8px" }}>
                  <Badge kind={r.attending ? "yes" : "no"} />
                </td>
                <td style={{ padding: "7px 8px" }}>{r.name}</td>
                <td style={{ padding: "7px 8px" }}>{r.relation || "-"}</td>
                <td style={{ padding: "7px 8px" }}>{r.headcount}</td>
                <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>
                  {variantLabel(r.variant)}
                </td>
                <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>
                  {fmt.format(new Date(r.created_at))}
                </td>
                <td style={{ padding: "5px 8px", textAlign: "right" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSheet({ mode: "edit", row: r });
                    }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 11.5,
                      border: "1px solid #e3dccf",
                      background: "#fffdf8",
                      color: "#3b3630",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 행 hover 표시 — inline style로는 :hover를 못 쓴다 */}
      <style>{`.rsvp-row:hover { background: #faf6ee; }`}</style>

      {sheet && (
        <RsvpEditSheet
          key={sheet.mode === "edit" ? sheet.row.id : "create"}
          mode={sheet.mode}
          row={sheet.mode === "edit" ? sheet.row : undefined}
          onClose={() => setSheet(null)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "calc(24px + env(safe-area-inset-bottom))",
            transform: "translateX(-50%)",
            background: "#3b3630",
            color: "#fff",
            padding: "9px 16px",
            borderRadius: 999,
            fontSize: 12.5,
            zIndex: 60,
            boxShadow: "0 4px 14px rgba(59,54,48,.25)",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
