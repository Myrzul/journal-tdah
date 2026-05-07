import {
  IconCalendar,
  IconCloud,
  IconCompass,
  type IconComponent,
  IconList,
  IconMoon,
  IconSun,
} from "@/components/icons";
import {
  MonsterCalme,
  MonsterCurieux,
  MonsterEndormi,
  MonsterFier,
  MonsterReflexif,
  MonsterSurprise,
} from "@/components/monsters";

export type TabId = "matin" | "soir" | "semaine" | "boussole" | "pensees" | "listes";

export type TabConfig = {
  id: TabId;
  label: string;
  hex: string;
  cssColor: string;
  num: string;
  sub: string;
  icon: IconComponent;
  mascot: React.ComponentType<{ color: string }>;
};

export const TABS: readonly TabConfig[] = [
  {
    id: "matin",
    label: "Matin",
    hex: "#1B4FE5",
    cssColor: "var(--ch-observer)",
    num: "01",
    sub: "Pose le ton de la journée — données, pas verdicts.",
    icon: IconSun,
    mascot: MonsterCurieux,
  },
  {
    id: "soir",
    label: "Soir",
    hex: "#B05BC9",
    cssColor: "var(--ch-soin)",
    num: "02",
    sub: "Bilan tendre. La nuit trie ce que le jour a semé.",
    icon: IconMoon,
    mascot: MonsterEndormi,
  },
  {
    id: "semaine",
    label: "Semaine",
    hex: "#FF8AB8",
    cssColor: "var(--ch-emotions)",
    num: "03",
    sub: "Sept jours pour voir un motif, pas un échec.",
    icon: IconCalendar,
    mascot: MonsterReflexif,
  },
  {
    id: "boussole",
    label: "Boussole",
    hex: "#F26B2C",
    cssColor: "var(--ch-temps)",
    num: "04",
    sub: "Pas un plan de vie. Une direction.",
    icon: IconCompass,
    mascot: MonsterFier,
  },
  {
    id: "pensees",
    label: "Pensées",
    hex: "#FF1F8F",
    cssColor: "var(--ch-attention)",
    num: "05",
    sub: "Examiner les boucles. Les laisser passer.",
    icon: IconCloud,
    mascot: MonsterSurprise,
  },
  {
    id: "listes",
    label: "Listes",
    hex: "#1FBF7A",
    cssColor: "var(--ch-controle)",
    num: "06",
    sub: "Vider la tête. Respirer. La page se souvient.",
    icon: IconList,
    mascot: MonsterCalme,
  },
] as const;

export const TABS_BY_ID = Object.fromEntries(TABS.map((t) => [t.id, t])) as Record<
  TabId,
  TabConfig
>;
