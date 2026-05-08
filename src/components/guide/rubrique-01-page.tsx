"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconBook,
  IconClock,
  IconEyeOpen,
  IconHourglass,
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
} from "@/lib/guide/guide-types";
import { GuideMarkRead } from "./guide-mark-read";
import { GuidePersonalNote } from "./guide-personal-note";
import { GuidePhaseCard } from "./guide-phase-card";
import { GuideRubriqueHeader } from "./guide-rubrique-header";
import { GuideSectionTabs } from "./guide-section-tabs";
import { GuideSmartEditor } from "./guide-smart-editor";
import { GuideToolLink } from "./guide-tool-link";

const RUBRIQUE_ID: RubriqueId = "01";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique01Page({ rubrique }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<GuideStore>(EMPTY_GUIDE_STORE);
  const [active, setActive] = useState<SectionId>("intro");

  useEffect(() => {
    setStore(loadGuideStore());
    setHydrated(true);
  }, []);

  // Persistance debounce 500ms
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
          notes={progress.notes}
          onNoteSave={onNoteSave}
          read={isRead("intro")}
          onToggleRead={() => toggleRead("intro")}
        />
      )}

      {active === "pratique" && (
        <SectionPratique
          rubColor={rubColor}
          notes={progress.notes}
          onNoteSave={onNoteSave}
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
   SECTION A — REPÉRER ET COMPRENDRE (texte verbatim du PDF p.1)
   =================================================================== */
function SectionIntro({
  rubColor,
  notes,
  onNoteSave,
  read,
  onToggleRead,
}: {
  rubColor: string;
  notes: Record<string, string>;
  onNoteSave: (key: string, val: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <IntroHand>
        Changer, OK… mais changer quoi ? Et NE PAS changer quoi ?
      </IntroHand>

      <p className="guide-paragraph">
        Le premier pas vers la compréhension de soi, c'est s'observer. Cela veut
        dire se regarder en train de faire, prendre le temps, porter sur soi les
        yeux de la découverte, de la curiosité, en assortissant le tout d'une
        pointe d'objectivité et de bienveillance ! Nous te proposons de
        commencer le chemin par ce pas de côté, ce ralentissement que nous
        savons difficile, mais dont on peut difficilement faire l'économie pour
        orienter consciemment et efficacement ses efforts. Quitter l'autoroute
        vaut souvent le détour. Profite de ce remarquable voyage !
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <p className="guide-block-lead">Inattention + hyperactivité/impulsivité =</p>
        <ul className="guide-bullets">
          <li>
            Des fonctions <b>cognitives</b>, <b>sociales</b> et{" "}
            <b>émotionnelles</b> mal régulées : attention fluctuante,
            mémorisation à court terme et des fonctions de contrôle (
            <i>tri, filtre, frein, organisation, planification</i>) vite
            saturées, impulsivité (<i>verbale, motrice, émotionnelle</i>).
          </li>
          <li>
            Des fonctions <b>sensorielles</b> et <b>motrices</b> perturbées :
            hyperactivité motrice et/ou mentale (
            <i>
              "cerveau en ébullition", besoin constant de stimulation, pas de
              bouton "off"
            </i>
            ), particularités du traitement sensoriel.
          </li>
          <li>
            Des <b>difficultés</b> souvent <b>associées</b> : Troubles anxieux,
            troubles de l'humeur, troubles de la personnalité, conduites
            addictives, troubles du comportement alimentaire, troubles du
            sommeil, autres troubles du neurodéveloppement, pathologies
            médicales (<i>ex allergies, douleur chronique</i>).
          </li>
        </ul>
      </div>

      <GuidePersonalNote
        rubColor={rubColor}
        question="Quels sont mes symptômes à moi ?"
        initial={notes.symptomes ?? ""}
        onSave={(v) => onNoteSave("symptomes", v)}
        placeholder="Note ce que tu observes chez toi spécifiquement, sans filtrer."
      />

      <SectionLabel num="•">Répercussions possibles</SectionLabel>
      <Headline accent="dans ma vie">Impacts</Headline>

      <div className="guide-block guide-block-repercussions">
        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphères <b>privée + pro</b></h4>
          <ul className="guide-bullets">
            <li>
              Je suis <b>distrait·e</b> par ce qui se passe autour ou par mes
              pensées, j'ai tendance à me <b>déconcentrer</b>.
            </li>
            <li>
              Je peine à <b>aller au bout</b> de mes projets,{" "}
              <b>je change souvent</b> d'activités.
            </li>
            <li>
              Je me sens souvent <b>surchargé·e</b>, j'oublie, je perds des
              objets, je n'arrive pas à gérer le quotidien.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sphère <b>sociale</b></h4>
          <ul className="guide-bullets">
            <li>
              Je <b>décroche</b> pendant les conversations, j'ai du mal avec
              les <b>relations</b>, je vis souvent des <b>conflits</b>.
            </li>
            <li>
              Les <b>autres</b> me perçoivent négativement et ont tendance à{" "}
              <b>dévaloriser</b> mes façons de faire.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">
            Sphères <b>cognitive</b> & <b>psychoaffective</b>
          </h4>
          <ul className="guide-bullets">
            <li>
              Mes <b>performances fluctuent</b> selon le contexte, l'intérêt, la
              motivation.
            </li>
            <li>
              J'ai une <b>mauvaise image</b> de moi, je <b>me sous-estime</b>.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title"><b>Énergie / fatigue</b>.</h4>
          <ul className="guide-bullets">
            <li>
              J'ai du mal à canaliser mon <b>énergie</b> (physique, cognitive,
              émotionnelle).
            </li>
          </ul>
        </div>
      </div>

      <GuidePersonalNote
        rubColor={rubColor}
        question="Quels impacts ont mes symptômes sur ces différentes sphères ?"
        initial={notes.impacts ?? ""}
        onSave={(v) => onNoteSave("impacts", v)}
        placeholder="Décris où ça pèse le plus dans ta vie en ce moment."
      />

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION B — EN PRATIQUE, CONCRÈTEMENT (texte verbatim du PDF p.2)
   =================================================================== */
function SectionPratique({
  rubColor,
  notes,
  onNoteSave,
  read,
  onToggleRead,
}: {
  rubColor: string;
  notes: Record<string, string>;
  onNoteSave: (key: string, val: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <>
      <SectionLabel num="•">En pratique, concrètement</SectionLabel>
      <Headline accent="& bénéfices">Quels objectifs</Headline>

      <div className="guide-block guide-block-objectifs" style={{ ["--rub-color" as string]: rubColor }}>
        <ul className="guide-bullets">
          <li>
            Repérer mes propres <b>particularités</b> et <b>fluctuations</b> :{" "}
            <i>cognitives, émotionnelles, sensorielles, comportementales</i>,
          </li>
          <li>
            Identifier mes <b>besoins</b> de <b>stimulation</b> et mon
            intolérance à la <b>répétitivité</b>,
          </li>
          <li>
            Sonder la présence de difficultés d'autres natures (
            <i>sommeil, anxiété, humeur, …</i>),
          </li>
          <li>
            Me fixer <b>1 à 2 objectifs à la fois</b>,
          </li>
          <li>
            Me fixer des objectifs <b>SMART</b> :
            <ul className="guide-sub-bullets">
              <li><i>Concrets et précis (Spécifiques)</i>,</li>
              <li><i>Mesurables (M)</i>,</li>
              <li><i>Représentant un petit pas (Atteignables)</i>,</li>
              <li><i>Simples à mettre en œuvre (Réalisables)</i>,</li>
              <li><i>Avec une deadline (Temporellement définis)</i>.</li>
            </ul>
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Ex d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Pendant 2 semaines, je m'observe dans différents contextes de
              travail et j'évalue sur une échelle de 1 à 10 : mes niveaux
              d'énergie, de motivation & mon état émotionnel."
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
            un carnet, une application de notes, un fichier texte…
          </p>
          <p className="guide-tool-static-arrow">
            ▶ l'indispensable, l'élément clé pour mieux me comprendre ; il sert
            à noter mes observations, évaluations, questions, objectifs,
            avancées…
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Support de classement
          </div>
          <p className="guide-tool-static-desc">
            des documents sur le TDAH : une pochette / un dossier numérique
            clairement nommé (<i>ex. "mon TDAH"</i>).
          </p>
          <p className="guide-tool-static-arrow">
            ▶ organiser / ranger mes documents pour les retrouver facilement.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Supports de rappel
          </div>
          <p className="guide-tool-static-desc">
            Alarme/réveil, appli de rappels, post-it…je peux combiner des
            supports analogiques et numériques.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ me rappeler ce que j'ai à faire, à emporter, à mettre en place.
          </p>
        </div>

        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Chronomètre / montre
          </div>
          <p className="guide-tool-static-desc">
            porter une montre permet d'avoir un accès constant et immédiat au
            temps.
          </p>
          <p className="guide-tool-static-arrow">
            ▶ améliorer ma conscience temporelle et estimer mon temps
            d'exécution
          </p>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="Observer l'allocation de mon temps."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Fiche d'estimation"
          sub="Estimer le temps que demandent les tâches."
        />
      </div>

      <GuidePersonalNote
        rubColor={rubColor}
        question="Qu'est-ce que je veux changer, qui est le plus difficile, prioritaire ?"
        hint="Je teste les outils pendant au moins 2 semaines avant d'évaluer s'ils me conviennent."
        initial={notes.priorite ?? ""}
        onSave={(v) => onNoteSave("priorite", v)}
        placeholder="Une chose, pas dix. La plus invalidante ou la plus douloureuse."
      />

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION C — L'HISTOIRE DE LÉA (texte verbatim du PDF p.3)
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
      <Headline accent="35 ans, data analyst">Léa</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>
          « J'ai longtemps pensé que j'étais "irrégulière" : capable du meilleur
          comme du pire, de résoudre un problème ultra complexe le matin, et
          d'être incapable de me souvenir ou d'appliquer une procédure ultra
          basique et récurrente l'après-midi, d'être euphorique puis de
          m'effondrer sans raison. J'ai reçu le diagnostic de TDAH il y a 2 ans,
          après un burn-out (Je venais d'être maman, mon bébé dormait mal, je
          n'arrivais pas à me remettre au travail). J'ai d'abord ressenti un
          immense soulagement… et puis comme un vertige : "Et maintenant,
          qu'est-ce que je fais de ça ?".
        </p>
        <p>
          Ma psychiatre m'a proposé de commencer par m'observer. Pendant deux
          semaines, j'ai noté mes variations d'énergie, mes décrochages, les
          conditions qui me permettent de rester concentrée. J'ai découvert que
          ma concentration devient catastrophique après 15h, que l'open space me
          surcharge et me rend irritable, que le multitâche me désorganise, que
          j'ai besoin de repères visuels… J'ai aussi compris que mes moments
          d'hyperfocus n'étaient pas du "génie spontané", mais une facette de
          mon fonctionnement.
        </p>
        <p>
          Réussir à m'observer, à prendre le temps, sans me juger, a changé ma
          façon de me voir : je ne manque pas de volonté. Je devais juste
          apprendre à apprivoiser un fonctionnement différent. Aujourd'hui
          encore, il peut m'arriver de reprendre mes notes quand je me trouve
          dans une situation inédite, ou inconfortable. Cela me sert de
          baromètre, et aussi de boussole. »
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* ===================================================================
   SECTION D — LES 4 PHASES DU CHANGEMENT (texte verbatim PDF p.4-5)
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
  objectives: import("@/lib/guide/guide-types").SmartObjective[];
  onAddObjective: (o: import("@/lib/guide/guide-types").SmartObjective) => void;
  onDeleteObjective: (id: string) => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  const PHASE1_MATERIEL = [
    { key: "p1_journal", label: "Mon inséparable Journal de bord" },
    { key: "p1_classement", label: "Mon support de classement (pochette, dossier numérique…)" },
    { key: "p1_rappel", label: "Mes supports de rappel (alarme/réveil, appli, post-it…)" },
    { key: "p1_chrono", label: "Un Chronomètre / une montre" },
  ];
  const PHASE1_HABITUDES = [
    { key: "p1_h1", label: "Je définis un emplacement pour mon dossier TDAH (facile d'accès, visible)" },
    { key: "p1_h2", label: "Je le note dans mon journal de bord" },
    { key: "p1_h3", label: "Je me projette, visualise ou verbalise (avant, pendant, après l'action)" },
    { key: "p1_h4", label: "Je me crée des rappels pour penser à : prendre, compléter, consulter mon journal de bord" },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard num={1} title="Préparer et structurer l'observation" rubColor={rubColor}>
        <h4 className="guide-phase-h">Je prépare mon matériel :</h4>
        <ul className="guide-checklist">
          {PHASE1_MATERIEL.map((it) => (
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

        <h4 className="guide-phase-h">Je prends une nouvelle habitude :</h4>
        <ul className="guide-checklist">
          {PHASE1_HABITUDES.map((it) => (
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
      </GuidePhaseCard>

      <div className="guide-callout guide-callout-automatise">
        <div className="guide-automatise-eyebrow">J'AUTOMATISE</div>
        <div className="guide-automatise-equals">=</div>
        <div className="guide-automatise-line">JE RÉPÈTE AU MOINS*</div>
        <div className="guide-automatise-num">20-25 FOIS</div>
        <div className="guide-automatise-line">OU</div>
        <div className="guide-automatise-line">PENDANT AU MOINS*</div>
        <div className="guide-automatise-num">3 SEMAINES</div>
        <div className="guide-automatise-foot">
          *Selon une <b>étude</b> (Lally et al., 2010), il faudrait entre 18 et
          254 jours pour prendre une habitude. La durée est donc variable et
          peut prendre plus ou moins de temps selon la complexité de la tâche à
          automatiser.
        </div>
      </div>

      <GuidePhaseCard num={2} title="Comprendre et situer mon fonctionnement" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>Je consulte des ouvrages, sites, podcasts sur le TDAH.</li>
          <li>
            Je <b>ralentis</b>, je me scrute, je m'écoute, je me scanne :
            <ul className="guide-sub-bullets">
              <li><b>comment</b> se manifeste "mon TDAH à moi" ?</li>
              <li>
                quels <b>contextes</b> me <b>facilitent</b> les choses /{" "}
                <b>aggravent</b> mes difficultés ?
              </li>
            </ul>
          </li>
          <li>
            Je <b>m'autoévalue</b> en complétant les{" "}
            <b>échelles d'auto-évaluation</b> :
            <ul className="guide-sub-bullets">
              <li><b>Symptômes</b> du TDAH</li>
              <li><b>Répercussions</b> fonctionnelles</li>
              <li><b>Bien-être</b></li>
            </ul>
          </li>
        </ul>

        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ Il s'agit de mon <b>point de départ</b>{" "}
          <i>
            je me réévaluerai après apprentissage et mise en place de nouvelles
            habitudes
          </i>{" "}
          ➜ rubrique #02.
        </p>

        <p className="guide-paragraph guide-paragraph-arrow">
          • Je note mes observations et résultats ➜ dans mon{" "}
          <b>Journal de bord</b>.
        </p>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/evaluation"
          icon={IconEyeOpen}
          title="Auto-évaluation TDAH"
          sub="Les 3 échelles : symptômes, répercussions fonctionnelles, bien-être."
          status="Référence le résultat dans tes notes."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Comment se manifeste « mon TDAH à moi » ?"
          initial={notes.scrute_comment ?? ""}
          onSave={(v) => onNoteSave("scrute_comment", v)}
          placeholder="Sans filtre. Sans jugement. Ce que tu remarques."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Quels contextes me facilitent les choses, et lesquels aggravent mes difficultés ?"
          initial={notes.scrute_contextes ?? ""}
          onSave={(v) => onNoteSave("scrute_contextes", v)}
          placeholder="Heures de la journée, lieux, personnes, états physiques…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={3} title="Observer mon temps et mes habitudes" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je complète un <b>Journal du temps</b> :
            <p className="guide-sub-text">
              J'y reporte <b>chaque moment</b>, en <b>temps réel</b>, sur{" "}
              <b>2 jours</b> :
            </p>
            <p className="guide-sub-text guide-sub-pill">
              = 1 JOUR D'<b>ACTIVITÉ</b> + 1 JOUR <b>OFF</b>
            </p>
          </li>
          <li>
            Je prends <b>conscience</b> du temps et je le "calibre" :{" "}
            <b>fiche d'estimation</b>
            <ul className="guide-sub-bullets">
              <li>
                J'<b>estime</b> la durée d'exécution de ma tâche, de mon trajet,
                pour me préparer…
              </li>
              <li>Je mesure = je me <b>chronomètre</b>.</li>
              <li>Je <b>compare</b> avec mon temps réel d'exécution.</li>
            </ul>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/journal"
          icon={IconClock}
          title="Journal du temps"
          sub="J'y reporte mes activités, contextes, énergie, humeur."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="J'estime, je mesure, je compare."
        />

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">
            Pourquoi compléter un Journal du temps
          </span>
          <p className="guide-callout-text">
            <i>
              Il consiste à noter l'ensemble des <b>activités</b> réalisées,
              ainsi que leur <b>contexte</b>, tes niveaux d'<b>énergie</b> et
              d'<b>humeur</b>, au cours d'une journée de <b>travail</b> /
              études et d'une journée <b>libre</b>. Il aide à{" "}
              <b>prendre conscience</b> du temps, à observer tes <b>rythmes</b>.
              Il sert de <b>base</b> : pour <b>adapter</b> tes stratégies et
              pour <b>mesurer</b> ton évolution.
            </i>
          </p>
        </div>
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Analyser et me fixer des objectifs" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je relis et j'<b>analyse</b> mes données :
            <ul className="guide-sub-bullets">
              <li>
                ce qui <b>fonctionne bien</b> ou qui peut être une{" "}
                <b>force</b> dans certains contextes,
              </li>
              <li>
                ce qui <b>entrave</b> mon bien-être et que{" "}
                <b>je veux changer</b>,
              </li>
              <li>
                ce que je me sens <b>capable</b> de <b>changer maintenant</b>{" "}
                en faisant un premier <b>petit pas</b>.
              </li>
            </ul>
          </li>
          <li>
            Je définis <b>1 priorité</b> :{" "}
            <i>(le plus invalidant, le plus douloureux, le plus petit effort…)</i>
          </li>
          <li>
            Je formule un <b>objectif SMART</b>.{" "}
            <i>
              (Précis, mesurable, réalisable, concret, avec une deadline ou une
              fréquence définie)
            </i>
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Pendant 1 semaine, je prends 5 à 10 minutes chaque soir pour
              relire et analyser mes notes et observations".
            </i>
          </p>
        </div>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Ma priorité du moment"
          hint="Le plus invalidant, le plus douloureux, ou le plus petit effort utile."
          initial={notes.priorite_smart ?? ""}
          onSave={(v) => onNoteSave("priorite_smart", v)}
          placeholder="Ex : Réussir à protéger mes plages de concentration le matin."
        />

        <h4 className="guide-phase-h">Mon objectif SMART</h4>
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
   SECTION E — À RETENIR (texte verbatim du PDF p.6)
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
      <Headline accent="rubrique #01">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          S'observer et se comprendre
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Apprendre à <b>se connaître</b> avant de chercher à changer. On peut
          difficilement modifier ce qu'on ne comprend pas.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            Le TDAH se manifeste <b>différemment</b> chez chacun. Tes
            symptômes, tes déclencheurs, tes contextes favorables sont uniques.
          </li>
          <li>
            S'observer, c'est <b>ralentir</b> pour se regarder "
            <b>en train de faire</b>" : repérer ses <b>fluctuations</b>{" "}
            cognitives, émotionnelles, sensorielles.
          </li>
          <li>
            Le <b>journal de bord</b> devient ton outil central : <b>note</b>{" "}
            tes observations, tes réussites, tes difficultés, sans filtre.
          </li>
          <li>
            Utilise les échelles d'<b>autoévaluation</b> pour mesurer ton point
            de départ (symptômes, bien-être, gestion du temps, routines).
          </li>
          <li>
            Identifie <b>ce qui fonctionne</b> déjà <b>VS</b> ce que tu
            souhaites <b>améliorer</b>.
          </li>
          <li>
            Fixe-toi des <b>objectifs SMART</b> : un petit pas précis,
            mesurable, réalisable, concret, avec une deadline.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          La <b>connaissance de soi</b> est le <b>premier pas</b> vers le
          changement. <b>Prends le temps</b> de ce détour, il te fera gagner un
          temps précieux ensuite.
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
