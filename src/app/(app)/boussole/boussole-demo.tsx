"use client";

import { useState } from "react";
import {
  IconBolt,
  IconBook,
  IconBrush,
  IconCloud,
  IconCompass,
  IconEyeOpen,
  IconFlower,
  IconGem,
  IconHeart,
  IconLeaf,
  IconMix,
  IconMore,
  IconStarBig,
  IconUsers,
  IconWind,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Chips, Field, PillarGrid } from "@/components/journal/inputs";
import {
  Headline,
  HLQuote,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterFier } from "@/components/monsters";

export function BoussoleDemo() {
  const [values, setValues] = useState<string[]>([]);
  const [e1, setE1] = useState<string>();
  const [e2, setE2] = useState<string>();
  const [e3, setE3] = useState<string>();
  const [sab, setSab] = useState<string[]>([]);

  return (
    <>
      <IntroHand>
        Pas un plan de vie.
        <br />
        <span style={{ color: "var(--ink-2)" }}>Une direction. Une orientation.</span>
      </IntroHand>

      <SectionLabel num="1">Mes valeurs</SectionLabel>
      <Headline>
        Ce qui<br />
        <span className="accent">me tient debout</span>
      </Headline>
      <Card
        icon={IconHeart}
        title="Choisis 3 valeurs"
        sub="Pas ce que tu devrais valoriser. Ce qui résonne quand tu lis le mot."
      >
        <PillarGrid
          value={values}
          onChange={(v) => setValues(v.slice(-3))}
          items={[
            { id: "liberte", label: "Liberté", icon: IconWind },
            { id: "creation", label: "Création", icon: IconBrush },
            { id: "lien", label: "Lien", icon: IconUsers },
            { id: "verite", label: "Vérité", icon: IconEyeOpen },
            { id: "douceur", label: "Douceur", icon: IconFlower },
            { id: "force", label: "Force", icon: IconBolt },
            { id: "paix", label: "Paix", icon: IconLeaf },
            { id: "aventure", label: "Aventure", icon: IconStarBig },
            { id: "apprentis", label: "Apprendre", icon: IconBook },
          ]}
        />
      </Card>

      <SectionLabel num="2">Mes envies de la saison</SectionLabel>
      <Headline accent="dans 3 mois">Ce que je voudrais</Headline>
      <Card
        icon={IconCompass}
        title="Trois envies — pas trois objectifs"
        sub="Plutôt « je voudrais ressentir / vivre… » que « je dois atteindre… »"
      >
        <Label>Envie 1</Label>
        <Field value={e1} onChange={setE1} placeholder="Plus de moments lents…" />
        <Label>Envie 2</Label>
        <Field
          value={e2}
          onChange={setE2}
          placeholder="Reprendre une pratique abandonnée…"
        />
        <Label>Envie 3</Label>
        <Field
          value={e3}
          onChange={setE3}
          placeholder="Une rencontre, un voyage, un soin…"
        />
      </Card>

      <SectionLabel num="3">Mes saboteurs</SectionLabel>
      <Headline>
        Ce qui me<br />
        <span className="accent">détourne</span>
      </Headline>
      <Card icon={IconCloud} title="Les motifs récurrents">
        <Chips
          value={sab}
          onChange={setSab}
          items={[
            { id: "perf", label: "Perfectionnisme", icon: IconGem },
            { id: "fuite", label: "Évitement", icon: IconWind },
            { id: "comp", label: "Comparaison", icon: IconMix },
            { id: "tout", label: "Tout-ou-rien", icon: IconBolt },
            { id: "plus", label: "Toujours plus", icon: IconMore },
            { id: "sans", label: "Pas-assez", icon: IconCloud },
          ]}
        />
      </Card>

      <HLQuote>
        Je n'ai pas à choisir
        <br />
        une vie parfaite.
        <br />
        Je choisis la{" "}
        <span style={{ color: "var(--dominant)" }}>prochaine direction</span>.
      </HLQuote>

      <Retain
        title="LA BOUSSOLE NE CHOISIT PAS LE CHEMIN. ELLE INDIQUE LE NORD."
        monster={MonsterFier}
      >
        Tu peux dévier. Tu peux reculer. La boussole, elle, reste fiable — elle
        attend que tu lui demandes.
      </Retain>
    </>
  );
}
