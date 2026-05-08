/**
 * Auto-évaluation TDAH — données du questionnaire.
 * Port fidèle du proto EVALUATION/script.js, adapté à la charte du journal.
 *
 * Structure :
 *  - Étape 1 (Sévérité, 6 derniers mois) : Inattention 9q + Hyperactivité 9q, /36 chacun
 *  - Étape 2 (Répercussions, dernier mois) : 10 rubriques × 5 questions
 *    - rub1..rub9 : score /20 chacun, total /180
 *    - rub10 (Bien-être) : /20, échelle inversée (haut = bon)
 */

export type ScaleValue = 0 | 1 | 2 | 3 | 4;

export const SCALE_LABELS: readonly string[] = [
  "Jamais",
  "Rarement",
  "Parfois",
  "Souvent",
  "Très souvent",
] as const;

export type Question = {
  /** Texte principal (peut contenir <b> pour les emphases — affiché via dangerouslySetInnerHTML maîtrisé) */
  text: string;
  /** Précision optionnelle entre parenthèses */
  detail?: string;
};

export type EvalSection = {
  id: SectionId;
  /** Titre affiché en haut de l'écran */
  title: string;
  /** Tag court (ex : "Étape 1 – A") */
  badge: string;
  questions: readonly Question[];
  /** Couleur d'accent pour la section */
  color: string;
  /** Numéro étape (1 = sévérité, 2 = répercussions) */
  etape: 1 | 2;
};

export type SectionId =
  | "inattention"
  | "hyperactivite"
  | "rub1"
  | "rub2"
  | "rub3"
  | "rub4"
  | "rub5"
  | "rub6"
  | "rub7"
  | "rub8"
  | "rub9"
  | "rub10";

export const ETAPE1_PERIOD = "Au cours des 6 derniers mois, à quelle fréquence avez-vous tendance à...";
export const ETAPE2_PERIOD = "Au cours du dernier mois, à quelle fréquence...";
export const COMMON_INTRO =
  "Il n'y a pas de bonne ou de mauvaise réponse. L'objectif est de décrire ce que l'on observe, pas de se juger.";

