"use client";

import { useEffect, useMemo, useState } from "react";
import { FONT } from "@/lib/constants";

function Box({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: "12px 0",
        width: 64,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 500 }}>
        {value}
      </div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--sub)" }}>
        {label}
      </div>
    </div>
  );
}

export default function Countdown({
  targetISO,
  groomName,
  brideName,
}: {
  targetISO: string;
  groomName: string;
  brideName: string;
}) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  // 마운트 전에는 '--' 표시 → 서버/클라이언트 시간차로 인한 hydration 불일치 방지
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = now === null ? null : Math.max(0, target - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  const days = diff === null ? "--" : pad(Math.floor(diff / 864e5));
  const hrs = diff === null ? "--" : pad(Math.floor(diff / 36e5) % 24);
  const mins = diff === null ? "--" : pad(Math.floor(diff / 6e4) % 60);
  const secs = diff === null ? "--" : pad(Math.floor(diff / 1e3) % 60);
  const ddayN = diff === null ? null : Math.ceil(diff / 864e5);

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginTop: 26 }}>
        <Box value={days} label="DAYS" />
        <Box value={hrs} label="HOURS" />
        <Box value={mins} label="MIN" />
        <Box value={secs} label="SEC" />
      </div>
      <div style={{ fontSize: 13, color: "var(--sub)", marginTop: 18 }}>
        {groomName}, {brideName}의 결혼식이{" "}
        <b style={{ color: "var(--accent)", fontWeight: 600 }}>
          {ddayN === null ? "--" : ddayN}일
        </b>{" "}
        남았습니다
      </div>
    </>
  );
}
