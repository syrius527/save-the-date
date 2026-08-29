import { z } from "zod";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB — 영상/비정상 파일 차단용 (압축 아님)
export const SIGN_BATCH_MAX = 12; // 요청당 서명 개수. 총 장수는 무제한(배치 반복)
export const PHOTOS_PER_ENTRY_MAX = 200; // 함수 타임아웃 보호용 상한

export const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const OBJECT_KEY_RE =
  /^guestbook\/2026\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export const signRequestSchema = z.object({
  files: z
    .array(
      z.object({
        name: z.string().max(300),
        type: z.enum(ALLOWED_TYPES),
        size: z.number().int().min(1).max(MAX_FILE_BYTES),
      }),
    )
    .min(1)
    .max(SIGN_BATCH_MAX),
});

export const guestbookPostSchema = z.object({
  name: z.string().trim().min(1).max(20),
  message: z.string().trim().min(1).max(500),
  // honeypot: 사람은 비워두는 숨김 필드
  website: z.string().max(0).optional().default(""),
  photos: z
    .array(
      z.object({
        key: z.string().regex(OBJECT_KEY_RE),
        width: z.number().int().min(1).max(30000).nullable(),
        height: z.number().int().min(1).max(30000).nullable(),
      }),
    )
    .max(PHOTOS_PER_ENTRY_MAX)
    .default([]),
});

export const rsvpSchema = z.object({
  side: z.enum(["groom", "bride"]),
  attending: z.boolean(),
  name: z.string().trim().min(1).max(20),
  relation: z.string().trim().max(30).optional().default(""),
  headcount: z.number().int().min(1).max(10),
  variant: z.enum(["family", "friend"]),
  website: z.string().max(0).optional().default(""),
});
