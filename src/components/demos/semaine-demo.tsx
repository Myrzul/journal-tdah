"use client";

import { useState } from "react";
import { IconBulb, IconCalendar, IconSeedling, IconTrophy } from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { FreeArea } from "@/components/journal/inputs";
import {
  Headline,
  HLQuote,
  IntroHand,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterReflexif } from "@/components/monsters";
import { cn } from "@/lib/utils/cn";

type Cell = "ok" | "ko" | null;
type DayKey = "LUN" | "MAR" | "MER" | "JEU" | "VEN" | "SAM" | "DIM";
type RowKey = "sommeil" | "mvt" | "connexion" | "creation" | "recup";

const DAYS: DayKey[] = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

const ROWS: { key: RowKey; label: string }[] = [
  { key: "sommeil", label: "Sommeil suffisant" },
  { key: "mvt", label: "Mouvement / corps" },
  { key: "connexion", label: "Lien social positif" },
  { key: "creation", label: "Moment créatif / plaisir" },
  { key: "recup", label: "Pause récupératrice" },
];

type Grid = Record<RowKey, Partial<Record<DayKey, Cell>>>;

const emptyGrid: Grid = {
  sommeil: {},
  mvt: {},
  connexion: {},
  creation: {},
  recup: {},
};

export function SemaineDemo() {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [win, setWin] = useState<string>();
  const [learn, setLearn] = useState<string>();
  const [carry, setCarry] = useState<string>();

  const cycleCell = (rowKey: RowKey, day: DayKey) => {
    const current = grid[rowKey][day] ?? null;
    const next: Cell = current === "ok" ? "ko" : current === "ko" ? null : "ok";
    setGrid({
      ...grid,
      [rowKey]: { ...grid[rowKey], [day]: next },
    });
  };

  return (
    <>
      <IntroHand>
        Ma semaine, d'un seul regard.
        <br />
        <span style={{ color: "var(--ink-2)" }}>Le motif émerge dans la durée.</span>
      </IntroHand>

      <SectionLabel num="1">Tableau de la semaine</SectionLabel>
      <Headline accent="• ou ✗ chaque jour">5 piliers</Headline>
      <Card icon={IconCalendar} title="Suivi quotidien">
        <table className="bilan-table">
          <thead>
            <tr>
              <th />
              {DAYS.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <td>{r.label}</td>
                {DAYS.map((d) => {
                  const v = grid[r.key][d] ?? null;
                  return (
                    <td key={d}>
                      <button
                        type="button"
                        className={cn(
                          "b-radio",
                          v === "ok" && "ok-on",
                          v === "ko" && "ko-on",
                        )}
                        onClick={() => cycleCell(r.key, d)}
                        aria-label={`${r.label} - ${d} - ${v ?? "vide"}`}
                      >
                        {v === "ok" ? "•" : v === "ko" ? "✗" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <SectionLabel num="2">Bilan global</SectionLabel>
      <Headline>
        Ce que je<br />
        <span className="accent">retiens</span>
      </Headline>
      <Card icon={IconTrophy} title="Ma plus belle réussite">
        <FreeArea
          value={win}
          onChange={setWin}
          placeholder="Aussi petite soit-elle. Elle compte."
        />
      </Card>
      <Card icon={IconBulb} title="Ce que j'ai appris sur moi">
        <FreeArea
          value={learn}
          onChange={setLearn}
          placeholder="Une observation, un déclic, un motif récurrent…"
        />
      </Card>
      <Card
        icon={IconSeedling}
        title="Une chose à transporter dans la prochaine semaine"
      >
        <FreeArea
          value={carry}
          onChange={setCarry}
          placeholder="Une intention, un geste, une envie."
        />
      </Card>

      <HLQuote>
        Sept jours, c'est assez
        <br />
        pour voir une tendance.
        <br />
        Pas un échec.
      </HLQuote>

      <Retain
        title="ON NE GAGNE PAS UNE SEMAINE. ON LA TRAVERSE."
        monster={MonsterReflexif}
      >
        Le but n'est pas de cocher toutes les cases. C'est de remarquer celles qui
        te portent.
      </Retain>
    </>
  );
}
