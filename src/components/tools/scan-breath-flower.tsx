"use client";

import { useEffect, useRef, useState } from "react";
import { SCAN_PINK } from "@/lib/tools/scan-data";

type Props = {
  guided?: boolean;
  onComplete?: () => void;
};

const TARGET = 5;

export function ScanBreathFlower({ guided = true, onComplete }: Props) {
  const [tick, setTick] = useState(0);
  const [cycle, setCycle] = useState(0);
  const startRef = useRef<number>(Date.now());
  const period = guided ? 8000 : 6000;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const elapsed = Date.now() - startRef.current;
      const c = Math.min(TARGET, Math.floor(elapsed / period));
      setCycle(c);
      setTick((t) => (t + 1) % 100000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [period]);

  const elapsed = (Date.now() - startRef.current) % period;
  const t = elapsed / period;
  const phase = t < 0.5 ? "in" : "out";
  const ratio = phase === "in" ? t * 2 : (1 - t) * 2;
  const eased = ratio < 0.5 ? 2 * ratio * ratio : 1 - (-2 * ratio + 2) ** 2 / 2;
  const bloom = 0.35 + eased * 0.65;

  // Reference tick to keep biome happy (used for re-render every frame)
  void tick;

  const W = 320;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;
  const N = 6;
  const petalRot = (i: number) => i * (360 / N);

  const DOT_KEYS = ["d1", "d2", "d3", "d4", "d5"] as const;
  const PETAL_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        padding: "12px 0",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: 320, display: "block" }}
        aria-hidden="true"
      >
        <title>Fleur respiratoire</title>
        {DOT_KEYS.map((k, i) => {
          const ang = ((-90 + i * (360 / TARGET)) * Math.PI) / 180;
          const r = 142;
          const x = cx + Math.cos(ang) * r;
          const y = cy + Math.sin(ang) * r;
          const filled = i < cycle;
          return (
            <g key={k}>
              <circle
                cx={x}
                cy={y}
                r="9"
                fill={filled ? SCAN_PINK : "white"}
                stroke="#0E0E10"
                strokeWidth="2"
              />
              {filled && <circle cx={x} cy={y} r="3" fill="white" />}
            </g>
          );
        })}

        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy + 80}
          stroke="#0E0E10"
          strokeWidth="1.4"
          strokeDasharray="2 4"
          opacity="0.4"
        />

        <g transform={`translate(${cx} ${cy})`}>
          {PETAL_KEYS.map((k, i) => (
            <g key={k} transform={`rotate(${petalRot(i)}) scale(${bloom})`}>
              <ellipse
                cx="0"
                cy="-44"
                rx="22"
                ry="44"
                fill={SCAN_PINK}
                stroke="#0E0E10"
                strokeWidth="2.2"
                opacity={0.85}
              />
            </g>
          ))}
          <circle r="20" fill="white" stroke="#0E0E10" strokeWidth="2.5" />
          <circle r="6" fill="#0E0E10" />
        </g>
      </svg>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          textTransform: "uppercase",
          letterSpacing: "-0.005em",
          color: "#0E0E10",
          textAlign: "center",
        }}
      >
        {phase === "in" ? "Inspire — la fleur s’ouvre" : "Expire — la fleur se ferme"}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cond)",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "#7C8A99",
        }}
      >
        Cycle {Math.min(cycle + 1, TARGET)} / {TARGET}
      </div>

      {cycle >= TARGET && onComplete && (
        <button
          type="button"
          onClick={onComplete}
          style={{
            marginTop: 4,
            padding: "14px 24px",
            borderRadius: 999,
            background: SCAN_PINK,
            color: "#0E0E10",
            border: "2px solid #0E0E10",
            boxShadow: "4px 4px 0 #0E0E10",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: ".04em",
          }}
        >
          Continuer →
        </button>
      )}
    </div>
  );
}
