"use client";

import { BoussoleDemo } from "@/components/demos/boussole-demo";
import { SemaineDemo } from "@/components/demos/semaine-demo";
import { EvalEvolution } from "@/components/tools/eval-evolution";

export function RecapView() {
  return (
    <>
      <SemaineDemo />
      <div className="recap-divider" aria-hidden="true" />
      <BoussoleDemo />
      <div className="recap-divider" aria-hidden="true" />
      <EvalEvolution />
    </>
  );
}
