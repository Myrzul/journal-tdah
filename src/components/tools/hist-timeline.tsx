import { LEVEL_BY_N, type ThermoObservation } from "@/lib/tools/thermo-data";

type Props = {
  hist: ThermoObservation[];
};

/** Mini-timeline des 12 dernières observations. */
export function HistTimeline({ hist }: Props) {
  if (!hist || hist.length === 0) {
    return (
      <div className="thermo-hist-empty">
        Aucune observation enregistrée pour l'instant
      </div>
    );
  }

  const last12 = hist.slice(-12);
  const recent = last12.slice().reverse().slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="thermo-hist-bars">
        {last12.map((h, i) => {
          const L = LEVEL_BY_N[h.level];
          const heightPct = (h.level / 5) * 100;
          return (
            <div key={`${h.t}-${i}`} className="thermo-hist-col">
              <div
                className="thermo-hist-bar"
                style={{
                  height: `${heightPct}%`,
                  background: L.color,
                }}
                title={`Niveau ${h.level}, ${L.label}`}
              />
            </div>
          );
        })}
      </div>
      <div className="thermo-hist-axis">
        <span>+ ancien</span>
        <span>plus récent →</span>
      </div>
      <div className="thermo-hist-recent">
        {recent.map((h, i) => {
          const L = LEVEL_BY_N[h.level];
          const d = new Date(h.t);
          return (
            <div key={`${h.t}-recent-${i}`} className="thermo-hist-row">
              <span className="thermo-hist-dot" style={{ background: L.color }} />
              <span className="thermo-hist-row-label">{L.label}</span>
              <span className="thermo-hist-row-meta">
                {d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                {" · "}
                {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
