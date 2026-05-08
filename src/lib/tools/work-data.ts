export const WORK_MAGENTA = "#FF1F8F";

export type WorkOption = {
  id: string;
  label: string;
  /** Phrase neutre (sans mention TDAH) utilisée dans la synthèse exportable. */
  neutral?: string;
};

/** Difficultés observables — ce que le user remarque dans son travail. */
export const DIFFICULTIES: WorkOption[] = [
  { id: "prioriser", label: "Difficulté à prioriser" },
  { id: "oubli", label: "Oubli de tâches" },
  { id: "sensoriel", label: "Surcharge sensorielle (bruit, passages, écrans)" },
  { id: "documents", label: "Perte ou dispersion de documents" },
  { id: "demarrage", label: "Démarrage difficile sur les tâches" },
  { id: "dispersion", label: "Dispersion / fil de pensée qui saute" },
  { id: "soutien-attention", label: "Difficulté à soutenir l'attention sur la durée" },
  { id: "estimation", label: "Mauvaise estimation du temps des tâches" },
];

/** Stratégies concrètes — clé = id de la difficulté. */
export const STRATEGIES_BY_DIFFICULTY: Record<string, WorkOption[]> = {
  prioriser: [
    { id: "reunion-prio", label: "Court point hebdomadaire « priorités » avec ma hiérarchie" },
    { id: "matrice", label: "Matrice urgent / important affichée" },
  ],
  oubli: [
    { id: "agenda-partage", label: "Tableau mural ou agenda partagé visible" },
    { id: "rappels-prog", label: "Rappels programmés sur téléphone / agenda" },
  ],
  sensoriel: [
    { id: "casque", label: "Casque anti-bruit ou bouchons" },
    { id: "poste-calme", label: "Bureau dans une zone calme" },
  ],
  documents: [
    { id: "bannettes", label: "Bannettes : « urgent », « à faire », « archives »" },
    { id: "code-couleur", label: "Code couleur par projet" },
  ],
  demarrage: [
    { id: "micro-etapes", label: "Découpage en micro-étapes avec deadlines intermédiaires" },
    { id: "demarrage-2min", label: "Engagement minimal : 2 minutes pour démarrer" },
  ],
  dispersion: [
    { id: "consignes-ecrites", label: "Demander les consignes par écrit" },
    { id: "todolist", label: "To-do list visible et limitée à 3 priorités du jour" },
  ],
  "soutien-attention": [
    { id: "pauses", label: "Pauses courtes mais régulières (technique pomodoro adaptée)" },
    { id: "blocs-focus", label: "Blocs de focus protégés (calendrier, mode ne pas déranger)" },
  ],
  estimation: [
    { id: "double-temps", label: "Doubler par défaut le temps que je crois nécessaire" },
    { id: "outil-estim", label: "Utiliser l'outil d'estimation pour calibrer mon biais" },
  ],
};

export const ARRANGEMENTS_TEMPORAL: WorkOption[] = [
  { id: "points-suivi", label: "Points de suivi réguliers (1-2 sem) sur l'avancement" },
  { id: "deadlines-int", label: "Deadlines intermédiaires plutôt qu'un seul rendu final" },
  {
    id: "routine-debut",
    label: "Routine de début de journée : consulter agenda + lister 3 priorités",
  },
  {
    id: "routine-fin",
    label: "Routine de fin de journée : noter les 3 tâches du lendemain",
  },
  { id: "pauses-reg", label: "Pauses courtes mais régulières pour maintenir la concentration" },
];

export const ARRANGEMENTS_COGNITIVE: WorkOption[] = [
  { id: "instructions-ecrit", label: "Instructions par écrit plutôt qu'à l'oral" },
  { id: "objectifs-explicites", label: "Objectifs mesurables et explicites" },
  { id: "decoupage", label: "Découpage des tâches complexes en sous-tâches simples" },
  { id: "feedback-regulier", label: "Feedback constructif régulier (pas qu'annuel)" },
];

