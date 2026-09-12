import { COVER_VIDEO_SRC, FONT, SECTIONS, themeVars } from "@/lib/constants";
import { resolveVariant, VARIANTS } from "@/lib/variant";
import { fetchGuestbookPage } from "@/lib/guestbook-data";
import { GALLERY_CATEGORIES, GALLERY_FIXED } from "@/lib/gallery-manifest";
import { SoundProvider } from "@/components/shell/SoundContext";
import SoundToggle from "@/components/shell/SoundToggle";
import ScrollShell from "@/components/shell/ScrollShell";
import CoverSection from "@/components/sections/CoverSection";
import InvitationSection from "@/components/sections/InvitationSection";
import PoemSection from "@/components/sections/PoemSection";
import AboutSection from "@/components/sections/AboutSection";
import SaveTheDateSection from "@/components/sections/SaveTheDateSection";
import GallerySection from "@/components/sections/GallerySection";
import LocationSection from "@/components/sections/LocationSection";
import FlowerNoticeSection from "@/components/sections/FlowerNoticeSection";
import AccountsSection from "@/components/sections/AccountsSection";
import GuestbookSection from "@/components/sections/GuestbookSection";
import RsvpSection from "@/components/sections/RsvpSection";
import ShareSection from "@/components/sections/ShareSection";
import coverPoster from "@/assets/photos/cover-poster.jpg";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[]; t?: string | string[] }>;
}) {
  const sp = await searchParams;
  const variant = resolveVariant(typeof sp.to === "string" ? sp.to : undefined);
  const vc = VARIANTS[variant];
  const guestbook = await fetchGuestbookPage();

  // 갤러리: ?t=p면 gallery/fix 폴더를 파일명 순서대로 고정 노출,
  // 그 외에는 렌더링마다 카테고리(01~12)별로 1장씩 랜덤 선택
  const pinned = (typeof sp.t === "string" ? sp.t : undefined) === "p";
  const galleryImages =
    pinned && GALLERY_FIXED.length > 0
      ? GALLERY_FIXED
      : GALLERY_CATEGORIES.map(
          (cat) => cat[Math.floor(Math.random() * cat.length)],
        );

  return (
    <div
      className="noSave"
      style={{
        ...themeVars(),
        position: "relative",
        height: "100dvh",
        maxWidth: 430,
        margin: "0 auto",
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: FONT.sans,
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(0,0,0,.12)",
      }}
    >
      <SoundProvider>
        <SoundToggle hasVideo={Boolean(COVER_VIDEO_SRC)} />
        <ScrollShell labels={SECTIONS.map(([, label]) => label)}>
          <CoverSection
            videoSrc={COVER_VIDEO_SRC}
            posterSrc={coverPoster.src}
          />
          <InvitationSection
            greetingTitle={vc.greetingTitle}
            greetingBody={vc.greetingBody}
          />
          <PoemSection />
          <AboutSection />
          <SaveTheDateSection />
          <GallerySection images={galleryImages} />
          <RsvpSection variant={variant} />
          <FlowerNoticeSection />
          <LocationSection transport={vc.transport} />
          <AccountsSection />
          <GuestbookSection
            initialEntries={guestbook.entries}
            initialCursor={guestbook.nextCursor}
          />
          <ShareSection />
        </ScrollShell>
      </SoundProvider>
    </div>
  );
}
