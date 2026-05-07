"use client";

import { useEffect, useState } from "react";
import {
  IconCalendar,
  IconCloud,
  IconHand,
  IconPhone,
  IconShield,
  IconWriting,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Chips, Field } from "@/components/journal/inputs";
import {
  Headline,
  HLQuote,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterCalme } from "@/components/monsters";
import {
  LEVEL_BY_N,
  STRATEGIES,
  type LevelN,
  type ThermoObservation,
} from "@/lib/tools/thermo-data";
import { CoherenceModal } from "./coherence-modal";
import { CrisisModal } from "./crisis-modal";
import { HistTimeline } from "./hist-timeline";
import { ThermoSteps } from "./thermo-steps";
import { ThermoVisual } from "./thermo-visual";
import { TriggerGuide } from "./trigger-guide";

const T_KEY = "jtdah-thermo-v1";
const T_HIST = "jtdah-thermo-hist-v1";

type ThermoState = {
  level?: LevelN;
  body?: string;
  trigger?: string;
  coping?: string;
  strats?: string[];
  contact1Name?: string;
  contact1Tel?: string;
  contact2Name?: string;
  contact2Tel?: string;
};

type Variant = "visual" | "steps";

export function ThermoTool({ variant = "visual" }: { variant?: Variant }) {
  const [s, setS] = useState<ThermoState>({});
  const [hist, setHist] = useState<ThermoObservation[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [autoBreath, setAutoBreath] = useState(false);

  // Hydration localStorage côté client
  useEffect(() => {
    try {
      const raw = localStorage.getItem(T_KEY);
      if (raw) setS(JSON.parse(raw));
      const rawH = localStorage.getItem(T_HIST);
      if (rawH) setHist(JSON.parse(rawH));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(T_KEY, JSON.stringify(s));
      } catch {
        // ignore
      }
    }
  }, [s, hydrated]);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(T_HIST, JSON.stringify(hist));
      } catch {
        // ignore
      }
    }
  }, [hist, hydrated]);

  const set = <K extends keyof ThermoState>(k: K, v: ThermoState[K]) => {
    setS((prev) => ({ ...prev, [k]: v }));
  };

  const level = s.level ?? null;
  const L = level ? LEVEL_BY_N[level] : null;

  const pickLevel = (n: LevelN) => {
    set("level", n);
    if (n === 5 && !crisisOpen) {
      setCrisisOpen(true);
    } else if ((n === 3 || n === 4) && !autoBreath) {
      setAutoBreath(true);
    }
  };

  const saveObs = () => {
    if (!level) return;
    const entry: ThermoObservation = {
      t: Date.now(),
      level,
      body: s.body ?? "",
      trigger: s.trigger ?? "",
      coping: s.coping ?? "",
    };
    setHist((h) => [...h, entry].slice(-60));
    setS({
      contact1Name: s.contact1Name,
      contact1Tel: s.contact1Tel,
      contact2Name: s.contact2Name,
      contact2Tel: s.contact2Tel,
    });
    setAutoBreath(false);
  };

  return (
    <>
      <IntroHand>
        Pas pour te juger.
        <br />
        <span style={{ color: "var(--ink-2)" }}>
          Pour <em>nommer</em> ce qui se passe, et choisir une réponse à ta taille.
        </span>
      </IntroHand>

      <SectionLabel num="1">Niveau d'activation</SectionLabel>
      <Headline accent="à cet instant">Où en suis-je</Headline>

      <div
        className={`thermo-panel ${L ? "" : "empty"}`}
        style={{
          background: L ? L.color : undefined,
          color: L ? "white" : undefined,
        }}
      >
        <div className="thermo-panel-content">
          {variant === "steps" ? (
            <ThermoSteps level={level} onPick={pickLevel} />
          ) : (
            <div className="thermo-panel-grid">
              <ThermoVisual
                level={level}
                limbColor={L ? "#FFFFFF" : "#0E0E10"}
                mercuryColor={L ? L.color : "#B5B5BD"}
                onPick={pickLevel}
              />
              <div>
                {L ? (
                  <>
                    <div className="thermo-eyebrow">
                      Niveau {L.n} · {L.sublabel}
                    </div>
                    <h3 className="thermo-label">{L.label}</h3>
                    <p className="thermo-cog">{L.cog}</p>
                    <div className="thermo-cluster">
                      {L.cluster.map((c) => (
                        <span key={c} className="thermo-cluster-chip">
                          {c}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="thermo-empty-msg">
                    Glisse le mercure, ou tape un chiffre, sans réfléchir.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-suggestion respiration niveaux 3-4 */}
      {autoBreath && level !== null && (level === 3 || level === 4) && !breathOpen && (
        <div className="breath-suggest">
          <div className="breath-suggest-text">
            <div className="breath-suggest-title">UNE RESPIRATION D'ABORD ?</div>
            <div className="breath-suggest-sub">3 minutes, sans rien à faire d'autre.</div>
          </div>
          <button type="button" onClick={() => setBreathOpen(true)} className="breath-yes">
            Oui
          </button>
          <button
            type="button"
            onClick={() => setAutoBreath(false)}
            aria-label="Plus tard"
            className="breath-dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {breathOpen && <CoherenceModal onClose={() => setBreathOpen(false)} />}

      {/* ABC : Antecedent / Body / Coping */}
      {L && (
        <>
          <SectionLabel num="2">Mon corps</SectionLabel>
          <Headline accent="qu'est-ce que je sens ?">Le corps parle</Headline>
          <Card
            icon={IconHand}
            title="Traduction corporelle"
            sub="Tension, chaleur, vide, picotement, gorge serrée…"
          >
            <Field
              multiline
              rows={3}
              value={s.body}
              onChange={(v) => set("body", v)}
              placeholder="Là, dans mon corps, je remarque…"
            />
          </Card>

          <SectionLabel num="3">Avant ça…</SectionLabel>
          <Headline>
            Le contexte
            <br />
            <span className="accent">qui a précédé</span>
          </Headline>
          <Card
            icon={IconCloud}
            title="Déclencheur(s) possible(s)"
            sub="Pas une cause unique, un contexte. Tape un début et complète."
          >
            <TriggerGuide value={s.trigger} onChange={(v) => set("trigger", v)} />
          </Card>

          <SectionLabel num="4">Une réponse à ma taille</SectionLabel>
          <Headline accent={`niveau ${L.n}`}>Stratégies pour</Headline>
          <Card
            icon={IconShield}
            title="Choisis-en une, pas dix"
            sub="Plus le niveau monte, plus la stratégie est simple et corporelle."
          >
            <Chips
              value={s.strats ?? []}
              onChange={(v) => set("strats", v)}
              items={STRATEGIES[L.n].map((st) => ({ id: st.id, label: st.label }))}
            />
            {L.breath && (
              <button
                type="button"
                onClick={() => setBreathOpen(true)}
                style={{
                  marginTop: 14,
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "var(--ink)",
                  color: "white",
                  border: "2px solid var(--ink)",
                  cursor: "pointer",
                  fontFamily: "var(--font-cond)",
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                ≈ Respirer 3 min
              </button>
            )}
          </Card>

          <Card
            icon={IconWriting}
            title="Ce que je vais essayer"
            sub="Une seule. Concrète. Maintenant ou très bientôt."
          >
            <Field
              value={s.coping}
              onChange={(v) => set("coping", v)}
              placeholder="Ex : sortir 10 min, appeler X, écrire ce qui tourne…"
            />
          </Card>

          <button
            type="button"
            onClick={saveObs}
            className="thermo-save"
            style={{ background: L.color }}
          >
            Enregistrer cette observation
          </button>
        </>
      )}

      <SectionLabel num="•">Mes dernières observations</SectionLabel>
      <Headline accent="dans la durée">Ce qui se dessine</Headline>
      <Card
        icon={IconCalendar}
        title="Timeline · 12 derniers relevés"
        sub="Pas un score. Un motif que tu peux remarquer."
      >
        <HistTimeline hist={hist} />
      </Card>

      <HLQuote>
        Un thermomètre ne juge pas la fièvre.
        <br />
        Il <span style={{ color: "var(--dominant)" }}>la nomme</span>.
      </HLQuote>

      <Retain title="NOMMER, C'EST DÉJÀ COMMENCER À RÉGULER." monster={MonsterCalme}>
        Tu n'as pas à descendre l'échelle pour avoir « réussi ». Tu peux juste observer où tu es,
        et choisir une réponse à ta taille.
      </Retain>

      {/* Bouton SOS toujours dispo */}
      <button
        type="button"
        onClick={() => setCrisisOpen(true)}
        className="sos-button"
        title="Aide d'urgence"
        aria-label="Aide d'urgence"
      >
        SOS
      </button>

      {crisisOpen && (
        <CrisisModal
          contacts={[
            { name: s.contact1Name ?? "", tel: s.contact1Tel ?? "" },
            { name: s.contact2Name ?? "", tel: s.contact2Tel ?? "" },
          ]}
          onClose={() => setCrisisOpen(false)}
          onBreath={() => {
            setCrisisOpen(false);
            setBreathOpen(true);
          }}
        />
      )}

      {/* Contacts pré-saisis */}
      <SectionLabel num="•">Mes contacts</SectionLabel>
      <Headline>
        Pré-saisir
        <br />
        <span className="accent">avant la crise</span>
      </Headline>
      <Card
        icon={IconPhone}
        title="Pour que le bouton SOS fonctionne"
        sub="Renseigne ces contacts à froid, tu n'auras pas à chercher au mauvais moment."
      >
        <Label>Contact 1, nom</Label>
        <Field
          value={s.contact1Name}
          onChange={(v) => set("contact1Name", v)}
          placeholder="Ex : Marie (sœur)"
        />
        <Label>Téléphone</Label>
        <Field
          value={s.contact1Tel}
          onChange={(v) => set("contact1Tel", v)}
          placeholder="06 12 34 56 78"
        />
        <Label>Contact 2, nom</Label>
        <Field
          value={s.contact2Name}
          onChange={(v) => set("contact2Name", v)}
          placeholder="Ex : Médecin traitant"
        />
        <Label>Téléphone</Label>
        <Field
          value={s.contact2Tel}
          onChange={(v) => set("contact2Tel", v)}
          placeholder="01 23 45 67 89"
        />
        <p
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "var(--ink-2)",
            fontFamily: "var(--font-cond)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
          }}
        >
          Données stockées localement, jamais envoyées.
        </p>
      </Card>
    </>
  );
}
