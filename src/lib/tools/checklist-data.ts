export const CHECKLIST_GREEN = "#1FBF7A";

export type ChecklistStep = {
  id: string;
  label: string;
};

export type Checklist = {
  id: string;
  title: string;
  whenText: string;
  durationText: string;
  steps: ChecklistStep[];
  attention: string;
  reward: string;
  createdAt: number;
  updatedAt: number;
};

export type ExecLog = {
  t: number;
  checklistId: string;
  completedSteps: string[];
  totalSteps: number;
};

export type RunDraft = {
  checklistId: string;
  startedAt: number;
  completedSteps: string[];
};

export const CHECKLIST_STORAGE = {
  data: "jtdah-checklists-v1",
} as const;

export type ChecklistStore = {
  checklists: Checklist[];
  logs: ExecLog[];
  runDraft: RunDraft | null;
};

export const EMPTY_STORE: ChecklistStore = {
  checklists: [],
  logs: [],
  runDraft: null,
};

export function genId(prefix = "c"): string {
  // ID stable côté client : timestamp + random.
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function newEmptyChecklist(): Checklist {
  const now = Date.now();
  return {
    id: genId("cl"),
    title: "",
    whenText: "",
    durationText: "",
    steps: [{ id: genId("s"), label: "" }],
    attention: "",
    reward: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function morningTemplate(): Checklist {
  const now = Date.now();
  return {
    id: genId("cl"),
    title: "Ma routine du matin",
    whenText: "Au réveil, avant de partir",
    durationText: "45 à 60 min",
    steps: [
      { id: genId("s"), label: "Me lever dès que le réveil sonne" },
      { id: genId("s"), label: "Boire un grand verre d'eau" },
      { id: genId("s"), label: "Prendre mon traitement" },
      { id: genId("s"), label: "Prendre ma douche et m'habiller" },
      { id: genId("s"), label: "Préparer et prendre mon petit-déjeuner" },
      { id: genId("s"), label: "Vérifier mon agenda du jour" },
      { id: genId("s"), label: "Préparer mon sac" },
      { id: genId("s"), label: "Mettre clés, téléphone, portefeuille dans le sac" },
      { id: genId("s"), label: "Regarder la météo et adapter mon vêtement" },
      { id: genId("s"), label: "Partir à l'heure prévue (5 min de marge incluses)" },
    ],
    attention:
      "Préparer la veille mes vêtements et la vaisselle du petit-déj.\nMettre mon sac près de la porte la veille au soir.\nRégler plusieurs alarmes si j'ai du mal à me lever.",
    reward:
      "Un café/thé que je prends le temps d'apprécier ; une émission ou une playlist que j'ai le temps d'écouter.",
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Renvoie la liste des 7 derniers jours (du plus ancien au plus récent),
 * avec un booléen indiquant si la checklist a été complétée ce jour-là.
 *
 * Une "complétion" = un ExecLog avec completedSteps.length === totalSteps.
 */
export function lastSevenDays(
  logs: ExecLog[],
  checklistId: string,
  now: number = Date.now(),
): { date: Date; isoDay: string; done: boolean }[] {
  const completedDays = new Set<string>();
  for (const log of logs) {
    if (log.checklistId !== checklistId) continue;
    if (log.completedSteps.length < log.totalSteps) continue;
    const d = new Date(log.t);
    completedDays.add(toIsoDay(d));
  }
  const days: { date: Date; isoDay: string; done: boolean }[] = [];
  const today = new Date(now);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const iso = toIsoDay(d);
    days.push({ date: d, isoDay: iso, done: completedDays.has(iso) });
  }
  return days;
}

function toIsoDay(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const DAY_INITIALS = ["L", "M", "M", "J", "V", "S", "D"] as const;

export function dayInitial(d: Date): string {
  // 0 = Sun, 1 = Mon ... → on convertit en index 0..6 où Lun=0
  const js = d.getDay();
  const idx = js === 0 ? 6 : js - 1;
  return DAY_INITIALS[idx] ?? "";
}