export const SECTIONS: readonly EvalSection[] = [
  {
    id: "inattention",
    title: "Section A : Inattention",
    badge: "Étape 1 · A",
    color: "#1B4FE5",
    etape: 1,
    questions: [
      {
        text: "Négliger les <b>détails</b>, manquer de <b>précision</b>, et/ou faire des <b>erreurs d'étourderie</b>",
        detail:
          "(en particulier pendant une activité jugée inintéressante ou difficile, que ce soit au travail ou dans ma vie privée)",
      },
      {
        text: "Trouver difficile de <b>maintenir</b> mon <b>attention</b>, avoir une <b>concentration</b> fluctuante",
        detail: "(en particulier pendant une activité longue, répétitive ou ennuyeuse)",
      },
      {
        text: "Donner l'impression aux autres de <b>ne pas écouter</b>, <b>décrocher</b> pendant une conversation",
        detail: "même si mon interlocuteur s'adresse à moi, et en l'absence de distraction évidente",
      },
      {
        text: "Avoir du mal à suivre les <b>consignes</b> et à mener un <b>projet à terme</b>",
        detail:
          "(commencer des tâches domestiques, obligations professionnelles, activités créatives... et ne pas les finir, notamment lorsque le plus intéressant a été fait et qu'il me reste les détails à peaufiner)",
      },
      {
        text: "Avoir du mal à <b>organiser</b> mes activités, mes affaires ou mes idées, les projets impliquant plusieurs étapes",
        detail: "(désordre, gestion du temps inefficace, délais non tenus...)",
      },
      {
        text: "Éviter, <b>remettre à plus tard</b> au dernier moment, ou avoir <b>en aversion</b>, une tâche peu motivante et qui me demande un effort mental soutenu",
        detail: "(formulaires administratifs, analyse, synthèse, rédaction de documents...)",
      },
      {
        text: "<b>Perdre</b> mes affaires, le <b>matériel</b> nécessaire à mes activités",
        detail: "(personnelles et professionnelles), et perdre du temps à les chercher",
      },
      {
        text: "Me laisser facilement <b>distraire</b> par de l'activité et des <b>stimuli</b> autour de moi",
        detail: "(sons, visuels, lumières, odeurs, matières, mouvements...) ou par mes propres pensées",
      },
      {
        text: "<b>Oublier</b> des rendez-vous, des événements, des obligations, ce que j'ai à faire au quotidien",
        detail: "(rappeler des personnes, régler des factures, accomplir les tâches ménagères...)",
      },
    ],
  },
  {
    id: "hyperactivite",
    title: "Section B : Hyperactivité / Impulsivité",
    badge: "Étape 1 · B",
    color: "#FF1F8F",
    etape: 1,
    questions: [
      {
        text: "<b>Remuer</b>, me tortiller sur mon siège, <b>tapoter</b> des doigts et/ou des pieds, <b>agiter</b> les mains et/ou les jambes",
        detail: "(ou avoir du mal à y résister), lorsque je suis contraint·e de rester assis·e un long moment",
      },
      {
        text: "Me <b>lever</b>, quitter ma place / la salle dans laquelle je suis",
        detail: "(en trouvant éventuellement des excuses) par incapacité à rester assis·e",
      },
      {
        text: "Me sentir excessivement <b>agité·e</b>, contraint·e à m'activer",
        detail:
          "sans pouvoir me contenir ou avoir le sentiment d'un cerveau en ébullition, d'un flot incessant de pensées",
      },
      {
        text: "Avoir du mal à me <b>détendre</b>, à m'arrêter de m'activer",
        detail: "à profiter calmement d'une activité de loisir",
      },
      {
        text: "M'agiter, être <b>difficile à suivre</b>, faire du <b>bruit</b>",
        detail: "(ex : « penser tout haut ») au point de perturber les autres (ou faire beaucoup d'efforts pour m'en empêcher)",
      },
      {
        text: "Trop <b>parler</b> / laisser peu mon interlocuteur·ice s'exprimer",
        detail: "et/ou manquer de tact",
      },
      {
        text: "<b>Finir les phrases</b> / répondre aux questions de mes interlocuteurs avant qu'ils n'aient le temps de les poser entièrement",
        detail: "couper la parole",
      },
      {
        text: "Me sentir <b>tendu·e</b>, <b>impatient·e</b>, dans les situations où je dois attendre mon tour",
        detail: "(files d'attente, embouteillages, rendez-vous...)",
      },
      {
        text: "<b>Interrompre / déranger</b> d'autres personnes / leur imposer ma présence alors qu'elles sont occupées",
        detail: "(déjà engagées dans une conversation, dans une activité)",
      },
    ],
  },
  {
    id: "rub1",
    title: "1. Attention, mémoire et charge mentale",
    badge: "Étape 2 · R1",
    color: "#FF08C3",
    etape: 2,
    questions: [
      { text: "J'ai du mal à rester <b>concentré·e</b> suffisamment <b>longtemps</b> sur une tâche." },
      { text: "J'ai du mal à ne mener qu'<b>une seule tâche à la fois</b>." },
      {
        text: "J'<b>oublie</b> ce que j'ai à faire (tâches, rendez-vous) ou des <b>informations</b>",
        detail: "(délais, consignes...)",
      },
      { text: "J'ai la sensation d'avoir l'esprit <b>surchargé</b> ou <b>embrouillé</b>." },
      { text: "Je dépends d'une <b>aide extérieure</b> pour me rappeler certaines choses importantes." },
    ],
  },
  {
    id: "rub2",
    title: "2. Organisation matérielle et environnement",
    badge: "Étape 2 · R2",
    color: "#FDD27E",
    etape: 2,
    questions: [
      { text: "J'ai du mal à maintenir mon logement ou mon espace de travail <b>en ordre</b> / <b>propre</b>." },
      {
        text: "Je <b>perds</b> ou cherche souvent mes <b>affaires / documents</b>",
        detail: "(car non rangé·e·s).",
      },
      { text: "J'ai des difficultés à <b>retrouver</b> mes <b>papiers, informations</b>, dossiers..." },
      { text: "La gestion de l'<b>administratif</b> (papiers, mails, démarches) me met en difficulté." },
      { text: "Le <b>désordre</b> / <b>manque d'organisation</b> de mes informations me nuit." },
    ],
  },
  {
    id: "rub3",
    title: "3. Gestion du temps et planification",
    badge: "Étape 2 · R3",
    color: "#FF743E",
    etape: 2,
    questions: [
      { text: "J'ai du mal à <b>estimer</b> le temps que prend une tâche et/ou à gérer un <b>agenda</b>." },
      { text: "Je perds la <b>notion</b> du <b>temps</b> lorsque je suis absorbé·e par une activité." },
      { text: "Je fais souvent les choses à la <b>dernière minute</b> / je ne <b>planifie</b> pas ma semaine." },
      {
        text: "Je ne respecte pas les <b>délais</b> ou oublie mes <b>obligations</b>",
        detail: "(rendez-vous manqués, retards).",
      },
      { text: "Je manque de <b>temps</b> pour réaliser mes tâches / faire ce qui est important pour moi." },
    ],
  },
  {
    id: "rub4",
    title: "4. Initiation de l'action et priorités",
    badge: "Étape 2 · R4",
    color: "#EE2E63",
    etape: 2,
    questions: [
      { text: "Quand j'ai plusieurs choses à faire, je ne sais pas <b>par quoi commencer</b>." },
      { text: "J'ai du mal à distinguer ce qui est <b>prioritaire</b> de ce qui peut attendre." },
      { text: "Je <b>repousse</b> les tâches peu stimulantes ou contraignantes." },
      { text: "J'ai besoin d'une <b>pression extérieure</b> (urgence, autre personne) pour m'y mettre." },
      { text: "Je me consacre peu aux <b>activités importantes</b> pour moi, même non urgentes." },
    ],
  },
  {
    id: "rub5",
    title: "5. Motivation et engagement",
    badge: "Étape 2 · R5",
    color: "#EE2E63",
    etape: 2,
    questions: [
      { text: "Je me lasse <b>rapidement</b>, même pour des projets importants pour moi." },
      { text: "Je commence des tâches que j'ai du mal à poursuivre <b>jusqu'au bout</b>." },
      { text: "Je m'engage dans trop de <b>projets</b> ou poursuis trop d'<b>idées</b> en même temps." },
      { text: "Je me fixe peu d'<b>objectifs</b> (à court terme ou à long terme)." },
      { text: "J'ai du mal à maintenir un <b>effort régulier</b> dans le temps." },
    ],
  },
  {
    id: "rub6",
    title: "6. Impulsivité, émotions et comportements à risque",
    badge: "Étape 2 · R6",
    color: "#FF93D6",
    etape: 2,
    questions: [
      { text: "J'agis <b>sans</b> forcément <b>réfléchir</b> aux conséquences." },
      { text: "J'ai du mal à <b>résister</b> aux <b>tentations</b> (achats, écrans, nourriture…)." },
      { text: "Certaines <b>consommations</b> / <b>comportements</b> nuisent à ma productivité (écrans...)" },
      { text: "Il m'arrive d'avoir des <b>comportements à risque</b> (relations, conduite, substances…)." },
      {
        text: "J'ai du mal à <b>contrôler</b> mes <b>réactions émotionnelles</b> (colère, frustration, débordement).",
      },
    ],
  },
  {
    id: "rub7",
    title: "7. Vie quotidienne et hygiène de vie",
    badge: "Étape 2 · R7",
    color: "#C7A2DE",
    etape: 2,
    questions: [
      { text: "J'ai des horaires et/ou un volume de <b>sommeil</b> irrégulier·s / insuffisant·s." },
      { text: "Mes horaires et/ou l'équilibre de mes <b>repas</b> sont irréguliers / désorganisés." },
      { text: "Ma pratique d'une <b>activité physique</b> est irrégulière / insuffisante." },
      {
        text: "J'ai du mal à tenir une <b>routine quotidienne</b> stable",
        detail: "(soin de soi, tâches ménagères).",
      },
      { text: "Je néglige mon <b>suivi médical</b> et/ou mon <b>hygiène</b>, ou celle de mes proches." },
    ],
  },
  {
    id: "rub8",
    title: "8. Fonctionnement au travail / dans les études",
    badge: "Étape 2 · R8",
    color: "#C7A2DE",
    etape: 2,
    questions: [
      { text: "Mes difficultés impactent mon <b>efficacité</b> et/ou mes <b>performances</b>." },
      { text: "J'ai du mal à répondre aux attentes et/ou à <b>honorer mes engagements</b>." },
      { text: "J'ai du mal à m'<b>organiser</b> de façon <b>autonome</b>." },
      { text: "Je me sens souvent <b>en difficulté</b> et/ou <b>en décalage</b> par rapport aux autres." },
      { text: "Ces difficultés nuisent à mon <b>estime</b> et à la <b>confiance en moi</b>." },
    ],
  },
  {
    id: "rub9",
    title: "9. Interactions sociales et communication",
    badge: "Étape 2 · R9",
    color: "#88D8B7",
    etape: 2,
    questions: [
      { text: "Les autres me font des <b>reproches</b>." },
      { text: "Je dois faire face à des <b>conflits</b> et/ou <b>incompréhensions</b> / malentendus." },
      { text: "Mes paroles/réactions peuvent blesser, me nuire. Il m'arrive de le regretter." },
      { text: "Je passe peu de temps avec ma <b>famille</b>, mes <b>amis</b> ; je réponds peu aux appels." },
      { text: "Mes difficultés compliquent mes <b>relations</b> avec mes proches / les autres." },
    ],
  },
  {
    id: "rub10",
    title: "10. Bien-être mental global",
    badge: "Étape 2 · R10",
    color: "#05CF8F",
    etape: 2,
    questions: [
      { text: "Je sens que j'ai de l'<b>énergie</b>." },
      { text: "Je me sens <b>utile</b>." },
      { text: "Je me sens <b>confiant·e</b> quant à ma capacité à <b>faire face</b> aux difficultés." },
      {
        text: "Je ressens du <b>plaisir</b> ou de l'<b>intérêt</b> à être avec les autres et/ou apprendre et/ou « faire ».",
      },
      { text: "Je me sens globalement <b>joyeux·se</b> et/ou <b>serein·e</b> et/ou <b>détendu·e</b>." },
    ],
  },
] as const;

