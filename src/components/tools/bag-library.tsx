"use client";

import {
  type Bag,
  BAG_YELLOW,
  type BagPrepLog,
  lastPrep,
  totalItems,
} from "@/lib/tools/bag-data";

type Props = {
  bags: Bag[];
  logs: BagPrepLog[];
  onCreateEmpty: () => void;
  onCreateSport: () => void;
  onCreateWeekend: () => void;
  onOpen: (id: string) => void;
  onPrep: (id: string) => void;
};

export function BagLibrary({
  bags,
  logs,
  onCreateEmpty,
  onCreateSport,
  onCreateWeekend,
  onOpen,
  onPrep,
}: Props) {
  if (bags.length === 0) {
    return (
      <div className="bag-empty">
        <div className="bag-empty-eyebrow">Aucun sac créé</div>
        <div className="bag-empty-title">
          Commence avec un modèle, ou crée le tien.
        </div>
        <p className="bag-empty-sub">
          Les modèles sont déjà remplis avec les essentiels — tu pourras tout
          modifier ensuite.
        </p>
        <div className="bag-empty-actions">
          <button
            type="button"
            onClick={onCreateSport}
            className="bag-primary-btn"
            style={{ background: BAG_YELLOW }}
          >
            Sac de sport
          </button>
          <button
            type="button"
            onClick={onCreateWeekend}
            className="bag-primary-btn"
            style={{ background: BAG_YELLOW }}
          >
            Sac week-end
          </button>
          <button type="button" onClick={onCreateEmpty} className="bag-nav-btn">
            Sac vierge
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bag-grid">
        {bags.map((bag) => {
          const total = totalItems(bag);
          const last = lastPrep(logs, bag.id);
          const lastLabel = last
            ? new Date(last.t).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })
            : null;
          return (
            <div key={bag.id} className="bag-card">
              <button
                type="button"
                onClick={() => onOpen(bag.id)}
                className="bag-card-title-btn"
                aria-label={`Modifier le sac ${bag.title}`}
              >
                <span className="bag-card-title">
                  {bag.title || "Sans titre"}
                </span>
                <span className="bag-card-edit">Modifier</span>
              </button>
              {bag.description && (
                <div className="bag-card-desc">{bag.description}</div>
              )}
              <div className="bag-card-meta">
                <span className="bag-card-meta-line">
                  <b>Items :</b> {total}
                </span>
                <span className="bag-card-meta-line">
                  <b>Catégories :</b> {bag.categories.length}
                </span>
                {lastLabel && (
                  <span className="bag-card-meta-line">
                    <b>Dernière prépa :</b> {lastLabel}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onPrep(bag.id)}
                className="bag-card-prep"
                style={{ background: BAG_YELLOW }}
                disabled={total === 0}
              >
                Préparer →
              </button>
            </div>
          );
        })}
      </div>
      <div className="bag-grid-add">
        <button type="button" onClick={onCreateEmpty} className="bag-add-btn">
          + Nouveau sac vierge
        </button>
        <button type="button" onClick={onCreateSport} className="bag-add-btn">
          + À partir du modèle Sport
        </button>
        <button type="button" onClick={onCreateWeekend} className="bag-add-btn">
          + À partir du modèle Week-end
        </button>
      </div>
    </>
  );
}
