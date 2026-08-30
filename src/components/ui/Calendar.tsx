import { FONT } from "@/lib/constants";

// 실제 달력 배치(요일 정렬) + 에디토리얼 미니멀 톤 유지, 예식일에 원형 표시
// 2026년 10월: 1일 = 목요일, 24일(토) 예식
const DAYS_IN_MONTH = 31;
const WEDDING_DAY = 24;
const LEAD_BLANKS = 4; // 일~수 공백
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const SUNDAY_COLOR = "#c65f4f";

export default function Calendar() {
  const cells: (number | null)[] = [
    ...Array.from({ length: LEAD_BLANKS }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
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
        <div style={{ display: "flex", gap: 3 }}>
          {WEEKDAYS.map((w, i) => (
            <span
              key={i}
              style={{
                width: 25,
                height: 24,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10.5,
                letterSpacing: 1,
                color: i === 0 ? SUNDAY_COLOR : "var(--sub)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", gap: 3 }}>
            {week.map((d, di) => (
              <span
                key={di}
                style={{
                  width: 25,
                  height: 27,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: di === 0 ? SUNDAY_COLOR : "var(--ink)",
                  ...(d === WEDDING_DAY
                    ? {
                        border: "1.2px solid var(--ink)",
                        borderRadius: "50%",
                        fontWeight: 500,
                        color: "var(--ink)",
                      }
                    : {}),
                }}
              >
                {d ?? ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
