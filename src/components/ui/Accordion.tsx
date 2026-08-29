"use client";

import { useState } from "react";
import type { Account } from "@/lib/constants";
import CopyButton from "./CopyButton";

export default function Accordion({
  title,
  rows,
  defaultOpen = false,
}: {
  title: string;
  rows: Account[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 13.5,
          fontWeight: 600,
          color: "var(--ink)",
        }}
      >
        <span>{title}</span>
        <span style={{ color: "var(--sub)", fontWeight: 400 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "2px 18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {rows.map((a) => (
            <div
              key={a.role + a.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                borderTop: "1px solid var(--line)",
                paddingTop: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--sub)" }}>
                  {a.role} {a.name}
                </div>
                <div style={{ fontSize: 13, marginTop: 2 }}>
                  {a.bank} {a.num}
                </div>
              </div>
              <CopyButton text={`${a.bank} ${a.num} ${a.name}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
