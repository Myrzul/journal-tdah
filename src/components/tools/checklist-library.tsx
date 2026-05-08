"use client";

import {
  type Checklist,
  CHECKLIST_GREEN,
  type ExecLog,
} from "@/lib/tools/checklist-data";
import { ChecklistRecent } from "./checklist-recent";

type Props = {
  checklists: Checklist[];
  logs: ExecLog[];
  onCreate: () => void;
  onCreateFromTemplate: () => void;
  onOpen: (id: string) => void;
  onRun: (id: string) => void;
};

export function ChecklistLibrary({
  checklists,
  logs,
  onCreate,
  onCreateFromTemplate,
  onOpen,
  onRun,
}: Props) {
  if (checklists.length === 0) {
    return (
      <div className="checklist-empty">
        <div className="checklist-empty-eyebrow">Aucune checklist</div>
        <div className="checklist-empty-title">
          Tu peux commencer par un modèle, ou créer la tienne.
        </div>
        <p className="checklist-empty-sub">
          Une bonne checklist : un titre clair, 5 à 10 étapes courtes, une récompense
          à la fin. Pas plus.
        </p>
        <div className="checklist-empty-actions">
          <button
            type="button"
            onClick={onCreateFromTemplate}
            className="checklist-primary-btn"
            style={{ background: CHECKLIST_GREEN }}
          >
            Démarrer avec « Routine du matin »
          </button>
          <button type="button" onClick={onCreate} className="checklist-nav-btn">
            Créer une checklist vierge
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="checklist-grid">
        {checklists.map((cl) => {
          const stepCount = cl.steps.filter((s) => s.label.trim()).length;
          return (
            <div key={cl.id} className="checklist-card">
              <div className="checklist-card-head">
                <button
                  type="button"
                  onClick={() => onOpen(cl.id)}
                  className="checklist-card-title-btn"
                  aria-label={`Modifier la checklist ${cl.title}`}
                >
                  <span className="checklist-card-title">
                    {cl.title || "Sans titre"}
                  </span>
                  <span className="checklist-card-edit">Modifier</span>
                </button>
              </div>
              <div className="checklist-card-meta">
                {cl.whenText && (
                  <span className="checklist-card-meta-line">
                    <b>Quand :</b> {cl.whenText}
                  </span>
                )}
                {cl.durationText && (
                  <span className="checklist-card-meta-line">
                    <b>Durée :</b> {cl.durationText}
                  </span>
                )}
                <span className="checklist-card-meta-line">
                  <b>Étapes :</b> {stepCount}
                </span>
              </div>
              <div className="checklist-card-recent-wrap">
                <span className="checklist-card-recent-label">7 derniers jours</span>
                <ChecklistRecent logs={logs} checklistId={cl.id} />
              </div>
              <button
                type="button"
                onClick={() => onRun(cl.id)}
                className="checklist-card-run"
                style={{ background: CHECKLIST_GREEN }}
                disabled={stepCount === 0}
              >
                Lancer →
              </button>
            </div>
          );
        })}
      </div>
      <div className="checklist-grid-add">
        <button type="button" onClick={onCreate} className="checklist-add-btn">
          + Nouvelle checklist
        </button>
      </div>
    </>
  );
}
