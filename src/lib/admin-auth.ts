// Web Crypto만 사용 — edge 런타임(middleware)과 node 런타임에서 동일하게 동작
export const ADMIN_COOKIE = "admin";

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function adminToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET 환경변수가 없습니다");
  return hmacHex(secret, "admin-v1");
}

function timingSafeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyAdminCookie(
  value: string | undefined,
): Promise<boolean> {
  if (!process.env.ADMIN_SECRET || !value) return false;
  return timingSafeEq(value, await adminToken());
}

// 로그인 키 검증도 HMAC 비교로 수행해 길이 정보 노출 없이 상수시간 비교
export async function verifyAdminKey(key: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !key) return false;
  const [a, b] = await Promise.all([
    hmacHex("admin-key-cmp", key),
    hmacHex("admin-key-cmp", secret),
  ]);
  return timingSafeEq(a, b);
}
