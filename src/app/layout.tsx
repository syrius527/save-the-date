import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Noto_Serif_KR,
  Noto_Sans_KR,
} from "next/font/google";
import "./globals.css";
import { WEDDING } from "@/lib/constants";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// 한글 폰트는 unicode-range 분할이 많아 preload를 끄고 swap으로 로드
const serif = Noto_Serif_KR({
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const sans = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const title = `${WEDDING.groom.firstName} ♥ ${WEDDING.bride.firstName} 결혼합니다`;
const description = `${WEDDING.dateLabelKo} · ${WEDDING.venue.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f3ec",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${display.variable} ${serif.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