export const SECTIONS_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<
  SectionId,
  EvalSection
>;

export const TOTAL_QUESTIONS = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);

/* =========================================================
   Réponses + scoring
   ========================================================= */
export type EvalAnswers = Partial<Record<string, ScaleValue>>;

/** Clé de la réponse pour une question : "rub3_2" = rubrique 3, question d'index 2 */
export const answerKey = (sectionId: SectionId, qIndex: number) => `${sectionId}_${qIndex}`;

export type EvalScores = {
  inattention: number;
  hyperactivite: number;
  rub1: number;
  rub2: number;
  rub3: number;
  rub4: number;
  rub5: number;
  rub6: number;
  rub7: number;
  rub8: number;
  rub9: number;
  rub10: number;
  totalRepercussions: number;
};

function sumSection(answers: EvalAnswers, sectionId: SectionId, count: number): number {
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += answers[answerKey(sectionId, i)] ?? 0;
  }
  return sum;
}

export function computeScores(answers: EvalAnswers): EvalScores {
  const scores: EvalScores = {
    inattention: sumSection(answers, "inattention", 9),
    hyperactivite: sumSection(answers, "hyperactivite", 9),
    rub1: sumSection(answers, "rub1", 5),
    rub2: sumSection(answers, "rub2", 5),
    rub3: sumSection(answers, "rub3", 5),
    rub4: sumSection(answers, "rub4", 5),
    rub5: sumSection(answers, "rub5", 5),
    rub6: sumSection(answers, "rub6", 5),
    rub7: sumSection(answers, "rub7", 5),
    rub8: sumSection(answers, "rub8", 5),
    rub9: sumSection(answers, "rub9", 5),
    rub10: sumSection(answers, "rub10", 5),
    totalRepercussions: 0,
  };
  scores.totalRepercussions =
    scores.rub1 +
    scores.rub2 +
    scores.rub3 +
    scores.rub4 +
    scores.rub5 +
    scores.rub6 +
    scores.rub7 +
    scores.rub8 +
    scores.rub9;
  return scores;
}

