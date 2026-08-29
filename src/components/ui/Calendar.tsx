import { FONT } from "@/lib/constants";

// 2026년 10월 고정 달력 (1일 = 목요일, 24일 예식)
const LEAD_BLANKS = 4;
const DAYS_IN_MONTH = 31;
const WEDDING_DAY = 24;

export default function Calendar() {
  const cells: { d: string; bg: string; color: string; fw: number }[] = [];
  for (let i = 0; i < LEAD_BLANKS; i++) {
    cells.push({ d: "", bg: "transparent", color: "transparent", fw: 400 });
  }
  for (let d = 1; d <= DAYS_IN_MONTH; d++) {
    const dow = (LEAD_BLANKS + d - 1) % 7;
    const isDay = d === WEDDING_DAY;
    cells.push({
      d: String(d),
      bg: isDay ? "var(--accent)" : "transparent",
      color: isDay ? "#fff" : dow === 0 ? "#c65f4f" : "var(--ink)",
      fw: isDay ? 600 : 400,
    });
  }

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "22px 20px",
        width: "100%",
        maxWidth: 310,
        fontFamily: FONT.sans,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 4,
          fontSize: 11,
          color: "var(--sub)",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        <div style={{ color: "#c65f4f" }}>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12.5,
              borderRadius: "50%",
              background: c.bg,
              color: c.color,
              fontWeight: c.fw,
            }}
          >
            {c.d}
          </div>
        ))}
      </div>
    </div>
  );
}
