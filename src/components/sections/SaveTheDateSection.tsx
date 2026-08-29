import { FONT, WEDDING } from "@/lib/constants";
import Calendar from "../ui/Calendar";
import Countdown from "../ui/Countdown";

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
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: 44,
          fontWeight: 400,
          margin: "10px 0 2px",
          letterSpacing: 2,
        }}
      >
        10 · 24
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: "var(--sub)",
          letterSpacing: 1,
          marginBottom: 26,
        }}
      >
        {WEDDING.dateLabelKo}
      </div>
      <Calendar />
      <Countdown
        targetISO={WEDDING.dateISO}
        groomName={WEDDING.groom.firstName}
        brideName={WEDDING.bride.firstName}
      />
    </section>
  );
}
