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

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const tabId = tabFromPath(pathname);

  return (
    <>
      <DominantTabSetter tab={tabId} />
      <AppHeader tabId={tabId} />
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
