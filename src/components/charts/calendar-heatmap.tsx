"use client";

import { addDays, addMonths, format, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export type DayState = {
  hasMorning: boolean;
  hasEvening: boolean;
  /** intensité moyenne [1..5], pilote l'opacité du dot */
  intensity?: number;
};

type CalendarHeatmapProps = {
  /** Map<YYYY-MM-DD, DayState> */
  states: Map<string, DayState>;
  /** Mois initialement affiché (par défaut : courant) */
  initialMonth?: Date;
  /** Date considérée comme "aujourd'hui" — par défaut Date courante */
  today?: Date;
  /**
   * Préfixe de lien — la date ISO sera appendée. Ex : "/matin?date="
   * → produit "/matin?date=2026-05-07". Si absent, les cellules ne sont pas cliquables.
   */
  hrefBase?: string;
};

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

export function CalendarHeatmap({
  states,
  initialMonth,
  today = new Date(),
  hrefBase,
}: CalendarHeatmapProps) {
  const [cursor, setCursor] = useState<Date>(initialMonth ?? startOfMonth(today));
  const monthStart = startOfMonth(cursor);
  const offset = (monthStart.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayISO = format(today, "yyyy-MM-dd");

  const cells: (Date | null)[] = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - offset + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return addDays(monthStart, dayNum - 1);
  });

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          type="button"
          className="cal-nav"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <div className="cal-title">{format(cursor, "MMMM yyyy", { locale: fr })}</div>
        <button
          type="button"
          className="cal-nav"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map((d, i) => (
          <div key={`${d}-${i}`} className="cal-dlabel">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className="cal-cell empty" />;
          const iso = format(d, "yyyy-MM-dd");
          const state = states.get(iso);
          const isToday = iso === todayISO;
          const isFuture = d > today;
          const isOtherMonth = !isSameMonth(d, cursor);
          const fillIntensity = state?.intensity ?? 0;
          const opacity = state ? 0.45 + (fillIntensity / 5) * 0.55 : 0;

          const content = (
            <>
              {state?.hasMorning && <span className="cal-half cal-half-am" style={{ opacity }} />}
              {state?.hasEvening && <span className="cal-half cal-half-pm" style={{ opacity }} />}
              <span className="cal-num">{d.getDate()}</span>
            </>
          );

          if (hrefBase && !isFuture) {
            return (
              <Link
                key={iso}
                href={`${hrefBase}${iso}`}
                className={cn(
                  "cal-cell",
                  isToday && "today",
                  isOtherMonth && "other-month",
                  state && "filled",
                )}
                aria-label={format(d, "d MMMM yyyy", { locale: fr })}
              >
                {content}
              </Link>
            );
          }
          return (
            <div
              key={iso}
              className={cn(
                "cal-cell",
                isToday && "today",
                isOtherMonth && "other-month",
                isFuture && "future",
                state && "filled",
              )}
            >
              {content}
            </div>
          );
        })}
      </div>

      <div className="cal-legend">
        <span className="cal-legend-item">
          <span className="cal-legend-dot am" />
          matin
        </span>
        <span className="cal-legend-item">
          <span className="cal-legend-dot pm" />
          soir
        </span>
        <span className="cal-legend-item">
          <span className="cal-legend-dot today" />
          aujourd'hui
        </span>
      </div>
    </div>
  );
}
