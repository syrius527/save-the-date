"use client";

import { useEffect, useState } from "react";

export const RSVP_DONE_KEY = "wg_rsvp_done";
export const RSVP_DONE_EVENT = "wg:rsvp-done";

// 하단 플로팅 CTA — 이미 참석 여부를 보냈으면 숨긴다
export default function RsvpFab({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  const [done, setDone] = useState(true); // 마운트 전에는 숨겨서 깜빡임 방지

  useEffect(() => {
    try {
      setDone(localStorage.getItem(RSVP_DONE_KEY) === "1");
    } catch {
      setDone(false);
    }
    const onDone = () => setDone(true);
    window.addEventListener(RSVP_DONE_EVENT, onDone);
    return () => window.removeEventListener(RSVP_DONE_EVENT, onDone);
  }, []);

  const show = visible && !done;

  return (
    <div
      className="rsvpFabWrap"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        transform: `translateX(-50%) translateY(${show ? "0" : "14px"})`,
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transition: "opacity .3s, transform .3s",
        zIndex: 45,
      }}
    >
      <button
        onClick={onClick}
        aria-hidden={!show}
        tabIndex={show ? 0 : -1}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          border: "none",
          cursor: "pointer",
          padding: "10px 18px",
          borderRadius: 999,
          background: "var(--accent)",
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 500,
          letterSpacing: 0.3,
          boxShadow: "0 4px 14px rgba(20,18,16,.18)",
          whiteSpace: "nowrap",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
          <path d="m22 7-10 6L2 7" />
        </svg>
        참석 여부 전달하기
      </button>
    </div>
  );
}
