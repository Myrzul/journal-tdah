"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";
import { DominantTabSetter } from "./dominant-color";
import { TABS_BY_ID, type TabId } from "./tabs-config";
import { TabsNav } from "./tabs-nav";

const DEFAULT_TAB: TabId = "aujourdhui";

function tabFromPath(pathname: string): TabId {
  const seg = pathname.split("/").filter(Boolean)[0] as TabId | undefined;
  if (seg && seg in TABS_BY_ID) return seg;
  return DEFAULT_TAB;
}

/**
 * Pages avec leur propre header full-bleed contextuel — l'AppHeader global
 * doit être caché pour éviter un double bandeau (sinon chevauchement visuel).
 */
function hasOwnHeader(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // /guide/[slug] (pas /guide tout court) — la rubrique a son header coloré
  return segments[0] === "guide" && segments.length > 1;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const tabId = tabFromPath(pathname);
  const ownHeader = hasOwnHeader(pathname);

  return (
    <>
      <DominantTabSetter tab={tabId} />
      {!ownHeader && <AppHeader tabId={tabId} />}
      <main className="page-shell">
        <div className="page" key={tabId}>
          {children}
        </div>
        <AppFooter />
      </main>
      <TabsNav current={tabId} />
    </>
  );
}
