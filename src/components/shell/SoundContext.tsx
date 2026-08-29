"use client";

import {
  createContext,
  useCallback,
  useContext,
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

  return (
    <Ctx.Provider value={{ muted, toggle, attachVideo }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSound(): SoundCtx {
  return useContext(Ctx);
}
