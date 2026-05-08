/**
 * Persistance localStorage pour l'auto-évaluation.
 *
 *  - jtdah-eval-current : session en cours (réponses partielles, index de section)
 *  - jtdah-eval-history : historique des évaluations terminées (max 60)
 */

import { computeScores, type EvalAnswers, type EvalScores } from "./eval-data";

const CURRENT_KEY = "jtdah-eval-current";
const HISTORY_KEY = "jtdah-eval-history";

export type CurrentEval = {
  /** Index de la section courante dans la liste à plat (0..11) */
  sectionIndex: number;
  answers: EvalAnswers;
  /** Timestamp ms — dernier auto-save */
  updatedAt: number;
  /** Timestamp ms — début de la session */
  startedAt: number;
};

export type EvalRecord = {
  /** ISO date du remplissage (YYYY-MM-DDTHH:mm:ss.sssZ) */
  date: string;
  answers: EvalAnswers;
  scores: EvalScores;
};

/* =========================================================
   Helpers safe (côté client uniquement, gracieux si SSR)
   ========================================================= */
function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string): T | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage plein ou désactivé — silent fail
  }
}

function removeKey(key: string): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/* =========================================================
   Session en cours (reprise possible)
   ========================================================= */
export function loadCurrent(): CurrentEval | null {
  return readJson<CurrentEval>(CURRENT_KEY);
}

export function saveCurrent(state: Pick<CurrentEval, "sectionIndex" | "answers"> & { startedAt?: number }): void {
  const existing = loadCurrent();
  const startedAt = state.startedAt ?? existing?.startedAt ?? Date.now();
  const next: CurrentEval = {
    sectionIndex: state.sectionIndex,
    answers: state.answers,
    updatedAt: Date.now(),
    startedAt,
  };
  writeJson(CURRENT_KEY, next);
}

export function clearCurrent(): void {
  removeKey(CURRENT_KEY);
}

/* =========================================================
   Historique des évaluations terminées
   ========================================================= */
export function loadHistory(): EvalRecord[] {
  return readJson<EvalRecord[]>(HISTORY_KEY) ?? [];
}

/** Finalise une session : calcule les scores, archive, et nettoie le current. */
export function finalizeEvaluation(answers: EvalAnswers): EvalRecord {
  const record: EvalRecord = {
    date: new Date().toISOString(),
    answers,
    scores: computeScores(answers),
  };
  const history = loadHistory();
  history.push(record);
  // Garde les 60 dernières (5 ans à raison de tous les 3 mois)
  const trimmed = history.slice(-60);
  writeJson(HISTORY_KEY, trimmed);
  clearCurrent();
  return record;
}

/** Date de la dernière évaluation terminée, ou null si aucune. */
export function lastEvaluationDate(): Date | null {
  const history = loadHistory();
  const last = history[history.length - 1];
  if (!last) return null;
  return new Date(last.date);
}

/** Nombre de jours depuis la dernière évaluation, ou null. */
export function daysSinceLastEvaluation(): number | null {
  const last = lastEvaluationDate();
  if (!last) return null;
  const diff = Date.now() - last.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
