"use client";

import { useEffect, useMemo, useState } from "react";
import { Headline, HLQuote, IntroHand, Retain, SectionLabel } from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";
import {
  EMPTY_WORK_STORE,
  newEmptyWorkPlan,
  WORK_MAGENTA,
  WORK_STORAGE,
  type WorkPlan,
  type WorkStore,
} from "@/lib/tools/work-data";
import { WorkEditor } from "./work-editor";
import { WorkLibrary } from "./work-library";
import { WorkSummary } from "./work-summary";

type View =
  | { kind: "library" }
  | { kind: "edit"; id: string; isNew: boolean }
  | { kind: "summary"; id: string };

export function WorkTool() {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<WorkStore>(EMPTY_WORK_STORE);
  const [view, setView] = useState<View>({ kind: "library" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WORK_STORAGE.data);
      if (raw) {
        const parsed = JSON.parse(raw) as WorkStore;
        setStore({ plans: parsed.plans ?? [] });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(WORK_STORAGE.data, JSON.stringify(store));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(id);
  }, [store, hydrated]);

  const planById = useMemo(() => {
    const map = new Map<string, WorkPlan>();
    for (const p of store.plans) map.set(p.id, p);
    return map;
  }, [store.plans]);

  const upsert = (plan: WorkPlan) => {
    setStore((s) => {
      const idx = s.plans.findIndex((p) => p.id === plan.id);
      const next = [...s.plans];
      if (idx >= 0) next[idx] = plan;
      else next.unshift(plan);
      return { plans: next };
    });
  };

  const removePlan = (id: string) => {
    setStore((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
    setView({ kind: "library" });
  };

  // ============== VIEW: SUMMARY ==============
  if (view.kind === "summary") {
    const plan = planById.get(view.id);
    if (!plan) {
      setView({ kind: "library" });
      return null;
    }
    return (
      <>
        <IntroHand>
          {plan.title || "Mon plan"}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            La synthèse, prête à copier ou à garder pour toi.
          </span>
        </IntroHand>
        <WorkSummary
          plan={plan}
          onBack={() => setView({ kind: "edit", id: plan.id, isNew: false })}
        />
      </>
    );
  }

  // ============== VIEW: EDIT ==============
  if (view.kind === "edit") {
    const plan = planById.get(view.id);
    if (!plan) {
      setView({ kind: "library" });
      return null;
    }
    return (
      <>
        <IntroHand>
          {view.isNew ? "Un nouveau plan." : plan.title || "Mon plan"}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Tu n'es pas obligé·e de tout cocher — l'idée c'est d'identifier le
            minimum utile.
          </span>
        </IntroHand>
        <WorkEditor
          initial={plan}
          isNew={view.isNew}
          onSave={(updated) => {
            upsert(updated);
            setView({ kind: "library" });
          }}
          onCancel={() => {
            const empty =
              !plan.title.trim() &&
              plan.difficulties.length === 0 &&
              plan.strategies.length === 0;
            if (view.isNew && empty) {
              setStore((s) => ({
                plans: s.plans.filter((p) => p.id !== plan.id),
              }));
            }
            setView({ kind: "library" });
          }}
          onDelete={view.isNew ? undefined : () => removePlan(plan.id)}
          onSummary={(updated) => {
            upsert(updated);
            setView({ kind: "summary", id: updated.id });
          }}
        />
      </>
    );
  }

  // ============== VIEW: LIBRARY ==============
  return (
    <>
      <IntroHand>
        Adapter ton environnement,
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          pour libérer ton attention au lieu de la dépenser.
        </span>
      </IntroHand>

      <SectionLabel num="04">Outil de la rubrique</SectionLabel>
      <Headline accent="& travail">Attention</Headline>

      <WorkLibrary
        plans={store.plans}
        onCreate={() => {
          const empty = newEmptyWorkPlan();
          upsert(empty);
          setView({ kind: "edit", id: empty.id, isNew: true });
        }}
        onOpen={(id) => setView({ kind: "edit", id, isNew: false })}
      />

      <HLQuote>
        Pas une longue liste —
        <br />
        un <span style={{ color: WORK_MAGENTA }}>ajustement minimal</span> bien
        ciblé.
      </HLQuote>

      <Retain
        title="VALORISER LES FORCES, PAS SEULEMENT COMPENSER LES FRAGILITÉS."
        monster={MonsterReflexif}
      >
        Le TDAH au travail apporte aussi des atouts : créativité, hyperfocus,
        adaptabilité, énergie. Demander un aménagement n'est pas demander une
        faveur — c'est libérer ces forces. Tu peux formuler en neutre, sans
        mentionner le TDAH, si la situation l'impose.
      </Retain>
    </>
  );
}
