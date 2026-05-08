"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Headline,
  HLQuote,
  IntroHand,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";
import {
  type Bag,
  BAG_STORAGE,
  BAG_YELLOW,
  type BagPrepDraft,
  type BagPrepLog,
  type BagStore,
  EMPTY_BAG_STORE,
  newEmptyBag,
  sportTemplate,
  totalItems,
  weekendTemplate,
} from "@/lib/tools/bag-data";
import { BagEditor } from "./bag-editor";
import { BagLibrary } from "./bag-library";
import { BagRunner } from "./bag-runner";

type View =
  | { kind: "library" }
  | { kind: "edit"; id: string; isNew: boolean }
  | { kind: "prep"; id: string };

export function BagTool() {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<BagStore>(EMPTY_BAG_STORE);
  const [view, setView] = useState<View>({ kind: "library" });

  // Hydratation
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BAG_STORAGE.data);
      if (raw) {
        const parsed = JSON.parse(raw) as BagStore;
        setStore({
          bags: parsed.bags ?? [],
          logs: parsed.logs ?? [],
          prep: parsed.prep ?? null,
        });
        if (parsed.prep) {
          setView({ kind: "prep", id: parsed.prep.bagId });
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
        localStorage.setItem(BAG_STORAGE.data, JSON.stringify(store));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(id);
  }, [store, hydrated]);

  const bagById = useMemo(() => {
    const map = new Map<string, Bag>();
    for (const b of store.bags) map.set(b.id, b);
    return map;
  }, [store.bags]);

  const upsertBag = (bag: Bag) => {
    setStore((s) => {
      const idx = s.bags.findIndex((b) => b.id === bag.id);
      const next = [...s.bags];
      if (idx >= 0) next[idx] = bag;
      else next.unshift(bag);
      return { ...s, bags: next };
    });
  };

  const deleteBag = (id: string) => {
    setStore((s) => ({
      ...s,
      bags: s.bags.filter((b) => b.id !== id),
      logs: s.logs.filter((l) => l.bagId !== id),
      prep: s.prep?.bagId === id ? null : s.prep,
    }));
    setView({ kind: "library" });
  };

  const startPrep = (bag: Bag) => {
    upsertBag(bag);
    const draft: BagPrepDraft = {
      bagId: bag.id,
      startedAt: Date.now(),
      checkedItems: [],
      finalChecks: [],
    };
    setStore((s) => ({ ...s, prep: draft }));
    setView({ kind: "prep", id: bag.id });
  };

  const startPrepFromLibrary = (id: string) => {
    const bag = bagById.get(id);
    if (!bag) return;
    const draft: BagPrepDraft = {
      bagId: id,
      startedAt: Date.now(),
      checkedItems: [],
      finalChecks: [],
    };
    setStore((s) => ({ ...s, prep: draft }));
    setView({ kind: "prep", id });
  };

  const toggleItem = (itemId: string) => {
    setStore((s) => {
      if (!s.prep) return s;
      const cur = s.prep.checkedItems;
      const next = cur.includes(itemId)
        ? cur.filter((x) => x !== itemId)
        : [...cur, itemId];
      return { ...s, prep: { ...s.prep, checkedItems: next } };
    });
  };

  const toggleFinal = (checkId: string) => {
    setStore((s) => {
      if (!s.prep) return s;
      const cur = s.prep.finalChecks;
      const next = cur.includes(checkId)
        ? cur.filter((x) => x !== checkId)
        : [...cur, checkId];
      return { ...s, prep: { ...s.prep, finalChecks: next } };
    });
  };

  const completePrep = () => {
    setStore((s) => {
      if (!s.prep) return s;
      const bag = s.bags.find((b) => b.id === s.prep?.bagId);
      if (!bag) return s;
      const log: BagPrepLog = {
        t: Date.now(),
        bagId: s.prep.bagId,
        checkedItems: s.prep.checkedItems,
        finalChecks: s.prep.finalChecks,
        totalItems: totalItems(bag),
        totalFinal: bag.finalChecks.length,
      };
      return {
        ...s,
        logs: [...s.logs, log].slice(-200),
        prep: null,
      };
    });
    setView({ kind: "library" });
  };

  const cancelPrep = () => {
    setStore((s) => ({ ...s, prep: null }));
    setView({ kind: "library" });
  };

  const quitPrepKeepDraft = () => {
    setView({ kind: "library" });
  };

  // ============== VIEW: PREP ==============
  if (view.kind === "prep") {
    const bag = bagById.get(view.id);
    const prep = store.prep;
    if (!bag || !prep || prep.bagId !== bag.id) {
      setView({ kind: "library" });
      return null;
    }
    return (
      <>
        <IntroHand>
          {bag.title}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Coche au fur et à mesure — tu peux quitter et reprendre.
          </span>
        </IntroHand>
        <BagRunner
          bag={bag}
          prep={prep}
          onToggleItem={toggleItem}
          onToggleFinal={toggleFinal}
          onComplete={completePrep}
          onQuit={quitPrepKeepDraft}
          onCancel={cancelPrep}
        />
      </>
    );
  }

  // ============== VIEW: EDIT ==============
  if (view.kind === "edit") {
    const bag = bagById.get(view.id);
    if (!bag) {
      setView({ kind: "library" });
      return null;
    }
    return (
      <>
        <IntroHand>
          {view.isNew ? "Un nouveau sac." : "Modifier le sac."}
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Liste tout ce que tu veux retrouver dedans — tu pourras toujours ajuster.
          </span>
        </IntroHand>
        <BagEditor
          initial={bag}
          isNew={view.isNew}
          onSave={(updated) => {
            upsertBag(updated);
            setView({ kind: "library" });
          }}
          onCancel={() => {
            // Si nouveau jamais rempli, on retire
            const empty =
              !bag.title.trim() &&
              bag.categories.every((c) => c.items.every((it) => !it.label.trim()));
            if (view.isNew && empty) {
              setStore((s) => ({
                ...s,
                bags: s.bags.filter((b) => b.id !== bag.id),
              }));
            }
            setView({ kind: "library" });
          }}
          onDelete={view.isNew ? undefined : () => deleteBag(bag.id)}
          onPrep={(updated) => startPrep(updated)}
        />
      </>
    );
  }

  // ============== VIEW: LIBRARY ==============
  return (
    <>
      <IntroHand>
        Tes sacs, prêts à partir.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Externalise la mémoire de ce qu'il y a dedans — tu n'as plus à y penser.
        </span>
      </IntroHand>

      <SectionLabel num="07">Outil de la rubrique</SectionLabel>
      <Headline accent="& préparation">Environnement</Headline>

      <BagLibrary
        bags={store.bags}
        logs={store.logs}
        onCreateEmpty={() => {
          const empty = newEmptyBag();
          upsertBag(empty);
          setView({ kind: "edit", id: empty.id, isNew: true });
        }}
        onCreateSport={() => {
          const tpl = sportTemplate();
          upsertBag(tpl);
          setView({ kind: "edit", id: tpl.id, isNew: true });
        }}
        onCreateWeekend={() => {
          const tpl = weekendTemplate();
          upsertBag(tpl);
          setView({ kind: "edit", id: tpl.id, isNew: true });
        }}
        onOpen={(id) => setView({ kind: "edit", id, isNew: false })}
        onPrep={startPrepFromLibrary}
      />

      <HLQuote>
        Un sac bien préparé,
        <br />
        c'est une <span style={{ color: BAG_YELLOW }}>charge mentale en moins</span>.
      </HLQuote>

      <Retain title="LE SAC EST UNE EXTENSION DU CERVEAU." monster={MonsterReflexif}>
        L'oubli matériel n'est pas un défaut moral — c'est un fonctionnement neuro
        qui réagit mal à la fragmentation. Quand le sac est préparé en avance,
        avec sa liste, l'oubli n'a plus prise. Tu peux y joindre une photo du sac
        prêt comme référence visuelle, c'est encore plus efficace.
      </Retain>
    </>
  );
}
