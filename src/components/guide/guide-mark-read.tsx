"use client";

type Props = {
  read: boolean;
  onToggle: () => void;
  rubColor: string;
};

export function GuideMarkRead({ read, onToggle, rubColor }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`guide-mark-read ${read ? "is-read" : ""}`}
      style={{ ["--rub-color" as string]: rubColor }}
    >
      <span className="guide-mark-read-box" aria-hidden="true">
        {read ? "✓" : ""}
      </span>
      <span className="guide-mark-read-label">
        {read ? "Section lue" : "Marquer comme lu"}
      </span>
    </button>
  );
}
