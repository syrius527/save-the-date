import { Fragment } from "react";
import { FONT } from "@/lib/constants";

// 나태주, 「먼 길」 — 신랑·신부가 고른 시 (원문 그대로)
const STANZAS: string[][] = [
  ["함께 가자", "먼 길"],
  ["너와 함께라면", "멀어도 가깝고"],
  ["아름답지 않아도", "아름다운 길"],
  ["나도 그 길 위에서", "나무가 되고"],
  ["너를 위해 착한", "바람이 되고 싶다."],
];

export default function PoemSection() {
  return (
    <section
      data-screen-label="Poem"
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
        POEM
      </div>
      <h2
        style={{
          fontFamily: FONT.serif,
          fontSize: 19,
          fontWeight: 500,
          margin: "12px 0 4px",
        }}
      >
        먼 길
      </h2>
      <div style={{ fontSize: 12, color: "var(--sub)", letterSpacing: 1 }}>
        나태주
      </div>
      <div
        style={{
          width: 1,
          height: 30,
          background: "var(--line)",
          margin: "var(--divider-my) 0",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {STANZAS.map((stanza, si) => (
          <p
            key={si}
            style={{
              fontFamily: FONT.serif,
              fontSize: 14.5,
              fontWeight: 300,
              lineHeight: "var(--body-lh)",
              margin: 0,
              color: "var(--ink)",
            }}
          >
            {stanza.map((line, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
