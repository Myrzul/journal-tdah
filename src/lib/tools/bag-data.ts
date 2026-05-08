export const BAG_YELLOW = "#F0B340";

export type BagItem = {
  id: string;
  label: string;
};

export type BagCategoryKind =
  | "essentiels"
  | "vetements"
  | "hygiene"
  | "tech"
  | "sante"
  | "autres";

export type BagCategory = {
  id: string;
  kind: BagCategoryKind;
  label: string;
  items: BagItem[];
};

export type Bag = {
  id: string;
  title: string;
  description: string;
  categories: BagCategory[];
  /** Items du bloc « Vérification finale » — checklist secondaire de validation. */
  finalChecks: BagItem[];
  /** Astuces/notes libres associées à ce sac. */
  tips: string;
  createdAt: number;
  updatedAt: number;
};

export type BagPrepLog = {
  t: number;
  bagId: string;
  checkedItems: string[];
  finalChecks: string[];
  totalItems: number;
  totalFinal: number;
};

export type BagPrepDraft = {
  bagId: string;
  startedAt: number;
  checkedItems: string[];
  finalChecks: string[];
};

export type BagStore = {
  bags: Bag[];
  logs: BagPrepLog[];
  prep: BagPrepDraft | null;
};

export const EMPTY_BAG_STORE: BagStore = {
  bags: [],
  logs: [],
  prep: null,
};

export const BAG_STORAGE = {
  data: "jtdah-bags-v1",
} as const;

export const CATEGORY_LABELS: Record<BagCategoryKind, string> = {
  essentiels: "Essentiels",
  vetements: "Vêtements / accessoires",
  hygiene: "Hygiène / confort",
  tech: "Technologie & documents",
  sante: "Santé / confort",
  autres: "Autres",
};

export const CATEGORY_KINDS: BagCategoryKind[] = [
  "essentiels",
  "vetements",
  "hygiene",
  "tech",
  "sante",
  "autres",
];

