import Image from "next/image";
import { Fragment } from "react";
import { FONT, WEDDING } from "@/lib/constants";
import couple from "@/assets/photos/couple2.jpg";

export default function InvitationSection({
  greetingTitle,
  greetingBody,
}: {
  greetingTitle: string;
  greetingBody: string[];
}) {
  return (
    <section
      data-idx={1}
      data-screen-label="Invitation"
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
        INVITATION
      </div>
      <h2
        style={{
          fontFamily: FONT.serif,
          fontSize: 21,
          fontWeight: 500,
          margin: "14px 0 26px",
        }}
      >
        {greetingTitle}
      </h2>
      {/* 스타디움 셰이프 + 헤어라인 이중 프레임.
          비율은 사진 파일을 따라가므로 교체해도 크롭 없이 맞춰짐 (세로 사진이면 세로 아치가 됨) */}
      <div
        style={{
          padding: 6,
          border: "1px solid var(--line)",
          borderRadius: 999,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width:
              couple.width >= couple.height
                ? "min(calc(var(--couple-w) * 1.55), 78vw)"
                : "min(var(--couple-w), 52vw)",
            aspectRatio: `${couple.width} / ${couple.height}`,
            position: "relative",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <Image
            src={couple}
            alt="두 사람의 사진"
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 430px) 78vw, 310px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <p
        style={{
          fontFamily: FONT.serif,
          fontSize: 14.5,
          fontWeight: 300,
          lineHeight: "var(--body-lh)",
          margin: 0,
          color: "var(--ink)",
        }}
      >
        {greetingBody.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
      <div
        style={{
          width: 1,
          height: 34,
          background: "var(--line)",
          margin: "var(--divider-my) 0",
        }}
      />
      <div style={{ fontFamily: FONT.serif, fontSize: 14.5, lineHeight: 2.1 }}>
        <div>
          {WEDDING.groom.father} · {WEDDING.groom.mother}{" "}
          <span style={{ fontSize: 12.5, color: "var(--sub)" }}>의 아들</span>{" "}
          <b style={{ fontWeight: 600 }}>{WEDDING.groom.firstName}</b>
        </div>
        <div>
          {WEDDING.bride.father} · {WEDDING.bride.mother}{" "}
          <span style={{ fontSize: 12.5, color: "var(--sub)" }}>의 딸</span>{" "}
          <b style={{ fontWeight: 600 }}>{WEDDING.bride.firstName}</b>
        </div>
      </div>
    </section>
  );
}
