"use client";

import { useEffect, useState } from "react";
import { FONT } from "@/lib/constants";
import type { Variant } from "@/lib/variant";
import { RSVP_DONE_EVENT, RSVP_DONE_KEY } from "@/components/shell/RsvpFab";
import RsvpForm from "@/components/ui/RsvpForm";

export function RsvpThanks() {
  return (
    <div style={{ textAlign: "center", padding: "38px 20px" }}>
      <div style={{ fontFamily: FONT.display, fontSize: 26, color: "var(--accent)" }}>
        Thank you
      </div>
      <div style={{ fontSize: 13, color: "var(--sub)", marginTop: 10, lineHeight: 1.7 }}>
        참석 여부가 전달되었습니다.
        <br />
        소중한 시간 내주셔서 감사합니다.
      </div>
    </div>
  );
}

export default function RsvpSection({ variant }: { variant: Variant }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(RSVP_DONE_KEY) === "1") setDone(true);
    } catch {}
    // 모달에서 제출한 경우에도 이 파트가 감사 화면으로 바뀌도록
    const onDone = () => setDone(true);
    window.addEventListener(RSVP_DONE_EVENT, onDone);
    return () => window.removeEventListener(RSVP_DONE_EVENT, onDone);
  }, []);

  return (
    <section
      data-idx={8}
      data-screen-label="RSVP"
      className="snapSection"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "var(--sec-pt-lg) 26px var(--sec-pb)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 12,
            letterSpacing: 5,
            color: "var(--accent)",
          }}
        >
          RSVP
        </div>
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 19,
            fontWeight: 500,
            margin: "12px 0 8px",
          }}
        >
          참석 여부를 알려주세요
        </h2>
        <p style={{ fontSize: 12.5, color: "var(--sub)", lineHeight: 1.8, margin: 0 }}>
          더 나은 준비를 위해
          <br />
          참석 여부를 미리 알려주시면 감사하겠습니다.
        </p>
      </div>

      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: done ? 0 : "20px 18px",
        }}
      >
        {done ? <RsvpThanks /> : <RsvpForm variant={variant} onSubmitted={() => setDone(true)} />}
      </div>
    </section>
  );
}