export function genBagId(prefix = "bag"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function newCategory(kind: BagCategoryKind, items: string[]): BagCategory {
  return {
    id: genBagId("cat"),
    kind,
    label: CATEGORY_LABELS[kind],
    items: items.map((label) => ({ id: genBagId("it"), label })),
  };
}

function newFinalChecks(labels: string[]): BagItem[] {
  return labels.map((label) => ({ id: genBagId("fc"), label }));
}

const ESSENTIELS_BASE = [
  "Carte d'identité",
  "Clés",
  "Permis / Carte de transport",
  "Téléphone",
  "Chargeur / batterie",
  "Portefeuille / CB",
  "Traitement",
];

const FINAL_CHECKS_BASE = [
  "J'ai vérifié toute la liste",
  "J'ai mes clés, papiers, téléphone, paiement",
  "Je sais où je vais et comment y aller",
  "J'ai vérifié les horaires",
];

export function newEmptyBag(): Bag {
  const now = Date.now();
  return {
    id: genBagId(),
    title: "",
    description: "",
    categories: [
      newCategory("essentiels", [...ESSENTIELS_BASE]),
      newCategory("vetements", []),
      newCategory("hygiene", []),
      newCategory("tech", []),
    ],
    finalChecks: newFinalChecks(FINAL_CHECKS_BASE),
    tips: "Préparer ce sac la veille au soir.\nPrendre une photo du sac préparé comme référence visuelle.",
    createdAt: now,
    updatedAt: now,
  };
}

export function sportTemplate(): Bag {
  const now = Date.now();
  return {
    id: genBagId(),
    title: "Sac de sport",
    description: "Pour la salle ou les séances en extérieur.",
    categories: [
      newCategory("essentiels", [
        "Carte de membre / badge d'accès",
        "Gourde d'eau (remplie)",
        "Serviette",
        "Téléphone (musique / minuteur)",
      ]),
      newCategory("vetements", [
        "Tenue de sport complète (haut, bas)",
        "Sous-vêtements de rechange",
        "Chaussettes de sport",
        "Baskets ou chaussures adaptées",
        "Vêtements de rechange (après douche)",
        "Sac plastique (vêtements sales)",
      ]),
      newCategory("hygiene", [
        "Gel douche / savon",
        "Shampooing",
        "Déodorant",
        "Serviette de bain",
        "Tongs (douches communes)",
        "Élastiques à cheveux",
      ]),
      newCategory("tech", [
        "Écouteurs / casque",
        "Chargeur de téléphone (si séance longue)",
        "Programme d'entraînement",
      ]),
      newCategory("autres", [
        "Cadenas pour le casier",
        "Collation post-entraînement",
        "Gants de sport",
        "Médicaments (si prise pendant la journée)",
      ]),
    ],
    finalChecks: newFinalChecks([
      "J'ai vérifié toute la liste",
      "Mon sac est prêt, fermé",
      "J'ai mes clés, téléphone, portefeuille",
      "Je sais où je vais et comment y aller",
      "J'ai vérifié les horaires de la salle",
    ]),
    tips: "Garde un kit hygiène permanent dans ton sac, recharge-le 1× par mois.\nRecharge ton sac immédiatement après chaque séance.\nLaisse ton sac dans un endroit fixe et visible.\nMets une alarme « Préparer sac de sport » la veille au soir si besoin.",
    createdAt: now,
    updatedAt: now,
  };
}

export function weekendTemplate(): Bag {
  const now = Date.now();
  return {
    id: genBagId(),
    title: "Sac week-end",
    description: "Pour partir 2-3 jours.",
    categories: [
      newCategory("essentiels", [
        "Carte d'identité / passeport",
        "Carte bancaire / espèces",
        "Réservations (hôtel, transport, activités)",
        "Clés de la maison (pour le retour !)",
        "Médicaments habituels",
      ]),
      newCategory("vetements", [
        "Sous-vêtements (nb de jours + 1)",
        "Chaussettes (nb de jours + 1)",
        "Pantalons / jupes (2-3 selon activités)",
        "Hauts / t-shirts (nb de jours + 1)",
        "Pull / veste (selon météo)",
        "Pyjama / tenue de nuit",
        "Chaussures confortables",
        "Chaussures de rechange",
        "Maillot de bain",
        "Accessoires (écharpe, bonnet, chapeau)",
      ]),
      newCategory("hygiene", [
        "Trousse de toilette (brosse à dents, savon, shampooing)",
        "Déodorant",
        "Rasoir / nécessaire d'épilation",
        "Maquillage",
        "Accessoires capillaires",
        "Lunettes de vue / lentilles + étui",
        "Lunettes de soleil",
        "Protection solaire",
        "Mouchoirs",
      ]),
      newCategory("tech", [
        "Téléphone + chargeur",
        "Écouteurs",
        "Ordinateur portable / tablette",
        "Chargeurs et câbles",
        "Adaptateur de prise (si étranger)",
        "Livre / liseuse",
        "Appareil photo",
      ]),
      newCategory("sante", [
        "Trousse de premiers soins",
        "Médicaments mal des transports",
        "Ordonnances (si renouvellement)",
        "Bouteille d'eau réutilisable",
        "En-cas et eau pour le trajet",
      ]),
      newCategory("autres", [
        "Sac à dos (si excursions)",
        "Parapluie / coupe-vent",
        "Sacs plastiques (linge sale, chaussures mouillées)",
        "Cadeau / victuailles (si invitation)",
        "Équipement spécifique (vélo, randonnée...)",
        "Linge de maison (si non fourni)",
      ]),
    ],
    finalChecks: newFinalChecks([
      "J'ai vérifié toute la liste",
      "J'ai vérifié la météo de destination",
      "Mon sac est prêt, fermé",
      "J'ai mes clés, téléphone, portefeuille",
      "J'ai vérifié mes horaires de transport",
      "J'ai préparé l'itinéraire",
    ]),
    tips: "Lave les habits à emporter 3-4 jours avant.\nCommence le sac 2 jours avant le départ.\nGarde une trousse de toilette « spéciale voyage » toujours prête.\nPlastifie cette liste et garde-la dans ton sac.",
    createdAt: now,
    updatedAt: now,
  };
}

/** Renvoie la dernière préparation logguée pour ce sac, ou null. */
export function lastPrep(logs: BagPrepLog[], bagId: string): BagPrepLog | null {
  let best: BagPrepLog | null = null;
  for (const l of logs) {
    if (l.bagId !== bagId) continue;
    if (!best || l.t > best.t) best = l;
  }
  return best;
}

/** Total d'items dans toutes les catégories d'un sac. */
export function totalItems(bag: Bag): number {
  return bag.categories.reduce((acc, c) => acc + c.items.length, 0);
}
