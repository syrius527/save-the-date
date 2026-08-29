import { NextRequest, NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validation";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { countRecentByIp, ipHashOf } from "@/lib/request";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "참석 여부 전달이 아직 준비되지 않았어요" },
      { status: 503 },
    );
  }
  const parsed = rsvpSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }
  const { side, attending, name, relation, headcount, variant, website } =
    parsed.data;
  if (website) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const ipHash = ipHashOf(req);
  const recent = await countRecentByIp("rsvps", ipHash, 600_000);
  if (recent >= 5) {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해주세요" },
      { status: 429 },
    );
  }

  const { error } = await supabaseAdmin().from("rsvps").insert({
    side,
    attending,
    name,
    relation,
    headcount,
    variant,
    ip_hash: ipHash,
  });
  if (error) {
    return NextResponse.json(
      { error: "전달에 실패했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
