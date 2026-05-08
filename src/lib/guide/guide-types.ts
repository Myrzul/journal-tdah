export type RubriqueId =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10";

export type SectionId = "intro" | "pratique" | "histoire" | "phases" | "retenir";

export const SECTION_ORDER: SectionId[] = [
  "intro",
  "pratique",
  "histoire",
  "phases",
  "retenir",
];

export const SECTION_LABELS: Record<SectionId, string> = {
  intro: "Repérer & comprendre",
  pratique: "En pratique",
  histoire: "L'histoire de…",
  phases: "Les 4 phases",
  retenir: "À retenir",
};

export const SECTION_SHORT_LABELS: Record<SectionId, string> = {
  intro: "Repérer",
  pratique: "Pratique",
  histoire: "Histoire",
  phases: "Phases",
  retenir: "Retenir",
};

export type RubriqueMeta = {
  id: RubriqueId;
  slug: string;
  /** Eyebrow numéroté (« Rubrique 01 »). */
  eyebrow: string;
  /** Titre court (« S'observer pour se comprendre »). */
  title: string;
  /** Phrase d'accroche pour le sommaire. */
  hook: string;
  /** Variable CSS de la couleur dominante (ex `var(--ch-observer)`). */
  cssColor: string;
  /** Hex correspondant pour les SVG. */
  hex: string;
  /** Statut MVP : true = la rubrique est implémentée, false = à venir. */
  available: boolean;
};

export type SmartObjective = {
  id: string;
  /** Date de création */
  t: number;
  specifique: string;
  mesurable: string;
  atteignable: string;
  realisable: string;
  temporel: string;
  /** Phrase finale formulée (concaténation ou édition libre). */
  formulated: string;
  /** Optionnel : a été marqué comme atteint. */
  achieved?: boolean;
};

export type RubriqueProgress = {
  rubriqueId: RubriqueId;
  /** Sections marquées comme lues. */
  readSections: SectionId[];
  /** Notes personnelles libres, indexées par clé sémantique. */
  notes: Record<string, string>;
  /** État des cases cochées (clés sémantiques → bool). */
  checks: Record<string, boolean>;
  /** Objectifs SMART définis pour cette rubrique. */
  smartObjectives: SmartObjective[];
  /** Date de la première interaction. */
  startedAt?: number;
  /** Date de complétion (toutes sections lues). */
  completedAt?: number;
};

export type GuideStore = {
  /** Indexé par RubriqueId. */
  progress: Partial<Record<RubriqueId, RubriqueProgress>>;
};

export const EMPTY_GUIDE_STORE: GuideStore = { progress: {} };

export const GUIDE_STORAGE = {
  data: "jtdah-guide-v1",
} as const;

export function genObjectiveId(): string {
  return `obj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyRubriqueProgress(rubriqueId: RubriqueId): RubriqueProgress {
  return {
    rubriqueId,
    readSections: [],
    notes: {},
    checks: {},
    smartObjectives: [],
  };
}

/** Pourcentage de progression sur les sections (0..100). */
export function progressPercent(progress: RubriqueProgress | undefined): number {
  if (!progress) return 0;
  return Math.round((progress.readSections.length / SECTION_ORDER.length) * 100);
}
