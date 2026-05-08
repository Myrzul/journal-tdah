"use client";

import { formatHourMin, JOURNAL_BLUE, type TimeSlot } from "@/lib/tools/journal-data";

type Props = {
  slots: TimeSlot[];
};

const ENERGY_COLOR = JOURNAL_BLUE;
const MOOD_COLOR = "#FF1F8F"; // ch-attention magenta — pour distinguer

const W = 720;
const H = 240;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 20;
const PAD_BOTTOM = 32;

export function JournalChart({ slots }: Props) {
  if (slots.length === 0) return null;

  const innerW = W - PAD_LEFT - PAD_RIGHT;
  const innerH = H - PAD_TOP - PAD_BOTTOM;

  const xOf = (idx: number) => {
    if (slots.length <= 1) return PAD_LEFT;
    return PAD_LEFT + (idx / (slots.length - 1)) * innerW;
  };
  const yOf = (val: number) => {
    // val 1..10 → bottom..top
    const ratio = (val - 1) / 9;
    return PAD_TOP + (1 - ratio) * innerH;
  };

  const energyPoints = slots
    .map((s) => (s.energy != null ? { x: xOf(s.idx), y: yOf(s.energy), val: s.energy } : null))
    .filter((p): p is { x: number; y: number; val: number } => p !== null);
  const moodPoints = slots
    .map((s) => (s.mood != null ? { x: xOf(s.idx), y: yOf(s.mood), val: s.mood } : null))
    .filter((p): p is { x: number; y: number; val: number } => p !== null);

  const energyPath = energyPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const moodPath = moodPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Graduations Y : 1, 5, 10
  const yTicks = [1, 5, 10];
  // X ticks : 4 graduations horaires (début, 1/3, 2/3, fin)
  const xTickIdx = [
    0,
    Math.floor((slots.length - 1) / 3),
    Math.floor((2 * (slots.length - 1)) / 3),
    slots.length - 1,
  ];

  const noData = energyPoints.length === 0 && moodPoints.length === 0;

  return (
    <div className="journal-chart-wrap">
      <div className="journal-chart-legend">
        <span className="journal-chart-legend-item">
          <span className="journal-chart-legend-dot" style={{ background: ENERGY_COLOR }} />
          Énergie
        </span>
        <span className="journal-chart-legend-item">
          <span className="journal-chart-legend-dot" style={{ background: MOOD_COLOR }} />
          Humeur
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxWidth: "100%" }}
        role="img"
        aria-label="Courbes énergie et humeur sur la journée"
      >
        <title>Courbes énergie et humeur</title>
        {/* Grille horizontale */}
        {yTicks.map((t) => (
          <g key={`y-${t}`}>
            <line
              x1={PAD_LEFT}
              y1={yOf(t)}
              x2={W - PAD_RIGHT}
              y2={yOf(t)}
              stroke="#0E0E10"
              strokeWidth="0.6"
              opacity={t === 5 ? 0.25 : 0.12}
              strokeDasharray={t === 5 ? "0" : "3 4"}
            />
            <text
              x={PAD_LEFT - 8}
              y={yOf(t) + 4}
              textAnchor="end"
              fontFamily="var(--font-cond)"
              fontWeight="800"
              fontSize="10"
              fill="#7C8A99"
              letterSpacing="0.06em"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Graduations horaires */}
        {xTickIdx.map((idx) => {
          const slot = slots[idx];
          if (!slot) return null;
          return (
            <text
              key={`x-${idx}`}
              x={xOf(idx)}
              y={H - 10}
              textAnchor={idx === 0 ? "start" : idx === slots.length - 1 ? "end" : "middle"}
              fontFamily="var(--font-cond)"
              fontWeight="800"
              fontSize="10"
              fill="#7C8A99"
              letterSpacing="0.08em"
            >
              {formatHourMin(slot.startMin)}
            </text>
          );
        })}

        {noData ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            fontFamily="var(--font-cond)"
            fontWeight="700"
            fontSize="13"
            fill="#7C8A99"
            letterSpacing="0.08em"
          >
            Pas encore de données — coche au moins une tranche
          </text>
        ) : (
          <>
            {/* Énergie */}
            {energyPoints.length > 1 && (
              <path
                d={energyPath}
                fill="none"
                stroke={ENERGY_COLOR}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {energyPoints.map((p) => (
              <circle
                key={`e-${p.x}-${p.y}`}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="white"
                stroke={ENERGY_COLOR}
                strokeWidth="2"
              />
            ))}
            {/* Humeur */}
            {moodPoints.length > 1 && (
              <path
                d={moodPath}
                fill="none"
                stroke={MOOD_COLOR}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5 4"
              />
            )}
            {moodPoints.map((p) => (
              <circle
                key={`m-${p.x}-${p.y}`}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="white"
                stroke={MOOD_COLOR}
                strokeWidth="2"
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
