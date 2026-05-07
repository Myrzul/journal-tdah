"use client";

import { useState } from "react";
import {
  IconBulb,
  IconCart,
  IconCheck,
  IconMail,
  IconSparkleSmall,
} from "@/components/icons";
import {
  Headline,
  HLQuote,
  IntroHand,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { ListBlock, type ListItem } from "@/components/journal/list-block";
import { MonsterCalme } from "@/components/monsters";

type ListKey = "todo" | "idees" | "envies" | "memo" | "courses";

const LISTS: { key: ListKey; icon: React.ComponentType<{ size?: number; color?: string }>; title: string }[] = [
  { key: "todo", icon: IconCheck, title: "À faire (sans pression)" },
  { key: "idees", icon: IconBulb, title: "Idées en vrac" },
  { key: "envies", icon: IconSparkleSmall, title: "Envies de soin" },
  { key: "memo", icon: IconMail, title: "À ne pas oublier" },
  { key: "courses", icon: IconCart, title: "Courses & quotidien" },
];

type State = Record<ListKey, ListItem[]>;
const emptyState: State = {
  todo: [],
  idees: [],
  envies: [],
  memo: [],
  courses: [],
};

export function ListesDemo() {
  const [state, setState] = useState<State>(emptyState);

  return (
    <>
      <IntroHand>
        Mes listes, sur la page.
        <br />
        <span style={{ color: "var(--ink-2)" }}>Sortir de la tête. Respirer.</span>
      </IntroHand>

      <SectionLabel num="•">Vider la tête</SectionLabel>
      <Headline>
        Tout ce qui<br />
        <span className="accent">tourne en boucle</span>
      </Headline>

      {LISTS.map((l) => (
        <ListBlock
          key={l.key}
          icon={l.icon}
          title={l.title}
          items={state[l.key]}
          onChange={(items) => setState({ ...state, [l.key]: items })}
        />
      ))}

      <HLQuote>
        Une tête en paix,<br />
        c'est une tête<br />
        <span style={{ color: "var(--dominant)" }}>vidée sur le papier</span>.
      </HLQuote>

      <Retain title="CE QUI EST ÉCRIT N'A PLUS BESOIN D'ÊTRE RETENU." monster={MonsterCalme}>
        Tu peux relâcher. La page se souvient pour toi.
      </Retain>
    </>
  );
}