export const ARRANGEMENTS_SPATIAL: WorkOption[] = [
  {
    id: "zone-calme",
    label: "Bureau dans une zone calme, éloignée des passages",
    neutral: "Je suis plus productif·ve dans un environnement calme",
  },
  { id: "rangement-visible", label: "Rangement visible : bannettes identifiées, codes couleur" },
  { id: "materiel-visible", label: "Seul le projet en cours sur le bureau" },
  {
    id: "reduction-bruit",
    label: "Réduction du bruit : casque ou bouchons anti-bruit si nécessaire",
    neutral: "J'ai besoin de pouvoir réduire le bruit ambiant pour me concentrer",
  },
  {
    id: "teletravail",
    label: "Télétravail partiel si adapté au poste",
    neutral: "Je suis plus efficace avec une part de télétravail",
  },
];

export const FORMAL_ARRANGEMENTS: WorkOption[] = [
  { id: "horaires-flex", label: "Horaires adaptés ou flexibles" },
  { id: "hybride", label: "Modalités hybrides (télétravail / présentiel)" },
  { id: "pauses-formel", label: "Pauses régulières dans la journée formalisées" },
  { id: "espace-calme", label: "Bureau en espace calme, casque ou bouchons disponibles" },
  { id: "supports-visuels", label: "Supports visuels pour les procédures importantes" },
  { id: "segmentation", label: "Segmentation systématique des grands projets" },
];

export const STRENGTHS: WorkOption[] = [
  { id: "creativite", label: "Créativité, pensée « out of the box »" },
  { id: "adaptabilite", label: "Adaptabilité face aux changements" },
  { id: "reactivite", label: "Réactivité en situation de crise" },
  { id: "hyperfocus", label: "Hyperfocus sur les sujets qui m'intéressent" },
  { id: "energie", label: "Énergie qui dynamise une équipe" },
  { id: "intuition", label: "Intuition, lecture rapide des situations" },
  { id: "empathie", label: "Empathie, sensibilité aux dynamiques relationnelles" },
];

export type WorkPlan = {
  id: string;
  title: string;
  /** Sources de distraction — texte libre court */
  distractionSources: string;

  difficulties: string[]; // ids
  customDifficulty: string;

  strategies: string[]; // ids
  customStrategy: string;

  arrTemporal: string[];
  arrCognitive: string[];
  arrSpatial: string[];
  customArrangement: string;

  formalArrangements: string[];

  strengths: string[];
  customStrength: string;

  notes: string;
  createdAt: number;
  updatedAt: number;
};

export type WorkStore = {
  plans: WorkPlan[];
};

export const EMPTY_WORK_STORE: WorkStore = { plans: [] };

export const WORK_STORAGE = {
  data: "jtdah-work-v1",
} as const;

export function genWorkId(prefix = "wp"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function newEmptyWorkPlan(): WorkPlan {
  const now = Date.now();
  return {
    id: genWorkId(),
    title: "",
    distractionSources: "",
    difficulties: [],
    customDifficulty: "",
    strategies: [],
    customStrategy: "",
    arrTemporal: [],
    arrCognitive: [],
    arrSpatial: [],
    customArrangement: "",
    formalArrangements: [],
    strengths: [],
    customStrength: "",
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function findById<T extends { id: string }>(
  list: T[],
  id: string,
): T | undefined {
  return list.find((x) => x.id === id);
}

export function labelOf(list: WorkOption[], id: string): string {
  return findById(list, id)?.label ?? id;
}

export function neutralOrLabel(list: WorkOption[], id: string): string {
  const found = findById(list, id);
  return found?.neutral ?? found?.label ?? id;
}

/** Stratégies suggérées : agrège celles attachées aux difficultés cochées. */
export function suggestedStrategiesFor(difficulties: string[]): WorkOption[] {
  const out: WorkOption[] = [];
  const seen = new Set<string>();
  for (const d of difficulties) {
    const arr = STRATEGIES_BY_DIFFICULTY[d] ?? [];
    for (const s of arr) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        out.push(s);
      }
    }
  }
  return out;
}
