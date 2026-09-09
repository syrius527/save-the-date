import { FONT } from "@/lib/constants";

// 화환 사양 안내 — 계좌 섹션의 작은 문구로는 잘 읽히지 않아 한 파트로 분리
export default function FlowerNoticeSection() {
  return (
    <section
      data-screen-label="Notice"
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
        NOTICE
      </div>
      <h2
        style={{
          fontFamily: FONT.serif,
          fontSize: 23,
          fontWeight: 500,
          lineHeight: 1.55,
          margin: "26px 0 0",
        }}
      >
        화환은
        <br />
        정중히 사양합니다
      </h2>
      <div
        style={{
          width: 1,
          height: 30,
          background: "var(--line)",
          margin: "var(--divider-my) 0",
        }}
      />
      <p
        style={{
          fontFamily: FONT.serif,
          fontSize: 14.5,
          fontWeight: 300,
          lineHeight: "var(--body-lh)",
          margin: 0,
          color: "var(--sub)",
        }}
      >
        축하해 주시는 마음만으로
        <br />
        충분히 감사합니다.
        <br />
        보내주시려던 그 마음은
        <br />
        따뜻하게 간직하겠습니다.
      </p>
    </section>
  );
}