/* =========================================================
   Niveaux de sévérité (libellés + couleurs)
   ========================================================= */
export type Level = {
  label: string;
  color: string;
  /** Description courte affichée sous le score */
  desc?: string;
};

export function getSymptomLevel(score: number): Level {
  if (score <= 11)
    return { label: "Pas ou peu de symptômes", color: "#27AE60" };
  if (score <= 23) return { label: "Symptômes modérés", color: "#D4AC0D" };
  return { label: "Symptômes fréquents et marqués", color: "#E74C3C" };
}

export function getRubriqueLevel(score: number): Level {
  if (score <= 6) return { label: "Priorité faible", color: "#27AE60" };
  if (score <= 12) return { label: "Priorité modérée", color: "#D4AC0D" };
  if (score <= 16) return { label: "Priorité élevée", color: "#E67E22" };
  return { label: "Priorité très élevée", color: "#E74C3C" };
}

export function getWellbeingLevel(score: number): Level {
  if (score <= 6)
    return {
      label: "Niveau fragile",
      color: "#E74C3C",
      desc: "Votre bien-être semble actuellement fragilisé. Un soutien professionnel pourrait vous aider.",
    };
  if (score <= 12)
    return {
      label: "Niveau moyen",
      color: "#D4AC0D",
      desc: "Votre bien-être est variable. Certains ajustements pourraient l'améliorer.",
    };
  if (score <= 16)
    return {
      label: "Niveau élevé",
      color: "#27AE60",
      desc: "Vous disposez de bonnes ressources personnelles.",
    };
  return {
    label: "Niveau très élevé",
    color: "#27AE60",
    desc: "Vous présentez un bon niveau de bien-être global.",
  };
}

