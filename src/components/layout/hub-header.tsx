"use client";

import { motion } from "framer-motion";
import { MonsterReflexif, Umbrella } from "@/components/monsters";

const HUB_COLOR_HEX = "#14B8A6"; // --ch-evolution (turquoise)

export function HubHeader() {
  return (
    <header className="app-header" style={{ background: HUB_COLOR_HEX }}>
      <div className="brand-row">
        <Umbrella color="white" size={42} />
        <div className="brand-text">
          <span className="brand-eyebrow">Pratique d'introspection</span>
          <span className="brand-title">JOURNAL TDAH</span>
        </div>
      </div>

      <h1 className="tab-title">
        TABLEAU
        <br />
        DE BORD
      </h1>
      <p className="tab-subtitle">
        Tout ce que tu as posé d'un seul regard. Pas un score. Un miroir.
      </p>

      <motion.div
        className="header-mascot"
        initial={{ y: 0, rotate: 0 }}
        animate={{
          y: [0, -14, 0],
          rotate: [0, -6, 4, 0],
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <MonsterReflexif color="white" />
      </motion.div>

      <div className="umbrella-pill">
        <Umbrella color={HUB_COLOR_HEX} number={0} />
      </div>
    </header>
  );
}
