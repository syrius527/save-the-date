"use client";

import { useEffect, useRef, useState } from "react";
import NavDots from "./NavDots";

function isFormField(t: EventTarget | null): boolean {
  return (
    t instanceof HTMLElement &&
    (t.tagName === "INPUT" || t.tagName === "TEXTAREA")
  );
}

export default function ScrollShell({
  labels,
  children,
}: {
  labels: string[];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [soft, setSoft] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    // 섹션 인덱스는 DOM 순서를 따른다 — 섹션 추가/제거 시 번호 재부여 불필요
    const els = Array.from(
      c.querySelectorAll<HTMLElement>("section.snapSection"),
    );
    sectionsRef.current = els;
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
      >
        {children}
      </div>
      <NavDots labels={labels} active={active} onGo={goTo} />
    </>
  );
}
