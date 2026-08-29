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
  const [active, setActive] = useState(0);
  const [soft, setSoft] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((en) => {
          if (en.isIntersecting) {
            setActive(Number(en.target.getAttribute("data-idx")) || 0);
          }
        });
      },
      { root: c, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    c.querySelectorAll("section[data-idx]").forEach((s) => io.observe(s));

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
    ref.current
      ?.querySelector(`section[data-idx="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth" });
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
