"use client";

// 터미널 명령 출력 컴포넌트 모음 (Dracula 팔레트)
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { ACCOUNTS, WEDDING, type Account } from "@/lib/constants";
import { VARIANTS } from "@/lib/variant";
import type { GuestbookEntryDTO } from "@/lib/types";
import { copyText } from "@/lib/copy";
import { T } from "./theme";

export function Dim({ children }: { children: React.ReactNode }) {
  return <span style={{ color: T.comment }}>{children}</span>;
}

export function Ln({
  children,
  color = T.fg,
  indent = 0,
}: {
  children: React.ReactNode;
  color?: string;
  indent?: number;
}) {
  return (
    <div style={{ color, paddingLeft: indent * 8, lineHeight: 1.75 }}>
      {children}
    </div>
  );
}

export function Banner() {
  return (
    <pre
      style={{
        color: T.pink,
        margin: "4px 0 2px",
        lineHeight: 1.3,
        fontSize: 12,
      }}
    >{` ___      ___
|   \\  ♥ | _ \\
| |) |   |   /
|___/    |_|_\\`}</pre>
  );
}

export function InfoOut() {
  return (
    <div style={{ margin: "2px 0" }}>
      <Banner />
      <Ln color={T.purple}>
        DONGJAE <span style={{ color: T.pink }}>♥</span> RAEWON — 결혼합니다
      </Ln>
      <Ln>
        <Dim>date:</Dim>{" "}
        <span style={{ color: T.green }}>2026-10-24 (SAT) 18:00 KST</span>
      </Ln>
      <Ln>
        <Dim>venue:</Dim> {WEDDING.venue.name}
      </Ln>
      <Ln>
        <Dim>addr:</Dim> {WEDDING.venue.address}
      </Ln>
      <Ln>
        <Dim>groom:</Dim> {WEDDING.groom.ko} <Dim>({WEDDING.groom.father} · {WEDDING.groom.mother}의 아들)</Dim>
      </Ln>
      <Ln>
        <Dim>bride:</Dim> {WEDDING.bride.ko} <Dim>({WEDDING.bride.father} · {WEDDING.bride.mother}의 딸)</Dim>
      </Ln>
    </div>
  );
}

export function DdayOut() {
  const target = new Date(WEDDING.dateISO).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <Ln color={T.yellow}>⏳ 계산 중…</Ln>;
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 864e5);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hms = `${pad(Math.floor(diff / 36e5) % 24)}:${pad(Math.floor(diff / 6e4) % 60)}:${pad(Math.floor(diff / 1e3) % 60)}`;
  const totalCells = 14; // 모바일 한 줄에 D-XX HH:MM:SS까지 들어가는 폭
  const yearMs = 365 * 864e5;
  const filled = Math.min(
    totalCells,
    Math.max(1, Math.round(((yearMs - Math.min(diff, yearMs)) / yearMs) * totalCells)),
  );
  return (
    <div>
      <Ln>
        <span style={{ color: T.green }}>{"▓".repeat(filled)}</span>
        <Dim>{"░".repeat(totalCells - filled)}</Dim>{" "}
        <span style={{ color: T.pink, fontWeight: 700 }}>D-{d}</span>{" "}
        <span style={{ color: T.yellow }}>{hms}</span>
      </Ln>
      <Ln>
        <Dim>{WEDDING.dateLabelKo}까지 함께 카운트다운 중</Dim>
      </Ln>
    </div>
  );
}

