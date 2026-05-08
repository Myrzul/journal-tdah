import Link from "next/link";
import { IconEye, IconEyeOpen } from "@/components/icons";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import {
  MonsterCalme,
  MonsterCurieux,
  MonsterEnergique,
  MonsterFier,
  MonsterReflexif,
  MonsterSurprise,
} from "@/components/monsters";

type Tool = {
  href: string;
  eyebrow: string;
  title: string;
  sub: string;
  duration: string;
  /** Couleur d'accent — apparaît en bord et fond léger sur hover */
  color: string;
  /** Mascotte ou icône */
  mascot?: React.ComponentType<{ color: string }>;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
};

const TOOLS: Tool[] = [
  {
    href: "/outils/thermometre",
    eyebrow: "Auto-régulation",
    title: "Thermomètre des émotions",
    sub: "Nommer ce qui se passe maintenant et choisir une réponse à ta taille.",
    duration: "2 à 5 min",
    color: "var(--ch-soin)",
    mascot: MonsterCurieux,
  },
  {
    href: "/outils/evaluation",
    eyebrow: "Auto-évaluation TDAH",
    title: "Mes symptômes & leurs répercussions",
    sub: "68 questions pour observer la fréquence de tes symptômes et leur impact.",
    duration: "8 à 12 min",
    color: "var(--ch-attention)",
    icon: IconEyeOpen,
  },
  {
    href: "/outils/scan",
    eyebrow: "Pleine conscience corporelle",
    title: "Scan corporel",
    sub: "Sept phases guidées pour habiter le corps quand le mental bouillonne.",
    duration: "5 à 10 min",
    color: "var(--ch-emotions)",
    mascot: MonsterReflexif,
  },
  {
    href: "/outils/emotions",
    eyebrow: "Granularité émotionnelle",
    title: "Nommer mes émotions",
    sub: "Du flou à un mot juste — boussole, familles, nuances. Couches TCC et ACT optionnelles.",
    duration: "3 à 8 min",
    color: "var(--ch-emotions)",
    mascot: MonsterFier,
  },
  {
    href: "/outils/coherence",
    eyebrow: "Régulation respiratoire",
    title: "Cohérence cardiaque",
    sub: "5 secondes inspire, 5 secondes expire — la fleur t'accompagne pendant 3, 5 ou 10 min.",
    duration: "3, 5 ou 10 min",
    color: "var(--ch-emotions)",
    mascot: MonsterCalme,
  },
  {
    href: "/outils/duree",
    eyebrow: "Cécité au temps",
    title: "Estimer une durée",
    sub: "Comparer ton estimation au temps réel — pour calibrer ton intuition, sans jugement.",
    duration: "2 min + la tâche",
    color: "var(--ch-temps)",
    mascot: MonsterCalme,
  },
  {
    href: "/outils/checklists",
    eyebrow: "Routines & charge mentale",
    title: "Mes checklists",
    sub: "Externaliser l'ordre des tâches récurrentes. Étapes courtes, récompense à la fin.",
    duration: "5 min de mise en place",
    color: "var(--ch-controle)",
    mascot: MonsterEnergique,
  },
  {
    href: "/outils/sacs",
    eyebrow: "Préparation matérielle",
    title: "Mes sacs",
    sub: "Externaliser le contenu des sacs récurrents — sport, week-end, école. Catégories + vérification finale.",
    duration: "5 min de prépa",
    color: "var(--ch-environnement)",
    mascot: MonsterSurprise,
  },
];

export default function OutilsPage() {
  return (
    <>
      <IntroHand>
        Mes outils, à portée.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Choisis-en un quand tu en as besoin. Pas avant.
        </span>
      </IntroHand>

      <SectionLabel>Tous les outils</SectionLabel>
      <Headline accent="à ma disposition">Les outils</Headline>

      <div className="tools-grid">
        {TOOLS.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <p className="tools-coming">D'autres outils s'ajouteront ici progressivement.</p>
    </>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Mascot = tool.mascot;
  const Icon = tool.icon;
  return (
    <Link href={tool.href} className="tool-grid-card" style={{ ["--accent" as string]: tool.color }}>
      <div className="tool-grid-card-illu">
        {Mascot && <Mascot color={tool.color} />}
        {Icon && !Mascot && <Icon size={48} color={tool.color} />}
      </div>
      <div className="tool-grid-card-body">
        <span className="tool-grid-card-eyebrow">{tool.eyebrow}</span>
        <span className="tool-grid-card-title">{tool.title}</span>
        <span className="tool-grid-card-sub">{tool.sub}</span>
        <span className="tool-grid-card-meta">
          <IconEye size={12} color="var(--ink-2)" /> {tool.duration}
        </span>
      </div>
      <span className="tool-grid-card-arrow">→</span>
    </Link>
  );
}
