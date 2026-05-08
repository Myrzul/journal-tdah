"use client";

import {
  formatHourMin,
  isSlotFilled,
  type TimeSlot,
} from "@/lib/tools/journal-data";

type Props = {
  slots: TimeSlot[];
  currentIdx?: number | null;
  onClickSlot: (idx: number) => void;
};

export function JournalTable({ slots, currentIdx = null, onClickSlot }: Props) {
  return (
    <div className="journal-table-wrap">
      <div className="journal-table">
        <div className="journal-table-headrow">
          <div className="journal-table-th-time">Heure</div>
          <div className="journal-table-th-act">Activité</div>
          <div className="journal-table-th-ctx">Contexte</div>
          <div className="journal-table-th-num">É.</div>
          <div className="journal-table-th-num">H.</div>
        </div>
        {slots.map((slot) => {
          const filled = isSlotFilled(slot);
          const isCurrent = currentIdx === slot.idx;
          return (
            <button
              key={slot.idx}
              type="button"
              onClick={() => onClickSlot(slot.idx)}
              className={`journal-table-row ${filled ? "is-filled" : ""} ${isCurrent ? "is-current" : ""}`}
            >
              <div className="journal-table-time">
                {formatHourMin(slot.startMin)}
                <span className="journal-table-time-end">
                  {formatHourMin(slot.endMin)}
                </span>
              </div>
              <div className="journal-table-act">
                {slot.activity || (
                  <span className="journal-table-empty">—</span>
                )}
              </div>
              <div className="journal-table-ctx">
                {slot.context || <span className="journal-table-empty">—</span>}
              </div>
              <div className="journal-table-num">
                {slot.energy ?? <span className="journal-table-empty">—</span>}
              </div>
              <div className="journal-table-num">
                {slot.mood ?? <span className="journal-table-empty">—</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
