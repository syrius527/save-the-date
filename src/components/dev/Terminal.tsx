"use client";

import { useEffect, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import type { GuestbookEntryDTO, GuestbookPage } from "@/lib/types";
import { copyText } from "@/lib/copy";
import Lightbox, { type LightboxItem } from "../ui/Lightbox";
import { MONO, T } from "./theme";
import {
  AccountsOut,
  CalendarOut,
  ClaudeOut,
  DdayOut,
  Dim,
  EntryOut,
  GalleryOut,
  HelpOut,
  InfoOut,
  Ln,
  LocationOut,
} from "./outputs";

interface Props {
  initialEntries: GuestbookEntryDTO[];
  initialCursor: string | null;
  galleryImages: StaticImageData[];
}

type Mode =
  | { type: "boot" }
  | { type: "shell" }
  | { type: "text"; label: string; onSubmit: (v: string) => void }
  | {
      type: "choice";
      label: string;
      options: { label: string; value: string }[];
      onPick: (v: string) => void;
    };

interface Line {
  id: number;
  node: React.ReactNode;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Prompt({ cmd }: { cmd: string }) {
  return (
    <div style={{ lineHeight: 1.75 }}>
      <span style={{ color: T.green }}>❯</span>{" "}
      <span style={{ color: T.cyan }}>{cmd}</span>
    </div>
  );
}

function Echo({ label, answer }: { label: string; answer: string }) {
  return (
    <div style={{ lineHeight: 1.75 }}>
      <span style={{ color: T.purple }}>? {label}</span>{" "}
      <span style={{ color: T.comment }}>›</span>{" "}
      <span style={{ color: T.green }}>{answer}</span>
    </div>
  );
}

const BASE_CHIPS = [
  "help",
  "dday",
  "location",
  "gallery",
  "guestbook",
  "rsvp",
  "account",
  'claude "축사 부탁해"',
];

export default function Terminal({
  initialEntries,
  initialCursor,
  galleryImages,
}: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [mode, setMode] = useState<Mode>({ type: "boot" });
  const [typed, setTyped] = useState("");
  const [input, setInput] = useState("");
  const [chips, setChips] = useState<string[]>(BASE_CHIPS);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootedRef = useRef(false);
  const entriesRef = useRef(initialEntries);
  const cursorRef = useRef(initialCursor);

  const append = (node: React.ReactNode) => {
    setLines((ls) => [...ls, { id: ++idRef.current, node }]);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typed, mode]);

  // 인트로 세션 자동 재생
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    (async () => {
      const typeCmd = async (text: string) => {
        for (let i = 1; i <= text.length; i++) {
          setTyped(text.slice(0, i));
          await sleep(26);
        }
        await sleep(180);
        setTyped("");
        append(<Prompt cmd={text} />);
      };
      append(
        <Ln>
          <Dim>Last login: 우리가 처음 만난 날, from 서로의 마음</Dim>
        </Ln>,
      );
      await sleep(500);
      await typeCmd("wedding --info");
      append(<InfoOut />);
      await sleep(350);
      await typeCmd("wedding --dday");
      append(<DdayOut />);
      append(
        <Ln>
          <Dim>
            `help`를 입력하거나 아래 버튼을 눌러보세요. 터미널이 낯설다면{" "}
          </Dim>
          <a href="/" style={{ color: T.cyan, textDecoration: "underline" }}>
            본 청첩장 ↗
          </a>
          <Dim>도 있어요.</Dim>
        </Ln>,
      );
      setMode({ type: "shell" });
    })();
  }, []);

  const notFound = (cmd: string) => {
    append(
      <Ln color={T.red}>
        zsh: command not found: {cmd}{" "}
        <Dim>— `help`로 명령 목록을 볼 수 있어요</Dim>
      </Ln>,
    );
  };

  // ── 방명록 플로우 ──────────────────────────────────────
  const showGuestbook = () => {
    const es = entriesRef.current;
    append(
      <Ln>
        <Dim>$ tail -3 guestbook.txt ({es.length}건 로드됨)</Dim>
      </Ln>,
    );
    if (es.length === 0) {
      append(
        <Ln>
          <Dim>아직 메시지가 없어요. 첫 번째 축하를 남겨주세요!</Dim>
        </Ln>,
      );
    } else {
      es.slice(0, 3).forEach((e) => append(<EntryOut entry={e} />));
    }
    setChips(["guestbook write", ...(cursorRef.current ? ["guestbook more"] : []), ...BASE_CHIPS]);
  };

  const guestbookMore = async () => {
    if (!cursorRef.current) {
      append(
        <Ln>
          <Dim>더 불러올 메시지가 없어요.</Dim>
        </Ln>,
      );
      return;
    }
    const res = await fetch(
      `/api/guestbook?cursor=${encodeURIComponent(cursorRef.current)}`,
    );
    if (!res.ok) {
      append(<Ln color={T.red}>불러오기에 실패했어요.</Ln>);
      return;
    }
    const page = (await res.json()) as GuestbookPage;
    entriesRef.current = [...entriesRef.current, ...page.entries];
    cursorRef.current = page.nextCursor;
    page.entries.forEach((e) => append(<EntryOut entry={e} />));
    if (!page.nextCursor) {
      append(
        <Ln>
          <Dim>— 끝 —</Dim>
        </Ln>,
      );
    }
  };

  const guestbookWrite = () => {
    setMode({
      type: "text",
      label: "성함",
      onSubmit: (name) => {
        if (!name.trim()) return;
        append(<Echo label="성함" answer={name.trim()} />);
        setMode({
          type: "text",
          label: "축하 메시지",
          onSubmit: async (msg) => {
            if (!msg.trim()) return;
            append(<Echo label="축하 메시지" answer={msg.trim()} />);
            setMode({ type: "shell" });
            const res = await fetch("/api/guestbook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: name.trim(),
                message: msg.trim(),
                website: "",
                photos: [],
              }),
            });
            if (res.ok) {
              const entry = (await res.json()) as GuestbookEntryDTO;
              entriesRef.current = [entry, ...entriesRef.current];
              append(
                <Ln color={T.green}>
                  ✓ guestbook.txt에 기록되었습니다. 감사합니다!{" "}
                  <Dim>(사진 첨부는 본 청첩장에서 가능해요)</Dim>
                </Ln>,
              );
            } else {
              const body = await res.json().catch(() => null);
              append(
                <Ln color={T.red}>
                  ✗ {body?.error ?? "등록에 실패했어요. 잠시 후 다시 시도해주세요."}
                </Ln>,
              );
            }
          },
        });
      },
    });
  };

  // ── RSVP 플로우 (inquirer 스타일) ──────────────────────
  const startRsvp = () => {
    try {
      if (localStorage.getItem("wg_rsvp_done") === "1") {
        append(
          <Ln color={T.green}>
            ✓ 이미 참석 여부가 전달되었습니다. 감사합니다!
          </Ln>,
        );
        return;
      }
    } catch {}
    const data = { side: "groom", attending: true, name: "", headcount: 1 };
    setMode({
      type: "choice",
      label: "어느 쪽 하객이신가요?",
      options: [
        { label: "신랑측", value: "groom" },
        { label: "신부측", value: "bride" },
      ],
      onPick: (side) => {
        data.side = side;
        append(
          <Echo
            label="어느 쪽 하객이신가요?"
            answer={side === "groom" ? "신랑측" : "신부측"}
          />,
        );
        setMode({
          type: "choice",
          label: "참석하시나요?",
          options: [
            { label: "참석", value: "y" },
            { label: "불참", value: "n" },
          ],
          onPick: (a) => {
            data.attending = a === "y";
            append(
              <Echo label="참석하시나요?" answer={data.attending ? "참석" : "불참"} />,
            );
            setMode({
              type: "text",
              label: "대표자 성함",
              onSubmit: (name) => {
                if (!name.trim()) return;
                data.name = name.trim();
                append(<Echo label="대표자 성함" answer={data.name} />);
                setMode({
                  type: "choice",
                  label: "동행 인원 (본인 포함)",
                  options: ["1", "2", "3", "4", "5"].map((n) => ({
                    label: `${n}명`,
                    value: n,
                  })),
                  onPick: async (n) => {
                    data.headcount = Number(n);
                    append(
                      <Echo label="동행 인원 (본인 포함)" answer={`${n}명`} />,
                    );
                    setMode({ type: "shell" });
                    const res = await fetch("/api/rsvp", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        side: data.side,
                        attending: data.attending,
                        name: data.name,
                        relation: "",
                        headcount: data.headcount,
                        variant: "friend",
                        website: "",
                      }),
                    });
                    if (res.ok) {
                      try {
                        localStorage.setItem("wg_rsvp_done", "1");
                      } catch {}
                      append(
                        <Ln color={T.green}>
                          ✓ 전달되었습니다. 소중한 시간 내주셔서 감사합니다!
                        </Ln>,
                      );
                    } else {
                      const body = await res.json().catch(() => null);
                      append(
                        <Ln color={T.red}>
                          ✗ {body?.error ?? "전달에 실패했어요. 잠시 후 다시 시도해주세요."}
                        </Ln>,
                      );
                    }
                  },
                });
              },
            });
          },
        });
      },
    });
  };

  // ── 명령 라우팅 ────────────────────────────────────────
  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    append(<Prompt cmd={cmd} />);
    if (!cmd) return;
    setChips(BASE_CHIPS);
    const [headRaw, ...rest] = cmd.split(/\s+/);
    const head = headRaw.toLowerCase();
    const arg = rest.join(" ");

    if (head === "help" || head === "?") return append(<HelpOut />);
    if (head === "info" || head === "wedding") return append(<InfoOut />);
    if (["dday", "d-day", "d"].includes(head)) return append(<DdayOut />);
    if (["cal", "calendar", "달력"].includes(head))
      return append(<CalendarOut />);
    if (["location", "map", "길", "오시는길"].includes(head))
      return append(<LocationOut />);
    if (["account", "pay", "계좌", "마음"].includes(head))
      return append(<AccountsOut />);
    if (["gallery", "사진", "open"].includes(head))
      return append(
        <GalleryOut images={galleryImages} onOpen={(i) => setLightbox(i)} />,
      );
    if (["guestbook", "방명록", "gb"].includes(head)) {
      if (arg === "write") return guestbookWrite();
      if (arg === "more") return void guestbookMore();
      return showGuestbook();
    }
    if (["rsvp", "참석"].includes(head)) return startRsvp();
    if (head === "claude") {
      if (!arg)
        return append(
          <Ln>
            <Dim>usage: claude &quot;질문&quot; — 예) claude &quot;두 사람 소개해줘&quot;</Dim>
          </Ln>,
        );
      return append(<ClaudeOut query={arg} key={`c${idRef.current}`} />);
    }
    if (["full", "invite", "본청첩장", "청첩장"].includes(head))
      return append(
        <Ln>
          <a href="/" style={{ color: T.cyan, textDecoration: "underline" }}>
            → 본 청첩장 열기 ↗
          </a>
        </Ln>,
      );
    if (["share", "link", "공유"].includes(head)) {
      void copyText(`${location.origin}/dev`).then(() =>
        append(<Ln color={T.green}>✓ 링크가 클립보드에 복사되었습니다.</Ln>),
      );
      return;
    }
    if (head === "clear") return setLines([]);
    if (head === "sudo") {
      append(<Ln><Dim>[sudo] password for guest: ❤️❤️❤️❤️</Dim></Ln>);
      append(
        <Ln color={T.green}>
          Permission granted. 두 사람의 결혼이 승인되었습니다. 💍
        </Ln>,
      );
      return;
    }
    if (head === "exit") {
      append(
        <Ln>
          <Dim>결혼식장에서 만나요. 로그아웃은 없습니다. 🤝</Dim>
        </Ln>,
      );
      return;
    }
    notFound(head);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input;
    setInput("");
    if (mode.type === "shell") runCommand(v);
    else if (mode.type === "text") mode.onSubmit(v);
  };

  const chipRun = (c: string) => {
    if (mode.type !== "shell") return;
    runCommand(c.replace(/^claude ".*"$/, 'claude "축사 부탁해"'));
  };

  const lightboxItems: LightboxItem[] = galleryImages.map((img, i) => ({
    kind: "static",
    img,
    alt: `갤러리 사진 ${i + 1}`,
  }));

  return (
    <div
      className="noSave"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        minHeight: "100dvh",
        background: T.bgDarker,
        padding: 10,
        fontFamily: MONO,
      }}
    >
      <style>{`@keyframes tblink { 50% { opacity: 0 } }`}</style>
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          height: "calc(100dvh - 20px)",
          display: "flex",
          flexDirection: "column",
          background: T.bg,
          border: `1px solid ${T.line}`,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 18px 50px rgba(0,0,0,.5)",
        }}
      >
        {/* 타이틀 바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: T.bgDarker,
            borderBottom: `1px solid ${T.line}`,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              style={{ width: 11, height: 11, borderRadius: "50%", background: c }}
            />
          ))}
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 11.5,
              color: T.comment,
            }}
          >
            dongjae@wedding: ~ — zsh
          </span>
        </div>

        {/* 트랜스크립트 */}
        <div
          ref={scrollRef}
          data-scroll="1"
          className="innerScroll"
          style={{
            flex: 1,
            padding: "12px 14px",
            fontSize: 13,
            color: T.fg,
            overflowY: "auto",
          }}
        >
          {lines.map((l) => (
            <div key={l.id}>{l.node}</div>
          ))}
          {mode.type === "boot" && (
            <div style={{ lineHeight: 1.75 }}>
              <span style={{ color: T.green }}>❯</span>{" "}
              <span style={{ color: T.cyan }}>{typed}</span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 15,
                  background: T.fg,
                  verticalAlign: "text-bottom",
                  animation: "tblink 1s step-end infinite",
                }}
              />
            </div>
          )}
          {mode.type === "choice" && (
            <div style={{ lineHeight: 1.9 }}>
              <span style={{ color: T.purple }}>? {mode.label}</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {mode.options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => mode.onPick(o.value)}
                    style={{
                      background: "none",
                      border: `1px solid ${T.purple}`,
                      color: T.purple,
                      borderRadius: 6,
                      padding: "5px 14px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    ◯ {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        {mode.type !== "boot" && mode.type !== "choice" && (
          <div style={{ borderTop: `1px solid ${T.line}`, padding: "8px 12px 10px" }}>
            {mode.type === "shell" && (
              <div
                data-scroll="1"
                style={{
                  display: "flex",
                  gap: 6,
                  overflowX: "auto",
                  paddingBottom: 8,
                  scrollbarWidth: "none",
                }}
              >
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => chipRun(c)}
                    style={{
                      flex: "none",
                      background: T.line,
                      border: "none",
                      color: T.cyan,
                      borderRadius: 5,
                      padding: "4px 10px",
                      fontSize: 11.5,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={submit} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: mode.type === "shell" ? T.green : T.purple, fontSize: 14 }}>
                {mode.type === "shell" ? "❯" : `? ${mode.label} ›`}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode.type === "shell" ? "명령을 입력하세요" : ""}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  color: T.fg,
                  fontSize: 16, // iOS 포커스 줌 방지
                  fontFamily: "inherit",
                  padding: 0,
                }}
              />
            </form>
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox
          items={lightboxItems}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onIndex={setLightbox}
        />
      )}
    </div>
  );
}
