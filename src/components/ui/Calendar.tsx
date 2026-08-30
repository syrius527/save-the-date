import { FONT } from "@/lib/constants";

// 에디토리얼 스타일 미니멀 달력: 요일 없이 숫자를 9개씩 나열, 예식일에 원형 표시
const DAYS_IN_MONTH = 31; // 2026년 10월
const WEDDING_DAY = 24;
const PER_ROW = 9;

export default function Calendar() {
  const rows: number[][] = [];
  for (let start = 1; start <= DAYS_IN_MONTH; start += PER_ROW) {
    rows.push(
      Array.from(
        { length: Math.min(PER_ROW, DAYS_IN_MONTH - start + 1) },
        (_, i) => start + i,
      ),
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          fontFamily: FONT.sans,
          fontSize: 14,
          fontWeight: 300,
          color: "var(--ink)",
        }}
      >
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 3 }}>
            {row.map((d) => (
              <span
                key={d}
                style={{
                  width: 25,
                  height: 27,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(d === WEDDING_DAY
                    ? {
                        border: "1.2px solid var(--ink)",
                        borderRadius: "50%",
                        fontWeight: 500,
                      }
                    : {}),
                }}
              >
                {d}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
