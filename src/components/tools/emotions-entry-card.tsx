"use client";

type Props = {
  eyebrow: string;
  title: string;
  sub: string;
  onClick: () => void;
  mascot: React.ComponentType<{ color: string }>;
  bubbleColor?: string;
  mascotColor?: string;
};

export function EmotionsEntryCard({
  eyebrow,
  title,
  sub,
  onClick,
  mascot: Mascot,
  bubbleColor = "var(--ch-emotions)",
  mascotColor = "var(--paper)",
}: Props) {
  return (
    <button type="button" onClick={onClick} className="emo-entry-card">
      <span className="emo-entry-mascot-wrap" style={{ background: bubbleColor }}>
        <span className="emo-entry-mascot">
          <Mascot color={mascotColor} />
        </span>
      </span>
      <span className="emo-entry-body">
        <span className="emo-entry-eyebrow">{eyebrow}</span>
        <span className="emo-entry-title">{title}</span>
        <span className="emo-entry-sub">{sub}</span>
      </span>
      <span className="emo-entry-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}
