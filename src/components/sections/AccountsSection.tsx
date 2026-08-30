import { ACCOUNTS, FONT } from "@/lib/constants";
import Accordion from "../ui/Accordion";

export default function AccountsSection() {
  return (
    <section
      data-idx={6}
      data-screen-label="Gift"
      className="snapSection"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "var(--sec-pt-lg) 26px var(--sec-pb)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 12,
            letterSpacing: 5,
            color: "var(--accent)",
          }}
        >
          WITH LOVE
        </div>
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 19,
            fontWeight: 500,
            margin: "12px 0 8px",
          }}
        >
          마음 전하실 곳
        </h2>
        <p
          style={{
            fontSize: 12.5,
            color: "var(--sub)",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          참석이 어려워 직접 축하를 전하지 못하는
          <br />
          분들을 위해 계좌번호를 안내드립니다.
          <br />
          화환은 정중히 사양하며, 마음만 감사히 받겠습니다.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Accordion title="신랑측 계좌번호" rows={ACCOUNTS.groom} />
        <Accordion title="신부측 계좌번호" rows={ACCOUNTS.bride} />
      </div>
    </section>
  );
}
