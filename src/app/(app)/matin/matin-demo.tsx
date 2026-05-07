"use client";

import { useState } from "react";
import {
  IconBattery,
  IconCloud,
  IconCompass,
  IconDrop,
  IconEgg,
  IconHand,
  IconHourglass,
  IconMoon,
  IconPause,
  IconPill,
  IconRun,
  IconShield,
  IconSun,
  IconTarget,
  IconTooth,
  IconWind,
  IconWriting,
  IconChat,
} from "@/components/icons";
import {
  MonsterCalme,
  MonsterCurieux,
  MonsterEndormi,
  MonsterEnergique,
  MonsterInquiet,
  MonsterReflexif,
} from "@/components/monsters";
import { Card } from "@/components/journal/cards";
import {
  Checklist,
  Chips,
  EmoGrid,
  Field,
  PrioRow,
  Scale,
} from "@/components/journal/inputs";
import {
  HandNote,
  Headline,
  HLQuote,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";

/**
 * Démo statique de l'onglet Matin pour la phase 2 (port du design).
 * État local uniquement — la persistance et l'auth arrivent en phases 3-4.
 */
export function MatinDemo() {
  const [energie, setEnergie] = useState<number>();
  const [mental, setMental] = useState<number>();
  const [sommeil, setSommeil] = useState<number>();
  const [heureCouche, setHeureCouche] = useState<string>();
  const [heureReveil, setHeureReveil] = useState<string>();
  const [emotion, setEmotion] = useState<string | null>(null);
  const [emotionWhy, setEmotionWhy] = useState<string>();
  const [routine, setRoutine] = useState<string[]>([]);
  const [intention, setIntention] = useState<string>();
  const [prios, setPrios] = useState<[string, string, string]>(["", "", ""]);
  const [strats, setStrats] = useState<string[]>([]);

  return (
    <>
      <IntroHand>
        Comment je me sens, là, maintenant ?
        <br />
        <span style={{ color: "var(--ink-2)" }}>Pas de pression. On observe, c'est tout.</span>
      </IntroHand>

      <SectionLabel num="1">Mon état au réveil</SectionLabel>
      <Headline accent="(données, pas verdicts)">Je m'observe</Headline>

      <Card icon={IconBattery} title="Énergie corporelle" sub="De vide à pleine batterie.">
        <Scale
          value={energie}
          onChange={setEnergie}
          labelLow="VIDE"
          labelHigh="PLEINE"
        />
      </Card>
      <Card icon={IconCloud} title="État mental" sub="Brume, ou tête claire ?">
        <Scale
          value={mental}
          onChange={setMental}
          labelLow="BROUILLARD"
          labelHigh="LIMPIDE"
        />
      </Card>
      <Card icon={IconMoon} title="Sommeil" sub="Comment était la nuit ?">
        <Scale
          value={sommeil}
          onChange={setSommeil}
          labelLow="AGITÉ"
          labelHigh="RÉPARATEUR"
        />
        <Label>Heure du coucher · réveil</Label>
        <div style={{ display: "flex", gap: 10 }}>
          <Field value={heureCouche} onChange={setHeureCouche} placeholder="22h30" />
          <Field value={heureReveil} onChange={setHeureReveil} placeholder="07h00" />
        </div>
      </Card>

      <HandNote>« Ces chiffres ne définissent pas ma journée. »</HandNote>

      <SectionLabel num="2">Mes émotions du matin</SectionLabel>
      <Headline>
        Je nomme
        <br />
        ce que je ressens
      </Headline>
      <EmoGrid
        value={emotion}
        onChange={setEmotion}
        items={[
          { id: "calme", label: "Calme", illu: MonsterCalme, color: "#4DD0B0" },
          { id: "curieux", label: "Curieux", illu: MonsterCurieux, color: "#1B4FE5" },
          { id: "reflexif", label: "Réflexif", illu: MonsterReflexif, color: "#B05BC9" },
          { id: "energique", label: "Énergique", illu: MonsterEnergique, color: "#F26B2C" },
          { id: "inquiet", label: "Inquiet", illu: MonsterInquiet, color: "#F0B340" },
          { id: "endormi", label: "Endormi", illu: MonsterEndormi, color: "#7C8A99" },
        ]}
      />
      <Field
        multiline
        rows={2}
        value={emotionWhy}
        onChange={setEmotionWhy}
        placeholder="Si je devais préciser… (optionnel)"
      />

      <SectionLabel num="3">Routine du matin</SectionLabel>
      <Headline>
        Les petits
        <br />
        <span className="accent">gestes-ancres</span>
      </Headline>
      <Card icon={IconHand} title="Ce que j'ai déjà fait" sub="Coche au fil — sans culpabilité.">
        <Checklist
          value={routine}
          onChange={setRoutine}
          items={[
            { id: "eau", label: "Boire un verre d'eau", icon: IconDrop },
            { id: "lumiere", label: "M'exposer à la lumière", icon: IconSun },
            { id: "corps", label: "Bouger 5 minutes", icon: IconRun },
            { id: "manger", label: "Manger quelque chose", icon: IconEgg },
            { id: "dents", label: "Hygiène (dents, douche)", icon: IconTooth },
            { id: "meds", label: "Traitement / vitamines", icon: IconPill },
          ]}
        />
      </Card>

      <HLQuote>
        Une routine n'est pas une prison —<br />
        c'est un point d'appui.
      </HLQuote>

      <SectionLabel num="4">Intention du jour</SectionLabel>
      <Headline accent="aujourd'hui ?">
        Qu'est-ce que je
        <br />
        veux <span className="accent">vraiment</span>
      </Headline>

      <Card
        icon={IconCompass}
        title="Mon intention"
        sub="Un mot, une phrase. Pas un objectif — une direction."
      >
        <Field
          value={intention}
          onChange={setIntention}
          placeholder="Ex : être patient avec moi-même"
        />
      </Card>

      <Card
        icon={IconTarget}
        title="Mes 3 priorités"
        sub="Pas plus. Sinon ce ne sont plus des priorités."
      >
        <PrioRow
          tag="P1 · INCONTOURNABLE"
          klass="t1"
          value={prios[0]}
          onChange={(v) => setPrios([v, prios[1], prios[2]])}
          placeholder="Ce qui doit être fait"
        />
        <PrioRow
          tag="P2 · IMPORTANT"
          klass="t2"
          value={prios[1]}
          onChange={(v) => setPrios([prios[0], v, prios[2]])}
          placeholder="Ce qui ferait du bien"
        />
        <PrioRow
          tag="P3 · BONUS"
          klass="t3"
          value={prios[2]}
          onChange={(v) => setPrios([prios[0], prios[1], v])}
          placeholder="Si l'énergie le permet"
        />
      </Card>

      <Card
        icon={IconShield}
        title="Stratégies anti-débordement"
        sub="Si la journée déraille, voici mes filets."
      >
        <Chips
          value={strats}
          onChange={setStrats}
          items={[
            { id: "pause", label: "Faire une pause", icon: IconPause },
            { id: "liste", label: "Tout écrire", icon: IconWriting },
            { id: "air", label: "Sortir 10 min", icon: IconWind },
            { id: "aide", label: "Demander de l'aide", icon: IconChat },
            { id: "mono", label: "Une seule tâche", icon: IconTarget },
            { id: "stop", label: "Faire moins", icon: IconHourglass },
          ]}
        />
      </Card>

      <Retain title="LE MATIN POSE LE TON, PAS LE VERDICT." monster={MonsterCurieux}>
        Tu n'as pas à être au sommet pour démarrer. Tu dois juste démarrer doucement. Le reste se
        construit au fil des heures.
      </Retain>
    </>
  );
}
