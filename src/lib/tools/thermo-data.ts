import type { MonsterName } from "@/components/monsters";

export type LevelN = 1 | 2 | 3 | 4 | 5;

export type LevelDef = {
  n: LevelN;
  label: string;
  sublabel: string;
  cog: string;
  /** couleur du mercure / fond */
  color: string;
  /** mots qui accompagnent l'état */
  cluster: readonly string[];
  /** mascotte associée */
  monster: MonsterName;
  /** propose-t-on de la respiration ? */
  breath: boolean;
};

export const LEVELS: readonly LevelDef[] = [
  {
    n: 1,
    label: "CALME",
    sublabel: "Régulé·e",
    cog: "Je peux réfléchir, décider, m'exprimer clairement.",
    color: "#4DD0B0",
    cluster: ["serein", "posé", "présent", "ouvert", "disponible"],
    monster: "Calme",
    breath: false,
  },
  {
    n: 2,
    label: "ATTENTIF",
    sublabel: "Vigilant·e",
    cog: "Je peux encore réfléchir, mais quelque chose me sollicite.",
    color: "#1B4FE5",
    cluster: ["concentré", "alerte", "curieux", "engagé", "tension légère"],
    monster: "Curieux",
    breath: false,
  },
  {
    n: 3,
    label: "ACTIVÉ",
    sublabel: "Sous tension",
    cog: "Ma réflexion est impactée. Mes pensées s'accélèrent ou se brouillent.",
    color: "#B05BC9",
    cluster: ["agité", "anxieux", "frustré", "dispersé", "irritable"],
    monster: "Inquiet",
    breath: true,
  },
  {
    n: 4,
    label: "DÉBORDÉ",
    sublabel: "Submergé·e",
    cog: "J'ai du mal à penser clairement. Mon corps prend le dessus.",
    color: "#7C8A99",
    cluster: ["panique", "colère", "abattu", "honte", "dissocié"],
    monster: "Surprise",
    breath: true,
  },
  {
    n: 5,
    label: "STOP",
    sublabel: "Surcharge / crise",
    cog: "Penser n'est plus possible maintenant. C'est un signal, pas un échec.",
    color: "#2A2A33",
    cluster: ["sidéré", "submergé", "à bout", "immobile", "envie de fuir"],
    monster: "Endormi",
    breath: true,
  },
] as const;

export const LEVEL_BY_N = Object.fromEntries(LEVELS.map((l) => [l.n, l])) as Record<
  LevelN,
  LevelDef
>;

export type Strategy = {
  id: string;
  label: string;
};

/** Stratégies différenciées par niveau (escalade graduée vers le bas-régime) */
export const STRATEGIES: Record<LevelN, readonly Strategy[]> = {
  1: [
    { id: "note", label: "Noter ce qui va bien" },
    { id: "air", label: "Une marche tranquille" },
    { id: "lire", label: "Lire 10 min" },
    { id: "autre", label: "Profiter, simplement" },
  ],
  2: [
    { id: "pause", label: "Pause 2 min loin de l'écran" },
    { id: "eau", label: "Boire un grand verre d'eau" },
    { id: "liste", label: "Écrire ce qui me sollicite" },
    { id: "one", label: "Choisir UNE seule tâche" },
  ],
  3: [
    { id: "breath", label: "Cohérence cardiaque 3 min" },
    { id: "sortie", label: "Sortir 10 min, air, lumière" },
    { id: "corps", label: "Bouger : 20 jumping jacks" },
    { id: "froid", label: "Eau froide sur le visage" },
    { id: "voix", label: "Appeler un proche fiable" },
  ],
  4: [
    { id: "stop", label: "Tout arrêter, vraiment" },
    { id: "breath", label: "Respiration 4-7-8 (5 cycles)" },
    { id: "glace", label: "Glaçon dans la main 30 sec" },
    { id: "cocon", label: "Lieu calme, peu de stimulus" },
    { id: "voix", label: "Parler à quelqu'un de confiance" },
  ],
  5: [
    { id: "stop", label: "Mettre tout en pause" },
    { id: "sec", label: "Mise en sécurité physique" },
    { id: "aide", label: "Demander de l'aide MAINTENANT" },
    { id: "3114", label: "Appeler le 3114 (gratuit, 24/7)" },
  ],
} as const;

/** Prompts du TriggerGuide ("Avant ça je…") */
export const TRIGGER_PROMPTS: readonly string[] = [
  "Avant ça, j'étais en train de…",
  "Quelqu'un a dit ou fait…",
  "Mon corps signalait déjà…",
  "Je n'avais pas dormi / mangé / pausé…",
  "Une pensée tournait :…",
] as const;

/** Une observation enregistrée (historique local) */
export type ThermoObservation = {
  /** epoch ms */
  t: number;
  level: LevelN;
  body: string;
  trigger: string;
  coping: string;
};
