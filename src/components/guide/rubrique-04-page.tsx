"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconBook,
  IconClock,
  IconHand,
  IconHourglass,
  IconList,
  IconWind,
} from "@/components/icons";
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

const RUBRIQUE_ID: RubriqueId = "04";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique04Page({ rubrique }: Props) {
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

/* ===================================================================
   SECTION A — REPÉRER ET COMPRENDRE (texte verbatim PDF p.1)
   =================================================================== */
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
        L'attention est une fonction précieuse, mais instable.
      </IntroHand>

      <p className="guide-paragraph">
        En particulier quand on vit avec un TDAH. Elle peut se dérober au
        moindre bruit, mouvement, pensée parasite ou notification intrusive,
        ou au contraire être totalement mobilisée, au point d'en oublier tout
        le reste. La mémoire de travail est une ressource elle aussi limitée,
        qui peut rapidement saturer, notamment en situation de double tâche
        (<i>ex écouter et prendre des notes</i>). Il est néanmoins possible de
        la soutenir et la soulager. S'appuyer sur des outils externes,
        structurer l'information et "routiniser" certaines tâches permet
        d'éviter la surcharge, en canalisant et en régulant son énergie
        cognitive, au bon moment et au bon endroit.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>
            Manque de <b>précision</b>, d'attention aux <b>détails</b>, erreurs
            d'<b>étourderie</b>,
          </li>
          <li>
            Difficultés à se <b>concentrer</b> sur des tâches <b>longues</b>,{" "}
            <b>monotones</b> ou <b>peu stimulantes</b> (
            <i>réunions, paperasse, lectures…</i>),
          </li>
          <li>
            <b>Décrochages</b> fréquents lors des conversations ou activités
            demandant un effort soutenu,
          </li>
          <li>
            Difficulté à respecter les <b>consignes</b> ou à mener les{" "}
            <b>projets à terme</b>,
          </li>
          <li>
            <b>Désorganisation</b>, <b>procrastination</b>,
          </li>
          <li>
            <b>Perte</b> ou <b>oubli</b> d'objets (
            <i>clés, papiers, matériel, téléphone, lunettes…</i>),
          </li>
          <li>
            <b>Distractibilité</b> interne (<i>pensées parasites</i>) ou externe
            (<i>bruits, interruptions</i>),
          </li>
          <li>
            <b>Oublis</b> fréquents (
            <i>rendez-vous, échéances, tâches planifiées</i>).
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
              Je ne parviens pas à maintenir l'<b>ordre</b> / la{" "}
              <b>propreté</b> chez moi et/ou au travail.
            </li>
            <li>
              Je suis souvent <b>hors délai</b> pour des échéances{" "}
              <b>administratives</b> (<i>pénalités, oublis de paiement…</i>).
            </li>
            <li>
              Je me sens <b>surchargé·e</b>, notamment en situation de{" "}
              <b>double tâche</b> (<i>ex écouter et écrire</i>).
            </li>
            <li>
              Je peine à <b>apprendre</b> / <b>mémoriser</b> et à restituer les
              informations.
            </li>
            <li>
              J'ai l'impression d'avoir "<b>sous-performé</b>" dans mon parcours
              scolaire et/ou professionnel, malgré mes compétences.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>cognitive</b> &amp; <b>psychoaffective</b></h4>
          <ul className="guide-bullets">
            <li>
              J'ai du mal à <b>suivre le fil</b> d'un récit (
              <i>conversationnel, cinématographique, littéraire…</i>)
            </li>
            <li>
              Je suis sujet·te à l'<b>anxiété</b> / au <b>stress</b>.
            </li>
            <li>
              Je me sens <b>incompétent·e</b>, je perds <b>motivation</b> et{" "}
              <b>confiance</b> en moi.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title"><b>Énergie / fatigue</b></h4>
          <ul className="guide-bullets">
            <li>Je me sens <b>épuisé·e</b>.</li>
          </ul>
        </div>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION B — EN PRATIQUE, CONCRÈTEMENT (texte verbatim PDF p.2)
   =================================================================== */
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
          En <b>développant</b> mon <b>attention</b> et ma <b>mémoire</b>, je
          peux espérer :
        </p>
        <ul className="guide-bullets">
          <li>
            mieux <b>canaliser</b> mes <b>ressources cognitives</b> (
            <i>
              en prenant conscience des signes de décrochage et des conditions
              optimales de concentration
            </i>
            ),
          </li>
          <li>
            <b>réduire</b> ma <b>charge mentale</b> + limiter les{" "}
            <b>pertes</b> et <b>oublis</b> (
            <i>
              en compensant les ressources limitées de ma mémoire de travail
              par le recours à des supports externes fiables
            </i>
            ),
          </li>
          <li>
            <b>renforcer</b> ma concentration et ma mémoire par la pratique
            régulière de méthodes adaptées et de routines stables.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Pendant 2 semaines, je vais réaliser 2 sessions de 15 minutes
              de travail concentré par jour, en éloignant les sources de
              distraction, et en utilisant un minuteur."
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
            mon inséparable ! (rub. #01) — Je l'utilise côté verso pour mes
            listes.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ livres à lire, films et séries à voir, lieux à visiter, cadeaux
            de noël, …
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Agenda partagé, Tableau mural, check-lists
          </div>
          <p className="guide-tool-static-desc">
            pense-bête et supports de communication
          </p>
          <p className="guide-tool-static-arrow">
            ▶ me libérer l'esprit, externaliser les informations importantes et
            temporaires.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Applications de rappel
          </div>
          <p className="guide-tool-static-desc">
            alarmes, rappels de l'agenda en ligne
          </p>
          <p className="guide-tool-static-arrow">
            ▶ remobiliser mon attention régulièrement, automatiser les tâches
            récurrentes.
          </p>
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
          <p className="guide-tool-static-desc">
            sur téléphone, tablette, ordinateur.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ limiter les distractions, favoriser la concentration, la
            vigilance.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Minuteur / Time Timer, application Pomodoro
          </div>
          <p className="guide-tool-static-desc">objet ou application.</p>
          <p className="guide-tool-static-arrow">
            ▶ discipliner et renforcer mon attention, me remobiliser
            régulièrement. Structurer mon temps d'activité ; systématiser les
            pauses.
          </p>
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
          sub="Externaliser les tâches récurrentes en routines structurées."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Mesurer ma capacité de concentration sans décrocher (Pomodoro à ma taille)."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Observer mes pics et creux d'énergie attentionnelle dans la journée."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION C — L'HISTOIRE D'ISMAËL (texte verbatim PDF p.3)
   =================================================================== */
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
      <Headline accent="23 ans, étudiant en architecture">Ismaël</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « J'ai pu passer des heures absorbé dans la conception d'une
          maquette ou sur un logiciel 3D, mais impossible de tenir plus de dix
          minutes sur un chapitre d'histoire de l'archi ou de théorie urbaine.
          Je relisais la même phrase cinq fois sans la comprendre. Mon esprit
          partait ailleurs. En cours magistral, c'était encore pire : je
          notais trois mots, et je décrochais complètement. Je ressortais avec
          des pages blanches, honteux.
        </p>
        <p>
          La neuropsychologue qui m'a fait passer les tests m'a expliqué que
          ma mémoire de travail est fragile, et que cela explique les cours
          théoriques interminables, les consignes que je comprends mal ou que
          je ne respecte pas. Elle m'a ensuite conseillé un psychiatre, qui a
          posé le diagnostic, et qui a mis en place le traitement (
          <i>méthylphénidate</i>). Avec la neuropsy, on a ensuite pu réfléchir
          à des stratégies qui pourraient m'aider. Par exemple, j'ai mesuré ma
          capacité attentionnelle : 18 minutes. Après, je décroche. Du coup je
          me suis adapté : 18 minutes de travail, 5 minutes de pause, et je
          recommence. Je pense qu'à force, je pourrai aller plus loin, mais je
          sais qu'il faut y aller doucement, donc je prends le temps.
        </p>
        <p>
          J'ai aussi appris à "libérer de l'espace de travail" : une pensée
          qui n'a rien à voir avec ce que je suis en train de faire, je
          l'écris vite dans mon appli de notes, et je reviens tout de suite à
          mon activité. C'est comme dire à mon cerveau : "OK, je t'ai
          entendu, maintenant on continue." Aujourd'hui, je travaille dos à la
          fenêtre, avec un casque anti-bruit, et je mets mon téléphone en mode
          "concentration". J'apprends à mieux canaliser mon attention. »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION D — LES 5 PHASES (texte verbatim PDF p.4-5)
   =================================================================== */
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
  const PHASE3_ENV = [
    { key: "p3_desencombrer", label: "Je désencombre mon espace de travail" },
    {
      key: "p3_notif",
      label:
        "Je coupe les notifications, j'éloigne les tentations (téléphone, jeux, réseaux…)",
    },
    {
      key: "p3_isole",
      label:
        "Je m'isole d'autres distractions externes (ex : casque) et j'annonce mon indisponibilité",
    },
  ];

  const PHASE4_PLEINE_CONSCIENCE = [
    { key: "p4_respi", label: "J'observe ma respiration" },
    { key: "p4_decris", label: "Je décris mentalement mon activité" },
    {
      key: "p4_signaux",
      label:
        "Je prévois des signaux/rappels visuels pour revenir à l'instant présent en cas de décrochage",
    },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">5 phases</Headline>

      <GuidePhaseCard
        num={1}
        title="Observer et comprendre mon attention"
        rubColor={rubColor}
      >
        <ul className="guide-bullets">
          <li>
            Je mesure ma <b>capacité attentionnelle</b> = durée de focus sans
            décrocher.
          </li>
          <li>
            J'identifie les <b>conditions</b> dans lesquelles ma concentration
            est la plus <b>stable</b> (
            <i>
              tâche, heure, lieu, personnes présentes, stimulations
              sensorielles, niveau d'énergie, motivation
            </i>
            ).
          </li>
          <li>
            Je repère les <b>moments</b> où mon attention <b>décroche</b>, mes{" "}
            <b>sources</b> internes et externes de <b>distraction</b>.
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ <b>Je le note</b> dans mon <b>journal de bord</b>.
        </p>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Pour mesurer concrètement ma capacité de focus avant décrochage."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma capacité attentionnelle observée"
          hint="Combien de minutes je tiens en focus sans décrocher ?"
          initial={notes.p1_capacite ?? ""}
          onSave={(v) => onNoteSave("p1_capacite", v)}
          placeholder="Ex : 18 min sur un cours théorique, 2h sur un projet 3D…"
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes conditions optimales de concentration"
          hint="Heure, lieu, environnement, état."
          initial={notes.p1_conditions ?? ""}
          onSave={(v) => onNoteSave("p1_conditions", v)}
          placeholder="Ex : matin, bureau seul, casque, café près de moi…"
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes principales sources de distraction"
          initial={notes.p1_distractions ?? ""}
          onSave={(v) => onNoteSave("p1_distractions", v)}
          placeholder="Internes (pensées parasites…) ou externes (bruits, notifications…)"
        />
      </GuidePhaseCard>

      <GuidePhaseCard
        num={2}
        title="Alléger ma mémoire de travail"
        rubColor={rubColor}
      >
        <p className="guide-paragraph">
          <b>J'externalise</b> les informations importantes ou provisoires
          pour libérer de l'espace de travail (<i>"aides-mémoire"</i>) :
        </p>
        <ul className="guide-bullets">
          <li>
            Je note <b>immédiatement</b> les <b>idées</b>, <b>tâches</b> à
            faire, <b>informations</b> à retenir…
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je consacre le verso de mon <b>journal de bord</b> aux{" "}
              <b>listes</b> (toutes catégories).
            </p>
          </li>
          <li>
            J'<b>alimente l'agenda</b> - éventuellement partagé (
            <i>événements, rdv, tâches, deadlines</i>).
          </li>
          <li>
            Pour les <b>tâches récurrentes</b> (
            <i>déplacements, réunions, préparation…</i>) : j'utilise des{" "}
            <b>supports visuels</b> (<b>check-lists</b>, <b>tableau mural</b>),
            je crée des <b>rappels automatiques</b>.
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Pour les tâches récurrentes : créer une routine cochable, à relancer chaque cycle."
        />

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">
            Autres stratégies pour soutenir la mémoire de travail
          </span>
          <ul className="guide-bullets" style={{ marginTop: 8, marginBottom: 0 }}>
            <li>
              <b>Fractionner</b> les informations (
              <i>ex : 1 consigne à la fois</i>)
            </li>
            <li>
              <b>Regrouper / associer / catégoriser</b> les idées
            </li>
            <li>Se créer des <b>images mentales</b> des informations</li>
            <li>Se <b>répéter</b> les informations</li>
            <li>
              Utiliser des <b>stratégies mnémotechniques</b> (
              <i>ex : chanson, acrostiche</i>)
            </li>
            <li>
              S'<b>entraîner par le jeu</b> (<i>ex : mémo visuel, sonore</i>).
            </li>
          </ul>
        </div>
      </GuidePhaseCard>

      <GuidePhaseCard
        num={3}
        title="Réduire les distractions et redéployer mon attention"
        rubColor={rubColor}
      >
        <p className="guide-paragraph">
          J'observe et adapte si besoin mon <b>environnement</b> (➜ rubrique #07) :
        </p>
        <ul className="guide-checklist">
          {PHASE3_ENV.map((it) => (
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
            J'apprends à <b>repérer</b> mes <b>distracteurs internes</b> (
            <i>émotions, pensées, ruminations, projets, idées, questions…</i>)
            et à les <b>externaliser</b> (➜ phase 2) pour mieux me{" "}
            <b>recentrer</b>.
          </li>
          <li>
            Je prévois des <b>pauses régulières</b> et <b>conscientes</b> pour
            éviter la saturation.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Pour mieux me reconcentrer</span>
          <ul className="guide-bullets" style={{ marginTop: 8, marginBottom: 0 }}>
            <li>
              <i>Noter, externaliser mes émotions, pensées parasites</i>,
            </li>
            <li>
              <i>Appliquer mes techniques de régulation émotionnelle</i> (➜ rub. #03).
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 12 }}>
          <GuideToolLink
            rubColor={rubColor}
            href="/outils/coherence"
            icon={IconWind}
            title="Cohérence cardiaque"
            sub="Une pause respiratoire 5/5 entre 2 sessions de focus."
          />
          <GuideToolLink
            rubColor={rubColor}
            href="/outils/scan"
            icon={IconHand}
            title="Scan corporel"
            sub="Faire de la place aux pensées parasites avant de revenir à la tâche."
          />
        </div>
      </GuidePhaseCard>

      <GuidePhaseCard
        num={4}
        title="Soutenir mon attention par la structuration et les routines"
        rubColor={rubColor}
      >
        <ul className="guide-bullets">
          <li>
            Je <b>structure</b> ➜ rubriques #05, #06 :
            <ul className="guide-sub-bullets">
              <li>Je <b>fractionne</b> les tâches.</li>
              <li>
                Je m'appuie sur des <b>cycles de travail courts</b> (
                <b>méthode Pomodoro</b>).
              </li>
            </ul>
          </li>
          <li>
            Je <b>rythme</b> et <b>régularise</b> :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ je choisis et mets en place un <b>rituel</b> / un <b>signal</b>{" "}
              pour l'<b>entrée</b> et la <b>sortie</b> de tâche (
              <i>
                alarme, phrase-mantra, exercice de respiration, 5mn d'activité
                plaisante…
              </i>
              ).
            </p>
          </li>
          <li>
            Je renforce mon attention par la <b>pleine conscience</b> (
            <i>exercices courts</i>). Ex :
          </li>
        </ul>

        <ul className="guide-checklist">
          {PHASE4_PLEINE_CONSCIENCE.map((it) => (
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
            Je soutiens mon état de <b>vigilance</b> en associant du{" "}
            <b>mouvement</b> (<i>étirements, marche, verre d'eau, …</i>) et/ou
            de la <b>stimulation sensorielle</b> (
            <i>fidgets, odeurs, ballon d'assise, bureau assis-debout…</i>).
          </li>
          <li>
            J'<b>interroge</b> et <b>remobilise</b> régulièrement mon attention :
            <ul className="guide-sub-bullets">
              <li><b>Rappels sonores</b> ou <b>lumineux</b> toutes les 15-20 min :</li>
              <li>Suis-je toujours <b>sur ma tâche</b> ?</li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Mes cycles courts : tâche + pause, mesurés et calibrés à mon rythme."
        />
      </GuidePhaseCard>

      <GuidePhaseCard
        num={5}
        title="Consolider et ajuster"
        rubColor={rubColor}
      >
        <ul className="guide-bullets">
          <li>
            J'apprends à m'observer régulièrement <b>en train de faire</b>, à
            sonder mon "<b>état attentionnel</b>", identifier mes{" "}
            <b>décrochages</b>.
          </li>
          <li>
            J'évalue l'<b>efficacité</b> de mes outils en mesurant ma{" "}
            <b>progression</b>, à l'aide de différents critères.
            <p className="guide-paragraph" style={{ marginTop: 4, marginBottom: 4 }}>Ex :</p>
            <ul className="guide-sub-bullets">
              <li><b>durée</b> de concentration</li>
              <li>nombre de <b>décrochages</b></li>
              <li>
                sentiment d'<b>efficacité</b> (
                <i>ex : sur une échelle 1 à 10 ; en %…</i>)
              </li>
            </ul>
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ J'<b>ajuste</b> mes outils si besoin.
        </p>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Je <b>valorise</b> mes <b>réussites</b>.
        </p>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Je valorise mes réussites — même modestes !</span>
          <ul className="guide-bullets" style={{ marginTop: 8, marginBottom: 0 }}>
            <li>
              <i>je les note dans mon <b>journal de bord</b></i>
            </li>
            <li>
              <i>je les <b>partage</b> avec mes <b>proches</b></i>
            </li>
          </ul>
        </div>

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

/* ===================================================================
   SECTION E — À RETENIR (texte verbatim PDF p.6)
   =================================================================== */
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
      <Headline accent="rubrique #04">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Attention &amp; mémoire
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          <b>Optimiser</b> son énergie cognitive (
          <i>le bon moment, le bon endroit</i>). <b>Soutenir</b> sa{" "}
          <b>mémoire</b> de <b>travail</b> en l'allégeant.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Identifie ta <b>capacité attentionnelle</b> réelle (durée de focus
            sans décrocher) et utilise-la comme <b>unité de base</b>.
          </li>
          <li>
            <b>Réduis</b> les <b>distracteurs externes</b> (notifications,
            téléphone, bruit) et <b>internes</b> (pensées parasites à noter
            immédiatement).
          </li>
          <li>
            <b>Externalise</b> tout ce qui encombre ta mémoire de travail :
            notes, listes, rappels, agenda.
          </li>
          <li>
            <b>Structure</b> tes <b>sessions</b> de <b>travail</b> : cycles
            courts (Pomodoro), pauses programmées.
          </li>
          <li>
            Utilise des <b>rituels d'entrée</b> et de <b>sortie</b> de{" "}
            <b>tâche</b> pour rythmer ta concentration.
          </li>
          <li>
            Pratique des <b>exercices</b> de <b>pleine conscience</b> pour
            renforcer ta capacité à te recentrer.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Nos <b>ressources cognitives</b> sont <b>limitées</b>, en
          particulier quand on a un TDAH. L'idée n'est pas de "réparer" son{" "}
          <b>attention</b> ou sa <b>mémoire</b>, mais plutôt d'apprendre à les{" "}
          <b>protéger</b>, les <b>canaliser</b> et les <b>soutenir</b>.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
