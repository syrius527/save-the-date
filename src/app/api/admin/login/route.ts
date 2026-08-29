import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, verifyAdminKey } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { error: "ADMIN_SECRET이 설정되지 않았어요" },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => null)) as { key?: string } | null;
  if (!body?.key || !(await verifyAdminKey(body.key))) {
    return NextResponse.json({ error: "비밀키가 올바르지 않아요" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
