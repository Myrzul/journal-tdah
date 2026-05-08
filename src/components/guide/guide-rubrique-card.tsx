"use client";

import Link from "next/link";
import type { RubriqueMeta } from "@/lib/guide/guide-types";
import { progressPercent, type RubriqueProgress } from "@/lib/guide/guide-types";

type Props = {
  rubrique: RubriqueMeta;
  progress?: RubriqueProgress;
};

export function GuideRubriqueCard({ rubrique, progress }: Props) {
  const pct = progressPercent(progress);
  const objectivesCount = progress?.smartObjectives.length ?? 0;
  const inner = (
    <>
      <span className="guide-card-eyebrow">{rubrique.eyebrow}</span>
      <span className="guide-card-title">{rubrique.title}</span>
      <span className="guide-card-hook">{rubrique.hook}</span>
      <div className="guide-card-progress">
        <div className="guide-card-progress-track">
          <div
            className="guide-card-progress-fill"
            style={{ width: `${pct}%`, background: rubrique.cssColor }}
          />
        </div>
        <span className="guide-card-progress-label">
          {!rubrique.available
            ? "Bientôt disponible"
            : pct === 0
              ? "Pas encore commencée"
              : pct === 100
                ? `Terminée${objectivesCount > 0 ? ` · ${objectivesCount} objectif${objectivesCount > 1 ? "s" : ""}` : ""}`
                : `${pct}% lu${objectivesCount > 0 ? ` · ${objectivesCount} objectif${objectivesCount > 1 ? "s" : ""}` : ""}`}
        </span>
      </div>
      {rubrique.available && (
        <span className="guide-card-arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  const style = {
    ["--rub-color" as string]: rubrique.cssColor,
  };

  if (!rubrique.available) {
    return (
      <div className="guide-card is-coming" style={style}>
        {inner}
      </div>
    );
  }
  return (
    <Link href={`/guide/${rubrique.slug}`} className="guide-card" style={style}>
      {inner}
    </Link>
  );
}
