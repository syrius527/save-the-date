import { FONT, WEDDING } from "@/lib/constants";
import type { VariantConfig } from "@/lib/variant";
import KakaoMap from "../ui/KakaoMap";
import TransportTabs from "../ui/TransportTabs";

export default function LocationSection({
  transport,
}: {
  transport: VariantConfig["transport"];
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
      <KakaoMap />
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
      <TransportTabs car={transport.car} transit={transport.transit} />
    </section>
  );
}
