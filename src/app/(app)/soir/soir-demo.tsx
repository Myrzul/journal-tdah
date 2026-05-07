"use client";

import { useState } from "react";
import {
  IconGem,
  IconMoonStar,
  IconSparkle,
  IconTarget,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import {
  EmoGrid,
  Field,
  FreeArea,
  Prog3,
} from "@/components/journal/inputs";
import {
  Compare,
  HandNote,
  Headline,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import {
  MonsterCalme,
  MonsterEndormi,
  MonsterEnergique,
  MonsterFier,
  MonsterInquiet,
  MonsterReflexif,
} from "@/components/monsters";
import { relativeDateLabel } from "@/lib/utils/date";

type Prog = 0 | 1 | 2 | null;

export function SoirDemo({ activeDate = new Date() }: { activeDate?: Date }) {
  const dateLabel = relativeDateLabel(activeDate);

  // Priorités du matin — placeholder en attendant la DB.
  // En phase 4 : on lit l'entrée matin du jour pour récupérer les vraies prios.
  const priorities = ["", "", ""] as const;

  const [prog, setProg] = useState<[Prog, Prog, Prog]>([null, null, null]);
  const [emoSoir, setEmoSoir] = useState<string | null>(null);
  const [moment, setMoment] = useState<string>();
  const [g1, setG1] = useState<string>();
  const [g2, setG2] = useState<string>();
  const [g3, setG3] = useState<string>();
  const [lacher, setLacher] = useState<string>();

  return (
    <>
      <IntroHand>
        Mon soir, {dateLabel}.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Pas pour juger. Pour comprendre.
        </span>
      </IntroHand>

      <SectionLabel num="1">Bilan des priorités</SectionLabel>
      <Headline accent="(sans jugement)">Mes 3 priorités</Headline>
      <Card icon={IconTarget} title="Avancement" sub="○ pas commencé · ◐ entamé · ● fait">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ margin: "14px 0" }}>
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                marginBottom: 6,
              }}
            >
              P{i + 1} :{" "}
              {priorities[i] || (
                <span style={{ color: "var(--muted)" }}>—</span>
              )}
            </div>
            <Prog3
              value={prog[i]}
              onChange={(v) => {
                const next = [...prog] as [Prog, Prog, Prog];
                next[i] = v;
                setProg(next);
              }}
            />
          </div>
        ))}
        <Compare>
          Compare avec ton intention du matin. Pas pour t'en vouloir — pour
          repérer ce qui t'a éloigné(e).
        </Compare>
      </Card>

      <SectionLabel num="2">Émotions de la journée</SectionLabel>
      <Headline>
        Météo
        <br />
        <span className="accent">émotionnelle</span>
      </Headline>
      <EmoGrid
        value={emoSoir}
        onChange={setEmoSoir}
        items={[
          { id: "calme", label: "Apaisé", illu: MonsterCalme, color: "#4DD0B0" },
          { id: "fier", label: "Fier", illu: MonsterFier, color: "#E8294E" },
          { id: "reflexif", label: "Pensif", illu: MonsterReflexif, color: "#B05BC9" },
          { id: "energique", label: "Vivant", illu: MonsterEnergique, color: "#F26B2C" },
          { id: "inquiet", label: "Tendu", illu: MonsterInquiet, color: "#F0B340" },
          { id: "endormi", label: "Vidé", illu: MonsterEndormi, color: "#7C8A99" },
        ]}
      />

      <SectionLabel num="3">Le moment marquant</SectionLabel>
      <Headline>
        Une scène
        <br />
        de la journée
      </Headline>
      <Card
        icon={IconSparkle}
        title="Le moment qui s'impose"
        sub="Beau ou difficile — le premier qui revient."
      >
        <FreeArea
          value={moment}
          onChange={setMoment}
          placeholder="Quand je ferme les yeux, je revois…"
        />
      </Card>

      <HandNote right>« Le mémorable n'est pas toujours grand. »</HandNote>

      <SectionLabel num="4">Trois gratitudes</SectionLabel>
      <Headline accent="qui a tenu bon">Petit · moyen · grand</Headline>
      <Card icon={IconGem} title="Trois choses qui ont tenu bon">
        <Label>Petit</Label>
        <Field
          value={g1}
          onChange={setG1}
          placeholder="Un café chaud, une lumière douce…"
        />
        <Label>Moyen</Label>
        <Field
          value={g2}
          onChange={setG2}
          placeholder="Un message, un moment d'eau claire…"
        />
        <Label>Grand</Label>
        <Field
          value={g3}
          onChange={setG3}
          placeholder="Une décision, une rencontre…"
        />
      </Card>

      <SectionLabel num="5">Une chose à laisser ici</SectionLabel>
      <Headline>
        Vide ton sac
        <br />
        <span className="accent">avant la nuit</span>
      </Headline>
      <Card icon={IconMoonStar} title="Je dépose, j'allège">
        <FreeArea
          value={lacher}
          onChange={setLacher}
          placeholder="Ce que je laisse au jour qui passe, pour mieux dormir."
        />
      </Card>

      <Retain title="LA NUIT TRIE CE QUE LE JOUR A SEMÉ." monster={MonsterEndormi}>
        Pose le bilan, pose-toi. Demain, tu reprendras. Pas avant.
      </Retain>
    </>
  );
}
