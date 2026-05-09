"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBook, IconEyeOpen, IconList } from "@/components/icons";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import {
  addSmartObjective,
  deleteSmartObjective,
  loadGuideStore,
  markSectionRead,
  saveGuideStore,
  setNote,
  unmarkSectionRead,
} from "@/lib/guide/guide-storage";
import {
  EMPTY_GUIDE_STORE,
  emptyRubriqueProgress,
  type GuideStore,
  type RubriqueId,
  type RubriqueMeta,
  type SectionId,
  type SmartObjective,
} from "@/lib/guide/guide-types";
import { GuideMarkRead } from "./guide-mark-read";
import { GuidePersonalNote } from "./guide-personal-note";
import { GuidePhaseCard } from "./guide-phase-card";
import { GuideRubriqueHeader } from "./guide-rubrique-header";
import { GuideSectionTabs } from "./guide-section-tabs";
import { GuideSmartEditor } from "./guide-smart-editor";
import { GuideToolLink } from "./guide-tool-link";

const RUBRIQUE_ID: RubriqueId = "10";

type Props = { rubrique: RubriqueMeta };

export function Rubrique10Page({ rubrique }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<GuideStore>(EMPTY_GUIDE_STORE);
  const [active, setActive] = useState<SectionId>("intro");

  useEffect(() => {
    setStore(loadGuideStore());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => saveGuideStore(store), 500);
    return () => clearTimeout(id);
  }, [store, hydrated]);

  const progress = useMemo(
    () => store.progress[RUBRIQUE_ID] ?? emptyRubriqueProgress(RUBRIQUE_ID),
    [store],
  );

  const isRead = (s: SectionId) => progress.readSections.includes(s);
  const toggleRead = (s: SectionId) => {
    setStore((st) =>
      isRead(s) ? unmarkSectionRead(st, RUBRIQUE_ID, s) : markSectionRead(st, RUBRIQUE_ID, s),
    );
  };
  const onNoteSave = (key: string, val: string) => {
    setStore((st) => setNote(st, RUBRIQUE_ID, key, val));
  };

  const rubColor = rubrique.cssColor;

  return (
    <>
      <GuideRubriqueHeader rubrique={rubrique} />
      <GuideSectionTabs
        rubrique={rubrique}
        active={active}
        readSections={progress.readSections}
        onChange={setActive}
      />
      {active === "intro" && <SectionIntro rubColor={rubColor} read={isRead("intro")} onToggleRead={() => toggleRead("intro")} />}
      {active === "pratique" && <SectionPratique rubColor={rubColor} read={isRead("pratique")} onToggleRead={() => toggleRead("pratique")} />}
      {active === "histoire" && <SectionHistoire read={isRead("histoire")} onToggleRead={() => toggleRead("histoire")} rubColor={rubColor} />}
      {active === "phases" && (
        <SectionPhases
          rubColor={rubColor}
          notes={progress.notes}
          onNoteSave={onNoteSave}
          objectives={progress.smartObjectives}
          onAddObjective={(obj) => setStore((st) => addSmartObjective(st, RUBRIQUE_ID, obj))}
          onDeleteObjective={(id) => setStore((st) => deleteSmartObjective(st, RUBRIQUE_ID, id))}
          read={isRead("phases")}
          onToggleRead={() => toggleRead("phases")}
        />
      )}
      {active === "retenir" && <SectionRetenir read={isRead("retenir")} onToggleRead={() => toggleRead("retenir")} rubColor={rubColor} />}
    </>
  );
}

