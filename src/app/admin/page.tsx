import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { fetchGuestbookPage } from "@/lib/guestbook-data";
import DeleteEntryButton from "./DeleteEntryButton";

export const dynamic = "force-dynamic";

interface RsvpRow {
  id: string;
  side: "groom" | "bride";
  attending: boolean;
  name: string;
  relation: string | null;
  headcount: number;
  variant: string;
  created_at: string;
}

const card: React.CSSProperties = {
  background: "#fffdf8",
  border: "1px solid #e3dccf",
  borderRadius: 14,
  padding: 16,
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ ...card, flex: 1, minWidth: 130, textAlign: "center" }}>
      <div style={{ fontSize: 11.5, color: "#8a8177" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, marginTop: 6 }}>{value}</div>
    </div>
  );
}

export default async function AdminPage() {
  if (!supabaseConfigured()) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        Supabase 환경변수가 설정되지 않았습니다 (.env.local 참고).
      </div>
    );
  }

  const db = supabaseAdmin();
  const { data } = await db
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });
  const rsvps = (data ?? []) as RsvpRow[];

  const attend = rsvps.filter((r) => r.attending);
  const sum = (rows: RsvpRow[]) => rows.reduce((s, r) => s + r.headcount, 0);
  const groomAttend = attend.filter((r) => r.side === "groom");
  const brideAttend = attend.filter((r) => r.side === "bride");
  const familyCount = rsvps.filter((r) => r.variant === "family").length;

  const guestbook = await fetchGuestbookPage(undefined, 100);

  const fmt = new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#f7f3ec",
        color: "#3b3630",
        padding: "28px 18px 60px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif",
      }}
    >
      <h1 style={{ fontSize: 19, margin: "0 0 18px" }}>청첩장 관리자</h1>

      <h2 style={{ fontSize: 14.5, margin: "0 0 10px" }}>RSVP 집계</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <StatCard
          label="참석 합계 (명)"
          value={`${sum(attend)}명 · ${attend.length}건`}
        />
        <StatCard
          label="신랑측 참석"
          value={`${sum(groomAttend)}명 · ${groomAttend.length}건`}
        />
        <StatCard
          label="신부측 참석"
          value={`${sum(brideAttend)}명 · ${brideAttend.length}건`}
        />
        <StatCard
          label="불참 / 친인척 링크 응답"
          value={`${rsvps.length - attend.length}건 / ${familyCount}건`}
        />
      </div>

      <div style={{ ...card, marginTop: 12, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12.5,
            minWidth: 480,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#8a8177" }}>
              <th style={{ padding: "6px 8px" }}>측</th>
              <th style={{ padding: "6px 8px" }}>참석</th>
              <th style={{ padding: "6px 8px" }}>성함</th>
              <th style={{ padding: "6px 8px" }}>관계</th>
              <th style={{ padding: "6px 8px" }}>인원</th>
              <th style={{ padding: "6px 8px" }}>링크</th>
              <th style={{ padding: "6px 8px" }}>시각</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 14, color: "#8a8177" }}>
                  아직 응답이 없습니다.
                </td>
              </tr>
            )}
            {rsvps.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #efe9dd" }}>
                <td style={{ padding: "7px 8px" }}>
                  {r.side === "groom" ? "신랑측" : "신부측"}
                </td>
                <td style={{ padding: "7px 8px" }}>
                  {r.attending ? "참석" : "불참"}
                </td>
                <td style={{ padding: "7px 8px" }}>{r.name}</td>
                <td style={{ padding: "7px 8px" }}>{r.relation || "-"}</td>
                <td style={{ padding: "7px 8px" }}>{r.headcount}</td>
                <td style={{ padding: "7px 8px" }}>
                  {r.variant === "family" ? "친인척" : "지인"}
                </td>
                <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>
                  {fmt.format(new Date(r.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 14.5, margin: "26px 0 10px" }}>
        방명록 관리 (최근 {guestbook.entries.length}건)
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {guestbook.entries.length === 0 && (
          <div style={{ ...card, color: "#8a8177", fontSize: 13 }}>
            아직 방명록 글이 없습니다.
          </div>
        )}
        {guestbook.entries.map((e) => (
          <div key={e.id} style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {e.name}
                <span
                  style={{
                    color: "#8a8177",
                    fontWeight: 400,
                    fontSize: 11,
                    marginLeft: 8,
                  }}
                >
                  {fmt.format(new Date(e.createdAt))} · 사진 {e.photos.length}장
                </span>
              </div>
              <DeleteEntryButton id={e.id} />
            </div>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                marginTop: 6,
                whiteSpace: "pre-wrap",
              }}
            >
              {e.message}
            </div>
            {e.photos.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {e.photos.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <a key={p.key} href={p.url} target="_blank" rel="noreferrer">
                    <img
                      src={`/_next/image?url=${encodeURIComponent(p.url)}&w=128&q=75`}
                      alt=""
                      style={{
                        width: 56,
                        height: 56,
                        objectFit: "cover",
                        borderRadius: 6,
                        display: "block",
                      }}
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
