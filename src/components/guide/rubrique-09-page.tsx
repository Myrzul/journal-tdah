"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBook, IconClock, IconEyeOpen } from "@/components/icons";
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

const RUBRIQUE_ID: RubriqueId = "09";

type Props = { rubrique: RubriqueMeta };

export function Rubrique09Page({ rubrique }: Props) {
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
        Maintenir le cap vers une vie épanouissante, orientée vers ce qui compte vraiment.
      </IntroHand>
      <p className="guide-paragraph">
        Un diagnostic de TDAH conclut un parcours où ont majoritairement été
        pointées les difficultés, fragilités et autres "altérations" du
        fonctionnement. <b>Changer</b>, c'est apprendre de nouvelles façons
        de faire, de penser, dont celles consistant à <b>revaloriser</b> ses
        "bizarreries", qui peuvent devenir des <b>forces</b> dans certains
        environnements. Il ne s'agit pas de tout changer et révolutionner,
        mais de déterminer ce qui semble préférable de (ré)apprendre VS ce
        qui peut être (ré)adapté. Assurer un <b>suivi régulier</b> permet de
        renforcer ses acquis, d'évaluer ses progrès, d'ajuster ses méthodes,
        et de recourir à un accompagnement le cas échéant. C'est{" "}
        <b>maintenir le cap</b> vers une vie épanouissante, orientée vers ce
        qui compte vraiment.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>
      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>Je <b>connais mal mon</b> propre <b>fonctionnement</b>, mes forces et limites,</li>
          <li>J'<b>abandonne</b> mes routines dès que la <b>nouveauté</b> s'<b>estompe</b>,</li>
          <li>Ma <b>motivation fluctue</b> ; <i>j'ai du mal à maintenir mes efforts dans le temps</i>,</li>
          <li>Je ne <b>perçois pas</b> mes <b>progrès</b> ou je les <b>minimise</b>,</li>
          <li>J'ai tendance à fonctionner seul·e <b>sans demander d'aide</b>.</li>
        </ul>
      </div>

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>
      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>privée &amp; professionnelle</b></h4>
          <ul className="guide-bullets">
            <li>Mes <b>symptômes</b> peuvent <b>fluctuer</b> dans le temps, tout au long de la journée, au cours de ma vie.</li>
            <li>Je peux <b>abandonner</b> mes <b>routines</b> (<i>par perte de motivation ou par oubli</i>), ou au contraire les maintenir avec beaucoup de <b>rigidité</b>.</li>
          </ul>
        </div>
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>cognitive</b> et <b>psychoaffective</b></h4>
          <ul className="guide-bullets">
            <li>Je peine à <b>m'autoévaluer</b>, à connaître mes <b>points forts</b> et mes <b>points faibles</b>, à prendre <b>conscience</b> de mon <b>fonctionnement</b>, ou encore de mes <b>besoins</b>.</li>
            <li>J'ai l'impression de ne <b>pas être efficace</b>, d'être en dessous de mes <b>capacités</b>.</li>
            <li>Je n'ai pas <b>confiance en moi</b>.</li>
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
        <p className="guide-block-lead">Surveiller mon <b>évolution</b>, pour :</p>
        <ul className="guide-bullets">
          <li>Suivre mes <b>progrès</b> et mes <b>fluctuations</b> comportementales,</li>
          <li>Me créer une <b>base de données personnelle</b> pour mieux ajuster mes méthodes (<i>notamment en cas de rechute</i>). <i>Ex : stratégies efficaces pour moi</i>,</li>
          <li>Valoriser mes <b>réussites</b> et renforcer ma <b>confiance</b> en moi,</li>
          <li>Savoir <b>quand</b> et <b>comment</b> solliciter un <b>accompagnement professionnel</b> (<i>traitement médicamenteux, ergothérapie, réhabilitation psychosociale, psychoéducation, psychothérapie, …</i>).</li>
        </ul>
        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>"Pendant 1 mois, chaque vendredi, je prends 10 minutes pour noter 3 réussites de la semaine et compléter mes échelles d'autoévaluation."</i>
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
          <p className="guide-tool-static-desc">mon inséparable ! (rub. #01)</p>
          <p className="guide-tool-static-arrow">▶ noter mes observations, évaluations, objectifs, avancées, obstacles, rechutes…</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Autoévaluation en ligne
          </div>
          <p className="guide-tool-static-desc">
            Échelles de suivi de l'évolution des symptômes et répercussions,
            suivi des routines, de la gestion du temps, de son bien-être…
          </p>
          <p className="guide-tool-static-arrow">▶ suivre mes symptômes et leurs répercussions, évaluer et ajuster mes stratégies.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de gratitude / de réussites
          </div>
          <p className="guide-tool-static-desc">
            identifier et se souvenir des éléments positifs. Je peux créer
            une rubrique dans mon application de notes, écrire dans mon
            agenda, utiliser un support dédié (<i>tableau, bocal, boîte…</i>)
          </p>
          <p className="guide-tool-static-arrow">▶ valoriser mes petites victoires et mes forces.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Accompagnement guidé
          </div>
          <p className="guide-tool-static-desc">
            psychiatre, neurologue, (neuro)psychologue, ergothérapeute,
            centre de réhabilitation psychosociale…
          </p>
          <p className="guide-tool-static-arrow">▶ Solliciter de l'aide pour les situations répétitives, figées, difficiles à régler seul·e.</p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à cette rubrique</SectionLabel>
      <Headline accent="à mobiliser au quotidien">2 outils intégrés</Headline>
      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/evaluation"
          icon={IconEyeOpen}
          title="Auto-évaluation TDAH"
          sub="68 questions, à refaire régulièrement pour suivre l'évolution. Comparaison automatique des sessions."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Refaire un journal sur 2 jours, plus tard, pour comparer les rythmes et l'énergie."
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
      <Headline accent="39 ans, développeur web">Rayan</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « Pendant des années, à ne pas comprendre ce qui n'allait pas chez
          moi, j'ai essayé des méthodes miracles, pris des bonnes
          résolutions… Je les tenais deux semaines, et puis tout
          s'effondrait. J'avais l'impression de tourner en rond, de
          recommencer à zéro à chaque fois, d'être incapable de maintenir
          quoi que ce soit dans la durée.
        </p>
        <p>
          C'est le diagnostic de mon fils qui m'a mis la puce à l'oreille. En
          le regardant décrocher, s'agiter, oublier, je me suis revu enfant :
          rêveur, lent, souvent dépassé. Lors de mon propre bilan, ça a été
          une évidence. Au travail, j'ai compris pourquoi je perdais le fil
          d'un projet ; à la maison, pourquoi j'étais parfois "ailleurs".
          Comprendre, cela m'a déjà rendu plus présent.
        </p>
        <p>
          J'ai aussi entamé un suivi avec un psychologue spécialisé. Comme
          je bloquais sur ce qui restait difficile, sans voir mes progrès,
          j'ai commencé un journal de réussites : trois petites victoires
          par semaine, même minuscules.
        </p>
        <p>
          Maintenant, je sais que le changement prend du temps, que les
          rechutes font partie du chemin. J'apprends à avancer à mon rythme,
          sans me mettre trop la pression — et ça change tout. »
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

      <GuidePhaseCard num={1} title="Observer et noter" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            J'observe mes <b>comportements</b> et leurs <b>fluctuations</b> :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ j'alimente mon <b>journal de bord</b> en notant :
            </p>
            <ul className="guide-sub-bullets">
              <li>les <b>stratégies efficaces</b> (<i>impact sur mon attention, mon organisation et ma motivation</i>) <b>VS</b> celles qui fonctionnent moins bien,</li>
              <li>les <b>difficultés</b> qui persistent, <b>rechutes</b>, sentiment de "<i>retour en arrière</i>"…</li>
            </ul>
          </li>
          <li>
            Je reste attentif·ve à mon <b>état émotionnel</b> et <b>anxieux</b>,
            aux <b>variations</b> de mon <b>humeur</b>.
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ J'<b>évalue</b> régulièrement (<i>ex : une fois par semaine</i>) dans mon{" "}
              <b>journal de bord</b>, sur une échelle de 1 à 10 :
            </p>
            <ul className="guide-sub-bullets">
              <li>mon <b>moral</b>,</li>
              <li>mon état de <b>fatigue</b>,</li>
              <li>mon état <b>anxieux</b>,</li>
              <li>mon <b>émotion</b> du moment.</li>
            </ul>
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes 3 stratégies les plus efficaces — et celles qui ne marchent pas pour moi"
          hint="L'idée est de constituer ta base de données personnelle."
          initial={notes.p1_strategies ?? ""}
          onSave={(v) => onNoteSave("p1_strategies", v)}
          placeholder="Marche bien : ... / Ne marche pas chez moi : ..."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Évaluer et analyser" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je mesure l'<b>évolution</b> de mes <b>symptômes</b> (
            <i>nombre, intensité</i>) et de leurs <b>répercussions</b> :
            <ul className="guide-sub-bullets">
              <li>je complète régulièrement les <b>échelles d'autoévaluation</b> en ligne (➜ rub. #01)</li>
              <li>je <b>compare</b> les résultats sur plusieurs semaines pour avoir suffisamment de <b>recul</b>.</li>
            </ul>
          </li>
          <li>
            Je note mes <b>petites victoires</b> et <b>progrès</b> quotidiens
            dans mon <b>journal de gratitude / petites victoires</b>.
          </li>
          <li>
            J'analyse les <b>obstacles</b> ; je repère :
            <ul className="guide-sub-bullets">
              <li>les <b>moments</b> de décrochage,</li>
              <li>la <b>fatigue</b> / la <b>démotivation</b>,</li>
              <li>les <b>facteurs</b> d'échec, de rechute.</li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/evaluation"
          icon={IconEyeOpen}
          title="Auto-évaluation TDAH"
          sub="68 questions structurées. Refaire l'éval permet de comparer automatiquement avec les sessions précédentes."
        />

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Je ne culpabilise pas ! L'échec fait partie du processus de changement</span>
          <p className="guide-callout-text">
            <i>
              Quand on a un TDAH, l'<b>échec</b> peut sembler inévitable, et
              un sentiment de <b>stagnation</b> peut apparaître. Il est
              toutefois crucial de le voir comme une opportunité d'<b>apprentissage</b> :
              en acceptant que l'<b>erreur</b> et la "<b>rechute</b>" font
              partie du chemin, on adopte une autre perspective, qui permet
              alors d'ajuster ses attentes.
            </i>
          </p>
          <p className="guide-callout-text" style={{ marginTop: 8 }}>
            <i>
              Revoir ses <b>objectifs</b>, les redécouper en <b>étapes
              atteignables</b>, envisager un <b>accompagnement extérieur</b>,
              peuvent également aider à clarifier les <b>priorités</b>, et
              favoriser le <b>changement</b>.
            </i>
          </p>
        </div>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma dernière rechute — sans culpabiliser"
          hint="Quand ? Pourquoi ? Qu'est-ce que j'en apprends ?"
          initial={notes.p2_rechute ?? ""}
          onSave={(v) => onNoteSave("p2_rechute", v)}
          placeholder="Contexte, facteurs, leçon retenue…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={3} title="Ajuster et expérimenter" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>J'ai conscience et accepte que le <b>changement</b> prend <b>du temps</b>.</li>
          <li>
            J'avance <b>progressivement</b>, pas à pas, je teste{" "}
            <b>une stratégie après l'autre</b>. Si j'ai le sentiment d'avoir
            une montagne à franchir, je redécoupe, <b>je vise la prochaine étape</b>{" "}
            "refuge".
          </li>
          <li>
            <b>Je m'entraîne</b>, c'est par la <b>répétition</b> (
            <i>au moins 20-25 fois</i>) que je réussirai à <b>automatiser</b>.
            Après une <b>première période</b> qui est <b>coûteuse</b> en
            ressources cognitives (<i>désapprentissage / réapprentissage de
            nouvelles façons de faire</i>), viendra le <b>soulagement</b> (
            <i>les procédures, une fois devenues habituelles, se feront "sans
            y penser, selon le même principe que pour le vélo ou la conduite</i>
            ).
          </li>
          <li>
            <b>Je m'adapte</b> = je <b>réajuste</b> mes stratégies, méthodes,
            outils et routines au fur et à mesure de mon évolution.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Le changement, ça prend du temps !</span>
          <p className="guide-callout-text">
            <i>
              J'y vais <b>pas à pas</b>. Je commence par viser la{" "}
              <b>prochaine étape</b>, qui est bien balisée, <b>PAS le sommet</b>{" "}
              de la montagne (<i>trop loin, trop haut, trop flou</i>).
            </i>
          </p>
        </div>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma prochaine étape « refuge »"
          hint="Pas le sommet — la prochaine étape balisée."
          initial={notes.p3_refuge ?? ""}
          onSave={(v) => onNoteSave("p3_refuge", v)}
          placeholder="Ex : Tenir la routine du matin pendant 1 semaine. Pas plus."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Solliciter un accompagnement" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            <b>J'accepte</b> et décide de demander le soutien de{" "}
            <b>professionnel·le·s</b> si je détecte certains <b>signaux</b> :
            <ul className="guide-sub-bullets">
              <li><b>Absence d'évolution favorable</b> des symptômes et répercussions fonctionnelles / multiples rechutes</li>
              <li>Difficultés à <b>maintenir</b> les <b>habitudes</b>,</li>
              <li>Besoin d'un <b>cadre</b>, d'un <b>soutien externe</b> pour me mobiliser,</li>
              <li><b>Traitement médicamenteux</b> envisagé</li>
            </ul>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je peux bénéficier de <b>différents types</b> d'accompagnements (
              <i>
                suivi psychiatrique, psychoéducation, réhabilitation
                psychosociale, psychothérapie, remédiation cognitive,
                ergothérapie, jobcoaching…
              </i>
              )
            </p>
          </li>
          <li>Je sollicite le regard et l'avis de <b>personnes de confiance</b> si je doute.</li>
          <li>
            Je m'engage dans un <b>travail d'équipe</b> au sein duquel je
            serai <b>actif</b>. Je peux commencer par partager mes
            observations et données pour affiner les interventions.
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Les signaux qui me poussent (ou pourraient me pousser) à demander de l'aide"
          initial={notes.p4_signaux ?? ""}
          onSave={(v) => onNoteSave("p4_signaux", v)}
          placeholder="Ce qui me dit « cette fois je ne vais pas y arriver tout·e seul·e »…"
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
      <Headline accent="rubrique #09">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Évolution &amp; accompagnement
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          <b>Suivre</b> ses progrès, <b>ajuster</b> ses stratégies et savoir
          quand solliciter un <b>accompagnement</b> professionnel.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            <b>Observe</b> tes comportements et <b>note</b> dans ton{" "}
            <b>journal de bord</b> : ce qui fonctionne, ce qui coince, ce qui
            a changé.
          </li>
          <li>
            Complète régulièrement les <b>échelles d'autoévaluation</b> pour
            mesurer l'évolution de tes symptômes et de leurs répercussions.
          </li>
          <li>
            Note tes <b>petites victoires</b> : cela renforce la motivation
            et la confiance en soi.
          </li>
          <li>
            Analyse les <b>obstacles</b> et les <b>rechutes</b> sans
            culpabiliser : elles font <b>partie du processus</b> de changement.
          </li>
          <li>
            Sollicite un <b>accompagnement</b> si tu as besoin d'un cadre, si
            tu te sens en difficulté, si tu envisages un traitement…
          </li>
          <li>
            <b>Le changement prend du temps</b>. Avance pas à pas, ajuste,
            recommence.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Tu n'as pas à tout faire seul·e. <b>Suivre</b> ton <b>évolution</b>{" "}
          te permet de prendre conscience du <b>chemin parcouru</b> et de
          savoir <b>quand demander de l'aide</b>.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
