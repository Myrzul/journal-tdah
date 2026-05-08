"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { daysSinceLastEvaluation } from "@/lib/tools/eval-storage";

const NUDGE_THRESHOLD_DAYS = 90;

/**
 * Carte de rappel sur le hub : si l'utilisateur n'a jamais fait l'évaluation
 * ou si sa dernière évaluation date de plus de 90 jours, on propose de la
 * faire. Sinon, ne rend rien.
 *
 * Pas un rappel insistant : juste une carte parmi d'autres, pas de notification.
 */
export function EvalHubSuggestion() {
  const [days, setDays] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    setDays(daysSinceLastEvaluation());
  }, []);

  // Pendant l'hydration : ne rend rien (évite le flicker)
  if (days === undefined) return null;

  // L'utilisateur a fait une éval il y a moins de 90 jours : ne rien afficher
  if (days !== null && days < NUDGE_THRESHOLD_DAYS) return null;

  const isFirstTime = days === null;

  return (
    <Link
      href={isFirstTime ? "/outils/evaluation" : "/outils/evaluation"}
      className="eval-hub-nudge"
    >
      <span className="eval-hub-nudge-eyebrow">
        {isFirstTime ? "Pour commencer" : "Pour suivre ton évolution"}
      </span>
      <span className="eval-hub-nudge-title">
        {isFirstTime
          ? "Comment vont tes symptômes en ce moment ?"
          : `Refaire l'évaluation ?`}
      </span>
      <span className="eval-hub-nudge-sub">
        {isFirstTime
          ? "L'auto-évaluation TDAH te donne un point de départ. 8 à 12 minutes."
          : `Ta dernière évaluation date de ${days} jours. Repasser le test te permet de voir ce qui bouge.`}
      </span>
      <span className="eval-hub-nudge-cta">
        {isFirstTime ? "Faire l'évaluation" : "Refaire l'évaluation"} →
      </span>
    </Link>
  );
}
