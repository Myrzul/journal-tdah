"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBook, IconClock, IconHourglass, IconList } from "@/components/icons";
import { Headline, IntroHand, SectionLabel } from "@/components/journal/typography";
import {
  addSmartObjective,
  deleteSmartObjective,
  loadGuideStore,
  markSectionRead,
  saveGuideStore,
  setNote,
  unmarkSectionRead,
  updateProgress,
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

const RUBRIQUE_ID: RubriqueId = "06";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique06Page({ rubrique }: Props) {
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
  const onCheck = (key: string, val: boolean) => {
    setStore((st) =>
      updateProgress(st, RUBRIQUE_ID, (p) => ({
        ...p,
        checks: { ...p.checks, [key]: val },
      })),
    );
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

      {active === "intro" && (
        <SectionIntro
          rubColor={rubColor}
          read={isRead("intro")}
          onToggleRead={() => toggleRead("intro")}
        />
      )}
      {active === "pratique" && (
        <SectionPratique
          rubColor={rubColor}
          read={isRead("pratique")}
          onToggleRead={() => toggleRead("pratique")}
        />
      )}
      {active === "histoire" && (
        <SectionHistoire
          read={isRead("histoire")}
          onToggleRead={() => toggleRead("histoire")}
          rubColor={rubColor}
        />
      )}
      {active === "phases" && (
        <SectionPhases
          rubColor={rubColor}
          notes={progress.notes}
          onNoteSave={onNoteSave}
          checks={progress.checks}
          onCheck={onCheck}
          objectives={progress.smartObjectives}
          onAddObjective={(obj) =>
            setStore((st) => addSmartObjective(st, RUBRIQUE_ID, obj))
          }
          onDeleteObjective={(id) =>
            setStore((st) => deleteSmartObjective(st, RUBRIQUE_ID, id))
          }
          read={isRead("phases")}
          onToggleRead={() => toggleRead("phases")}
        />
      )}
      {active === "retenir" && (
        <SectionRetenir
          read={isRead("retenir")}
          onToggleRead={() => toggleRead("retenir")}
          rubColor={rubColor}
        />
      )}
    </>
  );
}

/* === SECTION A — REPÉRER ET COMPRENDRE (PDF p.1) === */
function SectionIntro({
  rubColor,
  read,
  onToggleRead,
}: {
  rubColor: string;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <IntroHand>
        La perception du temps comme filant plus vite qu'on ne le vit, est accrue quand on vit avec un TDAH.
      </IntroHand>

      <p className="guide-paragraph">
        Les tâches s'empilent, les retards s'enchaînent, et la culpabilité
        s'invite. <b>S'organiser</b>, c'est rendre <b>visible</b> et{" "}
        <b>prévisible</b> ce qui est important pour soi. <b>Planifier</b>,{" "}
        <b>séquencer</b>, <b>externaliser</b>, structurer la journée permet
        de soulager la charge mentale. L'objectif n'est pas la perfection,
        ni de tout contrôler, mais de créer des <b>repères fiables</b> et{" "}
        <b>souples</b> pour avancer avec plus de sérénité.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>
            J'ai du mal à <b>hiérarchiser</b>, <b>séquencer</b>,{" "}
            <b>planifier</b> mes activités et projets,
          </li>
          <li>
            J'ai l'impression que le <b>temps file</b> sans que je m'en rende
            compte,
          </li>
          <li>
            Je <b>surestime</b> ce que je peux accomplir dans un{" "}
            <b>temps donné</b>,
          </li>
          <li>
            J'<b>estime mal</b> les <b>durées</b> (
            <i>préparation, trajet, exécution des tâches</i>),
          </li>
          <li>
            Je suis souvent <b>en retard</b> ou <b>hors délai</b> pour mes
            échéances,
          </li>
          <li>
            Je me sens constamment débordé·e, <i>en train de "courir après le temps"</i>.
          </li>
        </ul>
      </div>

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>

      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>privée &amp; professionnelle</b></h4>
          <ul className="guide-bullets">
            <li>
              Je ne parviens pas à <b>organiser</b> ma <b>vie privée</b> et/ou
              ma <b>vie professionnelle</b>, à <b>mener à bien</b> les tâches
              prévues (<i>ménagères, administratives…</i>).
            </li>
            <li>
              J'<b>estime mal</b> les <b>durées</b> (
              <i>d'exécution des tâches, de préparation au départ, de trajet</i>
              ), ce qui me conduit à être souvent en <b>retard</b>, à être{" "}
              <b>hors délais</b>…
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphère <b>sociale</b></h4>
          <ul className="guide-bullets">
            <li>
              Mes difficultés à être à l'heure, à être "dans les temps",
              génèrent des <b>conflits</b> ; je me sens <b>mal perçu·e</b> par
              les autres.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>cognitive</b> et <b>psychoaffective</b></h4>
          <ul className="guide-bullets">
            <li>
              Je gère <b>inefficacement</b> mon <b>temps</b> ou{" "}
              <b>compense</b> mes difficultés avec une <b>rigidité excessive</b>{" "}
              (<i>discipline stricte</i>).
            </li>
            <li>
              Ces difficultés génèrent aussi du <b>stress</b> et un{" "}
              <b>sentiment d'échec</b>.
            </li>
          </ul>
        </div>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* === SECTION B — EN PRATIQUE (PDF p.2) === */
function SectionPratique({
  rubColor,
  read,
  onToggleRead,
}: {
  rubColor: string;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <SectionLabel num="•">En pratique, concrètement</SectionLabel>
      <Headline accent="& bénéfices">Quels objectifs</Headline>

      <div className="guide-block guide-block-objectifs" style={{ ["--rub-color" as string]: rubColor }}>
        <p className="guide-block-lead">
          Passer d'un <b>temps subi</b> à un <b>temps choisi</b>, c'est :
        </p>
        <ul className="guide-bullets">
          <li>
            Mieux <b>estimer</b> la <b>durée</b> des tâches et connaître ma{" "}
            <b>capacité attentionnelle</b>,
          </li>
          <li>
            Mieux <b>me repérer</b> dans le <b>temps</b> pour limiter les
            retards, respecter les échéances,
          </li>
          <li>
            Augmenter ma <b>productivité</b> et mes chances de <b>réussite</b>{" "}
            (<i>Apprendre à fractionner et planifier pour mener à terme mon projet</i>),
          </li>
          <li>
            <b>Structurer</b> mes journées (<i>baliser, sécuriser</i>) pour{" "}
            <b>diminuer le stress</b> et renforcer mon sentiment d'<b>efficacité</b>.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Pendant 2 semaines, chaque dimanche soir, je planifie ma
              semaine en 15 minutes avec 3 tâches prioritaires maximum par
              jour."
            </i>
          </p>
        </div>
      </div>

      <SectionLabel num="•">Les outils pour m'aider</SectionLabel>
      <Headline accent="à mobiliser">Mes appuis</Headline>

      <div className="guide-tools-list">
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Appli de listes ou côté verso du Journal de bord
          </div>
          <p className="guide-tool-static-arrow">
            ▶ Lister et catégoriser mes envies et obligations.
          </p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Matrice d'Eisenhower, planificateur, calendrier mural
          </div>
          <p className="guide-tool-static-desc">supports papiers ou numériques.</p>
          <p className="guide-tool-static-arrow">▶ Prioriser et planifier.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Time-Timer + Pomodoro
          </div>
          <p className="guide-tool-static-desc">Le combo.</p>
          <p className="guide-tool-static-arrow">▶ Structurer et rythmer ma journée.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Séquenceur, to-do list
          </div>
          <p className="guide-tool-static-desc">supports papiers ou numériques.</p>
          <p className="guide-tool-static-arrow">▶ Fractionner pour mieux avancer.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Applications de rappels, montre connectée
          </div>
          <p className="guide-tool-static-desc">
            alarmes, rappels de l'agenda en ligne, des plateformes de
            rendez-vous.
          </p>
          <p className="guide-tool-static-arrow">▶ Limiter mes retards.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Journal de gratitude / de réussites
          </div>
          <p className="guide-tool-static-desc">
            identifier et se souvenir des éléments positifs. Je peux créer une
            rubrique dans mon application de notes, écrire dans mon agenda,
            utiliser un support dédié (<i>tableau, bocal, boîte…</i>).
          </p>
          <p className="guide-tool-static-arrow">▶ Cultiver flexibilité et satisfaction</p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à cette rubrique</SectionLabel>
      <Headline accent="à mobiliser au quotidien">3 outils intégrés</Headline>

      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Comparer estimation et temps réel — calibrer mon biais, mesurer ma capacité attentionnelle."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Rendre visible l'allocation réelle de mon temps sur 2 journées contrastées."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Routines récurrentes : matin, soir, planification dominicale, séquences."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* === SECTION C — L'HISTOIRE D'ALINE (PDF p.3) === */
function SectionHistoire({
  read,
  onToggleRead,
  rubColor,
}: {
  read: boolean;
  onToggleRead: () => void;
  rubColor: string;
}) {
  return (
    <>
      <SectionLabel num="•">L'histoire de…</SectionLabel>
      <Headline accent="43 ans, éducatrice spécialisée libérale">Aline</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « Quand je me suis lancée dans le libéral, je pensais que ce que
          j'apprécierais le plus serait d'être libre de mon organisation. En
          réalité, ça a été un calvaire ! Le chaos permanent : les
          rendez-vous qui se chevauchent, des journées ultra chargées, un
          retard chronique. Dans ma tête, je partais à l'heure, mais dans la
          vraie vie, j'avais toujours vingt minutes de décalage. Je
          sous-estimais tout : le temps de trajet entre deux familles, la
          durée d'un entretien, les imprévus, le temps de rédaction des
          comptes rendus…
        </p>
        <p>
          Quand j'ai décidé de changer les choses, j'ai commencé par tout
          chronométrer : mes "5 minutes" de pause en prenaient 18, un trajet
          que j'estimais à 10 minutes en prenait 25. J'étais dans une faille
          spatio-temporelle ! Le diagnostic de TDAH m'a aidée à prendre
          conscience de ce sur quoi je pouvais agir. J'ai ensuite pu remettre
          de l'ordre : j'ai tout concentré, le pro et le perso, dans
          l'agenda de mon téléphone. J'ai posé des limites : j'ai arrêté de
          dire oui à toutes les demandes, et j'ai réduit mes tâches
          quotidiennes à trois priorités. J'ai ajouté des marges réalistes
          entre les rendez-vous. Et j'ai affiché des rappels visuels aux
          endroits stratégiques.
        </p>
        <p>
          Aujourd'hui, je structure mes semaines : administratif et activité
          ressourçante pendant 30 minutes le matin (une marche ou du piano),
          les accompagnements l'après-midi. Les journées n'ont pas rallongé,
          je programme moins de choses, et pourtant j'en réalise bien plus
          qu'avant. Au-delà de la quantité, le temps est peut-être aussi une
          affaire de qualité ! »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* === SECTION D — LES 5 PHASES (PDF p.4-5) === */
function SectionPhases({
  rubColor,
  notes,
  onNoteSave,
  checks,
  onCheck,
  objectives,
  onAddObjective,
  onDeleteObjective,
  read,
  onToggleRead,
}: {
  rubColor: string;
  notes: Record<string, string>;
  onNoteSave: (key: string, val: string) => void;
  checks: Record<string, boolean>;
  onCheck: (key: string, val: boolean) => void;
  objectives: SmartObjective[];
  onAddObjective: (o: SmartObjective) => void;
  onDeleteObjective: (id: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  const PHASE3_REGLES = [
    { key: "p3_deadlines", label: "Je note les deadlines (rétroplanning pour les grands projets)" },
    { key: "p3_rappels", label: "Je programme des rappels" },
    { key: "p3_3a5", label: "Je prévois 3 à 5 tâches max dans ma to-do list quotidienne" },
    { key: "p3_marges", label: "Je prévois des temps supplémentaires : marges / imprévus et pauses" },
  ];

  const PHASE5_HABITUDES = [
    { key: "p5_creneaux", label: "Je me réserve des créneaux" },
    { key: "p5_freq", label: "Je définis des fréquences" },
    { key: "p5_supports", label: "Je m'appuie sur des supports visuels, check-lists…" },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">5 phases</Headline>

      <GuidePhaseCard num={1} title="Prendre conscience du temps" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je porte une <b>montre</b>, j'installe des <b>horloges</b> dans
            différents lieux (<i>cuisine, salon, bureau</i>), afin d'avoir un{" "}
            <b>accès constant</b> au temps et de le rendre <b>visible</b>,{" "}
            <b>concret</b>.
          </li>
          <li>
            J'évalue objectivement la <b>durée</b> de mes tâches{" "}
            <b>récurrentes</b> (<i>douche, maquillage, habillage, repas, appels, ménage…</i>).
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je complète un <b>tableau d'estimation</b> du temps :
        </p>
        <ul className="guide-bullets">
          <li>
            <b>Comparer</b> estimation et réalité m'aidera à affiner ma
            représentation du temps.
          </li>
          <li>
            <b>Je recommence</b> jusqu'à une estimation proche du temps réel.
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="L'outil dédié pour cette phase : estim. → réel → écart."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes 5 tâches récurrentes à chronométrer en priorité"
          hint="Celles où je suis le plus dans le déni du temps qu'elles prennent."
          initial={notes.p1_taches_chrono ?? ""}
          onSave={(v) => onNoteSave("p1_taches_chrono", v)}
          placeholder="Ex : douche, trajet bureau, préparer un mail…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Identifier sa capacité attentionnelle" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je choisis une <b>tâche</b> qui demande un <b>effort de concentration</b>{" "}
            (<i>ex : payer une facture, lire un article</i>).
          </li>
          <li>
            Je lance le <b>chronomètre</b> jusqu'au <b>premier décrochage</b>{" "}
            attentionnel (<i>je peux mettre du temps à en prendre conscience !</i>).
          </li>
          <li>
            Je <b>répète</b> pour <b>3 tâches</b>, en notant les{" "}
            <b>distracteurs</b> et le <b>contexte</b> (
            <i>
              moment de la journée, lieu, niveau de fatigue /10, moral /10,
              émotion·s ressenties, personnes présentes…
            </i>
            ).
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je calcule / estime la <b>durée moyenne</b> : c'est{" "}
          <b>ma capacité attentionnelle</b>, qui me servira d'<b>unité de base</b>{" "}
          (<i>cf phase 4</i>).
        </p>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Quelques "Lois du temps"</span>
          <ul className="guide-bullets" style={{ marginTop: 8, marginBottom: 0 }}>
            <li>
              <i>Il faut toujours <b>plus de temps</b> que prévu.</i>
            </li>
            <li>
              <i>Plus on est <b>interrompu</b>, plus on met de temps.</i>
            </li>
            <li>
              <i>L'<b>efficacité diminue</b> dans le temps.</i>
            </li>
            <li>
              <i>Plus on a de temps, plus on en prend.</i>
            </li>
          </ul>
        </div>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma capacité attentionnelle moyenne (sur 3 mesures)"
          initial={notes.p2_capacite ?? ""}
          onSave={(v) => onNoteSave("p2_capacite", v)}
          placeholder="Ex : 22 min en moyenne — c'est mon « unité de temps » personnelle."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={3} title="Planifier avec méthode" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je <b>liste</b> toutes mes <b>tâches</b> et <b>obligations</b> (
            <i>envies de toutes sortes, projets, rendez-vous, …</i>).
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ dans mon <b>journal de bord</b> côté "verso".
            </p>
          </li>
          <li>
            Je <b>priorise</b> selon l'<b>urgence</b> et l'<b>importance</b>{" "}
            pour déterminer les <b>impératifs</b> de la semaine / de la journée
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ <b>Matrice d'Eisenhower</b>
            </p>
          </li>
          <li>
            Je <b>découpe</b> chaque projet/activité en tâches{" "}
            <b>courtes</b> et <b>concrètes</b>. J'estime leur <b>temps</b>{" "}
            d'exécution ➜ <b>Séquenceur</b>.
          </li>
          <li>
            Je <b>programme</b> ces tâches dans mon <b>agenda</b>, en
            intégrant les règles suivantes :
          </li>
        </ul>

        <ul className="guide-checklist">
          {PHASE3_REGLES.map((it) => (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onCheck(it.key, !checks[it.key])}
                className={`guide-check ${checks[it.key] ? "is-on" : ""}`}
                style={{ ["--rub-color" as string]: rubColor }}
              >
                <span className="guide-check-box" aria-hidden="true">
                  {checks[it.key] ? "✓" : ""}
                </span>
                <span className="guide-check-label">{it.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Pour les routines de planification (semaine, lendemain) ou les séquences récurrentes."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Agir avec la conscience du temps" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je <b>limite</b> le temps par tâche ➜ <b>timer</b>, créneaux dédiés.
          </li>
          <li>
            Je fais <b>immédiatement</b> ce qui prend <b>moins de 2 mn</b>.
          </li>
          <li>
            Je <b>fractionne</b> mon travail / mon activité :
            <ul className="guide-sub-bullets">
              <li>
                <b>Sessions courtes</b> (
                <i>durée équivalente à ma capacité attentionnelle = 1 unité de temps</i>
                )
              </li>
              <li><b>Pauses programmées</b></li>
            </ul>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ <b>Technique Pomodoro</b> : 1 séquence = 1 unité + 1 pause de
              5 mn. Après 4 séquences = pause de 15-30 mn
            </p>
          </li>
          <li>
            Je <b>surveille</b> le <b>temps qui passe</b> (
            <i>montre, alarme, timer</i>).
          </li>
          <li>
            Je <b>vérifie</b> en fin de journée / de semaine ce qui a été fait :
            <ul className="guide-sub-bullets">
              <li>
                Je constate le <b>travail réalisé</b> et m'en <b>félicite</b>.
              </li>
              <li>
                <b>Je reporte</b> ce qui n'a pas été fait (
                <i>dans la to-do list du lendemain / de la semaine suivante</i>
                ), <b>sans culpabiliser</b>.
              </li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée (mode Pomodoro)"
          sub="Une session = 1 unité de temps + 5 min de pause. Mesure-toi."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={5} title="Automatiser et simplifier" rubColor={rubColor}>
        <p className="guide-paragraph">Je me crée des <b>habitudes</b> :</p>
        <ul className="guide-checklist">
          {PHASE5_HABITUDES.map((it) => (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onCheck(it.key, !checks[it.key])}
                className={`guide-check ${checks[it.key] ? "is-on" : ""}`}
                style={{ ["--rub-color" as string]: rubColor }}
              >
                <span className="guide-check-box" aria-hidden="true">
                  {checks[it.key] ? "✓" : ""}
                </span>
                <span className="guide-check-label">{it.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <ul className="guide-bullets" style={{ marginTop: 12 }}>
          <li>
            Je "<b>routinise</b>" la <b>planification</b> :
            <ul className="guide-sub-bullets">
              <li>de la semaine</li>
              <li>du lendemain</li>
            </ul>
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ J'y consacre un créneau de
            </p>
            <ul className="guide-sub-bullets">
              <li>
                <b>10-15 mn</b> chaque <b>semaine</b>, (<i>ex : dimanche soir</i>)
              </li>
              <li>
                <b>5-10 mn</b> chaque <b>soir</b>.
              </li>
            </ul>
          </li>
          <li>
            Je "<b>routinise</b>" la consultation de mon <b>agenda</b> : matin,
            midi et soir.
          </li>
          <li>
            J'<b>automatise</b> les tâches <b>répétitives</b> (
            <i>paiements par prélèvements, rappels</i>).
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Je fais immédiatement ce qui prend moins de 2 mn</span>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Routines de planification : crée une checklist « dimanche soir », « tous les soirs »."
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

/* === SECTION E — À RETENIR (PDF p.6) === */
function SectionRetenir({
  read,
  onToggleRead,
  rubColor,
}: {
  read: boolean;
  onToggleRead: () => void;
  rubColor: string;
}) {
  return (
    <>
      <SectionLabel num="•">À retenir</SectionLabel>
      <Headline accent="rubrique #06">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Organisation &amp; gestion du temps
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Passer <b>d'un temps subi</b> à un <b>temps choisi</b>.{" "}
          <b>Structurer</b> ses journées pour <b>réduire le stress</b> et{" "}
          <b>augmenter</b> son <b>efficacité</b>.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Prends <b>conscience</b> du <b>temps réel</b> : porte une montre,
            mesure tes durées d'exécution, compare avec tes estimations.
          </li>
          <li>
            Identifie ta <b>capacité attentionnelle</b> et utilise-la comme{" "}
            <b>unité de base</b> (Pomodoro personnalisé).
          </li>
          <li>
            Liste, priorise, découpe, estime, <b>planifie</b> dans un{" "}
            <b>agenda unique</b>.
          </li>
          <li>
            Prévois des <b>marges</b> pour les <b>imprévus</b> et des{" "}
            <b>pauses</b> pour éviter la <b>saturation</b>.
          </li>
          <li>
            Limite-toi à <b>3-5 tâches par jour</b>. Fais <b>immédiatement</b>{" "}
            ce qui prend <b>moins de 2 mn</b>.
          </li>
          <li>
            <b>Routinise</b> la <b>planification</b> : chaque dimanche pour la
            semaine, chaque soir pour le lendemain.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Le temps peut se dompter. En <b>apprenant</b> à le <b>percevoir</b>,
          à le <b>mesurer</b> et à le <b>structurer</b>, tu en reprendras le{" "}
          <b>contrôle</b>.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
