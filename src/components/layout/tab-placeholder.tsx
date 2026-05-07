import { CardColor } from "@/components/journal/cards";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import { TABS_BY_ID, type TabId } from "./tabs-config";

export function TabPlaceholder({ tabId }: { tabId: TabId }) {
  const tab = TABS_BY_ID[tabId];

  return (
    <>
      <IntroHand>
        Onglet « {tab.label} » — bientôt ici.
        <br />
        <span style={{ color: "var(--ink-2)" }}>{tab.sub}</span>
      </IntroHand>

      <SectionLabel num={tab.num}>Phase 4-5</SectionLabel>
      <Headline accent="(porté ultérieurement)">En cours d'incarnation</Headline>

      <CardColor
        ribbon="WIP"
        title={`Onglet ${tab.label}`}
        sub="Cette section sera portée depuis le prototype dans les phases 4 et 5 : auth + DB + persistance + sauvegarde automatique."
      >
        <p style={{ marginTop: 12, opacity: 0.92 }}>
          Pour l'instant, va sur <strong>/matin</strong> pour voir une démo statique du design
          system. Ou sur <strong>/dev/components</strong> pour la galerie complète.
        </p>
      </CardColor>
    </>
  );
}
