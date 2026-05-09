import type { RubriqueId } from "@/lib/guide/guide-types";

/** 7 axes du parcours adaptatif (rubriques 02 à 08). */
export type AxisId =
  | "hygiene"
  | "emotions"
  | "attention"
  | "motivation"
  | "temps"
  | "environnement"
  | "interactions";

/** Mapping axe → rubrique correspondante du guide. */
export const AXIS_TO_RUBRIQUE: Record<AxisId, RubriqueId> = {
  hygiene: "02",
  emotions: "03",
  attention: "04",
  motivation: "05",
  temps: "06",
  environnement: "07",
  interactions: "08",
};

export const RUBRIQUE_TO_AXIS: Record<RubriqueId, AxisId | null> = {
  "01": null,
  "02": "hygiene",
  "03": "emotions",
  "04": "attention",
  "05": "motivation",
  "06": "temps",
  "07": "environnement",
  "08": "interactions",
  "09": null,
  "10": null,
};

export const AXIS_LABELS: Record<AxisId, string> = {
  hygiene: "Hygiène de vie",
  emotions: "Émotions & impulsivité",
  attention: "Attention & mémoire",
  motivation: "Motivation & action",
  temps: "Organisation & temps",
  environnement: "Environnement",
  interactions: "Interactions & communication",
};

export const AXIS_HOOKS: Record<AxisId, string> = {
  hygiene: "Sommeil, alimentation, mouvement — la base.",
  emotions: "Apprendre à freiner pour choisir sa réponse.",
  attention: "Protéger, canaliser, soutenir l'attention.",
  motivation: "Démarrer, finir, traverser les coups de mou.",
  temps: "D'un temps subi à un temps choisi.",
  environnement: "Une place pour chaque chose.",
  interactions: "Faire de la place aux autres — et à soi.",
};

/** Score pour 1 axe : 0 = aucun problème, 10 = très saillant. */
export type AxisScores = Record<AxisId, number>;

export type CoachMode = "quick" | "full" | "skipped";

export type CoachProfile = {
  /** Date de création du profil (1ère ouverture coach). */
  createdAt: number;
  /** Date du dernier ajustement. */
  updatedAt: number;
  /** Mode utilisé pour la dernière estimation. */
  mode: CoachMode;
  /** Scores par axe (0..10), résultat du questionnaire. */
  scores: AxisScores;
  /** Parcours adaptatif ordonné des 7 axes (du plus prioritaire au moins). */
  adaptivePath: AxisId[];
  /** Position courante dans le parcours global du guide. */
  currentRubrique: RubriqueId;
  /** Date de la dernière session ouverte. */
  lastSessionAt?: number;
  /** Notes libres saisies en onboarding (optionnel). */
  introNote?: string;
};

export type CoachStore = {
  profile: CoachProfile | null;
};

export const EMPTY_COACH_STORE: CoachStore = { profile: null };

export const COACH_STORAGE = {
  data: "jtdah-coach-v1",
} as const;

/** Crée un profil par défaut (utilisé si l'utilisateur skip l'onboarding). */
export function defaultProfile(): CoachProfile {
  const now = Date.now();
  const neutralScores: AxisScores = {
    hygiene: 5,
    emotions: 5,
    attention: 5,
    motivation: 5,
    temps: 5,
    environnement: 5,
    interactions: 5,
  };
  return {
    createdAt: now,
    updatedAt: now,
    mode: "skipped",
    scores: neutralScores,
    adaptivePath: [
      "emotions",
      "attention",
      "temps",
      "motivation",
      "hygiene",
      "environnement",
      "interactions",
    ],
    currentRubrique: "01",
  };
}

/** Séquence globale du parcours guide adaptatif. */
export function fullPathFromAxes(adaptivePath: AxisId[]): RubriqueId[] {
  return [
    "01",
    ...adaptivePath.map((a) => AXIS_TO_RUBRIQUE[a]),
    "09",
    "10",
  ];
}

/** Renvoie l'index (0-based) de la rubrique courante dans le parcours global. */
export function indexInPath(path: RubriqueId[], current: RubriqueId): number {
  return path.indexOf(current);
}

/** Renvoie la prochaine rubrique du parcours (ou null si terminé). */
export function nextRubriqueInPath(
  path: RubriqueId[],
  current: RubriqueId,
): RubriqueId | null {
  const idx = indexInPath(path, current);
  if (idx < 0 || idx >= path.length - 1) return null;
  return path[idx + 1] ?? null;
}
