"use client";

import { useState } from "react";
import type { TransportRow } from "@/lib/variant";

export default function TransportTabs({
  car,
  transit,
}: {
  car: TransportRow[];
  transit: TransportRow[];
}) {
  const [tab, setTab] = useState<"car" | "transit">("car");
  const rows = tab === "car" ? car : transit;

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {(
          [
            ["car", "자차"],
            ["transit", "대중교통"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 10,
              fontSize: 12.5,
              cursor: "pointer",
              border: `1px solid ${tab === key ? "var(--accent)" : "var(--line)"}`,
              background: tab === key ? "var(--accent)" : "var(--bg2)",
              color: tab === key ? "#fff" : "var(--sub)",
              fontWeight: tab === key ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontSize: 13,
          lineHeight: 1.7,
          textAlign: "left",
          minHeight: 76, // 탭 전환 시 섹션 높이 흔들림 방지
        }}
      >
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: "none",
                width: 52,
                fontWeight: 600,
                color: "var(--accent)",
              }}
            >
              {row.label}
            </div>
            <div style={{ color: "var(--sub)" }}>{row.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
