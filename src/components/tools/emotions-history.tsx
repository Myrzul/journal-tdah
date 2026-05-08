"use client";

import { type EmotionHistoryEntry, FAMILIES } from "@/lib/tools/emotions-data";

type Props = {
  hist: EmotionHistoryEntry[];
  onClear: () => void;
};

export function EmotionsHistory({ hist, onClear }: Props) {
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
        Pas encore d'émotion nommée
      </div>
    );
  }

  const last = hist.slice().reverse().slice(0, 12);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {last.map((h) => {
        const d = new Date(h.t);
        const fam = FAMILIES[h.family];
        const word =
          h.customWord || h.nuance || (h.emotion ? fam.emotions[h.emotion]?.label : null) ||
          fam.label;
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: fam.color,
                    border: "1.6px solid #0E0E10",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#0E0E10",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {fam.sym}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cond)",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#7C8A99",
                  }}
                >
                  {fam.label}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 22,
                  color: "#0E0E10",
                  lineHeight: 1.2,
                }}
              >
                « {word} »
              </div>
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
                {h.intens != null ? `Intensité ${h.intens}/10` : "Sans intensité"}
                {h.hasDeepened ? " · examiné" : ""}
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
