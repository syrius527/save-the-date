"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao?: any;
  }
}

const KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
// 워커힐 호텔 (서울 광진구 워커힐로 177)
const VENUE = { lat: 37.55467, lng: 127.11056 };

let sdkPromise: Promise<void> | null = null;
function loadSdk(): Promise<void> {
  if (window.kakao?.maps) return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        sdkPromise = null;
        reject(new Error("Kakao Maps SDK 로드 실패"));
      };
      document.head.appendChild(s);
    });
  }
  return sdkPromise;
}

export default function KakaoMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!KEY) {
      setFailed(true);
      return;
    }
    let cancelled = false;
    loadSdk()
      .then(() => {
        if (cancelled || !ref.current) return;
        window.kakao.maps.load(() => {
          if (cancelled || !ref.current) return;
          const center = new window.kakao.maps.LatLng(VENUE.lat, VENUE.lng);
          const map = new window.kakao.maps.Map(ref.current, {
            center,
            level: 4,
          });
          new window.kakao.maps.Marker({ map, position: center });
        });
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        aspectRatio: "var(--map-ar)",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "var(--bg2)",
        position: "relative",
      }}
    >
      <div ref={ref} style={{ position: "absolute", inset: 0 }} />
      {failed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "var(--sub)",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          지도를 불러오지 못했어요
          <br />
          아래 버튼으로 지도 앱에서 확인해주세요
        </div>
      )}
    </div>
  );
}
