export const JOURNAL_BLUE = "#1B4FE5";

/** Plage horaire par défaut : 7h00 à 23h30 (33 tranches de 30 min). */
export const SLOT_START_MIN = 7 * 60; // 420
export const SLOT_END_MIN = 23 * 60 + 30; // 1410
export const SLOT_DURATION_MIN = 30;

export type DayType = "work" | "free";

export type TimeSlot = {
  /** Index 0..N-1 dans la grille */
  idx: number;
  /** Minutes depuis minuit, début */
  startMin: number;
  /** Minutes depuis minuit, fin */
  endMin: number;
  activity?: string;
  context?: string;
  energy?: number; // 1-10
  mood?: number; // 1-10
  comment?: string;
};

export type DayJournal = {
  id: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  type: DayType;
  /** Titre court optionnel (ex « Mardi calme », « Journée chaotique ») */
  title: string;
  slots: TimeSlot[];
  createdAt: number;
  updatedAt: number;
};

export type JournalStore = {
  days: DayJournal[];
};

export const EMPTY_JOURNAL_STORE: JournalStore = { days: [] };

export const JOURNAL_STORAGE = {
  data: "jtdah-journal-v1",
} as const;

export function genJournalId(prefix = "j"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Génère la grille vierge des tranches 7h-23h30 par pas de 30 min. */
export function buildEmptySlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let idx = 0;
  for (let m = SLOT_START_MIN; m < SLOT_END_MIN; m += SLOT_DURATION_MIN) {
    slots.push({ idx, startMin: m, endMin: m + SLOT_DURATION_MIN });
    idx++;
  }
  return slots;
}

export function newEmptyDay(type: DayType = "work"): DayJournal {
  const now = Date.now();
  const today = new Date();
  const iso = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  return {
    id: genJournalId(),
    date: iso,
    type,
    title: "",
    slots: buildEmptySlots(),
    createdAt: now,
    updatedAt: now,
  };
}

/** Format minutes → "HH:MM". */
export function formatHourMin(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function formatSlotRange(slot: TimeSlot): string {
  return `${formatHourMin(slot.startMin)} – ${formatHourMin(slot.endMin)}`;
}

/** Renvoie l'index de la tranche correspondant à l'heure courante, ou null si hors plage. */
export function currentSlotIndex(now: Date = new Date()): number | null {
  const totalMin = now.getHours() * 60 + now.getMinutes();
  if (totalMin < SLOT_START_MIN || totalMin >= SLOT_END_MIN) return null;
  const idx = Math.floor((totalMin - SLOT_START_MIN) / SLOT_DURATION_MIN);
  return idx;
}

/** Retourne true si la tranche a un contenu. */
export function isSlotFilled(slot: TimeSlot): boolean {
  return !!(
    slot.activity?.trim() ||
    slot.context?.trim() ||
    slot.energy != null ||
    slot.mood != null ||
    slot.comment?.trim()
  );
}

export function filledSlotCount(day: DayJournal): number {
  return day.slots.filter(isSlotFilled).length;
}

/** Format ISO YYYY-MM-DD → "lun. 12 mars". */
export function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map((s) => Number.parseInt(s, 10));
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function dayTypeLabel(t: DayType): string {
  return t === "work" ? "Travail / études" : "Journée libre";
}
