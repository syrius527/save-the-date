import { NextRequest, NextResponse } from "next/server";
import { rsvpAdminSchema, UUID_RE } from "@/lib/validation";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

// 인증은 middleware가 담당 (/api/admin/* 쿠키 가드)
// variant·created_at·ip_hash는 출처 보존을 위해 수정 대상에서 제외
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  const parsed = rsvpAdminSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const { data: row, error } = await supabaseAdmin()
    .from("rsvps")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    // PGRST116: single()에 맞는 행이 없음 → 이미 삭제된 응답
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "이미 삭제된 응답이에요" }, { status: 404 });
    }
    return NextResponse.json({ error: "저장에 실패했어요" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("rsvps")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    return NextResponse.json({ error: "삭제에 실패했어요" }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "이미 삭제된 응답이에요" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
