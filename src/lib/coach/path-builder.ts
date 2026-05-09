import type { AxisId, AxisScores } from "./coach-types";

const ALL_AXES: AxisId[] = [
  "hygiene",
  "emotions",
  "attention",
  "motivation",
  "temps",
  "environnement",
  "interactions",
];

/**
 * Construit le parcours adaptatif à partir des scores par axe.
 *
 * Logique :
 * - Trie les axes par score décroissant (le plus saillant en premier)
 * - En cas d'égalité, applique un "ordre clinique" pédagogique
 *   (hygiène avant motivation par exemple — on veut soutenir le corps avant
 *   d'attaquer l'élan d'action).
 *
 * Si tous les scores sont égaux ou neutres, on retourne un ordre par défaut
 * pédagogiquement cohérent.
 */
const TIE_BREAK_ORDER: AxisId[] = [
  "hygiene", // le corps avant tout
  "emotions", // réguler avant d'agir
  "attention", // outils cognitifs
  "temps", // structure temporelle
  "motivation", // démarrer
  "environnement", // adapter l'extérieur
  "interactions", // relation aux autres
];

export function buildAdaptivePath(scores: AxisScores): AxisId[] {
  return [...ALL_AXES].sort((a, b) => {
    const sa = scores[a] ?? 5;
    const sb = scores[b] ?? 5;
    if (sa !== sb) return sb - sa;
    // Tie-break déterministe selon TIE_BREAK_ORDER
    return TIE_BREAK_ORDER.indexOf(a) - TIE_BREAK_ORDER.indexOf(b);
  });
}

/**
 * Map les sous-scores de l'auto-évaluation TDAH 68 questions vers des scores
 * d'axes du coach. À utiliser quand le user choisit le mode COMPLET.
 *
 * Note : on a 4 sous-scores en TDAH (inattention, hyperactivité-impulsivité,
 * répercussions, bien-être). On répartit intelligemment.
 *
 * @param fullScores Record avec les 4 sous-scores normalisés en 0..10.
 */
export function fullEvalScoresToAxes(fullScores: {
  inattention: number; // 0..10
  hyperactivite: number; // 0..10
  repercussions: number; // 0..10
  bienEtre: number; // 0..10 (10 = mauvais bien-être pour conserver la convention "haut = à travailler")
}): AxisScores {
  // Pondérations cliniques (issues du sens du guide)
  return {
    // hygiène : sensible au bien-être (sommeil/fatigue/conduites)
    hygiene: clamp(
      fullScores.bienEtre * 0.7 + fullScores.repercussions * 0.3,
    ),
    // émotions : surtout hyperactivité-impulsivité émotionnelle
    emotions: clamp(
      fullScores.hyperactivite * 0.7 + fullScores.bienEtre * 0.3,
    ),
    // attention : surtout inattention
    attention: clamp(
      fullScores.inattention * 0.85 + fullScores.repercussions * 0.15,
    ),
    // motivation : mix inattention + répercussions (procrastination)
    motivation: clamp(
      fullScores.inattention * 0.5 + fullScores.repercussions * 0.5,
    ),
    // temps : surtout répercussions (retards, deadlines) + un peu inattention
    temps: clamp(
      fullScores.repercussions * 0.7 + fullScores.inattention * 0.3,
    ),
    // environnement : répercussions sur l'organisation
    environnement: clamp(
      fullScores.repercussions * 0.6 + fullScores.inattention * 0.4,
    ),
    // interactions : hyperactivité-impulsivité (verbale) + répercussions
    interactions: clamp(
      fullScores.hyperactivite * 0.6 + fullScores.repercussions * 0.4,
    ),
  };
}

function clamp(v: number): number {
  return Math.max(0, Math.min(10, Math.round(v * 10) / 10));
}
