export const EMO_PINK = "#FF8AB8";

export type Quadrant = "he-p" | "be-p" | "he-d" | "be-d";

export type FamilyKey =
  | "joie"
  | "tristesse"
  | "colere"
  | "peur"
  | "degout"
  | "surprise";

export type EmotionEntry = {
  label: string;
  q: Quadrant;
  nuances: readonly string[];
};

export type Family = {
  label: string;
  color: string;
  sym: string;
  bodyHints: string;
  emotions: Record<string, EmotionEntry>;
};

export const FAMILIES: Record<FamilyKey, Family> = {
  joie: {
    label: "Joie",
    color: "#F5C24D",
    sym: "☀",
    bodyHints: "tiède · ample · poitrine ouverte · ralenti agréable",
    emotions: {
      sereine: {
        label: "Sereine",
        q: "be-p",
        nuances: ["paisible", "tranquille", "apaisé", "en paix", "détendu", "serein", "reposé"],
      },
      joyeuse: {
        label: "Joyeuse",
        q: "he-p",
        nuances: ["heureux", "content", "joyeux", "ravi", "enjoué", "réjoui", "gai"],
      },
      vibrante: {
        label: "Vibrante",
        q: "he-p",
        nuances: [
          "enthousiaste",
          "exalté",
          "électrisé",
          "euphorique",
          "transporté",
          "exubérant",
          "pétillant",
        ],
      },
      tendre: {
        label: "Tendre",
        q: "be-p",
        nuances: [
          "ému",
          "touché",
          "attendri",
          "reconnaissant",
          "comblé",
          "aimant",
          "accueillant",
        ],
      },
      fiere: {
        label: "Fière",
        q: "he-p",
        nuances: ["satisfait", "fier", "accompli", "valorisé", "confiant", "légitime", "digne"],
      },
      curieuse: {
        label: "Curieuse",
        q: "he-p",
        nuances: [
          "intéressé",
          "intrigué",
          "captivé",
          "émerveillé",
          "fasciné",
          "inspiré",
          "attentif",
        ],
      },
    },
  },
  tristesse: {
    label: "Tristesse",
    color: "#5B7FB8",
    sym: "☂",
    bodyHints: "lourd · creux dans la poitrine · gorge serrée · larmes proches",
    emotions: {
      melancolique: {
        label: "Mélancolique",
        q: "be-d",
        nuances: ["nostalgique", "mélancolique", "songeur", "rêveur", "pensif", "rétroactif"],
      },
      affligee: {
        label: "Affligée",
        q: "be-d",
        nuances: ["triste", "attristé", "peiné", "chagriné", "navré", "éploré"],
      },
      desespoir: {
        label: "Désespérée",
        q: "be-d",
        nuances: ["désespéré", "anéanti", "brisé", "abattu", "effondré", "dévasté"],
      },
      solitaire: {
        label: "Solitaire",
        q: "be-d",
        nuances: ["seul", "isolé", "abandonné", "délaissé", "exclu", "incompris"],
      },
      decue: {
        label: "Déçue",
        q: "be-d",
        nuances: ["déçu", "désenchanté", "désillusionné", "dépité", "résigné"],
      },
      vide: {
        label: "Vidée",
        q: "be-d",
        nuances: ["vidé", "las", "blasé", "éteint", "apathique", "engourdi", "éreinté"],
      },
    },
  },
  colere: {
    label: "Colère",
    color: "#E8294E",
    sym: "⚡",
    bodyHints: "chaud · monté dans la tête · mâchoire serrée · poings · poitrine bombée",
    emotions: {
      irritee: {
        label: "Irritée",
        q: "he-d",
        nuances: ["irrité", "agacé", "contrarié", "énervé", "gêné", "crispé"],
      },
      frustree: {
        label: "Frustrée",
        q: "he-d",
        nuances: ["frustré", "exaspéré", "à bout", "impuissant", "bloqué", "contraint"],
      },
      indignee: {
        label: "Indignée",
        q: "he-d",
        nuances: ["révolté", "indigné", "scandalisé", "outré", "en colère", "offensé"],
      },
      furieuse: {
        label: "Furieuse",
        q: "he-d",
        nuances: ["furieux", "enragé", "hors de soi", "fou de rage", "déchaîné", "explosé"],
      },
      amere: {
        label: "Amère",
        q: "be-d",
        nuances: ["aigri", "rancunier", "amer", "jaloux", "envieux", "vexé"],
      },
      mefiante: {
        label: "Méfiante",
        q: "he-d",
        nuances: ["méfiant", "suspicieux", "sur la défensive", "sceptique", "dubitatif"],
      },
    },
  },
  peur: {
    label: "Peur",
    color: "#9B6BD9",
    sym: "◈",
    bodyHints: "froid · ventre qui se contracte · souffle court · pulsations · tremblements",
    emotions: {
      inquiete: {
        label: "Inquiète",
        q: "he-d",
        nuances: ["inquiet", "soucieux", "préoccupé", "tracassé", "tendu"],
      },
      anxieuse: {
        label: "Anxieuse",
        q: "he-d",
        nuances: [
          "anxieux",
          "angoissé",
          "oppressé",
          "stressé",
          "nerveux",
          "sur les nerfs",
        ],
      },
      apeuree: {
        label: "Apeurée",
        q: "he-d",
        nuances: ["effrayé", "apeuré", "alarmé", "terrorisé", "paralysé", "panique"],
      },
      insecure: {
        label: "Insécure",
        q: "be-d",
        nuances: ["vulnérable", "fragile", "sans défense", "exposé", "démuni", "perdu"],
      },
      honteuse: {
        label: "Honteuse",
        q: "be-d",
        nuances: ["honteux", "embarrassé", "gêné", "mal à l'aise", "humilié", "rougi"],
      },
      coupable: {
        label: "Coupable",
        q: "be-d",
        nuances: ["coupable", "fautif", "en faute", "regrettant", "remords", "condamné"],
      },
    },
  },
  degout: {
    label: "Dégoût",
    color: "#3FA77A",
    sym: "☣",
    bodyHints: "lèvres serrées · nausée légère · recul · grimace",
    emotions: {
      reticente: {
        label: "Réticente",
        q: "be-d",
        nuances: ["réticent", "hésitant", "peu enclin", "sceptique", "partagé"],
      },
      aversive: {
        label: "Aversive",
        q: "he-d",
        nuances: ["dégoûté", "écœuré", "repoussé", "rebuté", "révulsé"],
      },
      meprisante: {
        label: "Méprisante",
        q: "he-d",
        nuances: ["méprisant", "dédaigneux", "hautain", "condescendant", "distant"],
      },
      saturee: {
        label: "Saturée",
        q: "be-d",
        nuances: ["saturé", "écœuré", "lassé", "blasé", "overdosé", "plein"],
      },
    },
  },
  surprise: {
    label: "Surprise",
    color: "#F26B2C",
    sym: "✦",
    bodyHints: "sursaut · souffle suspendu · yeux ouverts · pulsation soudaine",
    emotions: {
      etonnee: {
        label: "Étonnée",
        q: "he-p",
        nuances: ["surpris", "curieux", "étonné", "interrogatif", "attentif"],
      },
      intriguee: {
        label: "Intriguée",
        q: "he-p",
        nuances: [
          "intrigué",
          "perplexe",
          "déconcerté",
          "interloqué",
          "interrogateur",
        ],
      },
      bouleversee: {
        label: "Bouleversée",
        q: "he-d",
        nuances: [
          "bouleversé",
          "choqué",
          "sidéré",
          "abasourdi",
          "stupéfait",
          "désarçonné",
        ],
      },
      emerveillee: {
        label: "Émerveillée",
        q: "he-p",
        nuances: [
          "émerveillé",
          "ébahi",
          "ébloui",
          "subjugué",
          "transporté",
          "enchanté",
        ],
      },
    },
  },
};

