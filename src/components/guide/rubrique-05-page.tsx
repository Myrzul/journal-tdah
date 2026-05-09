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

const RUBRIQUE_ID: RubriqueId = "05";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique05Page({ rubrique }: Props) {
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
        Démarrer, savoir par où commencer, maintenir l'effort et mener à terme un projet : que d'épreuves pour un adulte avec TDAH !
      </IntroHand>

      <p className="guide-paragraph">
        Arrêter de procrastiner, goûter à la satisfaction de l'action engagée
        et aboutie, sont tributaires d'une <b>motivation</b> qui, lorsque les
        niveaux de dopamine font défaut, peut être cultivée consciemment,
        méthodiquement : par un nouveau regard, de la nuance, en se libérant
        de ses exigences ; et en s'entraînant, pour automatiser les processus
        et ainsi réduire l'effort. Prioriser et se fixer des objectifs
        atteignables constituent les premiers pas. Nul besoin d'être
        passionné·e pour être motivé·e : agir, même peu, crée un cercle
        vertueux : l'énergie, la satisfaction et la récompense de
        l'accomplissement inviteront à réitérer l'expérience.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>
            Je <b>repousse souvent</b> ce que j'ai à faire ; <i>je procrastine</i>,
          </li>
          <li>
            Les <b>tâches longues</b>, <b>répétitives</b>, <b>peu stimulantes</b>{" "}
            ou exigeant un <b>effort mental</b> soutenu me rebutent ;{" "}
            <i>je les évite</i>,
          </li>
          <li>
            J'ai besoin de <b>récompenses immédiates</b> pour me mettre en
            mouvement,
          </li>
          <li>
            Je <b>commence beaucoup</b> de projets mais j'en termine peu.
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
              Je laisse souvent mes <b>projets inachevés</b> ; j'ai un
              rendement <b>irrégulier</b>.
            </li>
            <li>
              Pour agir, j'ai besoin d'<b>échéances</b> imminentes, d'un
              sentiment d'<b>urgence</b>, de <b>pression externe</b>.
            </li>
            <li>
              Je <b>perds rapidement l'intérêt</b> pour ce qui m'enthousiasmait
              au départ.
            </li>
            <li>
              Je peine à mettre en place et à <b>maintenir</b> des{" "}
              <b>routines</b>, à réaliser les <b>tâches quotidiennes</b>.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>cognitive</b> et <b>psychoaffective</b></h4>
          <ul className="guide-bullets">
            <li>
              J'ai l'impression de multiplier les <b>échecs</b>, d'être{" "}
              <b>incompétent·e</b> ; je <b>m'estime peu</b>.
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
        <p className="guide-block-lead">En entretenant ma <b>motivation</b>, je pourrai mieux :</p>
        <ul className="guide-bullets">
          <li>
            <b>Amorcer</b> la mise en route même sans envie ou sans pression
            externe,
          </li>
          <li>
            <b>Réduire</b> ma tendance à <b>procrastiner</b> en rendant les
            tâches plus accessibles ;{" "}
            <i>passer concrètement à l'action, en procédant par "micro-étapes"</i>,
          </li>
          <li>
            <b>Maintenir</b> l'effort <b>jusqu'au bout</b> et mener mes projets
            à terme,
          </li>
          <li>
            Goûter à la <b>satisfaction</b> de l'<b>accomplissement</b> ;{" "}
            <i>nourrir un cercle vertueux</i>.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Pendant 1 semaine, chaque matin, je démarre ma tâche prioritaire
              dans les 10 premières minutes."
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
            Journal de bord
          </div>
          <p className="guide-tool-static-desc">
            mon inséparable ! (rub. #01) — Je l'utilise côté verso pour mes listes.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ noter mes observations, évaluations, questions, objectifs, avancées…
          </p>
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
          <p className="guide-tool-static-arrow">
            ▶ Consolider, renforcer, entretenir ma motivation.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            1 seul et unique Agenda
          </div>
          <p className="guide-tool-static-desc">papier ou électronique</p>
          <p className="guide-tool-static-arrow">
            ▶ centraliser les obligations, événements et échéances et éviter
            les chevauchements.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Planificateur, matrice d'Eisenhower
          </div>
          <p className="guide-tool-static-desc">Supports à télécharger.</p>
          <p className="guide-tool-static-arrow">
            ▶ prioriser, découper en étapes / structurer.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Timer + séquenceur + to-do list
          </div>
          <p className="guide-tool-static-desc">le combo.</p>
          <p className="guide-tool-static-arrow">▶ m'activer, me mettre en route.</p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Outils sensoriels
          </div>
          <p className="guide-tool-static-desc">
            casque anti-bruit, bouchons d'oreilles, fidgets, diffuseurs,
            bougies, ballon d'assise, bureau debout, éclairage…
          </p>
          <p className="guide-tool-static-arrow">
            ▶ me protéger, me stimuler, optimiser mon confort.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Applications anti-distraction
          </div>
          <p className="guide-tool-static-desc">sur téléphone, tablette, ordinateur.</p>
          <p className="guide-tool-static-arrow">
            ▶ limiter les distractions, favoriser ma concentration, ma vigilance.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Liste de récompenses
          </div>
          <p className="guide-tool-static-desc">
            "la carotte", gratifications après l'effort.
          </p>
          <p className="guide-tool-static-arrow">▶ Soutenir ma motivation.</p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à cette rubrique</SectionLabel>
      <Headline accent="à mobiliser au quotidien">3 outils intégrés</Headline>

      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Découper en sous-tâches courtes avec une récompense à la fin — pattern routine."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Timer + mesure du réel — pour calibrer Pomodoro et la règle des 10 min."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Identifier le « bon moment » de la journée selon mon énergie."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* === SECTION C — L'HISTOIRE DE MINA (PDF p.3) === */
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
      <Headline accent="36 ans, cheffe de projet événementiel">Mina</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « Pendant cinq ans, j'ai eu des essais de traitement pour un trouble
          bipolaire, mais cela ne fonctionnait pas. Lors d'un nouveau bilan,
          on a découvert que j'avais un TDAH, que j'avais tellement bien
          compensé que ça avait masqué les symptômes. J'ai compris pourquoi
          j'avais 100 projets survoltants en tête sans jamais les finir,
          pourquoi je remettais toujours à demain ma paperasse, jusqu'à la
          situation d'urgence absolue (du style "la deadline était hier !!"),
          qui me faisait passer à l'action parce que je n'avais plus le choix
          et que j'étais au pied du mur.
        </p>
        <p>
          Mon cerveau a besoin de récompenses rapides, pas de bénéfices
          lointains. Aujourd'hui, je découpe tout en micro-actions. J'utilise
          un timer visuel pour me mettre en marche, je me lance des petits
          défis. Je ne pense plus "mission" laborieuse, et je me dis plutôt à
          la place que je commence par 5 toutes petites minutes ; souvent,
          une fois lancée, je continue. Et après chaque étape : un petit thé,
          une réponse à un message, une vidéo… une petite pause sympa pour me
          récompenser de mes efforts !
        </p>
        <p>
          Je n'attends plus d'avoir envie. Je me prépare à l'action, j'agis,
          et c'est après que me vient l'envie de poursuivre. »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* === SECTION D — LES 4 PHASES (PDF p.4-5) === */
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
  const PHASE2_AMENAGEMENT = [
    {
      key: "p2_distract",
      label:
        "Je réduis les sources de distraction (bureau dégagé, téléphone éloigné, notifications désactivées, messagerie coupée…)",
    },
    {
      key: "p2_sensoriel",
      label:
        "J'optimise mon confort sensoriel (température, luminosité, son ; casque, silence ou playlist adaptée)",
    },
    {
      key: "p2_motrice",
      label:
        "Si besoin, je m'accorde une courte activité motrice (étirements, exercices) pour m'activer physiquement",
    },
  ];

  const PHASE3_REGLES = [
    {
      key: "p3_2mn",
      label: "Règle des 2 min : je fais immédiatement ce qui prend moins de 2 min",
    },
    {
      key: "p3_10mn",
      label: "Règle des 10 min : j'essaie 10 min, puis je décide ou non de poursuivre",
    },
    {
      key: "p3_amorce",
      label:
        "Si la résistance persiste, je commence par une tâche plaisante courte (< 10 min) ou une micro-étape (< 2 min)",
    },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard num={1} title="Clarifier et prioriser" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            <b>Je liste</b> toutes mes <b>envies</b>, <b>obligations</b>,{" "}
            <b>projets</b> (<i>to-do list "brute"</i>).
          </li>
          <li>
            J'identifie ce qui est <b>urgent</b>, et ce qui est{" "}
            <b>important</b> (<i>= qui a de la valeur pour moi</i>).
            <p className="guide-paragraph" style={{ marginTop: 4 }}>
              La <b>Matrice d'Eisenhower</b> aide à <b>prioriser</b> selon
              l'urgence (<i>date limite</i>) et l'importance (<i>pour moi</i>).
            </p>
          </li>
          <li>
            Je sélectionne <b>3 à 5 tâches par jour</b> pour éviter la
            surcharge.
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Pour chaque tâche, je clarifie mon <b>but</b> :
        </p>
        <ul className="guide-bullets">
          <li><b>Pourquoi</b> je fais cette tâche ?</li>
          <li>
            Quelle <b>satisfaction</b> ou <b>bénéfice</b> concret va-t-elle
            m'apporter ?
          </li>
        </ul>

        <ul className="guide-bullets">
          <li>
            Je <b>découpe</b> et séquence chaque tâche en <b>sous-tâches</b> :
            <ul className="guide-sub-bullets">
              <li><b>courtes</b> &amp; <b>concrètes</b>,</li>
              <li>
                formulées avec un <b>verbe d'action</b> (
                <i>ex : "envoyer le mail"</i>),
              </li>
            </ul>
          </li>
        </ul>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes 3 à 5 tâches prioritaires aujourd'hui"
          hint="Pas plus. La sélection est l'acte le plus important."
          initial={notes.p1_taches ?? ""}
          onSave={(v) => onNoteSave("p1_taches", v)}
          placeholder="1. … / 2. … / 3. …"
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Pour chacune : pourquoi ? Quelle satisfaction ?"
          initial={notes.p1_pourquoi ?? ""}
          onSave={(v) => onNoteSave("p1_pourquoi", v)}
          placeholder="Le « pourquoi » nourrit la motivation. Sans pourquoi, c'est juste une corvée."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Planifier et préparer" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>J'<b>estime</b> la <b>durée</b> de chaque sous-étape.</li>
          <li>
            Je <b>planifie</b> dans mon <b>agenda</b> unique, en partant de la{" "}
            <b>deadline</b> et en intégrant des <b>marges</b>.
          </li>
          <li>
            Je crée ma liste personnalisée de <b>récompenses</b> ➜ verso de mon{" "}
            <b>journal de bord</b>.
          </li>
          <li>
            Je choisis le <b>meilleur moment</b> de la journée, selon le{" "}
            <b>contexte</b>, l'<b>énergie</b> (
            <i>souvent le matin pour les tâches coûteuses</i>).
          </li>
        </ul>

        <h4 className="guide-phase-h">J'aménage mon environnement</h4>
        <ul className="guide-checklist">
          {PHASE2_AMENAGEMENT.map((it) => (
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
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Pour estimer chaque sous-étape, et calibrer les marges."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Pour repérer mes pics d'énergie dans la journée."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma liste personnalisée de récompenses"
          hint="« La carotte » : ce qui marche pour TOI après l'effort."
          initial={notes.p2_recompenses ?? ""}
          onSave={(v) => onNoteSave("p2_recompenses", v)}
          placeholder="Ex : un café tranquille, 10 min de jeu, une marche, appeler un·e ami·e…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard
        num={3}
        title="Passer à l'action, maintenir la concentration et l'effort"
        rubColor={rubColor}
      >
        <ul className="guide-bullets">
          <li>
            Je prépare mon <b>matériel</b> : <b>journal de bord</b>,{" "}
            <b>agenda</b>, <b>minuteur</b> (<i>visuel ou sonore</i>),{" "}
            <b>to-do list</b>, <b>liste de récompenses</b>…
          </li>
          <li>
            Je <b>pense temps et résultat</b> plutôt que <b>pénibilité</b> ou{" "}
            <b>perfection</b>.
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

        <ul className="guide-bullets" style={{ marginTop: 12 }}>
          <li>
            J'emploie la <b>méthode Pomodoro</b> :
            <ul className="guide-sub-bullets">
              <li>
                Ma <b>durée d'activité</b> = ma capacité attentionnelle (
                ➜ rub. #06) + 5 mn de pause.
              </li>
              <li>
                Après <b>4 cycles</b> maximum, je m'accorde une <b>pause longue</b> (
                <i>15-30 minutes</i>).
              </li>
            </ul>
          </li>
          <li>
            Je note mes idées/pensées dans mon <b>journal de bord</b> et/ou je
            me <b>recentre</b> dès que survient une <b>distraction</b> : je la
            repère mais je ne la suis pas ; je me parle (
            <i>"je me recentre sur ma tâche", "mon but est de…"</i>).
          </li>
        </ul>

        <h4 className="guide-phase-h">Je m'encourage et je me projette</h4>
        <ul className="guide-bullets">
          <li>Je me <b>félicite</b>.</li>
          <li>
            J'<b>imagine</b> / visualise l'après, le <b>résultat</b>, et la{" "}
            <b>satisfaction</b> post-réalisation (
            <i>pour moi / pour les autres</i>).
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée (mode Pomodoro)"
          sub="Lance une mesure « 25 min focus + 5 min pause », observe l'écart réel."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Consolider et renforcer" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je <b>coche</b> / raye chaque tâche accomplie ➜ je <b>visualise</b>{" "}
            ma progression = j'obtiens une <b>récompense visuelle immédiate</b>.
          </li>
          <li>
            Je me <b>récompense</b> à la <b>fin</b> de chaque étape ou cycle (
            <i>pause, café/thé, activité plaisante choisie</i>) ➜{" "}
            <b>liste de récompenses</b>.
          </li>
          <li>
            Je <b>reporte</b> sans culpabiliser les tâches non terminées ➜
            dans <b>mon seul et unique agenda</b>, à un <b>moment précis</b>.
          </li>
          <li>
            Je complète mon <b>Journal de réussites</b> par les{" "}
            <b>actions</b> menées à <b>terme</b>.
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ cela renforce mon sentiment d'<b>accomplissement</b>, la{" "}
              <b>confiance</b> en moi, et nourrit ma <b>motivation</b>.
            </p>
          </li>
          <li>
            J'analyse les <b>facteurs</b> de <b>réussite</b> ou de{" "}
            <b>blocage</b> (
            <i>moment de la journée, environnement, émotions, pensées…</i>)
          </li>
          <li>
            Je me <b>félicite</b> et je <b>partage</b> mes réussites avec un
            proche, un pair, un accompagnant.
          </li>
          <li>
            Je <b>répète</b> le processus régulièrement : plus on s'entraîne,
            plus cela devient automatique, donc moins coûteux et pénible.
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Cocher visuellement = récompense immédiate. Le pattern signature."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes facteurs de réussite et de blocage observés"
          hint="Sans jugement. Juste l'observation."
          initial={notes.p4_facteurs ?? ""}
          onSave={(v) => onNoteSave("p4_facteurs", v)}
          placeholder="Réussite : matin, après une marche, ... / Blocage : après-midi, faim, écran ouvert…"
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
      <Headline accent="rubrique #05">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Motivation &amp; action
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Créer un <b>cercle vertueux</b> de l'<b>action</b>. La{" "}
          <b>motivation</b> vient souvent <b>après</b> avoir commencé, pas
          avant.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Ton cerveau est particulièrement sensible à la{" "}
            <b>récompense immédiate</b>. Utilise cette caractéristique :{" "}
            <b>découpe</b>, et <b>récompense</b> chaque étape.
          </li>
          <li>
            <b>Liste</b>, <b>priorise</b> (
            <i>ex matrice d'Eisenhower</i>), découpe en sous-tâches{" "}
            <b>courtes</b> et <b>concrètes</b> avec un <b>verbe</b> d'action.
          </li>
          <li>
            <b>Clarifie</b> ton <b>but</b> : <b>pourquoi</b> cette tâche ?
            Quelle <b>satisfaction</b> m'apportera-t-elle ?
          </li>
          <li>
            Utilise les règles des <b>2 mn</b> (<i>faire immédiatement</i>) et
            des <b>10 mn</b> (
            <i>essayer, puis décider de poursuivre ou non</i>).
          </li>
          <li>
            <b>Prépare</b> ton <b>environnement</b>, réduis les{" "}
            <b>distractions</b>, choisis le <b>bon moment</b> selon ton
            énergie.
          </li>
          <li>
            Coche, raye : <b>visualise</b> ta progression. Et{" "}
            <b>félicite-toi !</b> La satisfaction nourrit la motivation.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          N'attends pas d'être motivé·e pour agir. <b>Agis pour devenir motivé·e</b>.
          Chaque petit pas compte et renforce le suivant.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
