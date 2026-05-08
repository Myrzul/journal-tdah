"use client";

import { COHERENCE_PINK, CYCLE_PERIOD_MS } from "@/lib/tools/coherence-data";

type Props = {
  /** Temps actif écoulé en ms (hors pauses) */
  elapsedMs: number;
  /** Durée totale visée en ms */
  durationMs: number;
  /** Si true : la session tourne. Si false : pause (animation gelée). */
  running: boolean;
};

export function CoherenceFlower({ elapsedMs, durationMs, running }: Props) {
  const period = CYCLE_PERIOD_MS;
  const cycleProgress = (elapsedMs % period) / period; // 0..1
  const phase: "in" | "out" = cycleProgress < 0.5 ? "in" : "out";
  const ratio = phase === "in" ? cycleProgress * 2 : (1 - cycleProgress) * 2;
  const eased = ratio < 0.5 ? 2 * ratio * ratio : 1 - (-2 * ratio + 2) ** 2 / 2;
  const bloom = 0.4 + eased * 0.6; // 0.4..1.0

  // Compteur 5..1 dans la phase, basé sur la position dans la moitié de cycle
  const phaseRatio = phase === "in" ? cycleProgress * 2 : (cycleProgress - 0.5) * 2;
  const countInPhase = Math.max(1, Math.min(5, Math.ceil((1 - phaseRatio) * 5)));

  const W = 320;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;
  const N = 6;
  const PETAL_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

  return (
    <div className="coherence-tool-flower">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: 320, display: "block" }}
        aria-hidden="true"
      >
        <title>Fleur respiratoire de cohérence cardiaque</title>

        {/* Anneau de progression total */}
        <circle
          cx={cx}
          cy={cy}
          r="148"
          fill="none"
          stroke="var(--surface-alt)"
          strokeWidth="6"
        />
        <circle
          cx={cx}
          cy={cy}
          r="148"
          fill="none"
          stroke={COHERENCE_PINK}
          strokeWidth="6"
          strokeDasharray={`${(elapsedMs / durationMs) * 2 * Math.PI * 148} ${2 * Math.PI * 148}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 200ms linear" }}
        />

        {/* Pétales */}
        <g transform={`translate(${cx} ${cy})`}>
          {PETAL_KEYS.map((k, i) => (
            <g key={k} transform={`rotate(${i * (360 / N)}) scale(${bloom})`}>
              <ellipse
                cx="0"
                cy="-44"
                rx="22"
                ry="44"
                fill={COHERENCE_PINK}
                stroke="#0E0E10"
                strokeWidth="2.2"
                opacity={running ? 0.85 : 0.45}
              />
            </g>
          ))}
          <circle r="20" fill="white" stroke="#0E0E10" strokeWidth="2.5" />
          <circle r="6" fill="#0E0E10" />
        </g>
      </svg>

      <div className="coherence-tool-state">
        <div className="coherence-tool-phase">
          {!running ? "PAUSE" : phase === "in" ? "INSPIRE" : "EXPIRE"}
        </div>
        <div className="coherence-tool-count">{running ? countInPhase : "—"}</div>
      </div>
    </div>
  );
}
