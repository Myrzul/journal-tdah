import { CardColor } from "@/components/journal/cards";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import { TABS_BY_ID } from "@/components/layout/tabs-config";
import { relativeDateLabel } from "@/lib/utils/date";

export function SoirPlaceholder({ activeDate = new Date() }: { activeDate?: Date }) {
  const tab = TABS_BY_ID.soir;
  const dateLabel = relativeDateLabel(activeDate);

  return (
    <>
      <IntroHand>
        Mon soir, {dateLabel}.
        <br />
        <span style={{ color: "var(--ink-2)" }}>Pas pour juger. Pour comprendre.</span>
      </IntroHand>

      <SectionLabel num={tab.num}>Phase 4</SectionLabel>
      <Headline accent="(porté ultérieurement)">En cours d'incarnation</Headline>

      <CardColor
        ribbon="WIP"
        title={`Onglet ${tab.label}`}
        sub="Cette section sera portée depuis le prototype dans la phase 4 : auth + DB + persistance + sauvegarde automatique."
      >
        <p style={{ marginTop: 12, opacity: 0.92 }}>
          Pour l'instant, retourne au <strong>hub</strong> via le parapluie en haut, ou ouvre la
          page <strong>/matin</strong> pour voir une démo statique du design.
        </p>
      </CardColor>
    </>
  );
}
