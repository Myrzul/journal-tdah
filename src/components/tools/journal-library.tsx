"use client";

import {
  type DayJournal,
  dayTypeLabel,
  filledSlotCount,
  formatDateLabel,
  JOURNAL_BLUE,
} from "@/lib/tools/journal-data";

type Props = {
  days: DayJournal[];
  onCreateWork: () => void;
  onCreateFree: () => void;
  onOpen: (id: string) => void;
};

export function JournalLibrary({
  days,
  onCreateWork,
  onCreateFree,
  onOpen,
}: Props) {
  if (days.length === 0) {
    return (
      <div className="journal-empty">
        <div className="journal-empty-eyebrow">Aucune journée enregistrée</div>
        <div className="journal-empty-title">
          Observe deux journées : une de travail, une libre.
        </div>
        <p className="journal-empty-sub">
          Pas besoin de tout remplir d'un coup. Le but est de capturer ton énergie
          et ton humeur en plusieurs instants — pour voir, après coup, la forme
          de ta journée.
        </p>
        <div className="journal-empty-actions">
          <button
            type="button"
            onClick={onCreateWork}
            className="journal-primary-btn"
            style={{ background: JOURNAL_BLUE, color: "white" }}
          >
            Démarrer une journée travail
          </button>
          <button
            type="button"
            onClick={onCreateFree}
            className="journal-nav-btn"
          >
            Démarrer une journée libre
          </button>
        </div>
      </div>
    );
  }

  // Tri : journées les plus récentes en haut
  const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="journal-grid">
        {sorted.map((day) => {
          const filled = filledSlotCount(day);
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onOpen(day.id)}
              className="journal-card"
            >
              <span className="journal-card-eyebrow">{dayTypeLabel(day.type)}</span>
              <span className="journal-card-date">
                {formatDateLabel(day.date)}
              </span>
              {day.title && (
                <span className="journal-card-title-text">{day.title}</span>
              )}
              <span className="journal-card-meta">
                {filled} / {day.slots.length} tranches
              </span>
              <span className="journal-card-arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </div>
      <div className="journal-grid-add">
        <button
          type="button"
          onClick={onCreateWork}
          className="journal-add-btn"
        >
          + Nouvelle journée travail
        </button>
        <button
          type="button"
          onClick={onCreateFree}
          className="journal-add-btn"
        >
          + Nouvelle journée libre
        </button>
      </div>
    </>
  );
}
