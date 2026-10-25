import { NextRequest, NextResponse } from "next/server";
import { EXT_BY_MIME, signRequestSchema } from "@/lib/validation";
import { presignPut, publicUrl, r2Configured } from "@/lib/storage/r2";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { ipHashOf } from "@/lib/request";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!r2Configured() || !supabaseConfigured()) {
    return NextResponse.json(
      { error: "사진 업로드가 아직 준비되지 않았어요" },
      { status: 503 },
    );
  }
  const parsed = signRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const ipHash = ipHashOf(req);

  const tickets: Record<string, unknown>[] = [];
  const uploads: { key: string; url: string; publicUrl: string }[] = [];
  for (const f of parsed.data.files) {
    const key = `guestbook/2026/${crypto.randomUUID()}.${EXT_BY_MIME[f.type]}`;
    tickets.push({
      object_key: key,
      content_type: f.type,
      declared_size: f.size,
      ip_hash: ipHash,
    });
    uploads.push({
      key,
      url: await presignPut({
        key,
        contentType: f.type,
        contentLength: f.size,
      }),
      publicUrl: publicUrl(key),
    });
  }

  const { error } = await db.from("upload_tickets").insert(tickets);
  if (error) {
    return NextResponse.json(
      { error: "업로드 준비에 실패했어요" },
      { status: 500 },
    );
  }
  return NextResponse.json({ uploads });
}
