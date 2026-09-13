"use client";

import { useCallback, useEffect, useState } from "react";
import { FONT } from "@/lib/constants";
import type { Variant } from "@/lib/variant";
import RsvpForm from "@/components/ui/RsvpForm";
import { RsvpThanks } from "@/components/sections/RsvpSection";

export default function RsvpModal({
  open,
  onClose,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  variant: Variant;
}) {
  const [done, setDone] = useState(false);

  // 제출 후에는 잠시 감사 인사를 보여주고 자동으로 닫는다
  const handleSubmitted = useCallback(() => {
    setDone(true);
    setTimeout(onClose, 1800);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    // 모달이 떠 있는 동안 뒤 배경 스크롤 잠금
    document.documentElement.setAttribute("data-modal-open", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.removeAttribute("data-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="참석 여부 전달"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(20,18,16,.45)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 22px",
        animation: "fadeIn .25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 350,
          maxHeight: "86dvh",
          overflowY: "auto",
          background: "var(--bg2)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          padding: "20px 18px 18px",
          boxShadow: "0 18px 50px rgba(0,0,0,.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -6 }}>
          <button
            onClick={onClose}
            aria-label="닫기"
            style={{
              border: "none",
              background: "none",
              color: "var(--sub)",
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {done ? (
          <RsvpThanks />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontSize: 11.5,
                  letterSpacing: 5,
                  color: "var(--accent)",
                }}
              >
                RSVP
              </div>
              <h2
                style={{
                  fontFamily: FONT.serif,
                  fontSize: 17.5,
                  fontWeight: 500,
                  margin: "10px 0 6px",
                }}
              >
                참석 여부를 알려주세요
              </h2>
              <p style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.7, margin: 0 }}>
                더 나은 준비를 위해 미리 알려주시면
                <br />
                큰 도움이 됩니다.
              </p>
            </div>
            <RsvpForm variant={variant} onSubmitted={handleSubmitted} />
          </>
        )}
      </div>
    </div>
  );
}
