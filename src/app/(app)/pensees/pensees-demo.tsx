"use client";

import { useState } from "react";
import {
  IconBolt,
  IconCloud,
  IconClock,
  IconDrop,
  IconEye,
  IconEyeOpen,
  IconSeedling,
  IconShield,
  IconUsers,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { FreeArea, Opt, Scale } from "@/components/journal/inputs";
import {
  HandNote,
  Headline,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";

export function PenseesDemo() {
  const [thought, setThought] = useState<string>();
  const [feel, setFeel] = useState<string | null>(null);
  const [intens, setIntens] = useState<number>();
  const [fait, setFait] = useState<string>();
  const [ami, setAmi] = useState<string>();
  const [semaine, setSemaine] = useState<string | null>(null);
  const [juste, setJuste] = useState<string>();

  return (
    <>
      <IntroHand>
        Mes pensées, en passage.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          La page ne juge pas. Elle accueille.
        </span>
      </IntroHand>

      <SectionLabel num="1">La pensée qui revient</SectionLabel>
      <Headline>
        Pose-la,<br />
        <span className="accent">examine-la</span>
      </Headline>
      <Card icon={IconCloud} title="La pensée, telle qu'elle est">
        <FreeArea
          value={thought}
          onChange={setThought}
          placeholder='« Je ne suis pas à la hauteur. » / « Tout va se planter. » / …'
        />
      </Card>
      <Card icon={IconBolt} title="L'émotion qu'elle déclenche">
        <Opt
          value={feel}
          onChange={setFeel}
          items={[
            { id: "angoisse", label: "Angoisse", icon: IconCloud },
            { id: "colere", label: "Colère", icon: IconBolt },
            { id: "tristesse", label: "Tristesse", icon: IconDrop },
            { id: "honte", label: "Honte", icon: IconEye },
            { id: "peur", label: "Peur", icon: IconShield },
          ]}
        />
        <Label>Intensité</Label>
        <Scale
          value={intens}
          onChange={setIntens}
          max={5}
          labelLow="LÉGÈRE"
          labelHigh="ÉCRASANTE"
        />
      </Card>

      <SectionLabel num="2">Examen</SectionLabel>
      <Headline>
        Quatre<br />
        <span className="accent">questions</span>
      </Headline>
      <Card icon={IconEyeOpen} title="Est-ce un fait, ou une interprétation ?">
        <FreeArea
          value={fait}
          onChange={setFait}
          placeholder="Qu'est-ce que je sais vraiment ? Qu'est-ce que j'invente ?"
        />
      </Card>
      <Card icon={IconUsers} title="Que dirais-je à un ami dans ma situation ?">
        <FreeArea
          value={ami}
          onChange={setAmi}
          placeholder="Je serais probablement plus doux qu'envers moi-même…"
        />
      </Card>
      <Card
        icon={IconClock}
        title="Cette pensée sera-t-elle vraie dans une semaine ?"
      >
        <Opt
          value={semaine}
          onChange={setSemaine}
          items={[
            { id: "oui", label: "Probablement oui" },
            { id: "peut", label: "Peut-être" },
            { id: "non", label: "Sans doute pas" },
          ]}
        />
      </Card>
      <Card icon={IconSeedling} title="Une version plus juste de cette pensée ?">
        <FreeArea
          value={juste}
          onChange={setJuste}
          placeholder="« Je trouve ça difficile, et c'est OK de demander de l'aide. »"
        />
      </Card>

      <HandNote>
        « Une pensée n'est pas un fait. Elle est juste de passage. »
      </HandNote>

      <Retain
        title="OBSERVER UNE PENSÉE, C'EST DÉJÀ S'EN DÉCROCHER."
        monster={MonsterReflexif}
      >
        Tu n'as pas à la combattre. Tu la regardes passer, comme un nuage. Elle
        finit par bouger.
      </Retain>
    </>
  );
}
