"use client";

import { LEVELS, type LevelN } from "@/lib/tools/thermo-data";
import { cn } from "@/lib/utils/cn";

type Props = {
  level: LevelN | null;
  onPick: (n: LevelN) => void;
};

/**
 * Variant tactile : 5 cartes empilées, du calme au stop.
 * Alternative au ThermoVisual quand on veut un tap rapide
 * sans drag (ou pour utilisateurs préférant une liste).
 */
export function ThermoSteps({ level, onPick }: Props) {
  return (
    <div className="thermo-steps">
      {LEVELS.slice()
        .reverse()
        .map((L) => {
          const on = level === L.n;
          return (
            <button
              key={L.n}
              type="button"
              onClick={() => onPick(L.n)}
              className={cn("thermo-step", on && "on")}
              style={{
                ["--step-color" as string]: L.color,
              }}
            >
              <span className="thermo-step-num">{L.n}</span>
              <span className="thermo-step-text">
                <span className="thermo-step-label">{L.label}</span>
                <span className="thermo-step-sub">{L.sublabel}</span>
              </span>
            </button>
          );
        })}
    </div>
  );
}
