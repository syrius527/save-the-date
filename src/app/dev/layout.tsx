import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nanum_Gothic_Coding } from "next/font/google";

// 개발자용 터미널 청첩장 전용 모노스페이스 폰트
const monoLatin = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-latin",
  display: "swap",
});

// 한글 코딩 폰트 (unicode-range 분할이 많아 preload 끔)
const monoKr = Nanum_Gothic_Coding({
  weight: ["400", "700"],
  variable: "--font-mono-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "dongjae@wedding: ~",
  description: "$ wedding --info · 2026-10-24 18:00 KST · 워커힐 워커홀",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1e1f29",
};

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${monoLatin.variable} ${monoKr.variable}`}>{children}</div>
  );
}
