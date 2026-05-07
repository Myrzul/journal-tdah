"use client";

import { BoussoleDemo } from "@/components/demos/boussole-demo";
import { SemaineDemo } from "@/components/demos/semaine-demo";

export function RecapView() {
  return (
    <>
      <SemaineDemo />
      <div className="recap-divider" aria-hidden="true" />
      <BoussoleDemo />
    </>
  );
}
