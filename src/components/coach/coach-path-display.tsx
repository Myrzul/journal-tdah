"use client";

import Link from "next/link";
import {
  AXIS_HOOKS,
  AXIS_LABELS,
  AXIS_TO_RUBRIQUE,
  type CoachProfile,
} from "@/lib/coach/coach-types";
import { RUBRIQUE_BY_ID } from "@/lib/guide/rubriques-meta";

type Props = {
  profile: CoachProfile;
  onContinue: () => void;
  onAdjust: () => void;
};

export function CoachPathDisplay({ profile, onContinue, onAdjust }: Props) {
  const top3 = profile.adaptivePath
    .slice(0, 3)
    .map((a) => AXIS_LABELS[a]);

  return (
    <div className="coach-path">
      <div className="coach-path-eyebrow">Ton parcours personnalisé</div>
      <h2 className="coach-path-title">Voici ce que je te propose</h2>

      <p className="coach-path-lead">
        D'après ce que tu m'as dit, on va se concentrer surtout sur :
      </p>

      <div className="coach-path-top3">
        {top3.map((label, i) => (
          <div key={label} className="coach-path-top3-item">
            <span className="coach-path-top3-num">{i + 1}</span>
            <span className="coach-path-top3-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="coach-path-list">
        <div className="coach-path-step is-fixed">
          <div className="coach-path-step-num">01</div>
          <div className="coach-path-step-body">
            <div className="coach-path-step-title">{RUBRIQUE_BY_ID["01"].title}</div>
            <div className="coach-path-step-hook">
              On commence toujours par s'observer.
            </div>
          </div>
          <div className="coach-path-step-tag">Tronc commun</div>
        </div>

        {profile.adaptivePath.map((axis, i) => {
          const rubId = AXIS_TO_RUBRIQUE[axis];
          const rub = RUBRIQUE_BY_ID[rubId];
          return (
            <div key={axis} className="coach-path-step is-adaptive">
              <div className="coach-path-step-num" style={{ background: rub.cssColor, color: "white" }}>
                {rub.id}
              </div>
              <div className="coach-path-step-body">
                <div className="coach-path-step-title">{rub.title}</div>
                <div className="coach-path-step-hook">{AXIS_HOOKS[axis]}</div>
              </div>
              <div className="coach-path-step-tag">Position {i + 1}</div>
            </div>
          );
        })}

        <div className="coach-path-step is-fixed">
          <div className="coach-path-step-num">09</div>
          <div className="coach-path-step-body">
            <div className="coach-path-step-title">{RUBRIQUE_BY_ID["09"].title}</div>
            <div className="coach-path-step-hook">Mesurer le chemin parcouru.</div>
          </div>
          <div className="coach-path-step-tag">Tronc commun</div>
        </div>

        <div className="coach-path-step is-fixed">
          <div className="coach-path-step-num">10</div>
          <div className="coach-path-step-body">
            <div className="coach-path-step-title">{RUBRIQUE_BY_ID["10"].title}</div>
            <div className="coach-path-step-hook">Composer avec son fonctionnement, pas contre lui.</div>
          </div>
          <div className="coach-path-step-tag">Tronc commun</div>
        </div>
      </div>

      <div className="coach-path-actions">
        <button type="button" onClick={onAdjust} className="coach-path-btn-adjust">
          Ajuster l'ordre
        </button>
        <button type="button" onClick={onContinue} className="coach-path-btn-continue">
          C'est parti — rubrique 01 →
        </button>
      </div>

      <p className="coach-path-foot">
        Tu pourras à tout moment <Link href="/guide">explorer le guide en libre</Link>{" "}
        ou refaire ton évaluation pour ajuster ton parcours.
      </p>
    </div>
  );
}
