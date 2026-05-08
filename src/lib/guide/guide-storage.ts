"use client";

import {
  EMPTY_GUIDE_STORE,
  emptyRubriqueProgress,
  GUIDE_STORAGE,
  type GuideStore,
  type RubriqueId,
  type RubriqueProgress,
  SECTION_ORDER,
  type SectionId,
  type SmartObjective,
} from "./guide-types";

export function loadGuideStore(): GuideStore {
  if (typeof window === "undefined") return EMPTY_GUIDE_STORE;
  try {
    const raw = localStorage.getItem(GUIDE_STORAGE.data);
    if (!raw) return EMPTY_GUIDE_STORE;
    const parsed = JSON.parse(raw) as GuideStore;
    return { progress: parsed.progress ?? {} };
  } catch {
    return EMPTY_GUIDE_STORE;
  }
}

export function saveGuideStore(store: GuideStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUIDE_STORAGE.data, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function getOrCreateProgress(
  store: GuideStore,
  rubriqueId: RubriqueId,
): { store: GuideStore; progress: RubriqueProgress } {
  const existing = store.progress[rubriqueId];
  if (existing) return { store, progress: existing };
  const fresh = emptyRubriqueProgress(rubriqueId);
  return {
    store: { progress: { ...store.progress, [rubriqueId]: fresh } },
    progress: fresh,
  };
}

export function updateProgress(
  store: GuideStore,
  rubriqueId: RubriqueId,
  patch: (p: RubriqueProgress) => RubriqueProgress,
): GuideStore {
  const cur = store.progress[rubriqueId] ?? emptyRubriqueProgress(rubriqueId);
  const next = patch(cur);
  // Auto-set startedAt sur première interaction
  if (!next.startedAt) next.startedAt = Date.now();
  // Auto-set completedAt si toutes sections lues
  if (
    !next.completedAt &&
    SECTION_ORDER.every((s) => next.readSections.includes(s))
  ) {
    next.completedAt = Date.now();
  }
  return {
    progress: { ...store.progress, [rubriqueId]: next },
  };
}

export function markSectionRead(
  store: GuideStore,
  rubriqueId: RubriqueId,
  section: SectionId,
): GuideStore {
  return updateProgress(store, rubriqueId, (p) => {
    if (p.readSections.includes(section)) return p;
    return { ...p, readSections: [...p.readSections, section] };
  });
}

export function unmarkSectionRead(
  store: GuideStore,
  rubriqueId: RubriqueId,
  section: SectionId,
): GuideStore {
  return updateProgress(store, rubriqueId, (p) => ({
    ...p,
    readSections: p.readSections.filter((s) => s !== section),
  }));
}

export function setNote(
  store: GuideStore,
  rubriqueId: RubriqueId,
  key: string,
  value: string,
): GuideStore {
  return updateProgress(store, rubriqueId, (p) => ({
    ...p,
    notes: { ...p.notes, [key]: value },
  }));
}

export function setCheck(
  store: GuideStore,
  rubriqueId: RubriqueId,
  key: string,
  value: boolean,
): GuideStore {
  return updateProgress(store, rubriqueId, (p) => ({
    ...p,
    checks: { ...p.checks, [key]: value },
  }));
}

export function addSmartObjective(
  store: GuideStore,
  rubriqueId: RubriqueId,
  objective: SmartObjective,
): GuideStore {
  return updateProgress(store, rubriqueId, (p) => ({
    ...p,
    smartObjectives: [...p.smartObjectives, objective],
  }));
}

export function deleteSmartObjective(
  store: GuideStore,
  rubriqueId: RubriqueId,
  objectiveId: string,
): GuideStore {
  return updateProgress(store, rubriqueId, (p) => ({
    ...p,
    smartObjectives: p.smartObjectives.filter((o) => o.id !== objectiveId),
  }));
}
