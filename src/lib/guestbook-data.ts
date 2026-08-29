import "server-only";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { publicUrl } from "@/lib/storage/r2";
import type { GuestbookPage, GuestbookPhotoDTO } from "@/lib/types";

export async function fetchGuestbookPage(
  cursor?: string,
  limit = 10,
): Promise<GuestbookPage> {
  // 백엔드 미설정 상태(dev 초기)에서도 페이지는 뜨도록 빈 목록 반환
  if (!supabaseConfigured()) return { entries: [], nextCursor: null };

  const db = supabaseAdmin();
  let q = db
    .from("guestbook_entries")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false })
    .limit(limit + 1);
  if (cursor) q = q.lt("created_at", cursor);

  const { data: rows, error } = await q;
  if (error || !rows) return { entries: [], nextCursor: null };

  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit);

  const mediaReady = Boolean(process.env.NEXT_PUBLIC_MEDIA_HOST);
  const photosByEntry = new Map<string, GuestbookPhotoDTO[]>();
  if (page.length > 0 && mediaReady) {
    const { data: photos } = await db
      .from("guestbook_photos")
      .select("entry_id, object_key, width, height, sort_order")
      .in(
        "entry_id",
        page.map((r) => r.id),
      )
      .order("sort_order", { ascending: true });
    for (const p of photos ?? []) {
      const list = photosByEntry.get(p.entry_id) ?? [];
      list.push({
        key: p.object_key,
        url: publicUrl(p.object_key),
        width: p.width,
        height: p.height,
      });
      photosByEntry.set(p.entry_id, list);
    }
  }

  return {
    entries: page.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      createdAt: r.created_at,
      photos: photosByEntry.get(r.id) ?? [],
    })),
    nextCursor: hasMore ? page[page.length - 1].created_at : null,
  };
}
