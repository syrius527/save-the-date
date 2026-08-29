import { NextRequest, NextResponse } from "next/server";
import { deleteObjects, r2Configured } from "@/lib/storage/r2";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// 인증은 middleware가 담당 (/api/admin/* 쿠키 가드)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: photos } = await db
    .from("guestbook_photos")
    .select("object_key")
    .eq("entry_id", id);

  // R2 객체 먼저 삭제 → 성공 후 행 삭제(사진 행은 cascade)
  const keys = (photos ?? []).map((p) => p.object_key);
  if (keys.length > 0 && r2Configured()) {
    try {
      await deleteObjects(keys);
    } catch {
      return NextResponse.json(
        { error: "스토리지 삭제에 실패했어요" },
        { status: 500 },
      );
    }
  }

  const { error } = await db.from("guestbook_entries").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "삭제에 실패했어요" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
