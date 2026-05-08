export const SCAN_PINK = "#FF8AB8";

export type ZoneId =
  | "tete"
  | "visage"
  | "gorge"
  | "epaules"
  | "bras"
  | "ventre"
  | "dos"
  | "jambes";

export type ZoneState = "tendu" | "neutre" | "detendu";

export type Zone = {
  id: ZoneId;
  label: string;
  sub: string;
};

export const ZONES: Zone[] = [
  { id: "tete", label: "Tête", sub: "Cuir chevelu, tempes" },
  { id: "visage", label: "Visage", sub: "Front, yeux, mâchoire" },
  { id: "gorge", label: "Gorge / nuque", sub: "La charnière" },
  { id: "epaules", label: "Épaules", sub: "Le souffle haut" },
  { id: "bras", label: "Bras / mains", sub: "Les outils du jour" },
  { id: "ventre", label: "Ventre", sub: "Le centre" },
  { id: "dos", label: "Dos / lombaires", sub: "Le porteur silencieux" },
  { id: "jambes", label: "Jambes / pieds", sub: "Les racines" },
];

export const STATES: Record<
  ZoneState,
  { color: string; label: string; word: string; hint: string }
> = {
  tendu: {
    color: "#E8294E",
    label: "TENDU",
    word: "tendue",
    hint: "crispé · serré · brûlant",
  },
  neutre: {
    color: "#FAF7F2",
    label: "NEUTRE",
    word: "neutre",
    hint: "présent, sans plus",
  },
  detendu: {
    color: "#4DD0B0",
    label: "DÉTENDU",
    word: "détendue",
    hint: "tiède · relâché · ample",
  },
};

export type PhaseId =
  | "amorce"
  | "global"
  | "balayage"
  | "emotions"
  | "ancrage"
  | "retour"
  | "notation";

export type Phase = {
  id: PhaseId;
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  label: string;
  title: string;
  sub: string;
};

export const PHASES: Phase[] = [
  {
    id: "amorce",
    n: 1,
    label: "Amorce",
    title: "Cinq respirations",
    sub: "On pose le rythme. La fleur s'ouvre quand tu inspires, se ferme quand tu expires.",
  },
  {
    id: "global",
    n: 2,
    label: "Présence",
    title: "Conscience globale",
    sub: "Sans détailler. Le corps comme un seul tenant. Son poids, sa température, sa présence.",
  },
  {
    id: "balayage",
    n: 3,
    label: "Balayage",
    title: "Huit régions",
    sub: "Une par une. Tu poses l'attention, tu remarques, tu glisses vers la suivante. Pas d'analyse.",
  },
  {
    id: "emotions",
    n: 4,
    label: "Accueil",
    title: "Émotions présentes",
    sub: "Si une émotion vient, elle peut être là. Tu la nommes ou pas. Tu ne la résous pas.",
  },
  {
    id: "ancrage",
    n: 5,
    label: "Ancrage",
    title: "Le contact",
    sub: "Le poids dans le siège ou les pieds dans le sol. La gravité est ton alliée silencieuse.",
  },
  {
    id: "retour",
    n: 6,
    label: "Retour",
    title: "Doucement",
    sub: "Tu reviens. Pas d'à-coups. Bouge un doigt, un pied. Le monde est encore là.",
  },
  {
    id: "notation",
    n: 7,
    label: "Trace",
    title: "Si tu veux",
    sub: "Un mot. Une sensation. Une émotion. Ou rien — c'est aussi une réponse.",
  },
];

export type ScanStates = Partial<Record<ZoneId, ZoneState>>;

export type ScanHistoryEntry = {
  t: number;
  word: string;
  emotion: string;
  emoChips: string[];
  states: ScanStates;
  cycles: number;
  duration: number;
  tally: { tendu: number; neutre: number; detendu: number };
};

export type ScanDraft = {
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  states: ScanStates;
  zoneIdx: number;
  emotion: string;
  emoChips: string[];
  globalNoticed: boolean;
  grounded: boolean;
  returnSteps: string[];
  outWord: string;
  startedAt: number | null;
};

export const EMPTY_DRAFT: ScanDraft = {
  phase: 0,
  states: {},
  zoneIdx: 0,
  emotion: "",
  emoChips: [],
  globalNoticed: false,
  grounded: false,
  returnSteps: [],
  outWord: "",
  startedAt: null,
};

export const SCAN_STORAGE = {
  draft: "jtdah-scan-draft-v1",
  hist: "jtdah-scan-hist-v1",
} as const;

export const EMO_CHIPS: string[] = [
  "tristesse",
  "colère",
  "peur",
  "joie",
  "calme",
  "agitation",
  "lassitude",
  "tendresse",
  "vide",
  "dégoût",
  "fierté",
  "rien de net",
];

export const RETURN_STEPS: { id: string; label: string }[] = [
  { id: "doigt", label: "Bouger un doigt" },
  { id: "pied", label: "Bouger un pied" },
  { id: "epaul", label: "Rouler les épaules" },
  { id: "oeil", label: "Ouvrir les yeux (si fermés)" },
];
