"use client";

import { useEffect, useRef, useState } from "react";
import NavDots from "./NavDots";
import RsvpFab, { RSVP_DONE_EVENT, RSVP_DONE_KEY } from "./RsvpFab";
import RsvpModal from "./RsvpModal";
import type { Variant } from "@/lib/variant";

function isFormField(t: EventTarget | null): boolean {
  return (
    t instanceof HTMLElement &&
    (t.tagName === "INPUT" || t.tagName === "TEXTAREA")
  );
}

// 모달을 띄울 파트 (캘린더·계좌) — 각각 기기당 1회
const MODAL_SEEN_KEY = "wg_rsvp_modal_seen";
const MODAL_DELAY_MS = 1400;

function readSeen(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(MODAL_SEEN_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default function ScrollShell({
  labels,
  rsvpIndex,
  modalTriggers,
  variant,
  children,
}: {
  labels: string[];
  rsvpIndex: number;
  modalTriggers: { key: string; index: number }[];
  variant: Variant;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [soft, setSoft] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const rsvpDoneRef = useRef(false);

  // 이미 제출한 기기에서는 모달을 띄우지 않는다
  useEffect(() => {
    try {
      rsvpDoneRef.current = localStorage.getItem(RSVP_DONE_KEY) === "1";
    } catch {}
    // 모달을 여기서 닫지 않는다 — 모달이 감사 인사를 보여준 뒤 스스로 닫는다
    const onDone = () => {
      rsvpDoneRef.current = true;
    };
    window.addEventListener(RSVP_DONE_EVENT, onDone);
    return () => window.removeEventListener(RSVP_DONE_EVENT, onDone);
  }, []);

  // 지정한 파트에 머무르면 잠깐 뒤 모달 노출 (파트별 1회, 지나가면 취소)
  useEffect(() => {
    if (modalOpen || rsvpDoneRef.current) return;
    const hit = modalTriggers.find((t) => t.index === active);
    if (!hit || readSeen().includes(hit.key)) return;
    const timer = setTimeout(() => {
      if (rsvpDoneRef.current) return;
      try {
        localStorage.setItem(
          MODAL_SEEN_KEY,
          JSON.stringify([...new Set([...readSeen(), hit.key])]),
        );
      } catch {}
      setModalOpen(true);
    }, MODAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [active, modalOpen, modalTriggers]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    // 섹션 인덱스는 DOM 순서를 따른다 — 섹션 추가/제거 시 번호 재부여 불필요
    const els = Array.from(
      c.querySelectorAll<HTMLElement>("section.snapSection"),
    );
    sectionsRef.current = els;

    // ?part=N (1부터 시작)으로 진입하면 해당 파트에서 바로 시작
    // 범위 밖·오타는 조용히 무시하고 커버부터
    const part = Number(new URLSearchParams(window.location.search).get("part"));
    if (Number.isInteger(part) && part >= 1 && part <= els.length) {
      els[part - 1].scrollIntoView({ behavior: "instant" });
      setActive(part - 1);
    }

    const io = new IntersectionObserver(
      (es) => {
        es.forEach((en) => {
          if (en.isIntersecting) {
            const i = els.indexOf(en.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      { root: c, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((s) => io.observe(s));

    const onFocusIn = (e: FocusEvent) => {
      if (isFormField(e.target)) setSoft(true);
    };
    const onFocusOut = () => setSoft(false);
    c.addEventListener("focusin", onFocusIn);
    c.addEventListener("focusout", onFocusOut);
    return () => {
      io.disconnect();
      c.removeEventListener("focusin", onFocusIn);
      c.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const goTo = (i: number) => {
    sectionsRef.current[i]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={ref}
        data-scroll="1"
        className={`snapShell${soft ? " softSnap" : ""}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <NavDots labels={labels} active={active} onGo={goTo} />
      {/* 커버(첫인상)와 RSVP 파트 자체에서는 숨긴다 */}
      <RsvpFab
        visible={rsvpIndex >= 0 && active !== 0 && active !== rsvpIndex && !modalOpen}
        onClick={() => goTo(rsvpIndex)}
      />
      <RsvpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={variant}
      />
    </>
  );
}
