"use client";

import { useState } from "react";
import { IconEyeOpen } from "@/components/icons";
import { Card } from "@/components/journal/cards";
import {
  EMO_PINK,
  type FamilyKey,
  type InconnuAnswers,
  type Quadrant,
  resolveInconnu,
} from "@/lib/tools/emotions-data";
import { EmotionsPickCard } from "./emotions-pick-card";

type Resolution = {
  quadrant: Quadrant;
  fams: FamilyKey[];
  point: { x: number; y: number };
};

type Props = {
  onResolve: (r: Resolution) => void;
  onCancel: () => void;
};

type Question = {
  key: keyof InconnuAnswers;
  q: string;
  sub: string;
  options: { id: string; label: string; sub: string }[];
};

const QUESTIONS: Question[] = [
  {
    key: "energie",
    q: "Mon énergie, en ce moment ?",
    sub: "Une seule observation. Pas une analyse.",
    options: [
      { id: "haute", label: "Haute", sub: "agité · tendu · vibrant · pressé" },
      { id: "basse", label: "Basse", sub: "lent · lourd · épuisé · dans le creux" },
      { id: "mixte", label: "Mixte", sub: "figé · qui hésite entre les deux" },
    ],
  },
  {
    key: "plaisir",
    q: "C'est plutôt ?",
    sub: "Plaisant ou pénible — ne cherche pas l'exactitude.",
    options: [
      { id: "plaisant", label: "Plaisant", sub: "agréable, même si flou" },
      { id: "penible", label: "Pénible", sub: "inconfortable, je voudrais que ça change" },
      {
        id: "neutre",
        label: "Indéterminé",
        sub: "ni l'un ni l'autre, ou les deux à la fois",
      },
    ],
  },
  {
    key: "mouvement",
    q: "Mon corps a tendance à ?",
    sub: "L'impulsion sous l'émotion.",
    options: [
      { id: "approche", label: "M'approcher", sub: "curiosité, désir, ouverture" },
      { id: "retrait", label: "M'éloigner", sub: "fuite, retrait, mise à distance" },
      { id: "repousse", label: "Repousser", sub: "rejet, dégoût, colère" },
      { id: "fige", label: "Me figer", sub: "rien ne bouge, suspendu" },
    ],
  },
];

export function EmotionsInconnu({ onResolve, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<InconnuAnswers>({});

  const cur = QUESTIONS[step];
  if (!cur) return null;

  const next = (val: string) => {
    const upd = { ...a, [cur.key]: val } as InconnuAnswers;
    setA(upd);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      onResolve(resolveInconnu(upd as Required<InconnuAnswers>));
    }
  };

  return (
    <Card icon={IconEyeOpen} title={`Question ${step + 1}/3`} sub={cur.sub}>
      <p
        style={{
          margin: "2px 0 14px",
          fontFamily: "var(--font-cond)",
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: ".02em",
        }}
      >
        {cur.q}
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {cur.options.map((o) => (
          <EmotionsPickCard
            key={o.id}
            label={o.label}
            sub={o.sub}
            onClick={() => next(o.id)}
            color={EMO_PINK}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onCancel}
        style={{
          display: "block",
          margin: "14px auto 0",
          background: "transparent",
          border: "none",
          fontFamily: "var(--font-cond)",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Revenir à l'entrée
      </button>
    </Card>
  );
}
