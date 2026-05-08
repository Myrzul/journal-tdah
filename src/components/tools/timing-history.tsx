"use client";

import {
  formatDuration,
  formatGap,
  formatMinutes,
  TIMING_ORANGE,
  type TimingEntry,
} from "@/lib/tools/timing-data";

type Props = {
  hist: TimingEntry[];
  onClear: () => void;
};

export function TimingHistory({ hist, onClear }: Props) {
  if (!hist || hist.length === 0) {
    return (
      <div
        style={{
          padding: "18px 20px",
          borderRadius: 20,
          border: "2px dashed #B5B5BD",
          color: "#7C8A99",
          fontSize: 13,
          textAlign: "center",
          fontFamily: "var(--font-cond)",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          fontWeight: 700,
        }}
      >
        Pas encore d'estimation enregistrée
      </div>
    );
  }

  const last = hist.slice().reverse().slice(0, 12);
  // Échelle : la plus longue valeur (estim ou réel) parmi les visibles → 100%
  const maxRef = last.reduce((max, h) => {
    return Math.max(max, h.estimateMin, h.realSec / 60);
  }, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {last.map((h) => {
        const realMin = h.realSec / 60;
        const estimW = `${Math.max(2, (h.estimateMin / maxRef) * 100)}%`;
        const realW = `${Math.max(2, (realMin / maxRef) * 100)}%`;
        const g = formatGap(h.estimateMin, h.realSec);
        const d = new Date(h.t);
        return (
          <div key={h.t} className="timing-hist-row">
            <div className="timing-hist-head">
              <div className="timing-hist-task">{h.task || "Tâche sans nom"}</div>
              <div className="timing-hist-date">
                {d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })} ·{" "}
                {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div className="timing-hist-bars">
              <div className="timing-hist-bar-row">
                <span className="timing-hist-bar-label">Estim.</span>
                <span className="timing-hist-bar-track">
                  <span
                    className="timing-hist-bar-fill is-estim"
                    style={{ width: estimW }}
                  />
                </span>
                <span className="timing-hist-bar-val">{formatMinutes(h.estimateMin)}</span>
              </div>
              <div className="timing-hist-bar-row">
                <span className="timing-hist-bar-label">Réel</span>
                <span className="timing-hist-bar-track">
                  <span
                    className="timing-hist-bar-fill is-real"
                    style={{ width: realW, background: TIMING_ORANGE }}
                  />
                </span>
                <span className="timing-hist-bar-val">{formatDuration(h.realSec)}</span>
              </div>
            </div>
            <div className={`timing-hist-gap is-${g.sign}`}>
              {g.sign === "equal"
                ? "Tout pile ·"
                : g.sign === "under"
                  ? `+${formatMinutes(g.gapMin)} ·`
                  : `−${formatMinutes(Math.abs(g.gapMin))} ·`}{" "}
              {g.sign === "equal"
                ? "calibration parfaite"
                : g.sign === "under"
                  ? "tu as sous-estimé"
                  : "tu as surestimé"}
            </div>
            {h.note && <div className="timing-hist-note">« {h.note} »</div>}
          </div>
        );
      })}
      <button type="button" onClick={onClear} className="timing-hist-clear">
        Effacer l'historique
      </button>
    </div>
  );
}
