"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  IconBook,
  IconCloud,
  IconCompass,
  IconEyeOpen,
  IconHand,
  IconHeart,
  IconShield,
  IconSparkle,
  IconWind,
} from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Field, FreeArea } from "@/components/journal/inputs";
import {
  HandNote,
  Headline,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import { MonsterCalme, MonsterCurieux, MonsterReflexif } from "@/components/monsters";
import {
  EMO_PINK,
  type EmotionDraft,
  type EmotionHistoryEntry,
  type EmotionPhase,
  EMOTIONS_STORAGE,
  EMPTY_EMOTION_DRAFT,
  FAM_KEYS,
  type FamilyKey,
  FAMILIES,
  QUADRANT_FAMS,
} from "@/lib/tools/emotions-data";
import { EmotionsBoussole } from "./emotions-boussole";
import { EmotionsEntryCard } from "./emotions-entry-card";
import { EmotionsHistory } from "./emotions-history";
import { EmotionsInconnu } from "./emotions-inconnu";
import { EmotionsPickCard } from "./emotions-pick-card";
import { EmotionsProgressBar } from "./emotions-progress-bar";
import { EmotionsSlider10 } from "./emotions-slider10";

type Props = {
  tcc?: boolean;
  act?: boolean;
};

export function EmotionsTool({ tcc = true, act = true }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<EmotionDraft>(EMPTY_EMOTION_DRAFT);
  const [hist, setHist] = useState<EmotionHistoryEntry[]>([]);
  const [resumeOffer, setResumeOffer] = useState(false);
  const [unknownMode, setUnknownMode] = useState(false);
  const [showAct, setShowAct] = useState(false);

  // Hydratation
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(EMOTIONS_STORAGE.draft);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as EmotionDraft;
        if (parsed?.phase && parsed.phase !== "porte") {
          setDraft(parsed);
          setResumeOffer(true);
        }
      }
      const rawHist = localStorage.getItem(EMOTIONS_STORAGE.hist);
      if (rawHist) setHist(JSON.parse(rawHist) as EmotionHistoryEntry[]);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persistance draft (debounce 800ms)
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        if (draft.phase === "porte") {
          localStorage.removeItem(EMOTIONS_STORAGE.draft);
        } else {
          localStorage.setItem(EMOTIONS_STORAGE.draft, JSON.stringify(draft));
        }
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(id);
  }, [draft, hydrated]);

  // Persistance historique
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(EMOTIONS_STORAGE.hist, JSON.stringify(hist));
    } catch {
      // ignore
    }
  }, [hist, hydrated]);

  const set = (patch: Partial<EmotionDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const goPhase = (p: EmotionPhase) => set({ phase: p });

  const reset = () => {
    setDraft(EMPTY_EMOTION_DRAFT);
    setUnknownMode(false);
    setShowAct(false);
  };

  const finish = () => {
    if (!draft.family) return;
    const entry: EmotionHistoryEntry = {
      t: Date.now(),
      family: draft.family,
      emotion: draft.emotion,
      nuance: draft.nuance ?? null,
      customWord: draft.customWord ?? "",
      intens: draft.intens ?? null,
      hasDeepened: !!(
        draft.declench ||
        draft.pensee ||
        draft.corps ||
        draft.fonction ||
        draft.defusion ||
        draft.acceptation
      ),
    };
    setHist((h) => [...h, entry].slice(-60));
    reset();
  };

  // Sélection famille → restreint au quadrant si point posé
  const allowedFams: FamilyKey[] = useMemo(() => {
    if (!draft.point) return FAM_KEYS;
    const he = draft.point.y < 0.5;
    const p = draft.point.x >= 0.5;
    const q = `${he ? "he" : "be"}-${p ? "p" : "d"}` as keyof typeof QUADRANT_FAMS;
    const base = QUADRANT_FAMS[q];
    return [...base, ...FAM_KEYS.filter((f) => !base.includes(f))];
  }, [draft.point]);

  const fam = draft.family ? FAMILIES[draft.family] : null;
  const emo = fam && draft.emotion ? fam.emotions[draft.emotion] : null;

  // ============== PHASE: PORTE ==============
  if (draft.phase === "porte") {
    return (
      <>
        <IntroHand>
          Mettre un mot sur ce qui se passe.
          <br />
          <span style={{ color: "var(--ink-2)" }}>Pas pour ranger. Pour mieux entendre.</span>
        </IntroHand>

        <SectionLabel num="•">Choisis ta porte d'entrée</SectionLabel>
        <Headline accent="comme tu peux">Deux façons d'entrer</Headline>

        {resumeOffer && (
          <div className="emo-resume-banner">
            <div className="emo-resume-text">
              <div className="emo-resume-eyebrow">Reprise possible</div>
              <div className="emo-resume-title">Tu as une émotion en cours</div>
              <div className="emo-resume-sub">
                Tu peux continuer où tu en étais, ou recommencer.
              </div>
            </div>
            <div className="emo-resume-actions">
              <button
                type="button"
                onClick={() => {
                  setResumeOffer(false);
                  goPhase(draft.phase === "porte" ? "boussole" : draft.phase);
                }}
                className="emo-resume-btn primary"
              >
                Reprendre →
              </button>
              <button
                type="button"
                onClick={() => {
                  setResumeOffer(false);
                  reset();
                }}
                className="emo-resume-btn ghost"
              >
                Recommencer
              </button>
            </div>
          </div>
        )}

        <div className="emo-entry-grid">
          <EmotionsEntryCard
            eyebrow="Côté émotion"
            title="Je sens quelque chose, je veux le nommer"
            sub="Tu sens qu'il y a quelque chose là, simple ou mélangé. On va chercher le mot juste — un ou plusieurs."
            mascot={MonsterCurieux}
            onClick={() => goPhase("boussole")}
          />
          <EmotionsEntryCard
            eyebrow="Côté corps"
            title="Je ne sais pas ce que je ressens"
            sub="On commence par le corps, on remonte vers le mot. Trois questions douces."
            mascot={MonsterCalme}
            onClick={() => setUnknownMode(true)}
          />
        </div>

        {unknownMode && (
          <div style={{ marginTop: 18 }}>
            <SectionLabel num="?">Trois questions corporelles</SectionLabel>
            <EmotionsInconnu
              onResolve={({ point, fams }) => {
                set({ point, suggestedFams: fams });
                setUnknownMode(false);
                goPhase("famille");
              }}
              onCancel={() => setUnknownMode(false)}
            />
          </div>
        )}

        <HandNote>
          « Plus on nomme finement,
          <br />
          moins l'émotion nous emporte. »
        </HandNote>

        <Card
          icon={IconHand}
          title="Si tu es bloqué·e dans le corps"
          sub="Parfois le mot ne vient pas parce que la sensation est trop forte. Tu peux faire un scan corporel d'abord, puis revenir."
        >
          <Link href="/outils/scan" className="emo-cross-link">
            → Aller au scan corporel
          </Link>
        </Card>

        <SectionLabel num="•">Mes émotions nommées</SectionLabel>
        <Headline accent="qualitatif">Trace</Headline>
        <Card
          icon={IconBook}
          title="12 dernières émotions posées"
          sub="Pas un score. Une mémoire de granularité — qui s'enrichit à mesure que tu nommes."
        >
          <EmotionsHistory hist={hist} onClear={() => setHist([])} />
        </Card>

        <Retain title="NOMMER, C'EST DÉJÀ COMMENCER À NE PLUS ÊTRE EMPORTÉ." monster={MonsterReflexif}>
          La granularité émotionnelle — savoir distinguer « contrarié » de « furieux »,
          « las » de « désespéré » — est, en TCC comme en ACT, un facteur de protection.
          Tu n'as pas à le faire parfaitement. Tu as juste à essayer.
        </Retain>
      </>
    );
  }

  // ============== PHASE: BOUSSOLE ==============
  if (draft.phase === "boussole") {
    return (
      <>
        <IntroHand>Place un point — où en es-tu ?</IntroHand>
        <EmotionsProgressBar phase={draft.phase} onJump={(p) => goPhase(p)} />
        <SectionLabel num="1">La boussole des émotions</SectionLabel>
        <Headline accent="2 axes ACT">Énergie × plaisir</Headline>

        <Card
          icon={IconCompass}
          title="Pose ton ressenti"
          sub="Glisse ton doigt jusqu'au point qui te ressemble. Pas besoin d'être précis — un ordre de grandeur suffit."
        >
          <EmotionsBoussole
            point={draft.point}
            onPlace={(p) => set({ point: p, suggestedFams: undefined })}
            onClear={() => set({ point: undefined })}
          />
        </Card>

        <div className="emo-nav-row">
          <button type="button" onClick={() => goPhase("porte")} className="emo-nav-btn">
            ← Retour
          </button>
          <button
            type="button"
            onClick={() => goPhase("famille")}
            disabled={!draft.point}
            className={`emo-primary-btn ${draft.point ? "" : "is-disabled"}`}
          >
            Continuer →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: FAMILLE ==============
  if (draft.phase === "famille") {
    return (
      <>
        <IntroHand>Quelle famille s'approche le plus ?</IntroHand>
        <EmotionsProgressBar phase={draft.phase} onJump={(p) => goPhase(p)} />
        <SectionLabel num="2">Les six grandes familles</SectionLabel>
        <Headline accent="(Ekman+)">La porte d'entrée du vocabulaire</Headline>

        {draft.point && draft.suggestedFams && draft.suggestedFams.length > 0 && (
          <p className="emo-suggestion-note">
            <b>Suggestion d'après tes réponses</b> : commence par regarder{" "}
            <b style={{ color: EMO_PINK }}>
              {draft.suggestedFams
                .slice(0, 2)
                .map((k) => FAMILIES[k].label)
                .join(" ou ")}
            </b>
            . Tu peux ignorer si ça ne colle pas.
          </p>
        )}

        <div className="emo-fam-grid">
          {allowedFams.map((k) => {
            const f = FAMILIES[k];
            const suggested = draft.suggestedFams?.includes(k) ?? false;
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  set({ family: k, emotion: undefined, nuance: undefined });
                  goPhase("emotion");
                }}
                className={`emo-fam-card ${suggested ? "is-suggested" : ""}`}
              >
                <div className="emo-fam-head">
                  <span className="emo-fam-sym" style={{ background: f.color }}>
                    {f.sym}
                  </span>
                  <span className="emo-fam-label">{f.label}</span>
                </div>
                <span className="emo-fam-hints">{f.bodyHints}</span>
              </button>
            );
          })}
        </div>

        <div className="emo-nav-row">
          <button type="button" onClick={() => goPhase("boussole")} className="emo-nav-btn">
            ← Boussole
          </button>
          <button type="button" onClick={reset} className="emo-nav-btn">
            ↻ Recommencer
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: ÉMOTION ==============
  if (draft.phase === "emotion" && fam) {
    return (
      <>
        <IntroHand>{fam.label} — quelle nuance s'approche ?</IntroHand>
        <EmotionsProgressBar phase={draft.phase} onJump={(p) => goPhase(p)} />
        <SectionLabel num="3">Émotions de la famille {fam.label}</SectionLabel>
        <Headline accent="moins emportant">Plus précis</Headline>

        <div style={{ display: "grid", gap: 10 }}>
          {Object.entries(fam.emotions).map(([k, e]) => (
            <EmotionsPickCard
              key={k}
              label={e.label}
              sub={`${e.nuances.slice(0, 3).join(" · ")}…`}
              onClick={() => {
                set({ emotion: k, nuance: undefined });
                goPhase("mot");
              }}
              color={fam.color}
            />
          ))}
        </div>

        <div className="emo-nav-row">
          <button type="button" onClick={() => goPhase("famille")} className="emo-nav-btn">
            ← Familles
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: MOT JUSTE ==============
  if (draft.phase === "mot" && fam && emo) {
    return (
      <>
        <IntroHand>Le mot qui sonne le plus juste, là, maintenant.</IntroHand>
        <EmotionsProgressBar phase={draft.phase} onJump={(p) => goPhase(p)} />
        <SectionLabel num="4">Nuances de « {emo.label} »</SectionLabel>
        <Headline accent="(ou écris le tien)">Choisis</Headline>

        <Card
          icon={IconSparkle}
          title={`Famille : ${fam.label} · Émotion : ${emo.label}`}
          sub="Si aucun mot ne te parle, écris le tien — c'est lui qui compte."
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {emo.nuances.map((n) => {
              const sel = draft.nuance === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => set({ nuance: n, customWord: "" })}
                  style={{
                    padding: "8px 14px",
                    background: sel ? EMO_PINK : "white",
                    color: "#0E0E10",
                    border: "2px solid #0E0E10",
                    borderRadius: 999,
                    fontFamily: "var(--font-cond)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    boxShadow: sel ? "2px 2px 0 #0E0E10" : "3px 3px 0 #0E0E10",
                    transform: sel ? "translate(1px,1px)" : "none",
                    transition: "transform .12s, box-shadow .12s",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <Label>Ou ton mot à toi</Label>
          <Field
            value={draft.customWord}
            onChange={(v) => set({ customWord: v, nuance: v ? null : draft.nuance })}
            placeholder="Le mot qui résonne, même bizarre…"
          />
        </Card>

        <div className="emo-nav-row">
          <button type="button" onClick={() => goPhase("emotion")} className="emo-nav-btn">
            ← Émotions
          </button>
          <button
            type="button"
            onClick={() => goPhase("couches")}
            disabled={!draft.nuance && !draft.customWord}
            className={`emo-primary-btn ${draft.nuance || draft.customWord ? "" : "is-disabled"}`}
          >
            Continuer →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: COUCHES ACT/TCC ==============
  if (draft.phase === "couches" && fam) {
    const word = draft.customWord || draft.nuance || emo?.label || fam.label;
    return (
      <>
        <IntroHand>
          <b style={{ color: EMO_PINK }}>{word}</b>.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Tu peux t'arrêter là, ou creuser un peu.
          </span>
        </IntroHand>
        <EmotionsProgressBar phase={draft.phase} onJump={(p) => goPhase(p)} />

        {tcc && (
          <>
            <SectionLabel num="5a">Intensité — TCC</SectionLabel>
            <Headline accent="0 à 10">Curseur clinique</Headline>
            <Card
              icon={IconWind}
              title="À quel point c'est fort, là ?"
              sub="Pas un score à atteindre. Une mesure pour suivre, plus tard, comment ça bouge."
            >
              <EmotionsSlider10
                value={draft.intens ?? null}
                onChange={(v) => set({ intens: v })}
              />
            </Card>

            <SectionLabel num="5b">Déclencheur — TCC</SectionLabel>
            <Headline>
              Quand est-ce <span className="accent">arrivé</span> ?
            </Headline>
            <Card
              icon={IconCloud}
              title="Le moment, la situation"
              sub="Quoi, qui, où — sans interprétation. Juste les faits."
            >
              <FreeArea
                value={draft.declench}
                onChange={(v) => set({ declench: v })}
                placeholder="Ce matin en lisant ce message… / Quand je me suis réveillé… / Pendant la réunion…"
              />
            </Card>

            <SectionLabel num="5c">Pensée associée — TCC</SectionLabel>
            <Headline accent="qu'est-ce que je me dis ?">L'arrière-pensée</Headline>
            <Card icon={IconCloud} title="La phrase qui passe dans la tête">
              <FreeArea
                value={draft.pensee}
                onChange={(v) => set({ pensee: v })}
                placeholder="« Je n'y arriverai pas. » / « Personne ne comprend. » / …"
              />
            </Card>

            <SectionLabel num="5d">Lien corporel — TCC</SectionLabel>
            <Headline>
              Où dans <span className="accent">le corps</span> ?
            </Headline>
            <Card
              icon={IconHand}
              title="La sensation associée"
              sub={`Repères de la famille ${fam.label} : ${fam.bodyHints}`}
            >
              <FreeArea
                value={draft.corps}
                onChange={(v) => set({ corps: v })}
                placeholder="Une boule dans la gorge, du chaud sur le visage, du vide dans le ventre…"
              />
              <Link href="/outils/scan" className="emo-cross-link" style={{ marginTop: 10 }}>
                → Faire un scan corporel détaillé
              </Link>
            </Card>
          </>
        )}

        {act && (
          <>
            <button
              type="button"
              onClick={() => setShowAct((s) => !s)}
              className={`emo-act-toggle ${showAct ? "is-open" : ""}`}
            >
              {showAct ? "↓ Couche ACT déployée" : "+ Ajouter la couche ACT (acceptation)"}
            </button>

            {showAct && (
              <>
                <SectionLabel num="6a">Fonction — ACT</SectionLabel>
                <Headline accent="à quoi sert-elle ?">Cette émotion me dit…</Headline>
                <Card
                  icon={IconEyeOpen}
                  title="Le message de l'émotion"
                  sub="Toute émotion porte un signal : valeur menacée, besoin non satisfait, intuition juste. Pas une ennemie."
                >
                  <FreeArea
                    value={draft.fonction}
                    onChange={(v) => set({ fonction: v })}
                    placeholder="« Cette colère me dit que mon temps est précieux. » / « Cette tristesse me dit que ce lien comptait. »"
                  />
                </Card>

                <SectionLabel num="6b">Défusion — ACT</SectionLabel>
                <Headline>
                  Prendre <span className="accent">du recul</span>
                </Headline>
                <Card
                  icon={IconShield}
                  title="Reformule en mode observateur"
                  sub="Au lieu de « je suis triste », essaie « je remarque que je me sens triste ». L'émotion devient quelque chose qui passe en toi, plutôt que toi."
                >
                  <FreeArea
                    value={draft.defusion}
                    onChange={(v) => set({ defusion: v })}
                    placeholder={`Je remarque que je me sens ${word}…`}
                  />
                </Card>

                <SectionLabel num="6c">Acceptation — ACT</SectionLabel>
                <Headline accent="sans la combattre">Faire de la place</Headline>
                <Card
                  icon={IconHeart}
                  title="L'accueillir telle qu'elle est"
                  sub="Pas l'aimer. Juste arrêter de la repousser. Lui faire de la place comme à un visiteur — elle finira par bouger toute seule."
                >
                  <FreeArea
                    value={draft.acceptation}
                    onChange={(v) => set({ acceptation: v })}
                    placeholder="« Je laisse cette colère être là. Elle peut s'asseoir un moment. »"
                  />
                </Card>
              </>
            )}
          </>
        )}

        <div className="emo-nav-row">
          <button type="button" onClick={() => goPhase("mot")} className="emo-nav-btn">
            ← Mot
          </button>
          <button
            type="button"
            onClick={() => goPhase("trace")}
            className="emo-primary-btn"
          >
            Voir ma trace →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: TRACE ==============
  if (draft.phase === "trace" && fam) {
    const word = draft.customWord || draft.nuance || emo?.label || fam.label;
    return (
      <>
        <IntroHand>
          Voilà ce que tu as posé.
          <br />
          <span style={{ color: "var(--ink-2)" }}>Pas un verdict. Une photo de l'instant.</span>
        </IntroHand>
        <EmotionsProgressBar phase={draft.phase} onJump={(p) => goPhase(p)} />

        <SectionLabel num="•">Ton émotion nommée</SectionLabel>

        <div className="emo-trace-card" style={{ background: fam.color }}>
          <div className="emo-trace-eyebrow">
            {fam.label} · {emo ? emo.label : "—"}
          </div>
          <div className="emo-trace-word">{word}</div>
          {draft.intens != null && (
            <div className="emo-trace-pill">Intensité {draft.intens}/10</div>
          )}
        </div>

        {(draft.declench ||
          draft.pensee ||
          draft.corps ||
          draft.fonction ||
          draft.defusion ||
          draft.acceptation) && (
          <Card icon={IconBook} title="Ce que tu as exploré">
            {draft.declench && <RecapRow label="Déclencheur" value={draft.declench} />}
            {draft.pensee && <RecapRow label="Pensée associée" value={draft.pensee} />}
            {draft.corps && <RecapRow label="Sensation corporelle" value={draft.corps} />}
            {draft.fonction && <RecapRow label="Fonction (ACT)" value={draft.fonction} />}
            {draft.defusion && <RecapRow label="Défusion (ACT)" value={draft.defusion} />}
            {draft.acceptation && (
              <RecapRow label="Acceptation (ACT)" value={draft.acceptation} />
            )}
          </Card>
        )}

        <HandNote right>
          « Plus on nomme finement,
          <br />
          moins l'émotion devient un brouillard. »
        </HandNote>

        <SectionLabel num="•">Aller plus loin (si tu veux)</SectionLabel>
        <div style={{ display: "grid", gap: 10 }}>
          <EmotionsPickCard
            label="Mesurer mon niveau d'activation"
            sub="Aller au thermomètre — utile si l'émotion est très intense."
            href="/outils/thermometre"
            color={EMO_PINK}
          />
          <EmotionsPickCard
            label="Faire un scan corporel"
            sub="Si l'émotion est encore présente dans le corps, lui faire de la place."
            href="/outils/scan"
            color={EMO_PINK}
          />
        </div>

        <div className="emo-nav-row">
          <button type="button" onClick={() => goPhase("couches")} className="emo-nav-btn">
            ← Examen
          </button>
          <button type="button" onClick={finish} className="emo-primary-btn">
            ✓ Terminer · nouvelle entrée
          </button>
        </div>
      </>
    );
  }

  return null;
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ margin: "10px 0" }}>
      <div
        style={{
          fontFamily: "var(--font-cond)",
          fontWeight: 800,
          fontSize: 10,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cond)",
          fontSize: 14,
          color: "#0E0E10",
          whiteSpace: "pre-wrap",
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  );
}
