"use client";

import { useEffect, useMemo, useState } from "react";
import { Headline, HLQuote, IntroHand, Retain, SectionLabel } from "@/components/journal/typography";
import { MonsterCurieux } from "@/components/monsters";
import {
  type DayJournal,
  EMPTY_JOURNAL_STORE,
  JOURNAL_BLUE,
  JOURNAL_STORAGE,
  type JournalStore,
  newEmptyDay,
} from "@/lib/tools/journal-data";
import { JournalEditor } from "./journal-editor";
import { JournalLibrary } from "./journal-library";

type View =
  | { kind: "library" }
  | { kind: "edit"; id: string; isNew: boolean };

export function JournalTool() {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<JournalStore>(EMPTY_JOURNAL_STORE);
  const [view, setView] = useState<View>({ kind: "library" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOURNAL_STORAGE.data);
      if (raw) {
        const parsed = JSON.parse(raw) as JournalStore;
        setStore({ days: parsed.days ?? [] });
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
        localStorage.setItem(JOURNAL_STORAGE.data, JSON.stringify(store));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(id);
  }, [store, hydrated]);

  const dayById = useMemo(() => {
    const map = new Map<string, DayJournal>();
    for (const d of store.days) map.set(d.id, d);
    return map;
  }, [store.days]);

  const upsertDay = (day: DayJournal) => {
    setStore((s) => {
      const idx = s.days.findIndex((d) => d.id === day.id);
      const next = [...s.days];
      if (idx >= 0) next[idx] = day;
      else next.unshift(day);
      return { days: next };
    });
  };

  const removeDay = (id: string) => {
    setStore((s) => ({ days: s.days.filter((d) => d.id !== id) }));
    setView({ kind: "library" });
  };

  // ============== VIEW: EDIT ==============
  if (view.kind === "edit") {
    const day = dayById.get(view.id);
    if (!day) {
      setView({ kind: "library" });
      return null;
    }
    return (
      <>
        <IntroHand>
          {day.title || "Une journée d'observation"}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Capture en plusieurs instants — pas en un seul effort.
          </span>
        </IntroHand>
        <JournalEditor
          initial={day}
          isNew={view.isNew}
          onSave={(updated) => {
            upsertDay(updated);
            setView({ kind: "library" });
          }}
          onCancel={() => setView({ kind: "library" })}
          onDelete={view.isNew ? undefined : () => removeDay(day.id)}
        />
      </>
    );
  }

  // ============== VIEW: LIBRARY ==============
  return (
    <>
      <IntroHand>
        Observer la forme de tes journées,
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          pour mieux les sculpter ensuite.
        </span>
      </IntroHand>

      <SectionLabel num="01">Outil de la rubrique</SectionLabel>
      <Headline accent="& patterns">Observer</Headline>

      <JournalLibrary
        days={store.days}
        onCreateWork={() => {
          const empty = newEmptyDay("work");
          upsertDay(empty);
          setView({ kind: "edit", id: empty.id, isNew: true });
        }}
        onCreateFree={() => {
          const empty = newEmptyDay("free");
          upsertDay(empty);
          setView({ kind: "edit", id: empty.id, isNew: true });
        }}
        onOpen={(id) => setView({ kind: "edit", id, isNew: false })}
      />

      <HLQuote>
        On ne change pas
        <br />
        ce qu'on n'a pas{" "}
        <span style={{ color: JOURNAL_BLUE }}>encore vu</span>.
      </HLQuote>

      <Retain title="OBSERVER, AVANT D'AJUSTER." monster={MonsterCurieux}>
        Cet outil ne te dit pas comment vivre. Il t'aide à voir, après-coup, la
        forme réelle de tes journées : tes pics d'énergie, tes creux d'humeur,
        les contextes qui t'usent ou te nourrissent. À répéter sur 2-3 journées
        contrastées (travail vs libre), tu verras des patterns qu'aucune intuition
        ne capte aussi bien que des données concrètes.
      </Retain>
    </>
  );
}
