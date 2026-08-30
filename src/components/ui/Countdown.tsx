"use client";

import { useEffect, useMemo, useState } from "react";

// 미니멀 D-day 한 줄 (레퍼런스 스타일: "D-16일 ෆ")
export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  // 마운트 전에는 '--' → 서버/클라이언트 시간차 hydration 불일치 방지
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const compute = () =>
      setDays(Math.max(0, Math.ceil((target - Date.now()) / 864e5)));
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [target]);

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
      D-{days === null ? "--" : days}일{" "}
      <span style={{ color: "var(--accent)" }}>ෆ</span>
    </div>
  );
}
