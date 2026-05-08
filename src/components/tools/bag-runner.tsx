"use client";

import {
  type Bag,
  BAG_YELLOW,
  type BagPrepDraft,
  totalItems,
} from "@/lib/tools/bag-data";

type Props = {
  bag: Bag;
  prep: BagPrepDraft;
  onToggleItem: (itemId: string) => void;
  onToggleFinal: (checkId: string) => void;
  onComplete: () => void;
  onQuit: () => void;
  onCancel: () => void;
};

export function BagRunner({
  bag,
  prep,
  onToggleItem,
  onToggleFinal,
  onComplete,
  onQuit,
  onCancel,
}: Props) {
  const total = totalItems(bag);
  const doneItems = prep.checkedItems.length;
  const allItemsDone = doneItems === total && total > 0;
  const itemProgress = total === 0 ? 0 : (doneItems / total) * 100;

  const totalFinal = bag.finalChecks.length;
  const doneFinal = prep.finalChecks.length;
  const allFinalDone = doneFinal === totalFinal && totalFinal > 0;

  const ready = allItemsDone && (totalFinal === 0 || allFinalDone);

  return (
    <>
      <div className="bag-runner-head" style={{ background: BAG_YELLOW }}>
        <div className="bag-runner-eyebrow">Préparation en cours</div>
        <h3 className="bag-runner-title">{bag.title}</h3>
        {bag.description && (
          <div className="bag-runner-desc">{bag.description}</div>
        )}
        <div className="bag-runner-progress-track">
          <div
            className="bag-runner-progress-fill"
            style={{ width: `${itemProgress}%` }}
          />
        </div>
        <div className="bag-runner-progress-label">
          {doneItems} / {total} items
        </div>
      </div>

      {bag.categories.map((cat) => {
        const catDoneCount = cat.items.filter((it) =>
          prep.checkedItems.includes(it.id),
        ).length;
        const catComplete = catDoneCount === cat.items.length && cat.items.length > 0;
        return (
          <div
            key={cat.id}
            className={`bag-runner-cat ${catComplete ? "is-complete" : ""}`}
          >
            <div className="bag-runner-cat-head">
              <span className="bag-runner-cat-label">{cat.label}</span>
              <span className="bag-runner-cat-count">
                {catDoneCount} / {cat.items.length}
              </span>
            </div>
            <ul className="bag-runner-items">
              {cat.items.map((it) => {
                const checked = prep.checkedItems.includes(it.id);
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => onToggleItem(it.id)}
                      className={`bag-runner-item ${checked ? "is-done" : ""}`}
                    >
                      <span
                        className="bag-runner-item-box"
                        aria-hidden="true"
                        style={
                          checked
                            ? { background: BAG_YELLOW, borderColor: "#0E0E10" }
                            : undefined
                        }
                      >
                        {checked ? "✓" : ""}
                      </span>
                      <span className="bag-runner-item-label">{it.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {bag.finalChecks.length > 0 && (
        <div className={`bag-runner-final ${allItemsDone ? "is-active" : "is-pending"}`}>
          <div className="bag-runner-final-eyebrow">Vérification finale</div>
          <div className="bag-runner-final-title">
            {allItemsDone
              ? "Le second tour, avant de fermer le sac"
              : "Coche d'abord tous les items"}
          </div>
          <ul className="bag-runner-items">
            {bag.finalChecks.map((fc) => {
              const checked = prep.finalChecks.includes(fc.id);
              return (
                <li key={fc.id}>
                  <button
                    type="button"
                    onClick={() => allItemsDone && onToggleFinal(fc.id)}
                    disabled={!allItemsDone}
                    className={`bag-runner-item ${checked ? "is-done" : ""}`}
                  >
                    <span
                      className="bag-runner-item-box"
                      aria-hidden="true"
                      style={
                        checked
                          ? { background: "var(--ink)", borderColor: "#0E0E10" }
                          : undefined
                      }
                    >
                      <span style={{ color: checked ? "white" : "var(--ink)" }}>
                        {checked ? "✓" : ""}
                      </span>
                    </span>
                    <span className="bag-runner-item-label">{fc.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {bag.tips && (
        <div className="bag-runner-tips">
          <div className="bag-runner-tips-label">Astuces</div>
          <pre className="bag-runner-tips-text">{bag.tips}</pre>
        </div>
      )}

      <div className="bag-nav-row">
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                "Annuler cette préparation ? Les items cochés seront perdus, mais le sac reste dans la bibliothèque.",
              )
            ) {
              onCancel();
            }
          }}
          className="bag-nav-btn"
        >
          Annuler
        </button>
        <button type="button" onClick={onQuit} className="bag-quit-btn">
          Pause — reprendre plus tard
        </button>
      </div>

      <button
        type="button"
        onClick={onComplete}
        disabled={!ready}
        className={`bag-runner-done-btn ${ready ? "" : "is-disabled"}`}
        style={ready ? { background: BAG_YELLOW } : undefined}
      >
        {ready ? "✓ Mon sac est prêt" : "Coche tout pour valider"}
      </button>
    </>
  );
}
