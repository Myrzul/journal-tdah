/**
 * Mock seed pour le hub (phase 2). 90 jours d'entrées plausibles.
 * Sera remplacé par les vraies queries DB en phases 4-5.
 *
 * Le seed est déterministe (PRNG fondé sur la date) pour que rechargements
 * et SSR produisent la même chose.
 */

import { addDays, format, startOfDay, subDays } from "date-fns";

export type EmotionId =
  | "calme"
  | "curieux"
  | "reflexif"
  | "energique"
  | "inquiet"
  | "endormi"
  | "fier";

export type RoutineId = "eau" | "lumiere" | "corps" | "manger" | "dents" | "meds";

export type MorningEntry = {
  date: string; // YYYY-MM-DD
  energie: number; // 1-5
  mental: number; // 1-5
  sommeil: number; // 1-5
  emotion: EmotionId | null;
  routine: RoutineId[];
  intention: string;
};

export type EveningEntry = {
  date: string;
  emotion: EmotionId | null;
  prog: [0 | 1 | 2 | null, 0 | 1 | 2 | null, 0 | 1 | 2 | null];
  lacher: string;
};

export type WeekEntry = {
  weekStart: string; // YYYY-MM-DD du lundi
  win: string;
  learn: string;
  carry: string;
};

export type Compass = {
  values: string[]; // 3 ids de valeurs
  e1: string;
  e2: string;
  e3: string;
};

export type MockData = {
  morningByDate: Map<string, MorningEntry>;
  eveningByDate: Map<string, EveningEntry>;
  weeks: WeekEntry[];
  compass: Compass;
};

/* =================================================================
   PRNG déterministe (mulberry32) — un seed par date
   ================================================================= */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function pickWeighted<T>(rng: () => number, items: { value: T; weight: number }[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let r = rng() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it.value;
  }
  const last = items[items.length - 1];
  if (!last) throw new Error("pickWeighted: empty items");
  return last.value;
}

/* =================================================================
   Génération
   ================================================================= */
const INTENTIONS = [
  "être patient avec moi-même",
  "ralentir avant de répondre",
  "honorer mon corps",
  "écrire 10 minutes",
  "remarquer ce qui va bien",
  "demander de l'aide si besoin",
  "faire moins, mieux",
  "garder une promesse à moi-même",
];

const LACHERS = [
  "Cette journée a été plus fluide que prévu.",
  "Je laisse cette tension au bureau, pas dans le lit.",
  "Tout n'a pas été parfait — et c'est très bien.",
  "Je dépose ce que je n'ai pas pu finir.",
  "Une chose à la fois, demain aussi.",
  "Je remercie le moi de ce matin d'avoir essayé.",
  "Le silence d'après une journée pleine.",
];

const WINS = [
  "J'ai dit non à une réunion qui ne m'apportait rien.",
  "J'ai pris 20 min pour marcher au lieu de scroller.",
  "J'ai écrit le mail que je repoussais depuis 3 semaines.",
  "J'ai osé poser une vraie question en réunion.",
  "J'ai cuisiné quelque chose de simple et bon.",
];

const LEARNS = [
  "Mon énergie chute systématiquement les lundis matin — je vais réorganiser le lever.",
  "Quand je dors moins de 6h, mes émotions virent vers l'inquiétude le soir.",
  "Si je commence par une vraie pause, le reste se déroule plus calmement.",
  "Le perfectionnisme sabote mes journées plus que la fatigue.",
  "Trois priorités c'est encore une de trop pour moi.",
];

const CARRIES = [
  "Une intention plus douce, une priorité de moins.",
  "Continuer la marche du midi.",
  "Lire 10 pages avant de dormir, pas l'écran.",
  "Appeler ma sœur avant que la semaine s'emballe.",
];

