"use client";

export default function NavDots({
  labels,
  active,
  onGo,
}: {
  labels: string[];
  active: number;
  onGo: (i: number) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        right: 9,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        gap: 9,
        alignItems: "center",
        padding: "12px 7px",
        borderRadius: 99,
        background: "color-mix(in srgb, var(--bg2) 55%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
      }}
    >
      {labels.map((label, i) => (
        <div
          key={label}
          onClick={() => onGo(i)}
          title={label}
          style={{
            width: 6,
            height: active === i ? 20 : 6,
            borderRadius: 99,
            background: "var(--ink)",
            opacity: active === i ? 1 : 0.32,
            cursor: "pointer",
            transition:
              "height .35s cubic-bezier(.6,0,.2,1), opacity .3s",
          }}
        />
      ))}
    </div>
  );
}
