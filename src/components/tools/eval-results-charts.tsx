/**
 * Composants graphiques pour la page de résultats d'auto-évaluation.
 * SVG custom à la charte (bordures noires épaisses, palette du proto).
 *
 * Pas Server Components stricts (pas d'effets) mais renderable serveur,
 * donc pas de "use client" — utilisable depuis page.tsx Server Component.
 */

import {
  getRubriqueLevel,
  getSymptomLevel,
  getWellbeingLevel,
  type SectionId,
  SECTIONS_BY_ID,
  type EvalScores,
} from "@/lib/tools/eval-data";

/* =========================================================
   ScoreBlock — Inattention / Hyperactivité (Étape 1)
   ========================================================= */
type ScoreBlockProps = {
  label: string;
  value: number;
  max: number;
  /** Niveau symptomatique (3 paliers) */
  level: { label: string; color: string };
};

export function ScoreBlock({ label, value, max, level }: ScoreBlockProps) {
  return (
    <div className="score-block" style={{ background: hexA(level.color, 0.1), borderColor: level.color }}>
      <div className="score-block-label" style={{ color: level.color }}>
        {label}
      </div>
      <div className="score-block-value" style={{ color: level.color }}>
        {value}
      </div>
      <div className="score-block-max">/ {max}</div>
      <span className="score-block-level" style={{ background: level.color, color: "white" }}>
        {level.label}
      </span>
    </div>
  );
}

/* =========================================================
   RubriqueBar — barre horizontale par rubrique (Étape 2)
   ========================================================= */
type RubriqueBarProps = {
  id: SectionId;
  score: number;
  /** Lien externe vers le chapitre du guide pour cette rubrique */
  guideHref?: string;
};

export function RubriqueBar({ id, score, guideHref }: RubriqueBarProps) {
  const section = SECTIONS_BY_ID[id];
  const max = 20;
  const level = getRubriqueLevel(score);
  const pct = (score / max) * 100;
  const showGuideLink = guideHref && score > 12; // Priorité élevée ou très élevée

  return (
    <div className="rubrique-bar">
      <div className="rubrique-bar-head">
        <h4 className="rubrique-bar-title">{section.title}</h4>
        <span className="rubrique-bar-score" style={{ color: level.color }}>
          {score} / {max}
        </span>
      </div>
      <div className="rubrique-bar-track">
        <div
          className="rubrique-bar-fill"
          style={{ width: `${pct}%`, background: level.color }}
        />
      </div>
      <div className="rubrique-bar-footer">
        <span className="rubrique-bar-level" style={{ background: level.color }}>
          {level.label}
        </span>
        {showGuideLink && (
          <a
            href={guideHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rubrique-bar-guide"
          >
            Guide →
          </a>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   WellbeingBlock — Rubrique 10 (échelle inversée : haut = bon)
   ========================================================= */
export function WellbeingBlock({ score }: { score: number }) {
  const max = 20;
  const level = getWellbeingLevel(score);
  const pct = (score / max) * 100;
  return (
    <div
      className="wellbeing-block"
      style={{ background: hexA(level.color, 0.08), borderColor: level.color }}
    >
      <div className="wellbeing-block-head">
        <span className="wellbeing-block-eyebrow">10. Bien-être mental global</span>
        <span className="wellbeing-block-value" style={{ color: level.color }}>
          {score} / {max}
        </span>
      </div>
      <div className="wellbeing-block-track">
        <div
          className="wellbeing-block-fill"
          style={{ width: `${pct}%`, background: level.color }}
        />
      </div>
      <div className="wellbeing-block-level" style={{ background: level.color }}>
        {level.label}
      </div>
      {level.desc && <p className="wellbeing-block-desc">{level.desc}</p>}
    </div>
  );
}

/* =========================================================
   RadarChart — vue d'ensemble des 9 rubriques en radar
   ========================================================= */
type RadarPoint = {
  id: SectionId;
  shortLabel: string;
  score: number;
  color: string;
};

const RUBRIQUES_RADAR: { id: SectionId; shortLabel: string }[] = [
  { id: "rub1", shortLabel: "Attention" },
  { id: "rub2", shortLabel: "Organisation" },
  { id: "rub3", shortLabel: "Temps" },
  { id: "rub4", shortLabel: "Initiation" },
  { id: "rub5", shortLabel: "Motivation" },
  { id: "rub6", shortLabel: "Impulsivité" },
  { id: "rub7", shortLabel: "Hygiène" },
  { id: "rub8", shortLabel: "Travail" },
  { id: "rub9", shortLabel: "Social" },
];

export function RadarChart({ scores }: { scores: EvalScores }) {
  const W = 380;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;
  const R = 140;
  const max = 20;

  const points: RadarPoint[] = RUBRIQUES_RADAR.map((r) => ({
    id: r.id,
    shortLabel: r.shortLabel,
    score: scores[r.id],
    color: SECTIONS_BY_ID[r.id].color,
  }));

  const N = points.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;

  const polygonPoints = points
    .map((p, i) => {
      const r = (p.score / max) * R;
      const x = cx + r * Math.cos(angle(i));
      const y = cy + r * Math.sin(angle(i));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Niveaux concentriques (5, 10, 15, 20)
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 420, display: "block", margin: "0 auto" }}
      aria-label="Vue d'ensemble des répercussions en radar"
      role="img"
    >
      {/* Anneaux concentriques */}
      {rings.map((r, i) => (
        <polygon
          key={`ring-${i}`}
          points={points
            .map((_p, j) => {
              const x = cx + r * R * Math.cos(angle(j));
              const y = cy + r * R * Math.sin(angle(j));
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ")}
          fill="none"
          stroke="var(--divider)"
          strokeWidth={1}
          strokeDasharray={i === 3 ? "" : "3 3"}
        />
      ))}

      {/* Axes radiaux */}
      {points.map((_p, i) => {
        const x = cx + R * Math.cos(angle(i));
        const y = cy + R * Math.sin(angle(i));
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--divider)"
            strokeWidth={1}
          />
        );
      })}

      {/* Polygone des scores */}
      <polygon
        points={polygonPoints}
        fill="rgba(255,31,143,0.18)"
        stroke="var(--ch-attention)"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* Points colorés */}
      {points.map((p, i) => {
        const r = (p.score / max) * R;
        const x = cx + r * Math.cos(angle(i));
        const y = cy + r * Math.sin(angle(i));
        return (
          <circle
            key={`pt-${p.id}`}
            cx={x}
            cy={y}
            r={4}
            fill={p.color}
            stroke="var(--ink)"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Labels axes */}
      {points.map((p, i) => {
        const labelR = R + 22;
        const x = cx + labelR * Math.cos(angle(i));
        const y = cy + labelR * Math.sin(angle(i));
        const a = angle(i);
        // Anchor selon position : à droite si cos > 0.3, à gauche si cos < -0.3, sinon centré
        const anchor = Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
        return (
          <text
            key={`label-${p.id}`}
            x={x}
            y={y}
            textAnchor={anchor}
            fontFamily="var(--font-cond)"
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.04em"
            fill="var(--ink)"
            dominantBaseline="middle"
          >
            {p.shortLabel.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

/* =========================================================
   Helpers
   ========================================================= */
function hexA(hex: string, alpha: number): string {
  // hex #RRGGBB → rgba(r,g,b,alpha)
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return `rgba(0,0,0,${alpha})`;
  const intVal = parseInt(m[1] ?? "000000", 16);
  const r = (intVal >> 16) & 0xff;
  const g = (intVal >> 8) & 0xff;
  const b = intVal & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

/* Re-export helpers for external use */
export { getSymptomLevel };
