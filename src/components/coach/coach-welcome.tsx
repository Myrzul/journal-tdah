"use client";

import { Umbrella } from "@/components/monsters";

type Props = {
  onPickQuick: () => void;
  onPickFull: () => void;
  onSkip: () => void;
};

export function CoachWelcome({ onPickQuick, onPickFull, onSkip }: Props) {
  return (
    <div className="coach-welcome">
      <div className="coach-welcome-umbrella">
        <Umbrella color="white" size={72} />
      </div>
      <div className="coach-welcome-eyebrow">Pratique d'introspection</div>
      <h1 className="coach-welcome-title">Bienvenue.</h1>
      <p className="coach-welcome-lead">
        On va construire ensemble un parcours <b>adapté à toi</b>. Le contenu
        du guide reste le même, mais l'<b>ordre</b> et les <b>priorités</b>{" "}
        seront calés sur ce qui pèse le plus dans ton quotidien aujourd'hui.
      </p>

      <div className="coach-welcome-choice">
        <button type="button" onClick={onPickQuick} className="coach-choice-card is-quick">
          <span className="coach-choice-eyebrow">5 minutes</span>
          <span className="coach-choice-title">Démarrage rapide</span>
          <span className="coach-choice-text">
            7 questions courtes, une par grand axe. Moins précis, mais on
            commence vite. Tu pourras toujours faire l'évaluation complète plus
            tard.
          </span>
          <span className="coach-choice-cta">→ Démarrer rapidement</span>
        </button>

        <button type="button" onClick={onPickFull} className="coach-choice-card is-full">
          <span className="coach-choice-eyebrow">15 à 20 minutes</span>
          <span className="coach-choice-title">Évaluation complète</span>
          <span className="coach-choice-text">
            68 questions issues d'outils cliniques (auto-évaluation TDAH).
            Plus précis, ton parcours sera plus finement calé. Tu peux faire
            une pause et reprendre.
          </span>
          <span className="coach-choice-cta">→ Évaluation complète</span>
        </button>
      </div>

      <button type="button" onClick={onSkip} className="coach-skip-btn">
        Plus tard — je veux juste explorer librement
      </button>
    </div>
  );
}
