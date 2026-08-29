"use client";

import { useRef, useState } from "react";
import { FONT, WEDDING } from "@/lib/constants";
import { copyText } from "@/lib/copy";
import { kakaoConfigured, shareKakao } from "@/lib/kakao";
import type { Variant } from "@/lib/variant";

export default function ShareSection({ variant }: { variant: Variant }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [kakaoMsg, setKakaoMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 현재 손님 구분(variant)을 유지한 정규화 URL — 잡다한 파라미터는 제거
  const shareUrl = () =>
    `${location.origin}${variant === "family" ? "/?to=family" : "/"}`;

  const onCopy = async () => {
    await copyText(shareUrl());
    setLinkCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLinkCopied(false), 1600);
  };

  const onKakao = async () => {
    if (!kakaoConfigured()) {
      setKakaoMsg("카카오 공유는 카카오 JS 키 설정 후 활성화됩니다");
      return;
    }
    try {
      await shareKakao({
        url: shareUrl(),
        title: `${WEDDING.groom.firstName} ♥ ${WEDDING.bride.firstName} 결혼합니다`,
        description: `${WEDDING.dateLabelKo} · ${WEDDING.venue.name}`,
        imageUrl: `${location.origin}/og.jpg`,
      });
    } catch {
      setKakaoMsg("카카오 공유를 열지 못했어요. 링크 복사를 이용해주세요.");
    }
  };

  return (
    <section
      data-idx={9}
      data-screen-label="Share"
      className="snapSection"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "var(--sec-pt) 32px var(--sec-pb)",
      }}
    >
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: 12,
          letterSpacing: 5,
          color: "var(--accent)",
        }}
      >
        SHARE
      </div>
      <h2
        style={{
          fontFamily: FONT.serif,
          fontSize: 19,
          fontWeight: 500,
          margin: "12px 0 6px",
        }}
      >
        청첩장 전하기
      </h2>
      <p
        style={{
          fontSize: 12.5,
          color: "var(--sub)",
          lineHeight: 1.8,
          margin: "0 0 24px",
        }}
      >
        소중한 분들에게 저희의 소식을 전해주세요.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          width: "100%",
          maxWidth: 280,
        }}
      >
        <button
          onClick={onKakao}
          style={{
            padding: "13px 0",
            borderRadius: 12,
            border: "none",
            background: "#FEE500",
            color: "#191919",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          카카오톡으로 공유하기
        </button>
        <button
          onClick={onCopy}
          style={{
            padding: "13px 0",
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "var(--bg2)",
            color: "var(--ink)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {linkCopied ? "복사되었습니다 ✓" : "청첩장 링크 복사"}
        </button>
      </div>
      {kakaoMsg && (
        <div style={{ fontSize: 11, color: "var(--sub)", marginTop: 12 }}>
          {kakaoMsg}
        </div>
      )}
      <div
        style={{
          marginTop: 52,
          fontFamily: FONT.display,
          fontSize: 11,
          letterSpacing: 3,
          color: "var(--sub)",
        }}
      >
        {WEDDING.groom.en} &amp; {WEDDING.bride.en}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: "var(--sub)",
          marginTop: 6,
          letterSpacing: 1,
        }}
      >
        2026 . 10 . 24
      </div>
    </section>
  );
}
