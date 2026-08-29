import "server-only";
import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export function ipHashOf(req: NextRequest): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT ?? ""))
    .digest("hex");
}

// Redis 없는 소규모 레이트리밋: 해당 테이블에서 같은 ip_hash의 최근 행 수를 센다
export async function countRecentByIp(
  table: string,
  ipHash: string,
  windowMs: number,
): Promise<number> {
  const { supabaseAdmin } = await import("@/lib/supabase/server");
  const since = new Date(Date.now() - windowMs).toISOString();
  const { count, error } = await supabaseAdmin()
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) return 0;
  return count ?? 0;
}
