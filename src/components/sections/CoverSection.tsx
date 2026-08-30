"use client";

import { useCallback, useRef } from "react";
import { useSound } from "../shell/SoundContext";
import { FONT, WEDDING } from "@/lib/constants";

export default function CoverSection({
  videoSrc,
  posterSrc,
}: {
  videoSrc: string | null;
  posterSrc?: string;
}) {
  const { attachVideo } = useSound();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      attachVideo(el);
    },
    [attachVideo],
  );

  // iOS 저전력 모드 등 자동재생 차단 대비 탭 재생 폴백
  const tapPlay = () => {
    const v = videoRef.current;
    if (v && v.paused) v.play().catch(() => {});
  };

  return (
    <section
      data-idx={0}
      data-screen-label="Cover"
      className="snapSection"
      style={{ background: "#141210", overflow: "hidden" }}
      onClick={tapPlay}
    >
      {videoSrc ? (
        <video
          ref={setVideo}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(45deg,#1d1b19 0 14px,#242120 14px 28px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "24%",
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace,Menlo,monospace",
              fontSize: 11,
              color: "rgba(255,255,255,.45)",
              textAlign: "center",
              lineHeight: 1.9,
              padding: "0 40px",
            }}
          >
            릴스 영상 (1080 × 1920)
            <br />이 자리에 재생됩니다
            <br />— public/cover/reel.mp4 추가 후 constants.ts 수정 —
          </div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,rgba(10,9,8,.35) 0%,transparent 30%,transparent 55%,rgba(10,9,8,.72) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "0 28px calc(46px + env(safe-area-inset-bottom))",
          textAlign: "center",
          color: "#f5f1ea",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 12,
            letterSpacing: 5,
            opacity: 0.85,
            marginBottom: 14,
          }}
        >
          THE WEDDING OF
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: 2,
            lineHeight: 1.25,
          }}
        >
          {WEDDING.bride.en}{" "}
          <span style={{ fontStyle: "italic", fontSize: 24, opacity: 0.8 }}>
            and
          </span>{" "}
          {WEDDING.groom.en}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 18,
          }}
        >
          <div style={{ width: 34, height: 1, background: "rgba(245,241,234,.4)" }} />
          <div style={{ fontSize: 12.5, letterSpacing: 2, fontWeight: 300 }}>
            {WEDDING.dateLabelEn}
          </div>
          <div style={{ width: 34, height: 1, background: "rgba(245,241,234,.4)" }} />
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 300,
            letterSpacing: 1,
            marginTop: 8,
            opacity: 0.85,
          }}
        >
          {WEDDING.venue.name}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT.display,
            fontSize: 10,
            letterSpacing: 4,
            opacity: 0.55,
          }}
        >
          SCROLL
        </div>
        <div
          style={{
            width: 1,
            height: 26,
            background:
              "linear-gradient(180deg,rgba(245,241,234,.6),transparent)",
            margin: "6px auto 0",
          }}
        />
      </div>
    </section>
  );
}
