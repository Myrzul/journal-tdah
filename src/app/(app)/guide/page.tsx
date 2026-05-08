"use client";

import { useEffect, useState } from "react";
import { GuideRubriqueCard } from "@/components/guide/guide-rubrique-card";
import { Headline, HLQuote, IntroHand, Retain, SectionLabel } from "@/components/journal/typography";
import { MonsterFier } from "@/components/monsters";
import { loadGuideStore } from "@/lib/guide/guide-storage";
import { EMPTY_GUIDE_STORE, type GuideStore } from "@/lib/guide/guide-types";
import { RUBRIQUES } from "@/lib/guide/rubriques-meta";

export default function GuidePage() {
  const [store, setStore] = useState<GuideStore>(EMPTY_GUIDE_STORE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadGuideStore());
    setHydrated(true);
  }, []);

  // Réécoute les changements (autre onglet, ou même onglet via storage event)
  useEffect(() => {
    if (!hydrated) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === "jtdah-guide-v1") setStore(loadGuideStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrated]);

  return (
    <>
      <IntroHand>
        Le guide en 10 rubriques.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Une rubrique par mois, ou à ton rythme. Pas de pression de progression.
        </span>
      </IntroHand>

      <SectionLabel num="•">Apprivoiser son TDAH</SectionLabel>
      <Headline accent="à ton rythme">10 rubriques</Headline>

      <div className="guide-grid">
        {RUBRIQUES.map((r) => (
          <GuideRubriqueCard
            key={r.id}
            rubrique={r}
            progress={store.progress[r.id]}
          />
        ))}
      </div>

      <HLQuote>
        Connaître,
        <br />
        avant de <span style={{ color: "var(--ch-soin)" }}>changer</span>.
      </HLQuote>

      <Retain
        title="LE GUIDE EST UN COMPAGNON, PAS UN PROGRAMME."
        monster={MonsterFier}
      >
        Tu peux explorer dans l'ordre, ou commencer par la rubrique qui résonne
        le plus aujourd'hui. Le contenu reste là, l'app garde tes notes et tes
        objectifs. Une rubrique correctement intégrée vaut mieux que dix lues
        en survol.
      </Retain>
    </>
  );
}
