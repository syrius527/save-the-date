"use client";

import { useSound } from "./SoundContext";
import { FONT } from "@/lib/constants";

export default function SoundToggle({ hasVideo }: { hasVideo: boolean }) {
  const { muted, toggle } = useSound();
  if (!hasVideo) return null;
  return (
    <div
      className="soundToggleWrap"
      style={{
        position: "absolute",
        top: "calc(14px + env(safe-area-inset-top))",
        right: 14,
        zIndex: 50,
      }}
    >
      <button
        onClick={toggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          border: "none",
          cursor: "pointer",
          padding: "9px 14px",
          borderRadius: 99,
          background: "rgba(22,20,18,.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "#fff",
          fontSize: 11,
          letterSpacing: 1.5,
          fontFamily: FONT.display,
          fontWeight: 600,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon
            points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
            fill="#fff"
            stroke="none"
          />
          {muted ? (
            <>
              <line x1="15" y1="9" x2="21" y2="15" />
              <line x1="21" y1="9" x2="15" y2="15" />
            </>
          ) : (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          )}
        </svg>
        <span>{muted ? "SOUND OFF" : "SOUND ON"}</span>
      </button>
    </div>
  );
}
