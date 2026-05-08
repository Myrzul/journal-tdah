"use client";

import { useEffect, useMemo, useState } from "react";
import { Headline, HLQuote, IntroHand, Retain, SectionLabel } from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";
import {
  type Checklist,
  CHECKLIST_GREEN,
  CHECKLIST_STORAGE,
  type ChecklistStore,
  EMPTY_STORE,
  type ExecLog,
  morningTemplate,
  newEmptyChecklist,
  type RunDraft,
} from "@/lib/tools/checklist-data";
import { ChecklistEditor } from "./checklist-editor";
import { ChecklistLibrary } from "./checklist-library";
import { ChecklistRunner } from "./checklist-runner";

type View =
  | { kind: "library" }
  | { kind: "edit"; id: string; isNew: boolean }
  | { kind: "run"; id: string };

export function ChecklistTool() {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<ChecklistStore>(EMPTY_STORE);
  const [view, setView] = useState<View>({ kind: "library" });

  // Hydratation
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_STORAGE.data);
      if (raw) {
        const parsed = JSON.parse(raw) as ChecklistStore;
        setStore({
          checklists: parsed.checklists ?? [],
          logs: parsed.logs ?? [],
          runDraft: parsed.runDraft ?? null,
        });
        if (parsed.runDraft) {
          setView({ kind: "run", id: parsed.runDraft.checklistId });
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persistance debounce 500ms
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(CHECKLIST_STORAGE.data, JSON.stringify(store));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(id);
  }, [store, hydrated]);

  const checklistById = useMemo(() => {
    const map = new Map<string, Checklist>();
    for (const c of store.checklists) map.set(c.id, c);
    return map;
  }, [store.checklists]);

  const upsertChecklist = (cl: Checklist) => {
    setStore((s) => {
      const existing = s.checklists.findIndex((c) => c.id === cl.id);
      const next = [...s.checklists];
      if (existing >= 0) {
        next[existing] = cl;
      } else {
        next.unshift(cl);
      }
      return { ...s, checklists: next };
    });
  };

  const deleteChecklist = (id: string) => {
    setStore((s) => ({
      ...s,
      checklists: s.checklists.filter((c) => c.id !== id),
      logs: s.logs.filter((l) => l.checklistId !== id),
      runDraft: s.runDraft?.checklistId === id ? null : s.runDraft,
    }));
    setView({ kind: "library" });
  };

  const startRun = (cl: Checklist) => {
    upsertChecklist(cl);
    const draft: RunDraft = {
      checklistId: cl.id,
      startedAt: Date.now(),
      completedSteps: [],
    };
    setStore((s) => ({ ...s, runDraft: draft }));
    setView({ kind: "run", id: cl.id });
  };

  const startRunFromLibrary = (id: string) => {
    const cl = checklistById.get(id);
    if (!cl) return;
    const draft: RunDraft = {
      checklistId: id,
      startedAt: Date.now(),
      completedSteps: [],
    };
    setStore((s) => ({ ...s, runDraft: draft }));
    setView({ kind: "run", id });
  };

  const toggleStep = (stepId: string) => {
    setStore((s) => {
      if (!s.runDraft) return s;
      const cur = s.runDraft.completedSteps;
      const next = cur.includes(stepId)
        ? cur.filter((x) => x !== stepId)
        : [...cur, stepId];
      return { ...s, runDraft: { ...s.runDraft, completedSteps: next } };
    });
  };

  const completeRun = () => {
    setStore((s) => {
      if (!s.runDraft) return s;
      const cl = s.checklists.find((c) => c.id === s.runDraft?.checklistId);
      if (!cl) return s;
      const log: ExecLog = {
        t: Date.now(),
        checklistId: s.runDraft.checklistId,
        completedSteps: s.runDraft.completedSteps,
        totalSteps: cl.steps.length,
      };
      return {
        ...s,
        logs: [...s.logs, log].slice(-200),
        runDraft: null,
      };
    });
    setView({ kind: "library" });
  };

  const cancelRun = () => {
    setStore((s) => ({ ...s, runDraft: null }));
    setView({ kind: "library" });
  };

  const quitRunKeepDraft = () => {
    setView({ kind: "library" });
  };

  // ============== VIEW: RUN ==============
  if (view.kind === "run") {
    const cl = checklistById.get(view.id);
    const runDraft = store.runDraft;
    if (!cl || !runDraft || runDraft.checklistId !== cl.id) {
      // Cohérence cassée → retour bibliothèque
      return (
        <>
          <IntroHand>Tes routines, à portée.</IntroHand>
          <SectionLabel>Bibliothèque</SectionLabel>
          <Headline accent="à toi de jouer">Mes checklists</Headline>
          <ChecklistLibrary
            checklists={store.checklists}
            logs={store.logs}
            onCreate={() => {
              const empty = newEmptyChecklist();
              upsertChecklist(empty);
              setView({ kind: "edit", id: empty.id, isNew: true });
            }}
            onCreateFromTemplate={() => {
              const tpl = morningTemplate();
              upsertChecklist(tpl);
              setView({ kind: "edit", id: tpl.id, isNew: true });
            }}
            onOpen={(id) => setView({ kind: "edit", id, isNew: false })}
            onRun={startRunFromLibrary}
          />
        </>
      );
    }
    return (
      <>
        <IntroHand>
          {cl.title}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Une étape à la fois — tu peux quitter et reprendre quand tu veux.
          </span>
        </IntroHand>
        <ChecklistRunner
          checklist={cl}
          runDraft={runDraft}
          onToggleStep={toggleStep}
          onComplete={completeRun}
          onQuit={quitRunKeepDraft}
          onCancel={cancelRun}
        />
      </>
    );
  }

  // ============== VIEW: EDIT ==============
  if (view.kind === "edit") {
    const cl = checklistById.get(view.id);
    if (!cl) {
      setView({ kind: "library" });
      return null;
    }
    return (
      <>
        <IntroHand>
          {view.isNew ? "Une nouvelle checklist." : "Modifier la checklist."}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Découpe en étapes courtes — pas plus de 10 si possible.
          </span>
        </IntroHand>
        <ChecklistEditor
          initial={cl}
          isNew={view.isNew}
          onSave={(updated) => {
            upsertChecklist(updated);
            setView({ kind: "library" });
          }}
          onCancel={() => {
            // Si c'était un nouveau jamais rempli, on le retire
            if (view.isNew && !cl.title.trim() && cl.steps.every((s) => !s.label.trim())) {
              setStore((s) => ({
                ...s,
                checklists: s.checklists.filter((c) => c.id !== cl.id),
              }));
            }
            setView({ kind: "library" });
          }}
          onDelete={view.isNew ? undefined : () => deleteChecklist(cl.id)}
          onRun={(updated) => {
            startRun(updated);
          }}
        />
      </>
    );
  }

  // ============== VIEW: LIBRARY ==============
  return (
    <>
      <IntroHand>
        Tes routines, à portée.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Pas pour t'enfermer — pour décharger ton cerveau de la mémoire de l'ordre.
        </span>
      </IntroHand>

      <SectionLabel num="10">Outil de la rubrique</SectionLabel>
      <Headline accent="& exécution">Contrôle</Headline>

      <ChecklistLibrary
        checklists={store.checklists}
        logs={store.logs}
        onCreate={() => {
          const empty = newEmptyChecklist();
          upsertChecklist(empty);
          setView({ kind: "edit", id: empty.id, isNew: true });
        }}
        onCreateFromTemplate={() => {
          const tpl = morningTemplate();
          upsertChecklist(tpl);
          setView({ kind: "edit", id: tpl.id, isNew: true });
        }}
        onOpen={(id) => setView({ kind: "edit", id, isNew: false })}
        onRun={startRunFromLibrary}
      />

      <HLQuote>
        Une routine n'est pas un piège.
        <br />
        C'est un <span style={{ color: CHECKLIST_GREEN }}>soutien</span>.
      </HLQuote>

      <Retain title="LA CHARGE MENTALE EST DEHORS, PAS DANS TA TÊTE." monster={MonsterReflexif}>
        Une bonne checklist, c'est de la mémoire externalisée. Tu n'as plus à
        retenir l'ordre, à te demander si tu n'as rien oublié. Tu fais. Tu coches.
        Et la dopamine de la case cochée nourrit l'envie de continuer.
      </Retain>
    </>
  );
}
