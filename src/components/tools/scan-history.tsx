"use client";

import type { ScanHistoryEntry } from "@/lib/tools/scan-data";

type Props = {
  hist: ScanHistoryEntry[];
  onClear: () => void;
};

export function ScanHistory({ hist, onClear }: Props) {
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
        Pas encore de scan enregistré
      </div>
    );
  }
  const last = hist.slice().reverse().slice(0, 12);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {last.map((h) => {
        const d = new Date(h.t);
        return (
          <div
            key={h.t}
            style={{
              padding: "14px 16px",
              border: "1.5px solid #E6E5E1",
              borderRadius: 18,
              background: "white",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#7C8A99",
                minWidth: 64,
              }}
            >
              {d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
              <br />
              {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div style={{ flex: 1 }}>
              {h.word ? (
                <div
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 22,
                    color: "#0E0E10",
                    lineHeight: 1.2,
                  }}
                >
                  « {h.word} »
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: "var(--font-cond)",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#7C8A99",
                    fontStyle: "italic",
                  }}
                >
                  (sans mot — c'est valide)
                </div>
              )}
              {h.cycles > 0 && (
                <div
                  style={{
                    fontFamily: "var(--font-cond)",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#7C8A99",
                    marginTop: 4,
                  }}
                >
                  {h.cycles} resp. ·{" "}
                  {h.duration ? `${Math.round(h.duration / 60)} min` : "—"}
                </div>
              )}
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