function SectionIntro({ rubColor, read, onToggleRead }: { rubColor: string; read: boolean; onToggleRead: () => void }) {
  return (
    <>
      <IntroHand>
        Devenir pleinement acteur·rice de sa vie, décisionnaire, autonome.
      </IntroHand>
      <p className="guide-paragraph">
        Reprendre le contrôle, ou se "<b>rétablir</b>", ce n'est pas
        "guérir", mais plutôt (re)devenir pleinement <b>acteur·rice</b> de sa
        vie, <b>décisionnaire</b>, <b>autonome</b>. C'est <b>accepter</b> son
        fonctionnement, dans ses <b>forces</b> et ses <b>limites</b>. C'est
        encore se (ré)appropier son <b>pouvoir d'agir</b> ("empowerment"), en
        se dotant de moyens concrets pour avancer malgré les obstacles.
        C'est enfin gagner en <b>stabilité</b>, en <b>confiance</b>, agir et
        choisir en <b>conscience</b>, avec sens, en tenant compte de ses{" "}
        <b>besoins</b>, en direction de ses <b>valeurs</b>.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>
      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>J'ai du mal à <b>installer</b> des <b>habitudes durables</b>, avec des bénéfices attendus à long terme ; <i>je préfère le plaisir immédiat</i>,</li>
          <li>Je peine à <b>réguler</b> mon <b>énergie</b> (<i>physique, cognitive, sociale, émotionnelle</i>),</li>
          <li>J'ai du mal à <b>identifier ce qui compte</b> vraiment pour moi (<i>mes besoins, mes valeurs</i>),</li>
          <li>J'applique des méthodes ou <b>stratégies</b> qui <b>ne me correspondent pas</b> toujours.</li>
        </ul>
      </div>

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>
      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>privée &amp; professionnelle</b></h4>
          <ul className="guide-bullets">
            <li>Je peine à trouver et/ou maintenir l'<b>équilibre</b> relationnel, personnel, professionnel.</li>
          </ul>
        </div>
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sur le <b>corps</b></h4>
          <ul className="guide-bullets">
            <li>J'ai tendance à <b>céder</b> à la <b>tentation</b> et à mes <b>impulsions</b>, même si cela <b>nuit</b> à mon <b>organisme</b> (<i>et si y résister m'apporterait des bénéfices supérieurs à long terme</i>).</li>
          </ul>
        </div>
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sur l'<b>esprit</b> (sphères cognitive et psychoaffective)</h4>
          <ul className="guide-bullets">
            <li>J'ai tendance au <b>perfectionnisme</b> ou au fonctionnement en "<b>tout ou rien</b>" ; j'ai du mal à introduire de la <b>nuance</b>, à <b>lâcher prise</b>.</li>
            <li>Je <b>culpabilise</b> et ressens un <b>sentiment d'échec</b> à ne pas mettre en place et/ou maintenir de nouvelles façons de faire.</li>
          </ul>
        </div>
        <div className="guide-sphere">
          <h4 className="guide-sphere-title"><b>Énergie / fatigue</b></h4>
          <ul className="guide-bullets">
            <li>Je <b>m'épuise</b> à mettre en place des stratégies <b>inefficaces</b> ou que je me contrains à <b>appliquer</b> et à suivre <b>inflexiblement</b>.</li>
          </ul>
        </div>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionPratique({ rubColor, read, onToggleRead }: { rubColor: string; read: boolean; onToggleRead: () => void }) {
  return (
    <>
      <SectionLabel num="•">En pratique, concrètement</SectionLabel>
      <Headline accent="& bénéfices">Quels objectifs</Headline>
      <div className="guide-block guide-block-objectifs" style={{ ["--rub-color" as string]: rubColor }}>
        <p className="guide-block-lead">Reprendre le <b>contrôle</b>, pour :</p>
        <ul className="guide-bullets">
          <li>Tendre vers l'<b>acceptation</b> de mon <b>fonctionnement</b>, vers l'<b>autonomie psychique</b>,</li>
          <li>Mieux <b>me connaître</b> pour aligner mes <b>choix</b> sur mes <b>besoins</b> et <b>valeurs</b>,</li>
          <li>Réguler mon <b>énergie</b> (<i>physique, cognitive, socio-émotionnelle</i>) de manière durable,</li>
          <li>Poser un <b>cadre</b>, des <b>limites</b>, sans culpabiliser,</li>
          <li>Installer et consolider des <b>habitudes</b> et <b>stratégies</b> qui ont du sens pour moi.</li>
        </ul>
        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>"Pendant 3 semaines, je pratique une technique de régulation (respiration, pause ou ancrage) 1 fois par jour".</i>
          </p>
        </div>
      </div>

      <SectionLabel num="•">Les outils pour m'aider</SectionLabel>
      <Headline accent="à mobiliser">Mes appuis</Headline>
      <div className="guide-tools-list">
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de bord
          </div>
          <p className="guide-tool-static-desc">mon inséparable ! (rub. #01) — Détection de mes signes d'épuisement, recueil de mes observations, pensées, réflexions.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Ronde des besoins, liste de valeurs
          </div>
          <p className="guide-tool-static-desc">Supports à télécharger.</p>
          <p className="guide-tool-static-arrow">▶ identification de mes besoins et valeurs</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Fiche "État d'esprit de croissance"
          </div>
          <p className="guide-tool-static-desc">Support à télécharger.</p>
          <p className="guide-tool-static-arrow">▶ développement de la flexibilité / souplesse d'esprit</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Check-lists de routines, créneaux dédiés dans l'agenda, applications de rappel
          </div>
          <p className="guide-tool-static-arrow">▶ Installation de "routines" / habitudes.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Échelles d'autoévaluation
          </div>
          <p className="guide-tool-static-desc">à compléter.</p>
          <p className="guide-tool-static-arrow">▶ Suivi et ajustements.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de gratitude / de réussites
          </div>
          <p className="guide-tool-static-desc">
            identifier et se souvenir des éléments positifs. Je peux créer
            une rubrique dans mon application de notes, écrire dans mon
            agenda, utiliser un support dédié (<i>tableau, bocal, boîte…</i>).
          </p>
          <p className="guide-tool-static-arrow">▶ Valoriser mes progrès (renforcement positif).</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Carnet de rétablissement
          </div>
          <p className="guide-tool-static-desc">à découvrir.</p>
          <p className="guide-tool-static-arrow">▶ acceptation, "empowerment"</p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à cette rubrique</SectionLabel>
      <Headline accent="à mobiliser au quotidien">2 outils intégrés</Headline>
      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Installer des routines simples — les répéter, les renforcer progressivement."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/evaluation"
          icon={IconEyeOpen}
          title="Auto-évaluation TDAH"
          sub="Suivre l'évolution dans le temps — comparer, ajuster."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionHistoire({ read, onToggleRead, rubColor }: { read: boolean; onToggleRead: () => void; rubColor: string }) {
  return (
    <>
      <SectionLabel num="•">L'histoire de…</SectionLabel>
      <Headline accent="48 ans, chargée de communication">Gwen</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « J'ai passé trente ans à lutter. J'ai enchaîné les jobs :
          saisonnière, animatrice, vendeuse, graphiste freelance,
          formatrice… J'étais sur tous les fronts, je m'essoufflais vite…
          et je culpabilisais. À l'adolescence, je recherchais déjà
          l'intensité : alcool, cannabis, nuits blanches, prises de risque
          absurdes. On a d'abord détecté un HPI (
          <i>haut potentiel intellectuel</i>), et je m'y suis accrochée, en
          pensant que cela expliquait mes difficultés. Mais j'ai fini par
          comprendre que le HPI n'est pas un diagnostic, ni une explication
          à l'anxiété, à la désorganisation ou à l'impulsivité.
        </p>
        <p>
          C'est à 46 ans, après un burn-out, que tout s'est éclairé : T-D-A-H.
          J'ai voulu y aller à fond, comme à mon habitude, et tout changer
          d'un coup. Ma psychiatre m'a freinée : "Une seule chose à la
          fois." J'ai choisi un ancrage sensoriel olfactif : chaque matin,
          respirer une huile essentielle, me concentrer sur mes sensations,
          ici et maintenant. Au début, j'oubliais et je culpabilisais. Puis
          j'ai appris à me dire : "Pas de panique, je réessaie demain ! "
          J'ai également repéré mes signaux de surcharge, et j'ai changé
          d'environnement : je suis devenue chargée de communication dans un
          tiers-lieu, un cadre calme mais vivant, où ma créativité est une
          force.
        </p>
        <p>
          Aujourd'hui, je ne lutte plus "contre", je compose "avec".
          Reprendre le contrôle, pour moi, c'est me libérer de certaines
          limites et exigences, viser non plus la perfection, mais une bonne
          et juste direction : la mienne. »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionPhases({
  rubColor,
  notes,
  onNoteSave,
  objectives,
  onAddObjective,
  onDeleteObjective,
  read,
  onToggleRead,
}: {
  rubColor: string;
  notes: Record<string, string>;
  onNoteSave: (key: string, val: string) => void;
  objectives: SmartObjective[];
  onAddObjective: (o: SmartObjective) => void;
  onDeleteObjective: (id: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard num={1} title="Soutenir le cerveau" rubColor={rubColor}>
        <p className="guide-paragraph">
          Pour adopter ou consolider les piliers d'un <b>cerveau en bonne santé</b>, j'envisage de :
        </p>
        <ul className="guide-bullets">
          <li>Soigner mon <b>alimentation</b>,</li>
          <li>Prendre soin de mon <b>sommeil</b>,</li>
          <li><b>Bouger</b> / sortir,</li>
          <li>Être en <b>lien</b> / nouer des <b>relations</b>,</li>
          <li><b>Apprendre</b>, stimuler ma réserve cognitive,</li>
          <li>Créer, <b>exprimer</b> (<i>mes émotions</i>),</li>
          <li>Cultiver la gratitude, le <b>positif</b>,</li>
          <li>Limiter les <b>toxiques</b>,</li>
          <li>Faire des <b>activités</b> que j'aime,</li>
          <li>Me fixer des <b>objectifs</b>, avoir des <b>projets</b> personnels et professionnels.</li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Focus : TDAH et vie pro</span>
          <p className="guide-callout-text">
            <i>Comment optimiser / adapter son environnement professionnel — voir l'outil dédié de l'app.</i>
          </p>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/travail"
          icon={IconList}
          title="Focus travail"
          sub="Identifier mes besoins et préparer un plan d'aménagement professionnel."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Développer la flexibilité" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je distingue :
            <ul className="guide-sub-bullets">
              <li>ce qui peut être <b>contrôlé</b>,</li>
              <li>ce qui peut être <b>influencé</b>,</li>
              <li>ce qui ne peut l'être (<i>et qui invite à <b>lâcher prise</b></i>).</li>
            </ul>
          </li>
          <li>
            Je porte un autre regard sur <b>mes erreurs</b> et je m'exerce à
            l'"<b>état d'esprit de croissance</b>" (<i>growth mindset</i>) :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je rechercher la valeur <b>pédagogique</b> de mes <b>erreurs</b>{" "}
              et échecs, ce qu'ils m'apprennent, ce qu'ils m'invitent à ne pas
              reproduire. = "<b>comment faire différemment ?</b>"
            </p>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je <b>reformule</b> mes pensées négatives et opte pour des{" "}
              <b>pensées plus aidantes</b>, constructives. = "<b>comment penser différemment ?</b>"
            </p>
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Le mantra</span>
          <p className="guide-callout-text" style={{ fontFamily: "var(--font-hand)", fontSize: 18, lineHeight: 1.4 }}>
            « Je fais ce qui dépend de moi. J'influence ce que je peux. Je
            lâche prise sur le reste. J'apprends de mes erreurs. »
          </p>
        </div>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Une chose que je peux contrôler aujourd'hui, et une que je dois lâcher"
          initial={notes.p2_controle ?? ""}
          onSave={(v) => onNoteSave("p2_controle", v)}
          placeholder="Contrôle : ... / Lâche prise : ..."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={3} title="Installer et maintenir les habitudes" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je définis des <b>habitudes quotidiennes</b> simples à mettre en
            œuvre et à honorer. <b>je les répète</b> et les <b>renforce</b>{" "}
            progressivement.
          </li>
          <li>
            Je détecte les signes de :
            <ul className="guide-sub-bullets">
              <li><b>fatigue</b>,</li>
              <li><b>irritabilité</b>,</li>
              <li><b>décrochage</b>,</li>
              <li><b>procrastination</b>.</li>
            </ul>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je les note dans mon <b>journal de bord</b>,
            </p>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ J'ajuste mon <b>rythme</b> : je ralentis, je fais des pauses.
            </p>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="L'outil-clé pour cette phase : créer une routine simple, la cocher, la renforcer."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes signes d'épuisement — à repérer tôt"
          initial={notes.p3_signes ?? ""}
          onSave={(v) => onNoteSave("p3_signes", v)}
          placeholder="Pour moi : ce qui annonce un débordement (fatigue, irritabilité, procrastination…)"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Consolider et renforcer" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Les exercices proposés m'invitent à "<b>rétropédaler</b>", à{" "}
            <b>prendre le temps</b> de m'observer, de me comprendre.
            <p className="guide-paragraph" style={{ marginTop: 4 }}>
              Je resterai le/la même, je ne cherche pas à me changer
              fondamentalement, mais je vise à être davantage{" "}
              <b>conscient·e</b>, attentif·ve à ce qui est <b>ici et maintenant</b>,
              à ce qui m'entoure, à ce qui m'habite. J'apprends à{" "}
              <b>me mobiliser</b> pour mener un <b>projet à venir</b>, et à
              tirer les enseignements de mes <b>expériences</b> et{" "}
              <b>erreurs passées</b>. J'apprends aussi à <b>me féliciter</b>{" "}
              du chemin parcouru.
            </p>
          </li>
          <li>
            Je tiens à jour mon <b>journal de bord</b>, mon{" "}
            <b>journal de gratitude / petites victoires</b>, je <b>partage</b>{" "}
            mes réussites et expériences avec mes <b>proches</b>, et je
            m'engage dans un <b>suivi régulier</b> si j'en ressens le besoin.
          </li>
          <li>
            Je vise le <b>rétablissement</b> et le <b>pouvoir d'agir</b> =
            apprendre à "<b>faire avec</b>", à avancer sur ce fil
            d'équilibriste, à <b>accepter</b> l'<b>inconfort</b> du{" "}
            <b>déséquilibre</b>, des oscillations, à en percevoir la{" "}
            <b>richesse</b>. J'apprends ainsi à mieux réguler ce qui est de{" "}
            <b>ma responsabilité</b>, à <b>lâcher prise</b> et à changer de
            regard sur ce qui échappe à mon <b>contrôle</b>.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Un support à ma disposition</span>
          <p className="guide-callout-text">
            <i>Carnet de rétablissement de la Clinique Sans Souci.</i>
          </p>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/evaluation"
          icon={IconEyeOpen}
          title="Auto-évaluation TDAH"
          sub="Refaire l'éval pour mesurer le chemin parcouru — comparaison automatique avec les sessions précédentes."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Le chemin parcouru depuis le début du guide"
          hint="Sans modestie, sans exagération — juste ce que tu vois."
          initial={notes.p4_chemin ?? ""}
          onSave={(v) => onNoteSave("p4_chemin", v)}
          placeholder="Ce que je sais maintenant que je ne savais pas. Ce qui a changé. Ce qui résiste."
        />

        <h4 className="guide-phase-h">Mon objectif SMART pour cette rubrique</h4>
        <p className="guide-phase-sub">
          5 champs à remplir progressivement, ou la phrase finale directement.
        </p>
        <GuideSmartEditor
          rubColor={rubColor}
          objectives={objectives}
          onAdd={onAddObjective}
          onDelete={onDeleteObjective}
        />
      </GuidePhaseCard>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

function SectionRetenir({ read, onToggleRead, rubColor }: { read: boolean; onToggleRead: () => void; rubColor: string }) {
  return (
    <>
      <SectionLabel num="•">À retenir</SectionLabel>
      <Headline accent="rubrique #10">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Reprendre le contrôle
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          <b>Accepter</b> son fonctionnement, <b>aligner</b> ses choix sur ses{" "}
          <b>valeurs</b> et installer des <b>habitudes durables</b> qui ont du{" "}
          <b>sens</b>.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            <b>Soutiens</b> ton cerveau : sommeil, alimentation, activité
            physique, liens sociaux, activités plaisantes / apprentissage /
            création.
          </li>
          <li>
            Développe ta <b>flexibilité</b> : distingue ce que tu peux
            contrôler, influencer, ou lâcher.
          </li>
          <li>
            Change de regard sur tes <b>erreurs</b> : cherche ce qu'elles
            t'apprennent (<i>état d'esprit de croissance, "Growth mindset"</i>).
          </li>
          <li>
            Installe <b>une habitude à la fois</b>, simple et répétable, avant
            d'en ajouter une autre.
          </li>
          <li>
            Détecte tes <b>signes d'épuisement</b> (
            <i>fatigue, irritabilité, procrastination</i>) et ajuste ton{" "}
            <b>rythme</b>.
          </li>
          <li>
            Vise le <b>rétablissement</b> : apprendre à "faire avec", à
            avancer malgré l'inconfort, à trouver ton équilibre.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Reprendre le contrôle, ce n'est pas devenir parfait·e ou effacer
          ses particularités. C'est devenir <b>acteur·ice de sa vie</b>, en{" "}
          <b>composant avec</b> son fonctionnement, pas contre lui.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