function randInRange(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function generateMorning(date: Date): MorningEntry {
  const rng = mulberry32(dateSeed(date));
  const dow = date.getDay(); // 0=dim, 1=lun
  // Lundis et dimanches matins un peu plus durs
  const energyBias = dow === 1 ? -1 : dow === 0 ? -0.5 : 0;

  return {
    date: format(date, "yyyy-MM-dd"),
    energie: clamp(Math.round(2.8 + rng() * 2.2 + energyBias), 1, 5),
    mental: clamp(Math.round(2.5 + rng() * 2.4), 1, 5),
    sommeil: clamp(Math.round(2.5 + rng() * 2.5), 1, 5),
    emotion: pickWeighted(rng, [
      { value: "calme", weight: 4 },
      { value: "curieux", weight: 3 },
      { value: "reflexif", weight: 3 },
      { value: "energique", weight: 2 },
      { value: "inquiet", weight: 3 },
      { value: "endormi", weight: 2 },
    ]) as EmotionId,
    routine: (["eau", "lumiere", "corps", "manger", "dents", "meds"] as RoutineId[]).filter(
      () => rng() > 0.35,
    ),
    intention: INTENTIONS[randInRange(rng, 0, INTENTIONS.length - 1)] ?? INTENTIONS[0]!,
  };
}

function generateEvening(date: Date): EveningEntry {
  const rng = mulberry32(dateSeed(date) + 7);
  const progs: (0 | 1 | 2 | null)[] = [
    pickWeighted(rng, [
      { value: 2, weight: 4 },
      { value: 1, weight: 3 },
      { value: 0, weight: 2 },
      { value: null, weight: 1 },
    ]),
    pickWeighted(rng, [
      { value: 2, weight: 3 },
      { value: 1, weight: 4 },
      { value: 0, weight: 2 },
      { value: null, weight: 1 },
    ]),
    pickWeighted(rng, [
      { value: 2, weight: 2 },
      { value: 1, weight: 3 },
      { value: 0, weight: 4 },
      { value: null, weight: 2 },
    ]),
  ];
  return {
    date: format(date, "yyyy-MM-dd"),
    emotion: pickWeighted(rng, [
      { value: "calme", weight: 4 },
      { value: "fier", weight: 2 },
      { value: "reflexif", weight: 3 },
      { value: "energique", weight: 1 },
      { value: "inquiet", weight: 3 },
      { value: "endormi", weight: 4 },
    ]) as EmotionId,
    prog: [progs[0]!, progs[1]!, progs[2]!],
    lacher: LACHERS[randInRange(rng, 0, LACHERS.length - 1)] ?? LACHERS[0]!,
  };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/* =================================================================
   Entrée publique : produit 90 jours de données + 12 semaines + boussole
   ================================================================= */
export function generateMockData(today = new Date()): MockData {
  const start = startOfDay(today);
  const morningByDate = new Map<string, MorningEntry>();
  const eveningByDate = new Map<string, EveningEntry>();
  const weeks: WeekEntry[] = [];

  // 90 derniers jours, certains "manquants" (skip aléatoire)
  for (let i = 89; i >= 0; i--) {
    const d = subDays(start, i);
    const rng = mulberry32(dateSeed(d) + 31);
    const skipMorning = rng() < 0.08; // 8% des matins non remplis
    const skipEvening = rng() < 0.18; // 18% des soirs non remplis
    if (!skipMorning) {
      const m = generateMorning(d);
      morningByDate.set(m.date, m);
    }
    if (!skipEvening) {
      const e = generateEvening(d);
      eveningByDate.set(e.date, e);
    }
  }

  // 12 dernières semaines (du plus ancien au plus récent)
  for (let w = 11; w >= 0; w--) {
    const monday = subDays(start, w * 7 + ((start.getDay() + 6) % 7));
    const rng = mulberry32(dateSeed(monday) + 99);
    weeks.push({
      weekStart: format(monday, "yyyy-MM-dd"),
      win: WINS[randInRange(rng, 0, WINS.length - 1)] ?? WINS[0]!,
      learn: LEARNS[randInRange(rng, 0, LEARNS.length - 1)] ?? LEARNS[0]!,
      carry: CARRIES[randInRange(rng, 0, CARRIES.length - 1)] ?? CARRIES[0]!,
    });
  }

  return {
    morningByDate,
    eveningByDate,
    weeks,
    compass: {
      values: ["liberte", "lien", "paix"],
      e1: "Reprendre l'écriture hebdomadaire",
      e2: "Dormir avant minuit, vraiment",
      e3: "Une vraie pause à midi, sans écran",
    },
  };
}

/* =================================================================
   Helpers d'agrégation pour les graphiques
   ================================================================= */
export function getMorningsInRange(
  data: MockData,
  from: Date,
  to: Date,
): { date: string; entry: MorningEntry | null }[] {
  const out: { date: string; entry: MorningEntry | null }[] = [];
  let cursor = startOfDay(from);
  const end = startOfDay(to);
  while (cursor <= end) {
    const key = format(cursor, "yyyy-MM-dd");
    out.push({ date: key, entry: data.morningByDate.get(key) ?? null });
    cursor = addDays(cursor, 1);
  }
  return out;
}

export function emotionCountsLastDays(
  data: MockData,
  days: number,
  source: "morning" | "evening",
  today = new Date(),
): Map<EmotionId, number> {
  const counts = new Map<EmotionId, number>();
  for (let i = 0; i < days; i++) {
    const d = format(subDays(startOfDay(today), i), "yyyy-MM-dd");
    const entry = source === "morning" ? data.morningByDate.get(d) : data.eveningByDate.get(d);
    if (entry?.emotion) counts.set(entry.emotion, (counts.get(entry.emotion) ?? 0) + 1);
  }
  return counts;
}