export const FAM_KEYS: FamilyKey[] = [
  "joie",
  "tristesse",
  "colere",
  "peur",
  "degout",
  "surprise",
];

export const QUADRANT_FAMS: Record<Quadrant, FamilyKey[]> = {
  "he-p": ["joie", "surprise"],
  "be-p": ["joie"],
  "he-d": ["colere", "peur", "surprise"],
  "be-d": ["tristesse", "peur", "degout"],
};

export type EmotionPhase =
  | "porte"
  | "boussole"
  | "famille"
  | "emotion"
  | "mot"
  | "couches"
  | "trace";

export const PHASE_ORDER: Exclude<EmotionPhase, "porte">[] = [
  "boussole",
  "famille",
  "emotion",
  "mot",
  "couches",
  "trace",
];

export const PHASE_LABELS: Record<Exclude<EmotionPhase, "porte">, string> = {
  boussole: "Boussole",
  famille: "Famille",
  emotion: "Émotion",
  mot: "Mot",
  couches: "Examen",
  trace: "Trace",
};

export type EmotionDraft = {
  phase: EmotionPhase;
  point?: { x: number; y: number };
  suggestedFams?: FamilyKey[];
  family?: FamilyKey;
  emotion?: string;
  nuance?: string | null;
  customWord?: string;
  intens?: number | null;
  declench?: string;
  pensee?: string;
  corps?: string;
  fonction?: string;
  defusion?: string;
  acceptation?: string;
};

export const EMPTY_EMOTION_DRAFT: EmotionDraft = { phase: "porte" };

export type EmotionHistoryEntry = {
  t: number;
  family: FamilyKey;
  emotion?: string;
  nuance?: string | null;
  customWord?: string;
  intens?: number | null;
  hasDeepened: boolean;
};

export const EMOTIONS_STORAGE = {
  draft: "jtdah-emotions-draft-v1",
  hist: "jtdah-emotions-hist-v1",
} as const;

export type InconnuAnswers = {
  energie?: "haute" | "basse" | "mixte";
  plaisir?: "plaisant" | "penible" | "neutre";
  mouvement?: "approche" | "retrait" | "repousse" | "fige";
};

export function resolveInconnu(a: Required<InconnuAnswers>): {
  quadrant: Quadrant;
  fams: FamilyKey[];
  point: { x: number; y: number };
} {
  const he = a.energie === "haute" || a.energie === "mixte";
  const p = a.plaisir === "plaisant";
  const quadrant = `${he ? "he" : "be"}-${p ? "p" : "d"}` as Quadrant;
  let fams: FamilyKey[] = [...QUADRANT_FAMS[quadrant]];
  if (a.mouvement === "repousse" && !fams.includes("degout")) {
    fams = ["colere", "degout", ...fams];
  }
  if (a.mouvement === "retrait" && !fams.includes("peur")) {
    fams = ["peur", ...fams];
  }
  if (a.mouvement === "approche") {
    fams = fams.filter((f) => f !== "tristesse");
  }
  if (a.mouvement === "fige") {
    fams = ["peur", "tristesse", ...fams];
  }
  fams = Array.from(new Set(fams));
  return {
    quadrant,
    fams,
    point: { x: p ? 0.75 : 0.25, y: he ? 0.25 : 0.75 },
  };
}
