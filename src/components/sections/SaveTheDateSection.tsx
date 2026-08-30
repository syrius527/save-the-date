import Image from "next/image";
import { FONT, WEDDING } from "@/lib/constants";
import Calendar from "../ui/Calendar";
import Countdown from "../ui/Countdown";
import datePhoto from "@/assets/photos/couple2.jpg";

export default function SaveTheDateSection() {
  return (
    <section
      data-idx={3}
      data-screen-label="Date"
      className="snapSection"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "var(--sec-pt) 32px var(--sec-pb)",
      }}
    >
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: 12,
          letterSpacing: 5,
          color: "var(--accent)",
        }}
      >
        SAVE THE DATE
      </div>
      {/* 흑백 스냅 사진 — 에디토리얼 무드 */}
      <div
        style={{
          width: 126,
          aspectRatio: `${datePhoto.width} / ${datePhoto.height}`,
          position: "relative",
          overflow: "hidden",
          marginTop: 24,
        }}
      >
        <Image
          src={datePhoto}
          alt=""
          fill
          placeholder="blur"
          sizes="126px"
          style={{ objectFit: "cover", filter: "grayscale(1)" }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT.display,
          fontStyle: "italic",
          fontSize: 22,
          marginTop: 22,
          letterSpacing: 1,
        }}
      >
        October.
      </div>
      <div style={{ marginTop: 12 }}>
        <Calendar />
      </div>
      <div
        style={{
          fontFamily: FONT.display,
          fontStyle: "italic",
          fontSize: 13.5,
          color: "var(--sub)",
          marginTop: 16,
          letterSpacing: 0.5,
        }}
      >
        Saturday, October 24, 2026
      </div>
      <Countdown targetISO={WEDDING.dateISO} />
    </section>
  );
}
