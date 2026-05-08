"use client";

import { WORK_MAGENTA, type WorkPlan } from "@/lib/tools/work-data";

type Props = {
  plans: WorkPlan[];
  onCreate: () => void;
  onOpen: (id: string) => void;
};

export function WorkLibrary({ plans, onCreate, onOpen }: Props) {
  if (plans.length === 0) {
    return (
      <div className="work-empty">
        <div className="work-empty-eyebrow">Aucun plan créé</div>
        <div className="work-empty-title">
          La question centrale, en 1 phrase
        </div>
        <p
          style={{
            fontFamily: "var(--font-hand)",
            fontSize: 22,
            lineHeight: 1.3,
            color: "var(--ink)",
            margin: "8px 0 14px",
          }}
        >
          « Quel ajustement minimal me permettrait
          <br />
          un gain maximal d'efficacité et de bien-être ? »
        </p>
        <p className="work-empty-sub">
          Le but n'est pas de demander une longue liste — c'est d'identifier
          UN ou DEUX ajustements qui changeraient la donne. Le reste, on le
          mobilise par des stratégies internes.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="work-primary-btn"
          style={{ background: WORK_MAGENTA, flex: "0 1 auto" }}
        >
          Démarrer mon plan d'aménagement
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="work-grid">
        {plans.map((plan) => {
          const total =
            plan.difficulties.length +
            plan.strategies.length +
            plan.arrTemporal.length +
            plan.arrCognitive.length +
            plan.arrSpatial.length;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onOpen(plan.id)}
              className="work-card"
            >
              <span className="work-card-eyebrow">Plan</span>
              <span className="work-card-title">
                {plan.title || "Sans titre"}
              </span>
              <span className="work-card-meta">
                {total > 0
                  ? `${total} élément${total > 1 ? "s" : ""} cochés`
                  : "À compléter"}
              </span>
              <span className="work-card-arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </div>
      <div className="work-grid-add">
        <button type="button" onClick={onCreate} className="work-add-btn">
          + Nouveau plan
        </button>
      </div>
    </>
  );
}
