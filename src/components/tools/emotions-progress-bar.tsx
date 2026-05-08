"use client";

import {
  EMO_PINK,
  type EmotionPhase,
  PHASE_LABELS,
  PHASE_ORDER,
} from "@/lib/tools/emotions-data";

type Props = {
  phase: EmotionPhase;
  onJump: (phase: Exclude<EmotionPhase, "porte">) => void;
};

export function EmotionsProgressBar({ phase, onJump }: Props) {
  const idx =
    phase === "porte"
      ? -1
      : PHASE_ORDER.indexOf(phase as Exclude<EmotionPhase, "porte">);

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        justifyContent: "space-between",
        margin: "4px 0 18px",
        padding: "8px 0",
        borderTop: "1.4px solid var(--ink-2)",
        borderBottom: "1.4px solid var(--ink-2)",
      }}
    >
      {PHASE_ORDER.map((p, i) => {
        const reached = i <= idx;
        const active = i === idx;
        return (
          <button
            key={p}
            type="button"
            onClick={() => {
              if (reached) onJump(p);
            }}
            disabled={!reached}
            style={{
              flex: 1,
              padding: "4px 2px",
              background: "transparent",
              border: "none",
              borderTop: active ? `3px solid ${EMO_PINK}` : "3px solid transparent",
              fontFamily: "var(--font-cond)",
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: reached ? "#0E0E10" : "var(--muted)",
              cursor: reached ? "pointer" : "default",
            }}
          >
            {PHASE_LABELS[p]}
          </button>
        );
      })}
    </div>
  );
}
