import type { AxisId } from "./coach-types";

export type QuickAnswer = 0 | 1 | 2 | 3;

export const ANSWER_LABELS: Record<QuickAnswer, string> = {
  0: "Jamais",
  1: "Parfois",
  2: "Souvent",
  3: "Très souvent",
};

export type QuickQuestion = {
  id: string;
  axis: AxisId;
  /** Texte de la question (à la 1re personne). */
  text: string;
  /** Indice optionnel, plus discret. */
  hint?: string;
};

/**
 * Mode rapide : 7 questions (1 par axe). Score 0..3 par question, ramené à 0..10.
 * L'idée n'est PAS d'être diagnostique — juste de classer les axes par saillance
 * pour personnaliser le parcours. Le mode complet (auto-évaluation TDAH 68 questions)
 * reste disponible pour qui veut.
 */
export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: "q-hygiene",
    axis: "hygiene",
    text: "Mon sommeil, mon alimentation ou mon activité physique sont irréguliers et m'épuisent.",
    hint: "Sommeil court, repas sautés, peu de mouvement, conduites compensatoires…",
  },
  {
    id: "q-emotions",
    axis: "emotions",
    text: "Mes émotions montent vite et fort, j'ai du mal à les contrôler avant qu'elles ne débordent.",
    hint: "Colère, stress, larmes, achats impulsifs, paroles regrettées…",
  },
  {
    id: "q-attention",
    axis: "attention",
    text: "Je perds le fil d'une conversation, d'un texte ou d'une tâche dès que c'est long ou peu stimulant.",
    hint: "Décrochages, étourderies, oublis, mémoire de travail saturée…",
  },
  {
    id: "q-motivation",
    axis: "motivation",
    text: "Je remets souvent à plus tard, j'ai besoin d'urgence pour démarrer, je termine peu de projets.",
    hint: "Procrastination, démarrage difficile, mille projets jamais finis…",
  },
  {
    id: "q-temps",
    axis: "temps",
    text: "Je sous-estime régulièrement le temps des choses, je suis souvent en retard ou hors délai.",
    hint: "Trajets sous-estimés, échéances ratées, sentiment de courir après le temps…",
  },
  {
    id: "q-environnement",
    axis: "environnement",
    text: "Mon espace est encombré, je perds mes affaires, l'environnement bruyant ou stimulant me déconcentre vite.",
    hint: "Bureau en désordre, clés perdues, sensibilité aux bruits / lumière…",
  },
  {
    id: "q-interactions",
    axis: "interactions",
    text: "J'ai des tensions ou malentendus dans mes interactions : couper la parole, mal décoder l'autre, perdre le fil…",
    hint: "Conflits familiaux, difficultés au travail, isolement, fatigue sociale…",
  },
];

/** Convertit un Record<questionId, QuickAnswer> en Record<axe, score 0..10>. */
export function quickAnswersToScores(
  answers: Record<string, QuickAnswer>,
): Record<AxisId, number> {
  const scores: Record<AxisId, number> = {
    hygiene: 5,
    emotions: 5,
    attention: 5,
    motivation: 5,
    temps: 5,
    environnement: 5,
    interactions: 5,
  };
  for (const q of QUICK_QUESTIONS) {
    const a = answers[q.id];
    if (a == null) continue;
    // 0 → 0, 1 → 3, 2 → 7, 3 → 10
    const mapped = a === 0 ? 0 : a === 1 ? 3 : a === 2 ? 7 : 10;
    scores[q.axis] = mapped;
  }
  return scores;
}
