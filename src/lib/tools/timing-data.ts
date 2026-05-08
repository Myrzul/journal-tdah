export const TIMING_ORANGE = "#F26B2C";

export const TIMING_PRESETS_MIN: number[] = [5, 15, 30, 60];

export const TASK_PLACEHOLDERS: string[] = [
  "Répondre à 3 mails",
  "Ranger la cuisine",
  "Préparer la séance de demain",
  "Faire ma déclaration en ligne",
  "Appeler la sécu",
  "Trier la pile sur le bureau",
];

export const FORGOTTEN_THRESHOLD_MS = 4 * 60 * 60 * 1000; // 4h

export type TimingDraft = {
  task: string;
  estimateMin: number | null;
  startedAt: number | null;
};

export const EMPTY_TIMING_DRAFT: TimingDraft = {
  task: "",
  estimateMin: null,
  startedAt: null,
};

export type TimingEntry = {
  t: number;
  task: string;
  estimateMin: number;
  realSec: number;
  note?: string;
};

export const TIMING_STORAGE = {
  draft: "jtdah-timing-draft-v1",
  hist: "jtdah-timing-hist-v1",
} as const;

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  if (total < 60) return `${total} s`;
  const minutes = Math.round(total / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest.toString().padStart(2, "0")}`;
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m.toString().padStart(2, "0")}`;
}

export function formatGap(estimateMin: number, realSec: number): {
  gapMin: number;
  sign: "over" | "under" | "equal";
  text: string;
} {
  const realMin = realSec / 60;
  const gapMinFloat = realMin - estimateMin;
  const gapMin = Math.round(gapMinFloat);
  if (Math.abs(gapMin) < 1) {
    return { gapMin: 0, sign: "equal", text: "Tout pile" };
  }
  if (gapMin > 0) {
    return {
      gapMin,
      sign: "under",
      text: `+${formatMinutes(gapMin)} de plus que prévu`,
    };
  }
  return {
    gapMin,
    sign: "over",
    text: `${formatMinutes(Math.abs(gapMin))} de moins que prévu`,
  };
}

export function averageGapMinutes(hist: TimingEntry[]): number | null {
  if (hist.length < 3) return null;
  const sumGap = hist.reduce(
    (acc, h) => acc + (h.realSec / 60 - h.estimateMin),
    0,
  );
  return sumGap / hist.length;
}
