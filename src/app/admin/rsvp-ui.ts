// RSVP 표·편집 시트가 함께 쓰는 표시 규칙 — 색과 라벨을 한 곳에서 맞춘다

// 배지 색: 한눈에 구분되도록 측/참석 여부를 색으로 고정
export const BADGE = {
  groom: { fg: "#2f5fa8", bg: "#e8f0fb", label: "신랑측" },
  bride: { fg: "#b8446e", bg: "#fbe9ef", label: "신부측" },
  yes: { fg: "#2f7a4a", bg: "#e6f4ea", label: "참석" },
  no: { fg: "#b0413e", bg: "#fbe8e6", label: "불참" },
} as const;

export type BadgeKind = keyof typeof BADGE;

// 24시간제 — Node는 "AM 11:24", 브라우저는 "오전 11:24"로 달라 hydration 불일치가 나므로 오전/오후 표기를 쓰지 않는다
export const fmt = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

// 응답 출처 라벨 — manual은 관리자가 직접 추가한 응답
export function variantLabel(variant: string): string {
  if (variant === "family") return "친인척";
  if (variant === "manual") return "직접 추가";
  return "지인";
}