export function CalendarOut() {
  // 2026년 10월 (1일 = 목요일, 24일 예식)
  const weeks = [
    "             1  2  3",
    " 4  5  6  7  8  9 10",
    "11 12 13 14 15 16 17",
    "18 19 20 21 22 23 __",
    "25 26 27 28 29 30 31",
  ];
  return (
    <pre style={{ margin: "2px 0", lineHeight: 1.6, color: T.fg }}>
      <span style={{ color: T.purple }}>{"    October 2026\n"}</span>
      <span style={{ color: T.comment }}>{"Su Mo Tu We Th Fr Sa\n"}</span>
      {weeks.map((w, i) => (
        <span key={i}>
          {w.includes("__") ? (
            <>
              {w.slice(0, w.indexOf("__"))}
              <span
                style={{
                  background: T.pink,
                  color: T.bg,
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                24
              </span>
            </>
          ) : (
            w
          )}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

export function LocationOut() {
  const rows = [
    ...VARIANTS.friend.transport.transit,
    ...VARIANTS.friend.transport.car,
  ];
  return (
    <div>
      <Ln color={T.green}>📍 {WEDDING.venue.name}</Ln>
      <Ln>
        <Dim>{WEDDING.venue.address}</Dim>
      </Ln>
      {rows.map((r) => (
        <Ln key={r.label}>
          <span style={{ color: T.cyan }}>{r.label.padEnd(4, " ")}</span>{" "}
          <Dim>{r.body}</Dim>
        </Ln>
      ))}
      <Ln>
        {(
          [
            ["kakao", WEDDING.mapLinks.kakao],
            ["naver", WEDDING.mapLinks.naver],
            ["tmap", WEDDING.mapLinks.tmap],
          ] as const
        ).map(([label, href]) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              color: T.cyan,
              textDecoration: "underline",
              marginRight: 14,
            }}
          >
            open --{label} ↗
          </a>
        ))}
      </Ln>
    </div>
  );
}

function TermCopy({ acc }: { acc: Account }) {
  const [copied, setCopied] = useState(false);
  return (
    <Ln>
      <Dim>
        {acc.role} {acc.name}
      </Dim>{" "}
      {acc.bank} <span style={{ color: T.yellow }}>{acc.num}</span>{" "}
      <button
        onClick={async () => {
          await copyText(`${acc.bank} ${acc.num} ${acc.name}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        style={{
          background: "none",
          border: `1px solid ${T.line}`,
          color: copied ? T.green : T.cyan,
          borderRadius: 4,
          padding: "1px 8px",
          fontSize: 11,
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {copied ? "copied ✓" : "| pbcopy"}
      </button>
    </Ln>
  );
}

export function AccountsOut() {
  return (
    <div>
      <Ln color={T.purple}># 신랑측</Ln>
      {ACCOUNTS.groom.map((a) => (
        <TermCopy key={a.role + a.name} acc={a} />
      ))}
      <Ln color={T.purple}># 신부측</Ln>
      {ACCOUNTS.bride.map((a) => (
        <TermCopy key={a.role + a.name} acc={a} />
      ))}
      <Ln>
        <Dim>마음 전해주셔서 감사합니다 🙇</Dim>
      </Ln>
    </div>
  );
}

export function GalleryOut({
  images,
  onOpen,
}: {
  images: StaticImageData[];
  onOpen: (index: number) => void;
}) {
  return (
    <div>
      <Ln>
        <Dim>gallery/ — {images.length} items (탭하면 크게 보여요)</Dim>
      </Ln>
      <div
        data-scroll="1"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "6px 0",
          scrollbarWidth: "none",
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onOpen(i)}
            style={{
              flex: "none",
              width: 110,
              height: 82,
              position: "relative",
              border: `1px solid ${T.line}`,
              borderRadius: 6,
              overflow: "hidden",
              padding: 0,
              cursor: "pointer",
              background: T.line,
            }}
          >
            <Image
              src={img}
              alt={`갤러리 ${i + 1}`}
              fill
              sizes="220px"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
      <Ln>
        <Dim>전체 갤러리는 </Dim>
        <a href="/" style={{ color: T.cyan, textDecoration: "underline" }}>
          본 청첩장 ↗
        </a>
        <Dim>에서</Dim>
      </Ln>
    </div>
  );
}

export function EntryOut({ entry }: { entry: GuestbookEntryDTO }) {
  return (
    <div style={{ margin: "2px 0" }}>
      <Ln>
        <span style={{ color: T.orange }}>@{entry.name}</span>{" "}
        <Dim>
          {new Intl.DateTimeFormat("ko-KR", {
            month: "numeric",
            day: "numeric",
            timeZone: "Asia/Seoul",
          }).format(new Date(entry.createdAt))}
          {entry.photos.length > 0 && ` · 📷 ${entry.photos.length}`}
        </Dim>
      </Ln>
      <Ln indent={1}>
        <span style={{ whiteSpace: "pre-wrap" }}>{entry.message}</span>
      </Ln>
    </div>
  );
}

const CLAUDE_ANSWERS: [RegExp, string[]][] = [
  [
    /소개|누구|introduce/i,
    [
      "두 분을 소개할게요.",
      "신랑 이동재 — 씩씩한 개구쟁이가 자라 다정한 어른이 되었습니다.",
      "신부 정래원 — 웃음 많은 꼬마가 자라 단단한 어른이 되었습니다.",
      "2026년 10월, 두 사람은 부부가 됩니다.",
    ],
  ],
  [
    /언제|날짜|when|시간/i,
    [
      "결혼식은 2026년 10월 24일 토요일 오후 6시입니다.",
      "장소는 워커힐 호텔 워커홀이에요. `location`으로 가는 길을 확인해보세요.",
    ],
  ],
  [
    /어디|장소|위치|where/i,
    [
      "워커힐 호텔 · 워커홀 (서울 광진구 워커힐로 177)입니다.",
      "`location` 명령으로 지하철·셔틀·주차 안내를 볼 수 있어요.",
    ],
  ],
];

const CLAUDE_DEFAULT = [
  "두 분의 결혼을 진심으로 축하합니다. 🎉",
  "서로를 향한 커밋이 충돌 없이 병합되어, 오늘부터 하나의 브랜치로 나아갑니다.",
  "더 나은 준비를 위해 `rsvp`로 참석 여부를 꼭 알려주세요.",
  "화환은 마음만 감사히 받겠습니다 — 정중히 사양할게요. 🌸",
  "이 청첩장도 저와 함께 만들어졌어요 — 축하 메시지는 `guestbook`으로 남겨주세요.",
];

export function ClaudeOut({ query }: { query: string }) {
  const [phase, setPhase] = useState<"thinking" | "done">("thinking");
  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(t);
  }, []);
  const answer =
    CLAUDE_ANSWERS.find(([re]) => re.test(query))?.[1] ?? CLAUDE_DEFAULT;
  if (phase === "thinking") {
    return (
      <Ln>
        <span style={{ color: T.purple }}>✳ Thinking…</span>
      </Ln>
    );
  }
  return (
    <div>
      {answer.map((line, i) => (
        <Ln key={i}>
          {i === 0 ? (
            <span style={{ color: T.orange }}>● </span>
          ) : (
            <span style={{ opacity: 0 }}>{"● "}</span>
          )}
          {line}
        </Ln>
      ))}
    </div>
  );
}

export function HelpOut() {
  const rows: [string, string][] = [
    ["info", "결혼식 정보"],
    ["dday", "실시간 카운트다운"],
    ["cal", "10월 달력"],
    ["location", "오시는 길 · 지도 링크"],
    ["account", "마음 전하실 곳 (계좌 복사)"],
    ["gallery", "사진 미리보기"],
    ["guestbook", "방명록 보기 · 남기기"],
    ["rsvp", "참석 여부 전달"],
    ["claude <질문>", "Claude에게 물어보기"],
    ["full", "본 청첩장 열기"],
    ["clear", "화면 지우기"],
  ];
  return (
    <div>
      {rows.map(([cmd, desc]) => (
        <Ln key={cmd}>
          <span style={{ color: T.green, display: "inline-block", minWidth: 132 }}>
            {cmd}
          </span>
          <Dim>{desc}</Dim>
        </Ln>
      ))}
    </div>
  );
}
