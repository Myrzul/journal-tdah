"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBook, IconHourglass, IconList } from "@/components/icons";
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

const RUBRIQUE_ID: RubriqueId = "07";

type Props = {
  rubrique: RubriqueMeta;
};

export function Rubrique07Page({ rubrique }: Props) {
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
        <SectionIntro rubColor={rubColor} read={isRead("intro")} onToggleRead={() => toggleRead("intro")} />
      )}
      {active === "pratique" && (
        <SectionPratique rubColor={rubColor} read={isRead("pratique")} onToggleRead={() => toggleRead("pratique")} />
      )}
      {active === "histoire" && (
        <SectionHistoire read={isRead("histoire")} onToggleRead={() => toggleRead("histoire")} rubColor={rubColor} />
      )}
      {active === "phases" && (
        <SectionPhases
          rubColor={rubColor}
          notes={progress.notes}
          onNoteSave={onNoteSave}
          checks={progress.checks}
          onCheck={onCheck}
          objectives={progress.smartObjectives}
          onAddObjective={(obj) => setStore((st) => addSmartObjective(st, RUBRIQUE_ID, obj))}
          onDeleteObjective={(id) => setStore((st) => deleteSmartObjective(st, RUBRIQUE_ID, id))}
          read={isRead("phases")}
          onToggleRead={() => toggleRead("phases")}
        />
      )}
      {active === "retenir" && (
        <SectionRetenir read={isRead("retenir")} onToggleRead={() => toggleRead("retenir")} rubColor={rubColor} />
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
        Plus épuré est l'espace, plus le contexte est propice à la concentration.
      </IntroHand>

      <p className="guide-paragraph">
        Plus épuré est l'espace (<i>de vie, de travail…</i>), moins nombreuses
        sont les sources potentielles de distraction, et plus le contexte est
        propice à la concentration. Plus structurés, balisés, lisibles, sont
        ces espaces, plus les objets / documents y sont accessibles,
        repérables, localisables, moins fréquentes sont les pertes : de
        matériel… et de temps à le chercher. <b>Organiser l'espace</b> allège
        la charge cognitive, libère des ressources pour soutenir d'autres
        efforts, tâches et projets, réduit l'incertitude et favorise le calme
        et la sérénité.
      </p>

      <SectionLabel num="•">Repérer et comprendre</SectionLabel>
      <Headline accent="à observer chez moi">Signes</Headline>

      <div className="guide-block guide-block-signes" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-block-eyebrow">Signes observés</div>
        <ul className="guide-bullets">
          <li>
            Mes <b>espaces</b> de <b>vie</b> et de <b>travail</b> sont souvent{" "}
            <b>encombrés</b>, <b>désorganisés</b> (<i>ou j'ai des stratégies rigides pour compenser</i>),
          </li>
          <li>
            Je <b>perds</b> régulièrement mes <b>objets</b>, <b>documents</b>,{" "}
            <b>informations</b>,
          </li>
          <li>
            J'ai du mal à <b>maintenir l'ordre</b> une fois le rangement fait,
          </li>
          <li>
            Je suis <b>sensible</b> aux <b>distracteurs</b> (
            <i>bruits, lumières, mouvements, température</i>),
          </li>
          <li>
            Ma <b>concentration varie</b> selon le <i>lieu, le contexte, les conditions de travail</i>,
          </li>
          <li>
            Je passe <b>beaucoup de temps</b> à <b>chercher</b> mes affaires.
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
              Mes affaires, mes espaces de vie et de travail, sont
              constamment en <b>désordre</b>.
            </li>
            <li>
              Je <b>perds du temps</b> (
              <i>à chercher mes affaires</i>) et de l'<b>argent</b> (
              <i>contraint·e au rachat du matériel perdu</i>).
            </li>
            <li>
              J'ai du mal à me concentrer ou à travailler efficacement dans
              certains <b>environnements</b>. Ils peuvent être soit{" "}
              <b>trop stimulants</b>, soit <b>insuffisamment</b> (
              <i>ex open space VS bibliothèque</i>).
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sur le <b>corps</b></h4>
          <ul className="guide-bullets">
            <li>Je me sens souvent <b>tendu·e</b>.</li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title">Sur l'<b>esprit</b> (sphères cognitive et psychoaffective)</h4>
          <ul className="guide-bullets">
            <li>
              J'ai tendance à me <b>dévaloriser</b>, à <b>sous-estimer</b> mes
              capacités.
            </li>
          </ul>
        </div>

        <div className="guide-sphere">
          <h4 className="guide-sphere-title"><b>Énergie / fatigue</b></h4>
          <ul className="guide-bullets">
            <li>Je me sens <b>surchargé·e</b>, <b>fatigué·e</b>.</li>
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
          Créer un <b>environnement stable</b>, <b>clair</b>, <b>fonctionnel</b>, pour :
        </p>
        <ul className="guide-bullets">
          <li>
            <b>Réduire</b> la <b>dispersion</b> mentale et visuelle, accéder{" "}
            <b>facilement</b> et <b>rapidement</b> à mes affaires,
          </li>
          <li>
            Favoriser la <b>régularité</b> pour maintenir l'ordre et pérenniser
            les <b>routines</b>,
          </li>
          <li>
            <b>Économiser</b> du <b>temps</b> (et de l'argent !),
          </li>
          <li>
            <b>Soulager</b> la <b>charge cognitive</b> et l'état de{" "}
            <b>tension</b>, trouver l'<b>équilibre</b>, optimiser <b>confort</b>{" "}
            et <b>stimulation sensorielle</b>.
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Exemple d'objectif SMART</span>
          <p className="guide-callout-text">
            <i>
              "Cette semaine, je définis un emplacement fixe pour mes 3 objets
              les plus perdus et je les y remets chaque soir pendant 3
              semaines."
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
            mon inséparable ! (rub. #01) — un carnet, une application de
            notes, un fichier texte…
          </p>
          <p className="guide-tool-static-arrow">
            ▶ noter mes observations, évaluations, questions, objectifs,
            avancées…
          </p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Boîtes de rangement, étiquettes, codes couleurs, trieurs, bacs / boîtes, classeurs thématiques
          </div>
          <p className="guide-tool-static-arrow">
            ▶ Classer, catégoriser, ranger, clarifier l'espace
          </p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Sacs de tri, applis de don ou revente (Geev, Vinted)
          </div>
          <p className="guide-tool-static-arrow">▶ trier, épurer l'espace.</p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Outils sensoriels
          </div>
          <p className="guide-tool-static-desc">
            Applications anti-distraction, bouchons d'oreilles, casque
            anti-bruit, applis de bruits blancs, lampe orientable, siège
            ergonomique, support d'écran…
          </p>
          <p className="guide-tool-static-arrow">
            ▶ optimiser l'environnement sensoriel et ergonomique.
          </p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Alarmes / rappels, créneaux dans l'agenda, minuteur, scanner, prélèvements automatiques
          </div>
          <p className="guide-tool-static-arrow">
            ▶ maintenir et ajuster l'organisation au quotidien, automatiser.
          </p>
        </div>
        <div className="guide-tool-static">
          <div className="guide-tool-static-title">
            <span className="guide-tool-static-bullet" style={{ background: rubColor }} />
            Disque de sauvegarde
          </div>
          <p className="guide-tool-static-desc">cloud, disque dur externe…</p>
          <p className="guide-tool-static-arrow">
            ▶ conserver, garder les informations accessibles et partageables.
          </p>
        </div>
      </div>

      <SectionLabel num="•">Outils de l'app dédiés à cette rubrique</SectionLabel>
      <Headline accent="à mobiliser au quotidien">3 outils intégrés</Headline>

      <div className="guide-tools-list">
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/sacs"
          icon={IconList}
          title="Mes sacs"
          sub="Externaliser le contenu de chaque sac (sport, week-end, école) — vérification finale."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Routines de rangement et tâches récurrentes (ménage, vide-poches…)."
        />
        <GuideToolLink
          rubColor={rubColor}
          href="/outils/duree"
          icon={IconHourglass}
          title="Estimer une durée"
          sub="Calibrer le temps des routines de rangement (10-15 min/jour, missions hebdo)."
        />
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}

/* === SECTION C — L'HISTOIRE DE JAMES (PDF p.3) === */
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
      <Headline accent="28 ans, danseur professionnel">James</Headline>

      <div className="guide-story" style={{ ["--rub-color" as string]: rubColor }}>
        <p>« Sur scène, tout est millimétré : chaque geste, chaque appui, chaque respiration.</p>
        <p>
          Avant le diagnostic, en dehors du studio, c'était la pagaille
          totale. Je perdais mes clés, mes papiers… Mon sac contenait
          parfois trois paires de chaussons… mais pas les documents ou la
          tenue que je cherchais. Chaque matin, je passais un quart d'heure
          à fouiller partout, déjà en retard avant d'être parti.
        </p>
        <p>
          J'ai réalisé que mon environnement nourrissait ma désorganisation.
          Avec l'aide de mon préparateur mental, j'ai tout remis à plat :
          j'ai fait le vide chez moi, trié, jeté. Puis j'ai créé des zones
          claires et visibles : un seul vide-poche pour mes clés et cartes
          d'accès, une zone "répétitions" pour mes tenues, une bannette "à
          traiter cette semaine" pour les papiers, et un seul classeur pour
          tout ce qui est administratif.
        </p>
        <p>
          J'ai aussi installé une check-list au-dessus de mon sac de danse,
          et des boîtes transparentes pour ne plus oublier ce qu'elles
          contiennent. Aujourd'hui, je ne cherche plus. Je sais où tout est.
          Je n'épuise plus mon énergie à gérer le chaos du quotidien. »
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
  const PHASE3_REDUCE = [
    { key: "p3_epure", label: "J'épure le bureau et les murs" },
    { key: "p3_ouvertures", label: "Je m'éloigne des ouvertures" },
    { key: "p3_tel", label: "J'éloigne téléphone, notifications, objets stimulants et autres tentations" },
    { key: "p3_lumiere", label: "J'ajuste la luminosité (lumière naturelle, lampe orientable) et la température si possible" },
    { key: "p3_protection", label: "Je porte des protections sensorielles (casque, filtre anti lumière bleue) ou prévois des stimulations adaptées (playlists, bruits blancs)" },
    { key: "p3_postural", label: "J'ajuste mon confort postural (siège ergonomique, ballon, bureau assis-debout, support d'écran…)" },
    { key: "p3_pauses", label: "Je prévois des pauses régulières et conscientes (Pomodoro)" },
    { key: "p3_correc", label: "Je porte mes corrections visuelles (lunettes, lentilles)" },
  ];

  return (
    <>
      <SectionLabel num="•">Les étapes du changement</SectionLabel>
      <Headline accent="à ton rythme">4 phases</Headline>

      <GuidePhaseCard num={1} title="Mettre de l'ordre et clarifier l'espace" rubColor={rubColor}>
        <h4 className="guide-phase-h">Ranger et organiser efficacement</h4>
        <p className="guide-paragraph">J'applique les principes suivants :</p>
        <ul className="guide-bullets">
          <li><b>Une place pour chaque chose, chaque chose à sa place</b></li>
          <li>Je <b>regroupe</b> les objets de <b>même type</b></li>
          <li>
            J'<b>étiquète</b> (<i>liste du contenu</i>), définis des{" "}
            <b>codes couleurs</b>, utilise des <b>boîtes</b> (
            <i>transparentes</i>), tiroirs ou pochettes dédiées.
          </li>
        </ul>

        <h4 className="guide-phase-h">Centraliser informations et documents (physiques et numériques)</h4>
        <ul className="guide-bullets">
          <li>Je <b>jette immédiatement</b> l'inutile</li>
          <li>
            Je <b>regroupe</b> au même endroit les documents qui arrivent (
            <i>courrier postal ou mails</i>) :
            <ul className="guide-sub-bullets">
              <li>
                Espace "<b>à traiter dans la semaine</b>" (
                <i>ex tableau magnétique dédié, ramette, dossier dans boîte de réception mail</i>
                ) ;
              </li>
              <li>
                Intercalaire/espace "<b>Mois en cours</b>" (
                <i>dans trieur / dossier de l'année en cours</i>).
              </li>
              <li>
                Fichiers numériques sur un support de stockage unique, ex :{" "}
                <b>drive partagé</b>.
              </li>
            </ul>
          </li>
        </ul>

        <h4 className="guide-phase-h">Trier et désencombrer régulièrement</h4>
        <p className="guide-paragraph guide-paragraph-arrow">
          ➜ J'<b>épure</b>, je m'allège, je garde l'<b>essentiel</b> ou ce qui
          me procure une <b>réelle satisfaction</b>.
        </p>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Une place pour chaque chose · chaque chose à sa place</span>
        </div>

        <GuidePersonalNote
          rubColor={rubColor}
          question="Mes 3 objets les plus perdus — leur emplacement fixe désormais"
          hint="L'objectif SMART suggéré dans le PDF."
          initial={notes.p1_emplacements ?? ""}
          onSave={(v) => onNoteSave("p1_emplacements", v)}
          placeholder="Ex : Clés → vide-poche entrée. Téléphone → bureau. Lunettes → table de chevet."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={2} title="Structurer l'information et le flux des tâches" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je crée des <b>zones dédiées</b> (
            <i>
              ex : boîtes pour les documents à traiter, les clés et autres
              affaires "ambulantes" de chaque membre du foyer, matériel pour
              les loisirs, pour le travail…
            </i>
            ).
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ <b>Boîtes, Bacs, étiquettes</b>
            </p>
          </li>
          <li>
            Je <b>range</b> selon un système <b>simple</b>, <b>facile d'accès</b>{" "}
            et <b>visuel</b>, dans des <b>lieux stratégiques</b>
            <ul className="guide-sub-bullets">
              <li>
                je garde l'<b>essentiel visible</b> (
                <i>coupelles, boîtes ouvertes, tableau mural</i>) :{" "}
                <b>ce qui disparaît de la vue n'existe plus !</b>
              </li>
              <li>
                je place des <b>check-lists</b> plastifiées dans les endroits
                stratégiques pour le <b>matériel</b> à ne pas oublier ou les{" "}
                <b>tâches récurrentes</b> (
                <i>
                  ex checklist de départ dans l'entrée, de voyage sur la porte
                  intérieure de l'armoire, de sport dans le sac de sport, des
                  tâches ménagères dans le placard des produits d'entretien…
                </i>
                ).
              </li>
            </ul>
          </li>
          <li>
            Je <b>classe</b> selon la nature des documents (
            <i>
              chronologique, par mois pour les documents de l'année en cours
              puis thématique pour les "archives"
            </i>
            ).
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ <b>Classeurs thématiques</b>, intercalaires, dossiers couleur,
              pochettes à onglets…
            </p>
          </li>
        </ul>

        <div className="guide-callout">
          <span className="guide-callout-eyebrow">Ce qui disparaît de la vue n'existe plus !</span>
        </div>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/sacs"
          icon={IconList}
          title="Mes sacs"
          sub="L'outil dédié pour les check-lists matérielles (sport, week-end, école)."
        />

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="Pour les tâches récurrentes (ménage, départ, voyage)."
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={3} title="Optimiser l'environnement sensoriel et ergonomique" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je <b>teste</b> différents <b>lieux</b> de travail (
            <i>calmes, animés, lumineux, épurés…</i>) : pièce fermée, café,
            bibliothèque, coworking… pour repérer celui qui soutient le mieux
            ma concentration.
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ Je prends des notes dans mon <b>journal de bord</b>.
            </p>
          </li>
          <li>
            Je <b>réduis</b> les <b>distracteurs sensoriels</b> :
            <ul className="guide-sub-bullets">
              <li>
                J'identifie <b>mes distracteurs</b> (<i>sons, lumières, objets visuels…</i>) ➜ rubrique #02.
              </li>
              <li>J'adapte mon environnement en fonction :</li>
            </ul>
          </li>
        </ul>

        <ul className="guide-checklist">
          {PHASE3_REDUCE.map((it) => (
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
          title="Estimer une durée (Pomodoro)"
          sub="Pour les pauses régulières et conscientes pendant le travail."
        />

        <GuidePersonalNote
          rubColor={rubColor}
          question="Le lieu où ma concentration est la meilleure"
          initial={notes.p3_lieu ?? ""}
          onSave={(v) => onNoteSave("p3_lieu", v)}
          placeholder="Et pourquoi : silence, lumière, présence de café, distance des distracteurs…"
        />
      </GuidePhaseCard>

      <GuidePhaseCard num={4} title="Maintenir et ajuster l'organisation au quotidien" rubColor={rubColor}>
        <ul className="guide-bullets">
          <li>
            Je <b>manipule en une seule fois</b> un document ou un objet (
            <i>je le traite ou l'utilise, et je le classe ou le remets à sa place dans la foulée</i>
            ).
          </li>
          <li>
            J'intègre un court <b>temps d'entretien</b>
            <ul className="guide-sub-bullets">
              <li><b>10-15 mn</b> chaque jour,</li>
              <li>créneau prévu dans l'<b>agenda</b>,</li>
              <li>
                répartition des tâches sur la semaine selon une <b>check-list</b>{" "}
                affichée.
              </li>
            </ul>
          </li>
          <li>
            Je programme des <b>missions "vide-poches"</b> hebdomadaires :
            j'explore mon bureau, mon sac, mon ordinateur… Je jette ou classe
            ce qui n'est pas à sa place.
          </li>
          <li>
            Je <b>numérise</b> et <b>automatise</b> les tâches répétitives (
            <i>paiements, rappels</i>) : cela me permet aussi de réduire le
            papier et de centraliser davantage les informations.
          </li>
          <li>
            Je m'<b>interroge</b> régulièrement sur la <b>pertinence</b> des
            stratégies mises en place :
            <p className="guide-paragraph guide-paragraph-arrow" style={{ marginTop: 4 }}>
              ➜ me soulagent-elles ? = sont-elles utiles, simples, efficaces ?
            </p>
          </li>
        </ul>

        <GuideToolLink
          rubColor={rubColor}
          href="/outils/checklists"
          icon={IconList}
          title="Mes checklists"
          sub="« Vide-poche hebdo », « 10 min d'entretien quotidien » — créer la routine cochable."
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
      <Headline accent="rubrique #07">Synthèse</Headline>

      <div className="guide-retenir" style={{ ["--rub-color" as string]: rubColor }}>
        <div className="guide-retenir-eyebrow">
          <IconBook size={18} color={rubColor} stroke={2.4} />
          Structurer l'environnement
        </div>

        <h4 className="guide-retenir-h">L'objectif :</h4>
        <p className="guide-paragraph">
          Créer un environnement <b>clair</b>, <b>stable</b> et{" "}
          <b>fonctionnel</b> pour libérer des ressources cognitives et réduire
          le stress.
        </p>

        <h4 className="guide-retenir-h">Les points clés :</h4>
        <ul className="guide-bullets guide-bullets-arrow">
          <li>
            <b>Désencombre</b>, <b>épure</b>, ne garde que l'essentiel ou ce
            qui te procure de la satisfaction.
          </li>
          <li>
            Applique la règle : <b>une place pour chaque chose</b> &amp;{" "}
            <b>chaque chose à sa place</b>. <b>Regroupe</b> par type, étiquète.
          </li>
          <li>
            Garde l'<b>essentiel visible</b> : ce qui disparaît de ta vue
            n'existera plus !
          </li>
          <li>
            Utilise des <b>check-lists plastifiées</b> dans les endroits
            stratégiques (<i>entrée, sac, armoire</i>).
          </li>
          <li>
            <b>Optimise</b> ton <b>environnement sensoriel</b> : réduis les
            distracteurs, ajuste lumière et bruit, protège-toi si besoin.
          </li>
          <li>
            <b>Maintiens l'ordre</b> avec des <b>routines</b> courtes
            quotidiennes (<i>10-15 mn</i>) et des missions "vide-poches"
            hebdomadaires.
          </li>
        </ul>

        <h4 className="guide-retenir-h">Le message :</h4>
        <p className="guide-paragraph">
          Un <b>environnement structuré soulage</b> la <b>charge</b> cognitive.
          En organisant l'extérieur, tu crées les conditions pour plus de{" "}
          <b>calme</b> et d'<b>efficacité</b> à "l'intérieur".
        </p>
      </div>

      <GuideMarkRead read={read} onToggle={onToggleRead} rubColor={rubColor} />
    </>
  );
}
