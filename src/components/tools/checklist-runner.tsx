"use client";

import { MonsterFier } from "@/components/monsters";
import {
  type Checklist,
  CHECKLIST_GREEN,
  type RunDraft,
} from "@/lib/tools/checklist-data";

type Props = {
  checklist: Checklist;
  runDraft: RunDraft;
  onToggleStep: (stepId: string) => void;
  onComplete: () => void;
  onQuit: () => void;
  onCancel: () => void;
};

export function ChecklistRunner({
  checklist,
  runDraft,
  onToggleStep,
  onComplete,
  onQuit,
  onCancel,
}: Props) {
  const totalSteps = checklist.steps.length;
  const doneCount = runDraft.completedSteps.length;
  const allDone = doneCount === totalSteps && totalSteps > 0;
  const progress = totalSteps === 0 ? 0 : (doneCount / totalSteps) * 100;

  if (allDone) {
    return (
      <div className="checklist-runner-done">
        <div className="checklist-runner-done-mascot">
          <MonsterFier color="var(--paper)" />
        </div>
        <div className="checklist-runner-done-eyebrow">Routine terminée</div>
        <h3 className="checklist-runner-done-title">{checklist.title}</h3>
        <p className="checklist-runner-done-text">
          Tu as fait toutes les étapes. C'est exactement ce que célèbrer veut dire :
          remarquer le pas, sans y mettre une note.
        </p>
        {checklist.reward && (
          <div className="checklist-runner-reward">
            <div className="checklist-runner-reward-label">Ta récompense</div>
            <p className="checklist-runner-reward-text">{checklist.reward}</p>
          </div>
        )}
        <div className="checklist-nav-row">
          <button type="button" onClick={onCancel} className="checklist-nav-btn">
            Retour à la bibliothèque
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="checklist-primary-btn"
            style={{ background: CHECKLIST_GREEN }}
          >
            ✓ Marquer comme faite
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="checklist-runner-head" style={{ background: CHECKLIST_GREEN }}>
        <div className="checklist-runner-eyebrow">Routine en cours</div>
        <h3 className="checklist-runner-title">{checklist.title}</h3>
        {checklist.durationText && (
          <div className="checklist-runner-meta">
            Durée estimée : {checklist.durationText}
          </div>
        )}
        {checklist.reward && (
          <div className="checklist-runner-reward-pill">
            <span className="checklist-runner-reward-pill-label">À la fin :</span>{" "}
            {checklist.reward}
          </div>
        )}
        <div className="checklist-runner-progress-track">
          <div
            className="checklist-runner-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="checklist-runner-progress-label">
          {doneCount} / {totalSteps} étapes
        </div>
      </div>

      <ol className="checklist-runner-steps">
        {checklist.steps.map((step, idx) => {
          const checked = runDraft.completedSteps.includes(step.id);
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onToggleStep(step.id)}
                className={`checklist-runner-step ${checked ? "is-done" : ""}`}
              >
                <span
                  className="checklist-runner-step-box"
                  aria-hidden="true"
                  style={
                    checked
                      ? { background: CHECKLIST_GREEN, borderColor: "#0E0E10" }
                      : undefined
                  }
                >
                  {checked ? "✓" : ""}
                </span>
                <span className="checklist-runner-step-num">{idx + 1}.</span>
                <span className="checklist-runner-step-label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {checklist.attention && (
        <div className="checklist-runner-attention">
          <div className="checklist-runner-attention-label">
            Points d'attention
          </div>
          <pre className="checklist-runner-attention-text">{checklist.attention}</pre>
        </div>
      )}

      <div className="checklist-nav-row">
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                "Annuler cette session ? Les cases cochées seront perdues, mais la checklist reste dans la bibliothèque.",
              )
            ) {
              onCancel();
            }
          }}
          className="checklist-nav-btn"
        >
          Annuler
        </button>
        <button type="button" onClick={onQuit} className="checklist-quit-btn">
          Pause — reprendre plus tard
        </button>
      </div>
    </>
  );
}
