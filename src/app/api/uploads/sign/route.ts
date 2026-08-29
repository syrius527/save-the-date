import { NextRequest, NextResponse } from "next/server";
import { EXT_BY_MIME, signRequestSchema } from "@/lib/validation";
import { presignPut, publicUrl, r2Configured } from "@/lib/storage/r2";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { ipHashOf } from "@/lib/request";

export const runtime = "nodejs";

// 시간당 IP별 서명 발급 상한 — 스토리지 스터핑 방지 (정상 하객이 닿을 일 없는 수치)
const TICKETS_PER_HOUR = 120;

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
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await db
    .from("upload_tickets")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) + parsed.data.files.length > TICKETS_PER_HOUR) {
    return NextResponse.json(
      { error: "업로드가 너무 많아요. 잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

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
