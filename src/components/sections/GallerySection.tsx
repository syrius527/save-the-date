"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { FONT } from "@/lib/constants";
import Lightbox, { type LightboxItem } from "../ui/Lightbox";

// 카테고리별 선택(기본/랜덤)은 서버(page.tsx)에서 결정되어 props로 내려온다
export default function GallerySection({
  images,
}: {
  images: StaticImageData[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  const items: LightboxItem[] = images.map((img, i) => ({
    kind: "static",
    img,
    alt: `갤러리 사진 ${i + 1}`,
  }));

  return (
    <section
      data-idx={4}
      data-screen-label="Gallery"
      className="snapSection"
      style={{
        padding: "var(--sec-pt-lg) 0 var(--sec-pb)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 12,
            letterSpacing: 5,
            color: "var(--accent)",
          }}
        >
          GALLERY
        </div>
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 19,
            fontWeight: 500,
            margin: "12px 0 0",
          }}
        >
          우리의 순간들
        </h2>
      </div>
      {/* 2열 매소너리: 각 사진이 원본 비율 그대로, 컬럼이 높이를 자동 분배.
          전체 높이가 한 화면을 넘으므로 섹션 내부 스크롤로 스냅 리듬 유지 */}
      <div className="innerScroll" style={{ maxHeight: "60svh", padding: "0 20px" }}>
        <div style={{ columns: 2, columnGap: 6 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setOpen(i)}
              aria-label={`갤러리 사진 ${i + 1} 크게 보기`}
              style={{
                display: "block",
                width: "100%",
                marginBottom: 6,
                breakInside: "avoid",
                border: "none",
                padding: 0,
                cursor: "pointer",
                borderRadius: 10,
                overflow: "hidden",
                background: "var(--line)",
              }}
            >
              <Image
                src={img}
                alt={`갤러리 사진 ${i + 1}`}
                placeholder="blur"
                sizes="(max-width: 430px) 46vw, 190px"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "var(--sub)",
          marginTop: 14,
          letterSpacing: 1,
        }}
      >
        아래로 넘기며 둘러보고, 누르면 크게 볼 수 있어요
      </div>
      {open !== null && (
        <Lightbox
          items={items}
          index={open}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      )}
    </section>
  );
}
