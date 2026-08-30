import Image, { type StaticImageData } from "next/image";
import { FONT, WEDDING } from "@/lib/constants";
import groomChild from "@/assets/photos/groom-child.jpeg";
import brideChild from "@/assets/photos/bride-child.jpeg";

function Person({
  img,
  role,
  name,
  caption,
}: {
  img: StaticImageData;
  role: string;
  name: string;
  caption: readonly string[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        width: 140,
      }}
    >
      <div
        style={{
          width: 128,
          height: 128,
          position: "relative",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Image
          src={img}
          alt={`${role} 어릴 적 사진`}
          fill
          placeholder="blur"
          sizes="128px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--sub)" }}>
          {role}
        </div>
        <div
          style={{
            fontFamily: FONT.serif,
            fontSize: 16,
            fontWeight: 600,
            marginTop: 3,
          }}
        >
          {name}
        </div>
      </div>
      <p
        style={{
          fontSize: 12,
          color: "var(--sub)",
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {caption[0]}
        <br />
        {caption[1]}
      </p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      data-idx={2}
      data-screen-label="About us"
      className="snapSection"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "var(--sec-pt) 28px var(--sec-pb)",
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
        ABOUT US
      </div>
      <h2
        style={{
          fontFamily: FONT.serif,
          fontSize: 19,
          fontWeight: 500,
          margin: "12px 0 30px",
        }}
      >
        우리를 소개합니다
      </h2>
      <div
        style={{
          display: "flex",
          gap: 22,
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Person
          img={groomChild}
          role="신랑"
          name={WEDDING.groom.ko}
          caption={WEDDING.groom.childCaption}
        />
        <div
          style={{
            fontFamily: FONT.display,
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--accent)",
            marginTop: 52,
          }}
        >
          and
        </div>
        <Person
          img={brideChild}
          role="신부"
          name={WEDDING.bride.ko}
          caption={WEDDING.bride.childCaption}
        />
      </div>
      <div
        style={{
          width: 1,
          height: 30,
          background: "var(--line)",
          margin: "28px 0 16px",
        }}
      />
      <div style={{ fontFamily: FONT.serif, fontSize: 13.5, color: "var(--ink)" }}>
        그리고 2026년 10월, 우리는 부부가 됩니다
      </div>
    </section>
  );
}
