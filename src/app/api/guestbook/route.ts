import { NextRequest, NextResponse } from "next/server";
import {
  ALLOWED_TYPES,
  guestbookPostSchema,
  MAX_FILE_BYTES,
} from "@/lib/validation";
import { deleteObjects, headObject, publicUrl, r2Configured } from "@/lib/storage/r2";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { fetchGuestbookPage } from "@/lib/guestbook-data";
import { countRecentByIp, ipHashOf } from "@/lib/request";
import type { GuestbookEntryDTO } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;
  const page = await fetchGuestbookPage(cursor, 10);
  return NextResponse.json(page);
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "방명록이 아직 준비되지 않았어요" },
      { status: 503 },
    );
  }
  const parsed = guestbookPostSchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }
  const { name, message, website, photos } = parsed.data;
  if (website) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const ipHash = ipHashOf(req);
  const recent = await countRecentByIp("guestbook_entries", ipHash, 600_000);
  if (recent >= 5) {
    return NextResponse.json(
      { error: "잠시 후 다시 남겨주세요" },
      { status: 429 },
    );
  }

  const db = supabaseAdmin();

  if (photos.length > 0) {
    if (!r2Configured()) {
      return NextResponse.json(
        { error: "사진 업로드가 아직 준비되지 않았어요" },
        { status: 503 },
      );
    }
    const keys = photos.map((p) => p.key);
    // 티켓 클레임 (미클레임 상태였던 키만) — 재사용/위조 키 차단
    const { data: claimed, error: claimErr } = await db
      .from("upload_tickets")
      .update({ claimed: true })
      .in("object_key", keys)
      .eq("claimed", false)
      .select("object_key");
    if (claimErr || !claimed || claimed.length !== keys.length) {
      return NextResponse.json(
        { error: "사진 정보가 유효하지 않아요. 다시 첨부해주세요." },
        { status: 400 },
      );
    }
    // 실제 객체 검증 (서명 헤더 강제에 더한 벨트&브레이스)
    for (let i = 0; i < keys.length; i += 10) {
      const batch = keys.slice(i, i + 10);
      const heads = await Promise.all(batch.map((k) => headObject(k)));
      const bad = heads.some(
        (h) =>
          !h ||
          h.size > MAX_FILE_BYTES ||
          !(ALLOWED_TYPES as readonly string[]).includes(h.contentType),
      );
      if (bad) {
        await deleteObjects(keys).catch(() => {});
        await db.from("upload_tickets").delete().in("object_key", keys);
        return NextResponse.json(
          { error: "사진 검증에 실패했어요. 다시 첨부해주세요." },
          { status: 400 },
        );
      }
    }
  }

  const { data: entry, error: entryErr } = await db
    .from("guestbook_entries")
    .insert({ name, message, ip_hash: ipHash })
    .select("id, name, message, created_at")
    .single();
  if (entryErr || !entry) {
    return NextResponse.json(
      { error: "등록에 실패했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  if (photos.length > 0) {
    const { error: photoErr } = await db.from("guestbook_photos").insert(
      photos.map((p, i) => ({
        entry_id: entry.id,
        object_key: p.key,
        content_type: "image/" + (p.key.endsWith(".png") ? "png" : p.key.endsWith(".webp") ? "webp" : "jpeg"),
        size_bytes: 0, // 실측치는 headObject 검증으로 갈음 (표시용 아님)
        width: p.width,
        height: p.height,
        sort_order: i,
      })),
    );
    if (photoErr) {
      await db.from("guestbook_entries").delete().eq("id", entry.id);
      return NextResponse.json(
        { error: "사진 저장에 실패했어요. 다시 시도해주세요." },
        { status: 500 },
      );
    }
  }

  const dto: GuestbookEntryDTO = {
    id: entry.id,
    name: entry.name,
    message: entry.message,
    createdAt: entry.created_at,
    photos: photos.map((p) => ({
      key: p.key,
      url: publicUrl(p.key),
      width: p.width,
      height: p.height,
    })),
  };
  return NextResponse.json(dto, { status: 201 });
}
