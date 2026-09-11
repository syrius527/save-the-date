"use client";

import { useMemo, useState } from "react";

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

// 배지 색: 한눈에 구분되도록 측/참석 여부를 색으로 고정
const BADGE = {
  groom: { fg: "#2f5fa8", bg: "#e8f0fb", label: "신랑측" },
  bride: { fg: "#b8446e", bg: "#fbe9ef", label: "신부측" },
  yes: { fg: "#2f7a4a", bg: "#e6f4ea", label: "참석" },
  no: { fg: "#b0413e", bg: "#fbe8e6", label: "불참" },
} as const;

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

const fmt = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
});

export default function RsvpTable({ rows }: { rows: RsvpRow[] }) {
  const [attend, setAttend] = useState<AttendFilter>("all");
  const [side, setSide] = useState<SideFilter>("all");

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (attend === "all" || (attend === "yes") === r.attending) &&
          (side === "all" || r.side === side),
      ),
    [rows, attend, side],
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
      </div>
      <div style={{ fontSize: 12, color: "#8a8177", margin: "10px 2px 6px" }}>
        {filtered.length}건 · 합계 <b style={{ color: "#3b3630" }}>{headcount}명</b>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12.5,
            minWidth: 480,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#8a8177" }}>
              <th style={{ padding: "6px 8px" }}>측</th>
              <th style={{ padding: "6px 8px" }}>참석</th>
              <th style={{ padding: "6px 8px" }}>성함</th>
              <th style={{ padding: "6px 8px" }}>관계</th>
              <th style={{ padding: "6px 8px" }}>인원</th>
              <th style={{ padding: "6px 8px" }}>링크</th>
              <th style={{ padding: "6px 8px" }}>시각</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 14, color: "#8a8177" }}>
                  {rows.length === 0 ? "아직 응답이 없습니다." : "조건에 맞는 응답이 없습니다."}
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #efe9dd" }}>
                <td style={{ padding: "7px 8px" }}>
                  <Badge kind={r.side} />
                </td>
                <td style={{ padding: "7px 8px" }}>
                  <Badge kind={r.attending ? "yes" : "no"} />
                </td>
                <td style={{ padding: "7px 8px" }}>{r.name}</td>
                <td style={{ padding: "7px 8px" }}>{r.relation || "-"}</td>
                <td style={{ padding: "7px 8px" }}>{r.headcount}</td>
                <td style={{ padding: "7px 8px" }}>
                  {r.variant === "family" ? "친인척" : "지인"}
                </td>
                <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>
                  {fmt.format(new Date(r.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
