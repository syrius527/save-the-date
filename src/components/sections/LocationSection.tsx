import { FONT, WEDDING } from "@/lib/constants";
import type { TransportRow } from "@/lib/variant";

export default function LocationSection({
  transportRows,
}: {
  transportRows: TransportRow[];
}) {
  return (
    <section
      data-idx={5}
      data-screen-label="Location"
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
          LOCATION
        </div>
        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: 19,
            fontWeight: 500,
            margin: "12px 0 8px",
          }}
        >
          오시는 길
        </h2>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{WEDDING.venue.name}</div>
        <div style={{ fontSize: 12.5, color: "var(--sub)", marginTop: 4 }}>
          {WEDDING.venue.address}
        </div>
      </div>
      <div
        style={{
          aspectRatio: "var(--map-ar)",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid var(--line)",
          background:
            "repeating-linear-gradient(45deg,color-mix(in srgb,var(--bg2) 92%, var(--ink)) 0 12px,var(--bg2) 12px 24px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace,Menlo,monospace",
            fontSize: 11,
            color: "var(--sub)",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          지도 영역
          <br />
          (카카오맵 / 네이버 지도 연동)
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {(
          [
            ["카카오맵", WEDDING.mapLinks.kakao],
            ["네이버 지도", WEDDING.mapLinks.naver],
            ["티맵", WEDDING.mapLinks.tmap],
          ] as const
        ).map(([label, href]) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "11px 0",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--bg2)",
              fontSize: 12,
            }}
          >
            {label}
          </a>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {transportRows.map((row) => (
          <div key={row.label} style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: "none",
                width: 52,
                fontWeight: 600,
                color: "var(--accent)",
              }}
            >
              {row.label}
            </div>
            <div style={{ color: "var(--sub)" }}>{row.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
