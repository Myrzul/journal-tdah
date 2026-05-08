"use client";

import {
  CHECKLIST_GREEN,
  dayInitial,
  type ExecLog,
  lastSevenDays,
} from "@/lib/tools/checklist-data";

type Props = {
  logs: ExecLog[];
  checklistId: string;
};

export function ChecklistRecent({ logs, checklistId }: Props) {
  const days = lastSevenDays(logs, checklistId);
  return (
    <div className="checklist-recent">
      {days.map((d) => (
        <div
          key={d.isoDay}
          className={`checklist-recent-dot ${d.done ? "is-done" : ""}`}
          style={d.done ? { background: CHECKLIST_GREEN } : undefined}
          title={d.date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "short",
          })}
        >
          <span className="checklist-recent-dot-letter">{dayInitial(d.date)}</span>
        </div>
      ))}
    </div>
  );
}
