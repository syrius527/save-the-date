import { NextRequest, NextResponse } from "next/server";
import { rsvpAdminSchema } from "@/lib/validation";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

// 인증은 middleware가 담당 (/api/admin/* 쿠키 가드)
// 전화 등으로 받은 응답을 관리자가 직접 추가 — 출처는 variant 'manual'로 구분
export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  const parsed = rsvpAdminSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const { data: row, error } = await supabaseAdmin()
    .from("rsvps")
    .insert({ ...parsed.data, variant: "manual", ip_hash: null })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: "추가에 실패했어요" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, row }, { status: 201 });
}
