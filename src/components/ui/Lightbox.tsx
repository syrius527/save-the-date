"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

export type LightboxItem =
  | { kind: "static"; img: StaticImageData; alt: string }
  | { kind: "remote"; fullUrl: string; alt: string };

// 목록 썸네일로 이미 Vercel CDN에 캐시된 변환본 URL — 원본 로드 전 즉시 표시용
function optimizedUrl(src: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// 핀치 줌 + 팬 + 더블탭 + (배율 1일 때) 좌우 스와이프
function PinchZoom({
  children,
  onSwipe,
}: {
  children: React.ReactNode;
  onSwipe: (dir: 1 | -1) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    scale: 1,
    tx: 0,
    ty: 0,
    pointers: new Map<number, { x: number; y: number }>(),
    pinchStart: null as null | { dist: number; scale: number },
    panStart: null as null | { x: number; y: number; tx: number; ty: number },
    swipeStart: null as null | { x: number; y: number },
    lastTap: 0,
  });

  const apply = () => {
    const el = contentRef.current;
    if (el) {
      el.style.transform = `translate(${s.current.tx}px, ${s.current.ty}px) scale(${s.current.scale})`;
    }
  };

  const clampPan = () => {
    const el = contentRef.current;
    if (!el) return;
    const maxX = (el.clientWidth * (s.current.scale - 1)) / 2;
    const maxY = (el.clientHeight * (s.current.scale - 1)) / 2;
    s.current.tx = clamp(s.current.tx, -maxX, maxX);
    s.current.ty = clamp(s.current.ty, -maxY, maxY);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    s.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...s.current.pointers.values()];
    if (pts.length === 2) {
      s.current.pinchStart = { dist: dist(pts[0], pts[1]), scale: s.current.scale };
      s.current.panStart = null;
      s.current.swipeStart = null;
    } else if (pts.length === 1) {
      const now = Date.now();
      if (now - s.current.lastTap < 280) {
        // 더블탭: 1배 ↔ 2.5배
        s.current.scale = s.current.scale > 1 ? 1 : 2.5;
        if (s.current.scale === 1) {
          s.current.tx = 0;
          s.current.ty = 0;
        }
        apply();
        s.current.lastTap = 0;
        return;
      }
      s.current.lastTap = now;
      if (s.current.scale > 1) {
        s.current.panStart = {
          x: e.clientX,
          y: e.clientY,
          tx: s.current.tx,
          ty: s.current.ty,
        };
      } else {
        s.current.swipeStart = { x: e.clientX, y: e.clientY };
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!s.current.pointers.has(e.pointerId)) return;
    s.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...s.current.pointers.values()];
    if (pts.length === 2 && s.current.pinchStart) {
      const d = dist(pts[0], pts[1]);
      s.current.scale = clamp(
        (d / s.current.pinchStart.dist) * s.current.pinchStart.scale,
        1,
        5,
      );
      clampPan();
      apply();
    } else if (pts.length === 1 && s.current.panStart) {
      s.current.tx = s.current.panStart.tx + (e.clientX - s.current.panStart.x);
      s.current.ty = s.current.panStart.ty + (e.clientY - s.current.panStart.y);
      clampPan();
      apply();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    s.current.pointers.delete(e.pointerId);
    if (s.current.pointers.size < 2) s.current.pinchStart = null;
    if (s.current.pointers.size === 0) {
      s.current.panStart = null;
      if (s.current.swipeStart && s.current.scale === 1) {
        const dx = e.clientX - s.current.swipeStart.x;
        const dy = e.clientY - s.current.swipeStart.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          onSwipe(dx < 0 ? 1 : -1);
        }
      }
      s.current.swipeStart = null;
      if (s.current.scale < 1.05) {
        s.current.scale = 1;
        s.current.tx = 0;
        s.current.ty = 0;
        apply();
      }
    }
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          transition: "transform .05s linear",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// 원격 원본: 캐시된 변환본을 즉시 깔고 뒤에서 무압축 원본을 로드해 크로스페이드
function RemoteOriginal({ fullUrl, alt }: { fullUrl: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", maxWidth: "100%", maxHeight: "100%" }}>
      <img
        src={optimizedUrl(fullUrl, 860)}
        alt=""
        style={{
          maxWidth: "92vw",
          maxHeight: "76dvh",
          display: "block",
        }}
      />
      <img
        src={fullUrl}
        alt={alt}
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: loaded ? 1 : 0,
          transition: "opacity .35s",
        }}
      />
      {!loaded && (
        <div
          style={{
            position: "absolute",
            bottom: -26,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 10.5,
            letterSpacing: 1,
            color: "rgba(245,241,234,.55)",
          }}
        >
          원본 불러오는 중…
        </div>
      )}
    </div>
  );
}

export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(Math.min(items.length - 1, index + 1));
      if (e.key === "ArrowLeft") onIndex(Math.max(0, index - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndex]);

  // 열려 있는 동안 페이지의 사운드 토글을 숨긴다 (× 버튼과 겹침 방지)
  useEffect(() => {
    document.documentElement.setAttribute("data-lightbox-open", "");
    return () => document.documentElement.removeAttribute("data-lightbox-open");
  }, []);

  const item = items[index];
  if (!item) return null;

  const go = (dir: 1 | -1) =>
    onIndex(clamp(index + dir, 0, items.length - 1));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10,9,8,.95)",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          color: "#f5f1ea",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.8 }}>
          {index + 1} / {items.length}
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            border: "none",
            background: "rgba(255,255,255,.12)",
            color: "#fff",
            width: 34,
            height: 34,
            borderRadius: "50%",
            fontSize: 16,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <PinchZoom key={index} onSwipe={go}>
          {item.kind === "static" ? (
            <Image
              src={item.img}
              alt={item.alt}
              quality={90}
              placeholder="blur"
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "76dvh",
                objectFit: "contain",
              }}
            />
          ) : (
            <RemoteOriginal fullUrl={item.fullUrl} alt={item.alt} />
          )}
        </PinchZoom>
      </div>
      {items.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            padding: "12px 0 26px",
          }}
        >
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="이전"
            style={{
              border: "1px solid rgba(255,255,255,.25)",
              background: "none",
              color: index === 0 ? "rgba(255,255,255,.25)" : "#fff",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            disabled={index === items.length - 1}
            aria-label="다음"
            style={{
              border: "1px solid rgba(255,255,255,.25)",
              background: "none",
              color:
                index === items.length - 1 ? "rgba(255,255,255,.25)" : "#fff",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
