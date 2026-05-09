"use client";

import {
  COACH_STORAGE,
  type CoachProfile,
  type CoachStore,
  EMPTY_COACH_STORE,
} from "./coach-types";

export function loadCoachStore(): CoachStore {
  if (typeof window === "undefined") return EMPTY_COACH_STORE;
  try {
    const raw = localStorage.getItem(COACH_STORAGE.data);
    if (!raw) return EMPTY_COACH_STORE;
    const parsed = JSON.parse(raw) as CoachStore;
    return { profile: parsed.profile ?? null };
  } catch {
    return EMPTY_COACH_STORE;
  }
}

export function saveCoachStore(store: CoachStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COACH_STORAGE.data, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function setProfile(profile: CoachProfile): void {
  saveCoachStore({ profile });
}

export function clearProfile(): void {
  saveCoachStore({ profile: null });
}
