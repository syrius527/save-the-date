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
