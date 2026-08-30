"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SoundCtx {
  muted: boolean;
  toggle: () => void;
  attachVideo: (el: HTMLVideoElement | null) => void;
}

const Ctx = createContext<SoundCtx>({
  muted: true,
  toggle: () => {},
  attachVideo: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mutedRef = useRef(true);

  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) el.muted = mutedRef.current;
  }, []);

  const toggle = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    const v = videoRef.current;
    if (v) {
      v.muted = next;
      if (!next && v.paused) v.play().catch(() => {});
    }
    setMuted(next);
  }, []);

  // 기본 사운드 ON: 브라우저 자동재생 정책상 음소거로 시작해야 하므로,
  // 첫 사용자 제스처(터치/클릭)에서 자동으로 소리를 켠다
  useEffect(() => {
    const unmuteOnFirstGesture = () => {
      if (!mutedRef.current) return;
      mutedRef.current = false;
      const v = videoRef.current;
      if (v) {
        v.muted = false;
        if (v.paused) v.play().catch(() => {});
      }
      setMuted(false);
    };
    document.addEventListener("pointerdown", unmuteOnFirstGesture, {
      once: true,
      capture: true,
    });
    return () =>
      document.removeEventListener("pointerdown", unmuteOnFirstGesture, {
        capture: true,
      });
  }, []);

  return (
    <Ctx.Provider value={{ muted, toggle, attachVideo }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSound(): SoundCtx {
  return useContext(Ctx);
}
