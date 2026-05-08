import Link from "next/link";
import { IconEyeOpen } from "@/components/icons";
import { ThermoTool } from "@/components/tools/thermo-tool";

export default function OutilsPage() {
  return (
    <>
      <ThermoTool variant="visual" />

      {/* Accroche vers les autres outils — pour l'instant juste l'auto-évaluation.
          En grandissant, ce bloc deviendra le funnel par intention. */}
      <Link href="/outils/evaluation" className="tool-card">
        <span className="tool-card-icon">
          <IconEyeOpen size={28} color="var(--ch-attention)" />
        </span>
        <span className="tool-card-text">
          <span className="tool-card-eyebrow">Auto-évaluation TDAH</span>
          <span className="tool-card-title">Mes symptômes & leurs répercussions</span>
          <span className="tool-card-sub">
            68 questions, 8 à 12 minutes. À refaire idéalement tous les 3 mois pour suivre
            l'évolution.
          </span>
        </span>
        <span className="tool-card-arrow">→</span>
      </Link>
    </>
  );
}
