"use client";

import {
  formatDuration,
  formatGap,
  formatMinutes,
  TIMING_ORANGE,
} from "@/lib/tools/timing-data";

type Props = {
  task: string;
  estimateMin: number;
  realSec: number;
};

export function TimingRecap({ task, estimateMin, realSec }: Props) {
  const realMin = realSec / 60;
  const g = formatGap(estimateMin, realSec);
  const maxRef = Math.max(estimateMin, realMin, 1);
  const estimW = `${Math.max(4, (estimateMin / maxRef) * 100)}%`;
  const realW = `${Math.max(4, (realMin / maxRef) * 100)}%`;

  return (
    <div className="timing-recap-card">
      <div className="timing-recap-eyebrow">Tâche terminée</div>
      <div className="timing-recap-task">{task || "Tâche sans nom"}</div>

      <div className="timing-recap-bars">
        <div className="timing-recap-bar-row">
          <span className="timing-recap-bar-label">Tu avais estimé</span>
          <span className="timing-recap-bar-track">
            <span className="timing-recap-bar-fill is-estim" style={{ width: estimW }} />
          </span>
          <span className="timing-recap-bar-val">{formatMinutes(estimateMin)}</span>
        </div>
        <div className="timing-recap-bar-row">
          <span className="timing-recap-bar-label">Ça a pris</span>
          <span className="timing-recap-bar-track">
            <span
              className="timing-recap-bar-fill is-real"
              style={{ width: realW, background: TIMING_ORANGE }}
            />
          </span>
          <span className="timing-recap-bar-val">{formatDuration(realSec)}</span>
        </div>
      </div>

      <div className={`timing-recap-gap is-${g.sign}`}>
        {g.sign === "equal" ? "·" : g.sign === "under" ? "+" : "−"}
        {g.sign === "equal" ? "" : formatMinutes(Math.abs(g.gapMin))}{" "}
        <span className="timing-recap-gap-text">
          {g.sign === "equal"
            ? "calibration parfaite — c'est rare !"
            : g.sign === "under"
              ? "de plus que prévu"
              : "de moins que prévu"}
        </span>
      </div>

      <p className="timing-recap-note-hand">
        {g.sign === "equal"
          ? "Tu as senti juste, là."
          : g.sign === "under"
            ? "Pas un échec — c'est exactement ce qu'on apprend en mesurant."
            : "Tu avais mis large — c'est aussi une info utile."}
      </p>
    </div>
  );
}