/* =========================================================
   Liens guide TDAH (cross-sell pour chaque rubrique)
   ========================================================= */
export const RUBRIQUE_GUIDE_LINKS: Record<SectionId, string | undefined> = {
  inattention: undefined,
  hyperactivite: undefined,
  rub1: "https://symbiosepsychologie.podia.com/04-developper-son-attention-sa-memoire",
  rub2: "https://symbiosepsychologie.podia.com/test-du",
  rub3: "https://symbiosepsychologie.podia.com/06-s-organiser",
  rub4: "https://symbiosepsychologie.podia.com/05-trouver-la-motivation-passer-a-l-action",
  rub5: "https://symbiosepsychologie.podia.com/05-trouver-la-motivation-passer-a-l-action",
  rub6: "https://symbiosepsychologie.podia.com/03-reguler-ses-emotions-son-impulsivite",
  rub7: "https://symbiosepsychologie.podia.com/4-rubriques",
  rub8: "https://symbiosepsychologie.podia.com/4-rubriques",
  rub9: "https://symbiosepsychologie.podia.com/bubdke",
  rub10: "https://symbiosepsychologie.podia.com/4-rubriques",
};

export const GUIDE_FULL_LINK =
  "https://symbiosepsychologie.podia.com/guide-interactif-apprivoiser-son-tdah";
