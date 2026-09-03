import type { CSSProperties } from "react";

export const WEDDING = {
  groom: {
    en: "DONGJAE",
    ko: "이동재",
    firstName: "동재",
    father: "이경한",
    mother: "최희정",
    childCaption: ["씩씩한 개구쟁이가 자라", "다정한 어른이 되었습니다"],
  },
  bride: {
    en: "RAEWON",
    ko: "정래원",
    firstName: "래원",
    father: "정봉수",
    mother: "임명숙",
    childCaption: ["웃음 많은 꼬마가 자라", "단단한 어른이 되었습니다"],
  },
  dateISO: "2026-10-24T18:00:00+09:00",
  dateLabelEn: "2026. 10. 24. SAT 6PM",
  dateLabelKo: "2026년 10월 24일 토요일 오후 6시",
  venue: {
    name: "워커힐 호텔 · 워커홀",
    address: "서울특별시 광진구 워커힐로 177",
  },
  mapLinks: {
    kakao: "https://map.kakao.com/link/search/워커힐호텔",
    naver: "https://map.naver.com/v5/search/워커힐호텔",
    tmap: "https://tmap.life/route",
  },
} as const;

export interface Account {
  role: string;
  name: string;
  bank: string;
  num: string;
}

export const ACCOUNTS: { groom: Account[]; bride: Account[] } = {
  groom: [
    { role: "신랑", name: "이동재", bank: "신한은행", num: "110-414-860183" },
  ],
  bride: [
    { role: "신부", name: "정래원", bank: "우리은행", num: "1002-159-756920" },
    { role: "아버지", name: "정봉수", bank: "국민은행", num: "713701-01-196182" },
    { role: "어머니", name: "임명숙", bank: "농협은행", num: "401140-56-047714" },
  ],
};

export type ThemeName =
  | "클래식 아이보리"
  | "미니멀 모던"
  | "따뜻한 내추럴"
  | "시네마틱 다크";

export const THEMES: Record<ThemeName, Record<string, string>> = {
  "클래식 아이보리": {
    bg: "#f7f3ec",
    bg2: "#fffdf8",
    ink: "#3b3630",
    sub: "#8a8177",
    accent: "#5c6f5a",
    line: "#e3dccf",
  },
  "미니멀 모던": {
    bg: "#fbfbfa",
    bg2: "#ffffff",
    ink: "#171717",
    sub: "#8b8b88",
    accent: "#1f1f1f",
    line: "#e8e8e5",
  },
  "따뜻한 내추럴": {
    bg: "#f4ede3",
    bg2: "#fdf9f2",
    ink: "#4a3f35",
    sub: "#9c8d7d",
    accent: "#b3714e",
    line: "#e5d9c8",
  },
  "시네마틱 다크": {
    bg: "#161514",
    bg2: "#211f1d",
    ink: "#ece7df",
    sub: "#97907f",
    accent: "#c8a96e",
    line: "#33302c",
  },
};

export const THEME: ThemeName = "클래식 아이보리";

export function themeVars(name: ThemeName = THEME): CSSProperties {
  const t = THEMES[name];
  return Object.fromEntries(
    Object.entries(t).map(([k, v]) => [`--${k}`, v]),
  ) as CSSProperties;
}

// 커버 릴스 영상: 웹용 재인코딩본 (원본은 public/cover/reel.mp4)
export const COVER_VIDEO_SRC: string | null = "/cover/reel-web.mp4";

export const SECTIONS: ReadonlyArray<readonly [string, string]> = [
  ["cover", "커버"],
  ["invite", "초대"],
  ["poem", "사랑에 답함"],
  ["about", "소개"],
  ["date", "일시"],
  ["gallery", "갤러리"],
  ["map", "오시는 길"],
  ["gift", "마음 전하실 곳"],
  ["guestbook", "게스트 스냅"],
  ["rsvp", "참석 여부"],
  ["share", "공유"],
];

export const FONT = {
  display: "var(--font-display), 'Cormorant Garamond', serif",
  serif: "var(--font-serif), 'Noto Serif KR', serif",
  sans: "var(--font-sans), 'Noto Sans KR', sans-serif",
} as const;
