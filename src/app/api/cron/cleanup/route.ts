import { NextRequest, NextResponse } from "next/server";
import { deleteObjects, r2Configured } from "@/lib/storage/r2";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

// 일일 실행 (vercel.json cron):
// 1) 24시간 지나도 클레임되지 않은 업로드(중단된 폼)의 R2 객체 정리
// 2) Supabase 무료 티어 auto-pause 방지 keep-alive 쿼리
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const db = supabaseAdmin();
  const cutoff = new Date(Date.now() - 24 * 3600_000).toISOString();
  const { data: stale } = await db
    .from("upload_tickets")
    .select("object_key")
    .eq("claimed", false)
    .lt("created_at", cutoff)
    .limit(500);

  const keys = (stale ?? []).map((t) => t.object_key);
  if (keys.length > 0) {
    if (r2Configured()) await deleteObjects(keys).catch(() => {});
    await db.from("upload_tickets").delete().in("object_key", keys);
  }

  // keep-alive
  await db.from("rsvps").select("id", { count: "exact", head: true });

  return NextResponse.json({ cleaned: keys.length });
}
