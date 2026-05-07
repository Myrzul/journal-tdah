import {
  IconCalendar,
  type IconComponent,
  IconList,
  IconSparkle,
  IconSun,
} from "@/components/icons";
import {
  MonsterCalme,
  MonsterCurieux,
  MonsterReflexif,
  MonsterSurprise,
} from "@/components/monsters";

export type TabId = "aujourdhui" | "recap" | "outils" | "listes";

export type TabConfig = {
  id: TabId;
  label: string;
  hex: string;
  cssColor: string;
  sub: string;
  icon: IconComponent;
  mascot: React.ComponentType<{ color: string }>;
};

export const TABS: readonly TabConfig[] = [
  {
    id: "aujourdhui",
    label: "Aujourd'hui",
    hex: "#1B4FE5",
    cssColor: "var(--ch-observer)",
    sub: "Le journal du jour. Matin et soir, à ton rythme.",
    icon: IconSun,
    mascot: MonsterCurieux,
  },
  {
    id: "recap",
    label: "Récap",
    hex: "#FF8AB8",
    cssColor: "var(--ch-emotions)",
    sub: "Sept jours, trois mois, une saison. Voir les motifs.",
    icon: IconCalendar,
    mascot: MonsterReflexif,
  },
  {
    id: "outils",
    label: "Outils",
    hex: "#FF1F8F",
    cssColor: "var(--ch-attention)",
    sub: "Une question : où en es-tu maintenant ?",
    icon: IconSparkle,
    mascot: MonsterSurprise,
  },
  {
    id: "listes",
    label: "Listes",
    hex: "#1FBF7A",
    cssColor: "var(--ch-controle)",
    sub: "Vider la tête. Respirer. La page se souvient.",
    icon: IconList,
    mascot: MonsterCalme,
  },
] as const;

export const TABS_BY_ID = Object.fromEntries(TABS.map((t) => [t.id, t])) as Record<
  TabId,
  TabConfig
>;
