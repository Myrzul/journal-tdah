export const COHERENCE_PINK = "#FF8AB8";

/** Période d'un cycle respiratoire complet en ms (5s inspire + 5s expire) */
export const CYCLE_PERIOD_MS = 10_000;

/** Durées préréglées pour une session, en secondes */
export const DURATION_PRESETS_SEC: number[] = [180, 300, 600];

export const DEFAULT_DURATION_SEC = 300;

export type CoherenceSession = {
  t: number;
  durationSec: number;
  completedSec: number;
  cycles: number;
};

export const COHERENCE_STORAGE = {
  hist: "jtdah-coherence-hist-v1",
} as const;

/** Format secondes → "MM:SS" */
export function formatMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function formatPresetLabel(sec: number): string {
  const m = Math.round(sec / 60);
  return `${m} min`;
}

export function totalCyclesFor(durationSec: number): number {
  return Math.round((durationSec * 1000) / CYCLE_PERIOD_MS);
}
