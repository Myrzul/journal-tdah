"use client";

import type { ReactNode } from "react";
import { type Phase, PHASES, SCAN_PINK } from "@/lib/tools/scan-data";

type Props = {
  phase: Phase;
  onPrev?: () => void;
  onNext?: () => void;
  canNext: boolean;
  hideNext?: boolean;
  children: ReactNode;
};

export function ScanPhaseShell({
  phase,
  onPrev,
  onNext,
  canNext,
  hideNext = false,
  children,
}: Props) {
  return (
    <div
      style={{
        background: "white",
        border: "2px solid #0E0E10",
        borderRadius: 28,
        padding: "22px 22px 18px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
        {PHASES.map((p) => (
          <div
            key={p.id}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background:
                p.n < phase.n
                  ? "#0E0E10"
                  : p.n === phase.n
                    ? SCAN_PINK
                    : "#E6E5E1",
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cond)",
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "#7C8A99",
          marginBottom: 6,
        }}
      >
        Phase {phase.n} / 7 · {phase.label}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "-.015em",
          marginBottom: 10,
        }}
      >
        {phase.title}
      </h3>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: "#4A4A55",
          marginBottom: 18,
        }}
      >
        {phase.sub}
      </p>

      {children}

      {!hideNext && (
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {phase.n > 1 && onPrev && (
            <button
              type="button"
              onClick={onPrev}
              style={{
                padding: "12px 18px",
                borderRadius: 999,
                background: "transparent",
                color: "#0E0E10",
                border: "2px solid #0E0E10",
                cursor: "pointer",
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              ← Avant
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: 999,
              background: canNext ? SCAN_PINK : "#E6E5E1",
              color: "#0E0E10",
              cursor: canNext ? "pointer" : "not-allowed",
              border: "2px solid #0E0E10",
              boxShadow: canNext ? "4px 4px 0 #0E0E10" : "none",
              fontFamily: "var(--font-display)",
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: ".04em",
              transition: "all .15s",
            }}
          >
            {phase.n === 7 ? "Terminer" : "Phase suivante →"}
          </button>
        </div>
      )}
    </div>
  );
}
