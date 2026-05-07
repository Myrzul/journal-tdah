import { format, isToday, isYesterday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse une string `YYYY-MM-DD` venant d'un searchParam.
 * Retourne null si invalide ou absent. Accepte "today" comme alias.
 */
export function parseDateParam(value: string | string[] | undefined): Date | null {
  if (!value) return null;
  const v = Array.isArray(value) ? value[0] : value;
  if (!v) return null;
  if (v === "today") return new Date();
  if (!DATE_RE.test(v)) return null;
  const d = parseISO(v);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/**
 * Phrase relative pour une date : "aujourd'hui", "hier", ou "le 12 avril 2026".
 */
export function relativeDateLabel(date: Date): string {
  if (isToday(date)) return "aujourd'hui";
  if (isYesterday(date)) return "hier";
  return `le ${format(date, "d MMMM yyyy", { locale: fr })}`;
}

/**
 * Variante avec majuscule en début (pour usage en début de phrase).
 */
export function relativeDateLabelCapitalized(date: Date): string {
  const l = relativeDateLabel(date);
  return l.charAt(0).toUpperCase() + l.slice(1);
}
