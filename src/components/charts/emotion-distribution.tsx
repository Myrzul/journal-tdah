import {
  MonsterCalme,
  MonsterCurieux,
  MonsterEndormi,
  MonsterEnergique,
  MonsterFier,
  MonsterInquiet,
  MonsterReflexif,
} from "@/components/monsters";
import type { EmotionId } from "@/lib/mock/seed";

type EmotionDistributionProps = {
  counts: Map<EmotionId, number>;
  /** total des entrées sur la période (pour calculer les % bar widths) */
  total?: number;
};

const EMOTION_META: Record<
  EmotionId,
  { label: string; color: string; mascot: React.ComponentType<{ color: string }> }
> = {
  calme: { label: "Calme", color: "#4DD0B0", mascot: MonsterCalme },
  curieux: { label: "Curieux", color: "#1B4FE5", mascot: MonsterCurieux },
  reflexif: { label: "Réflexif", color: "#B05BC9", mascot: MonsterReflexif },
  energique: { label: "Énergique", color: "#F26B2C", mascot: MonsterEnergique },
  inquiet: { label: "Inquiet", color: "#F0B340", mascot: MonsterInquiet },
  endormi: { label: "Endormi", color: "#7C8A99", mascot: MonsterEndormi },
  fier: { label: "Fier", color: "#E8294E", mascot: MonsterFier },
};

const EMOTION_ORDER: EmotionId[] = [
  "calme",
  "curieux",
  "reflexif",
  "energique",
  "fier",
  "inquiet",
  "endormi",
];

export function EmotionDistribution({ counts, total }: EmotionDistributionProps) {
  const max = total ?? Math.max(...Array.from(counts.values()), 1);
  const present = EMOTION_ORDER.filter((id) => (counts.get(id) ?? 0) > 0);

  if (present.length === 0) {
    return (
      <p
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          fontFamily: "var(--font-body)",
          padding: "8px 0",
        }}
      >
        Pas encore d'émotion enregistrée sur cette période.
      </p>
    );
  }

  return (
    <div className="emo-dist">
      {present.map((id) => {
        const meta = EMOTION_META[id];
        const count = counts.get(id) ?? 0;
        const pct = (count / max) * 100;
        const Mascot = meta.mascot;
        return (
          <div key={id} className="emo-dist-row">
            <div className="emo-dist-mascot">
              <Mascot color={meta.color} />
            </div>
            <div className="emo-dist-label">{meta.label}</div>
            <div className="emo-dist-bar-wrap">
              <div className="emo-dist-bar" style={{ width: `${pct}%`, background: meta.color }} />
            </div>
            <div className="emo-dist-count">{count}</div>
          </div>
        );
      })}
    </div>
  );
}
