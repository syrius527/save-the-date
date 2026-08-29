import type { NextConfig } from "next";

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST;

const nextConfig: NextConfig = {
  images: {
    // R2 공개 도메인의 방명록 사진만 원격 최적화 대상
    remotePatterns: mediaHost
      ? [{ protocol: "https", hostname: mediaHost }]
      : [],
    formats: ["image/avif", "image/webp"],
    // 레이아웃 max-width 430px × DPR 1/1.5/2/3 — 이보다 넓은 변환은 만들지 않는다
    deviceSizes: [430, 640, 860, 1290],
    imageSizes: [128, 200, 272, 408],
    // 방명록 사진 키는 불변 UUID, 정적 자산은 해시 경로 → 1년 캐시
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
