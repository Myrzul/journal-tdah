"use client";

import {
  type CoherenceSession,
  formatMmSs,
} from "@/lib/tools/coherence-data";

type Props = {
  hist: CoherenceSession[];
  onClear: () => void;
};

export function CoherenceHistory({ hist, onClear }: Props) {
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
        Pas encore de session enregistrée
      </div>
    );
  }

  const last = hist.slice().reverse().slice(0, 12);
  const totalSec = hist.reduce((acc, h) => acc + h.completedSec, 0);
  const totalSessions = hist.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="coherence-tool-stats">
        <div className="coherence-tool-stat">
          <div className="coherence-tool-stat-value">{totalSessions}</div>
          <div className="coherence-tool-stat-label">
            session{totalSessions > 1 ? "s" : ""}
          </div>
        </div>
        <div className="coherence-tool-stat">
          <div className="coherence-tool-stat-value">
            {Math.round(totalSec / 60)}
          </div>
          <div className="coherence-tool-stat-label">min cumulées</div>
        </div>
      </div>
      {last.map((h) => {
        const d = new Date(h.t);
        const completed = h.completedSec >= h.durationSec;
        return (
          <div key={h.t} className="coherence-tool-hist-row">
            <div className="coherence-tool-hist-date">
              {d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
              <br />
              {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="coherence-tool-hist-body">
              <div className="coherence-tool-hist-duration">
                {formatMmSs(h.completedSec)}
                <span className="coherence-tool-hist-target">
                  {" / "}{formatMmSs(h.durationSec)}
                </span>
              </div>
              <div
                className={`coherence-tool-hist-state ${completed ? "is-complete" : ""}`}
              >
                {completed
                  ? `Cycle complet · ${h.cycles} respirations`
                  : `Session interrompue · ${h.cycles} respirations`}
              </div>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={onClear}
        style={{
          marginTop: 6,
          padding: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-cond)",
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#B5B5BD",
        }}
      >
        Effacer l'historique
      </button>
    </div>
  );
}
