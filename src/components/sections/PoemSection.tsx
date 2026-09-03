import { Fragment } from "react";
import { FONT } from "@/lib/constants";

// 나태주, 「사랑에 답함」 — 신랑·신부가 고른 시 (원문 그대로)
const STANZAS: string[][] = [
  ["예쁘지 않은 것을 예쁘게", "보아주는 것이 사랑이다"],
  ["좋지 않은 것을 좋게", "생각해주는 것이 사랑이다"],
  ["싫은 것도 잘 참아주면서", "처음만 그런 것이 아니라"],
  ["나중까지 아주 나중까지", "그렇게 하는 것이 사랑이다"],
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
        사랑에 답함
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
