"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Umbrella } from "@/components/monsters";
import { TABS_BY_ID, type TabId } from "./tabs-config";

type AppHeaderProps = {
  tabId: TabId;
};

export function AppHeader({ tabId }: AppHeaderProps) {
  const tab = TABS_BY_ID[tabId];
  const Mascot = tab.mascot;

  return (
    <header className="app-header" style={{ background: tab.cssColor }}>
      <Link
        href="/"
        className="brand-row"
        aria-label="Retour à l'accueil"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Umbrella color="white" size={42} />
        <div className="brand-text">
          <span className="brand-eyebrow">Pratique d'introspection</span>
          <span className="brand-title">JOURNAL TDAH</span>
        </div>
      </Link>

      <div className="header-eyebrow">
        <span>{tab.num}</span>
        <span>·</span>
        <span>{tab.label}</span>
      </div>
      <h1 className="tab-title">{tab.label.toUpperCase()}</h1>
      <p className="tab-subtitle">{tab.sub}</p>

      <motion.div
        key={tab.id}
        className="header-mascot"
        initial={{ y: 0, rotate: 0 }}
        animate={{
          y: [0, -14, 0],
          rotate: [0, -6, 4, 0],
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <Mascot color="white" />
      </motion.div>

      <div className="umbrella-pill">
        <Umbrella color={tab.hex} number={Number(tab.num)} />
      </div>
    </header>
  );
}
