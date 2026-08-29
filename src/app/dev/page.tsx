import { fetchGuestbookPage } from "@/lib/guestbook-data";
import { GALLERY_CATEGORIES } from "@/lib/gallery-manifest";
import Terminal from "@/components/dev/Terminal";

// 방명록은 요청 시점 데이터
export const dynamic = "force-dynamic";

export default async function DevPage() {
  const guestbook = await fetchGuestbookPage();
  // 갤러리 미리보기: 렌더링마다 카테고리별 랜덤 1장씩, 앞 6개 카테고리
  const galleryImages = GALLERY_CATEGORIES.map(
    (cat) => cat[Math.floor(Math.random() * cat.length)],
  ).slice(0, 6);

  return (
    <Terminal
      initialEntries={guestbook.entries}
      initialCursor={guestbook.nextCursor}
      galleryImages={galleryImages}
    />
  );
}
