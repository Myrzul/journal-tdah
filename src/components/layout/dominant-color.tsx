"use client";

import { useEffect } from "react";
import type { TabId } from "./tabs-config";

/**
 * Met à jour `<html data-tab="...">` au montage. Le CSS prend ensuite le relais
 * pour basculer la variable `--dominant`. Pas besoin de provider/contexte.
 */
export function DominantTabSetter({ tab }: { tab: TabId }) {
  useEffect(() => {
    document.documentElement.dataset.tab = tab;
  }, [tab]);
  return null;
}
