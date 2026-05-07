"use client";

import { useEffect, useState } from "react";

type Phase = "in" | "out";

type Props = {
  onClose: () => void;
};

/** Cohérence cardiaque guidée 5s in / 5s out, jusqu'à fermeture. */
export function CoherenceModal({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("in");
  const [count, setCount] = useState(5);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => {
            const next: Phase = p === "in" ? "out" : "in";
            if (next === "in") setCycle((x) => x + 1);
            return next;
          });
          return 5;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const scale = phase === "in" ? 1 : 0.5;

  return (
    <div className="coherence-modal" role="dialog" aria-label="Cohérence cardiaque">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la respiration guidée"
        className="coherence-close"
      >
        ✕
      </button>
      <div className="coherence-eyebrow">Cohérence cardiaque · 5s/5s</div>
      <div className="coherence-orb-wrap">
        <div className="coherence-orb" style={{ transform: `scale(${scale})` }}>
          <div className="coherence-phase">{phase === "in" ? "INSPIRE" : "EXPIRE"}</div>
          <div className="coherence-count">{count}</div>
        </div>
      </div>
      <div className="coherence-cycle">
        Cycle {cycle + 1}, laisse-toi porter par le rythme.
      </div>
    </div>
  );
}
