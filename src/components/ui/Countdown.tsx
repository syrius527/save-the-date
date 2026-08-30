"use client";

import { useEffect, useMemo, useState } from "react";

// 미니멀 한 줄 카운트다운: "D-55일 03:12:45 ෆ" (초 단위, 매초 갱신)
export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  // 마운트 전에는 '--' → 서버/클라이언트 시간차 hydration 불일치 방지
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = now === null ? null : Math.max(0, target - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  const days = diff === null ? "--" : String(Math.floor(diff / 864e5));
  const hms =
    diff === null
      ? "--:--:--"
      : `${pad(Math.floor(diff / 36e5) % 24)}:${pad(Math.floor(diff / 6e4) % 60)}:${pad(Math.floor(diff / 1e3) % 60)}`;

  return (
    <div
      style={{
        fontSize: 15,
        letterSpacing: 1,
        marginTop: 20,
        fontWeight: 500,
        color: "var(--ink)",
      }}
    >
      D-{days}일{" "}
      <span
        style={{
          color: "var(--sub)",
          fontSize: 13,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {hms}
      </span>{" "}
      <span style={{ color: "var(--accent)" }}>ෆ</span>
    </div>
  );
}
