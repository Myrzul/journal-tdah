"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IconWriting } from "@/components/icons";
import { Card } from "@/components/journal/cards";
import { Checklist, Chips, Field, FreeArea } from "@/components/journal/inputs";
import {
  Headline,
  HLQuote,
  IntroHand,
  Label,
  Retain,
  SectionLabel,
} from "@/components/journal/typography";
import {
  EMO_CHIPS,
  EMPTY_DRAFT,
  type Phase,
  PHASES,
  RETURN_STEPS,
  SCAN_PINK,
  SCAN_STORAGE,
  type ScanDraft,
  type ScanHistoryEntry,
  type ScanStates,
  STATES,
  type Zone,
  ZONES,
  type ZoneId,
  type ZoneState,
} from "@/lib/tools/scan-data";
import { ScanBreathFlower } from "./scan-breath-flower";
import { ScanHistory } from "./scan-history";
import { ScanPhaseShell } from "./scan-phase-shell";
import { ScanSilhouette } from "./scan-silhouette";
import { ScanSwipePad } from "./scan-swipe-pad";

type Props = {
  guided?: boolean;
};

export function ScanTool({ guided = true }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<ScanDraft>(EMPTY_DRAFT);
  const [hist, setHist] = useState<ScanHistoryEntry[]>([]);
  const [resumeOffer, setResumeOffer] = useState(false);
  const startedAt = useRef<number | null>(null);

  // Hydratation côté client : draft + historique
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(SCAN_STORAGE.draft);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as ScanDraft;
        if (parsed?.phase && parsed.phase > 0) {
          // Brouillon existant en cours de scan : on propose la reprise
          setDraft(parsed);
          startedAt.current = parsed.startedAt;
          setResumeOffer(true);
        }
      }
      const rawHist = localStorage.getItem(SCAN_STORAGE.hist);
      if (rawHist) setHist(JSON.parse(rawHist) as ScanHistoryEntry[]);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persistance du brouillon (debounce 800ms) — optim 1
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        if (draft.phase === 0) {
          localStorage.removeItem(SCAN_STORAGE.draft);
        } else {
          localStorage.setItem(SCAN_STORAGE.draft, JSON.stringify(draft));
        }
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(id);
  }, [draft, hydrated]);

  // Persistance de l'historique
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SCAN_STORAGE.hist, JSON.stringify(hist));
    } catch {
      // ignore
    }
  }, [hist, hydrated]);

  const setField = <K extends keyof ScanDraft>(k: K, v: ScanDraft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
  };

  const start = () => {
    startedAt.current = Date.now();
    setResumeOffer(false);
    setDraft({ ...EMPTY_DRAFT, phase: 1, startedAt: Date.now() });
  };

  const resume = () => {
    setResumeOffer(false);
  };

  const restart = () => {
    setResumeOffer(false);
    startedAt.current = Date.now();
    setDraft({ ...EMPTY_DRAFT, phase: 1, startedAt: Date.now() });
  };

  const finish = () => {
    const begin = startedAt.current ?? draft.startedAt;
    const duration = begin ? Math.round((Date.now() - begin) / 1000) : 0;
    const tendu = Object.values(draft.states).filter((s) => s === "tendu").length;
    const detendu = Object.values(draft.states).filter((s) => s === "detendu").length;
    const neutre = Object.values(draft.states).filter((s) => s === "neutre").length;
    const entry: ScanHistoryEntry = {
      t: Date.now(),
      word: draft.outWord || "",
      emotion: draft.emotion || "",
      emoChips: draft.emoChips,
      states: draft.states,
      cycles: 5,
      duration,
      tally: { tendu, neutre, detendu },
    };
    setHist((h) => [...h, entry].slice(-60));
    startedAt.current = null;
    setDraft(EMPTY_DRAFT);
  };

  const cur = useMemo<Phase>(
    () => (PHASES.find((p) => p.n === draft.phase) ?? PHASES[0]) as Phase,
    [draft.phase],
  );

  const tally = useMemo(
    () => ({
      tendu: Object.values(draft.states).filter((s) => s === "tendu").length,
      neutre: Object.values(draft.states).filter((s) => s === "neutre").length,
      detendu: Object.values(draft.states).filter((s) => s === "detendu").length,
    }),
    [draft.states],
  );

  // ======= INTRO (phase 0) =======
  if (draft.phase === 0) {
    return (
      <>
        <IntroHand>
          Pas pour analyser.
          <br />
          <span style={{ color: "var(--ink-2)" }}>
            Pour <em>habiter</em> ce qui est là — sans rien régler.
          </span>
        </IntroHand>

        <SectionLabel num="03">Outil de la rubrique</SectionLabel>
        <Headline accent="& Émotions">Impulsivité</Headline>

        <div
          style={{
            background: SCAN_PINK,
            border: "2px solid #0E0E10",
            borderRadius: 36,
            padding: "32px 28px",
            color: "#0E0E10",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.12,
              pointerEvents: "none",
              backgroundImage: "radial-gradient(circle, #0E0E10 1px, transparent 1.4px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-cond)",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              position: "relative",
            }}
          >
            Pratique guidée · 7 phases
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              lineHeight: 0.95,
              textTransform: "uppercase",
              letterSpacing: "-.02em",
              margin: "10px 0 14px",
              position: "relative",
            }}
          >
            Scan corporel
          </h3>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              marginBottom: 18,
              maxWidth: 460,
              position: "relative",
            }}
          >
            Quand le mental bouillonne, l'attention dans le corps lui sert de
            contrepoids. Pas de timer. Pas de score. Tu poses ton attention, tu
            observes, tu repars.
          </p>

          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              background: "rgba(255,255,255,0.4)",
              border: "2px solid #0E0E10",
              borderRadius: 24,
              padding: "14px 18px",
              marginBottom: 18,
              position: "relative",
            }}
          >
            <div style={{ width: 80, flexShrink: 0 }}>
              <ScanSilhouette states={{}} />
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 12,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontFamily: "var(--font-cond)",
                fontWeight: 700,
                letterSpacing: ".04em",
                color: "#0E0E10",
              }}
            >
              <li>1 · Cinq respirations</li>
              <li>2 · Conscience globale</li>
              <li>3 · Balayage des 8 zones</li>
              <li>4 · Accueil des émotions</li>
              <li>5 · Ancrage</li>
              <li>6 · Retour</li>
              <li>7 · Trace (facultative)</li>
            </ul>
          </div>

          {resumeOffer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 19,
                  lineHeight: 1.25,
                  position: "relative",
                  marginBottom: 4,
                }}
              >
                Tu as un scan en cours — phase {draft.phase} sur 7.
              </div>
              <button
                type="button"
                onClick={resume}
                style={{
                  padding: "16px 28px",
                  borderRadius: 999,
                  background: "#0E0E10",
                  color: "white",
                  border: "2px solid #0E0E10",
                  boxShadow: "4px 4px 0 white",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  position: "relative",
                }}
              >
                Reprendre où j'en étais →
              </button>
              <button
                type="button"
                onClick={restart}
                style={{
                  padding: "12px 20px",
                  borderRadius: 999,
                  background: "transparent",
                  color: "#0E0E10",
                  border: "2px solid #0E0E10",
                  cursor: "pointer",
                  fontFamily: "var(--font-cond)",
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  position: "relative",
                }}
              >
                Recommencer un nouveau scan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={start}
              style={{
                padding: "16px 28px",
                borderRadius: 999,
                background: "#0E0E10",
                color: "white",
                border: "2px solid #0E0E10",
                boxShadow: "4px 4px 0 white",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontSize: 15,
                textTransform: "uppercase",
                letterSpacing: ".04em",
                position: "relative",
              }}
            >
              Commencer le scan
            </button>
          )}

          <div
            style={{
              marginTop: 14,
              fontFamily: "var(--font-cond)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              opacity: 0.75,
              position: "relative",
            }}
          >
            Mode {guided ? "guidé · animation lente" : "silencieux · à ton rythme"}
          </div>
        </div>

        <SectionLabel num="•">Mes derniers scans</SectionLabel>
        <Headline accent="qualitatif">Trace</Headline>
        <Card
          icon={IconWriting}
          title="Mots de sortie"
          sub="Pas de visualisation, pas de moyenne. Juste ce que tu as posé."
        >
          <ScanHistory hist={hist} onClear={() => setHist([])} />
        </Card>

        <HLQuote>
          Le corps n'invente pas.
          <br />
          Il <span style={{ color: SCAN_PINK }}>signale</span>.
        </HLQuote>

        <Retain title="OBSERVER, PAS RÉGLER.">
          La pleine conscience corporelle n'est pas un exercice à réussir. Tu ne
          « gagnes » rien à terminer. Tu n'as rien à corriger si tout est tendu.
          Tu écoutes ce qui est là — et c'est déjà l'acte.
        </Retain>
      </>
    );
  }

  // ======= PHASE 1 — Amorce respiratoire =======
  if (draft.phase === 1) {
    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 0)}
        onNext={() => setField("phase", 2)}
        canNext={true}
      >
        <ScanBreathFlower guided={guided} onComplete={() => setField("phase", 2)} />
        <div
          style={{
            marginTop: 8,
            padding: "14px 18px",
            borderRadius: 16,
            background: "#FAF7F2",
            border: "1.5px solid #E6E5E1",
            fontFamily: "var(--font-hand)",
            fontSize: 19,
            lineHeight: 1.25,
            color: "#4A4A55",
            textAlign: "center",
          }}
        >
          {guided
            ? "Aucune perfection demandée. Si ton souffle se cherche, ce n'est pas un échec."
            : "Avance quand tu te sens prêt·e — pas avant."}
        </div>
      </ScanPhaseShell>
    );
  }

  // ======= PHASE 2 — Conscience globale =======
  if (draft.phase === 2) {
    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 1)}
        onNext={() => setField("phase", 3)}
        canNext={draft.globalNoticed}
      >
        <div className="scan-2col">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScanSilhouette states={draft.states} />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: 22,
                lineHeight: 1.3,
                color: "#0E0E10",
                marginBottom: 14,
              }}
            >
              Sens-tu ton corps comme une seule chose, là, posée dans l'espace ?
            </p>
            <p style={{ fontSize: 13, color: "#7C8A99", lineHeight: 1.6, marginBottom: 16 }}>
              Pas en détail. Juste sa <em>présence</em>. Sa température, son
              poids, son contour.
            </p>
            <button
              type="button"
              onClick={() => setField("globalNoticed", true)}
              style={{
                padding: "14px 18px",
                borderRadius: 18,
                background: draft.globalNoticed ? SCAN_PINK : "white",
                color: "#0E0E10",
                border: "2px solid #0E0E10",
                boxShadow: draft.globalNoticed ? "4px 4px 0 #0E0E10" : "none",
                cursor: "pointer",
                width: "100%",
                fontFamily: "var(--font-display)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: ".04em",
                transition: "all .15s",
              }}
            >
              {draft.globalNoticed ? "✓ Oui, je le sens" : "J'ai pris ce moment"}
            </button>
          </div>
        </div>
      </ScanPhaseShell>
    );
  }

  // ======= PHASE 3 — Balayage =======
  if (draft.phase === 3) {
    const z = (ZONES[draft.zoneIdx] ?? ZONES[0]) as Zone;
    const visited: ZoneId[] = ZONES.slice(0, draft.zoneIdx)
      .map((zz) => zz.id)
      .concat(draft.states[z.id] ? [z.id] : []);
    const allDone = ZONES.every((zz) => draft.states[zz.id]);

    const choose = (s: ZoneState) => {
      const newStates: ScanStates = { ...draft.states, [z.id]: s };
      setDraft((d) => ({ ...d, states: newStates }));
      setTimeout(() => {
        setDraft((d) => {
          if (d.zoneIdx < ZONES.length - 1) {
            return { ...d, zoneIdx: d.zoneIdx + 1 };
          }
          return d;
        });
      }, 360);
    };

    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 2)}
        onNext={() => setField("phase", 4)}
        canNext={allDone}
      >
        <div className="scan-2col">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScanSilhouette
              states={draft.states}
              activeZone={z.id}
              onZoneClick={(id) => {
                const idx = ZONES.findIndex((zz) => zz.id === id);
                if (idx >= 0) setField("zoneIdx", idx);
              }}
              dimUnvisited
              visited={visited}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#7C8A99",
                marginBottom: 4,
              }}
            >
              Zone {draft.zoneIdx + 1} / 8
            </div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "-.01em",
                marginBottom: 4,
              }}
            >
              {z.label}
            </h4>
            <div
              style={{
                fontSize: 12,
                color: "#7C8A99",
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              {z.sub}
            </div>

            <ScanSwipePad onChoose={choose} />

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {(["detendu", "neutre", "tendu"] as ZoneState[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => choose(s)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    borderRadius: 14,
                    background: draft.states[z.id] === s ? STATES[s].color : "white",
                    color: "#0E0E10",
                    border: "2px solid #0E0E10",
                    cursor: "pointer",
                    fontFamily: "var(--font-cond)",
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    boxShadow:
                      draft.states[z.id] === s ? "3px 3px 0 #0E0E10" : "none",
                    transition: "all .15s",
                  }}
                >
                  {STATES[s].label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              {ZONES.map((zz, i) => {
                const isCur = i === draft.zoneIdx;
                const st = draft.states[zz.id];
                return (
                  <button
                    key={zz.id}
                    type="button"
                    onClick={() => setField("zoneIdx", i)}
                    aria-label={`Aller à la zone ${i + 1} : ${zz.label}`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: st ? STATES[st].color : "white",
                      border: `${isCur ? 3 : 1.5}px solid ${isCur ? SCAN_PINK : "#0E0E10"}`,
                      fontFamily: "var(--font-cond)",
                      fontWeight: 800,
                      fontSize: 10,
                      cursor: "pointer",
                      color: "#0E0E10",
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScanPhaseShell>
    );
  }

  // ======= PHASE 4 — Accueil des émotions =======
  if (draft.phase === 4) {
    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 3)}
        onNext={() => setField("phase", 5)}
        canNext={true}
      >
        <p
          style={{
            fontFamily: "var(--font-hand)",
            fontSize: 22,
            lineHeight: 1.25,
            color: "#0E0E10",
            marginBottom: 14,
          }}
        >
          Si une émotion est là, tu peux la nommer. Ou pas. Aucun mot n'est mieux
          que le silence.
        </p>
        <Chips
          items={EMO_CHIPS}
          value={draft.emoChips}
          onChange={(v) => setField("emoChips", v)}
        />
        <Label>Et avec tes mots, si tu veux —</Label>
        <FreeArea
          value={draft.emotion}
          onChange={(v) => setField("emotion", v)}
          placeholder="Là, dans le corps, ça ressemble à…"
        />
      </ScanPhaseShell>
    );
  }

  // ======= PHASE 5 — Ancrage =======
  if (draft.phase === 5) {
    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 4)}
        onNext={() => setField("phase", 6)}
        canNext={draft.grounded}
      >
        <div
          style={{
            background: "#FAF7F2",
            border: "2px solid #0E0E10",
            borderRadius: 24,
            padding: "24px 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 200 80"
            width="100%"
            style={{ maxWidth: 240 }}
            aria-hidden="true"
          >
            <title>Empreintes au sol</title>
            <g stroke="#0E0E10" strokeWidth="1.4" fill="none">
              <path d="M 20 20 Q 100 16 180 20" />
              <path d="M 14 32 Q 100 28 186 32" />
              <path d="M 8 46 Q 100 42 192 46" opacity="0.6" />
              <path d="M 4 62 Q 100 58 196 62" opacity="0.4" />
            </g>
            <ellipse
              cx="80"
              cy="22"
              rx="14"
              ry="6"
              fill={SCAN_PINK}
              stroke="#0E0E10"
              strokeWidth="1.8"
            />
            <ellipse
              cx="120"
              cy="22"
              rx="14"
              ry="6"
              fill={SCAN_PINK}
              stroke="#0E0E10"
              strokeWidth="1.8"
            />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: 22,
              lineHeight: 1.25,
              color: "#0E0E10",
              textAlign: "center",
              maxWidth: 380,
            }}
          >
            Sens le poids — dans ton siège, tes pieds, ta colonne. Le sol ne lâche
            pas.
          </p>
          <button
            type="button"
            onClick={() => setField("grounded", true)}
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              background: draft.grounded ? SCAN_PINK : "white",
              color: "#0E0E10",
              border: "2px solid #0E0E10",
              boxShadow: draft.grounded ? "4px 4px 0 #0E0E10" : "none",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: ".04em",
              transition: "all .15s",
            }}
          >
            {draft.grounded ? "✓ Je sens le poids" : "Je prends ce temps"}
          </button>
        </div>
      </ScanPhaseShell>
    );
  }

  // ======= PHASE 6 — Retour =======
  if (draft.phase === 6) {
    const allChecked = draft.returnSteps.length === RETURN_STEPS.length;
    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 5)}
        onNext={() => setField("phase", 7)}
        canNext={allChecked}
      >
        <p style={{ fontSize: 14, color: "#4A4A55", marginBottom: 14, lineHeight: 1.55 }}>
          Quatre micro-mouvements. Coche-les dans l'ordre, ou tape « Tout est là »
          si tu les sens dans le corps sans les distinguer.
        </p>
        <Checklist
          items={RETURN_STEPS}
          value={draft.returnSteps}
          onChange={(v) => setField("returnSteps", v)}
        />
        <button
          type="button"
          onClick={() => setField("returnSteps", RETURN_STEPS.map((s) => s.id))}
          style={{
            marginTop: 10,
            padding: "10px 16px",
            borderRadius: 14,
            background: "transparent",
            border: "1.5px dashed #0E0E10",
            color: "#0E0E10",
            cursor: "pointer",
            fontFamily: "var(--font-cond)",
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Tout est là, je continue
        </button>
      </ScanPhaseShell>
    );
  }

  // ======= PHASE 7 — Notation =======
  if (draft.phase === 7) {
    return (
      <ScanPhaseShell
        phase={cur}
        onPrev={() => setField("phase", 6)}
        onNext={finish}
        canNext={true}
      >
        <div
          className="scan-2col"
          style={{ marginBottom: 16 }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScanSilhouette states={draft.states} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-cond)",
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#7C8A99",
                marginBottom: 6,
              }}
            >
              Paysage corporel du moment
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(["tendu", "neutre", "detendu"] as ZoneState[]).map((k) => (
                <div
                  key={k}
                  style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: STATES[k].color,
                      border: "1.5px solid #0E0E10",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-cond)",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "#0E0E10",
                      minWidth: 64,
                    }}
                  >
                    {STATES[k].label}
                  </span>
                  <span style={{ color: "#4A4A55" }}>
                    {tally[k]} zone{tally[k] > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: 19,
                lineHeight: 1.3,
                color: "#4A4A55",
                marginTop: 14,
              }}
            >
              Pas un score. Pas un diagnostic. Une <em>photo</em> qui change
              demain.
            </p>
          </div>
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            lineHeight: 1.05,
            textTransform: "uppercase",
            letterSpacing: "-.015em",
            marginBottom: 4,
          }}
        >
          Qu'est-ce que tu emportes
          <br />
          <span style={{ color: SCAN_PINK }}>de ce scan&nbsp;?</span>
        </p>
        <p style={{ fontSize: 12, color: "#7C8A99", marginBottom: 8, lineHeight: 1.5 }}>
          Un mot suffit. Une sensation. Ou rien — c'est aussi une réponse.
        </p>
        <Field
          value={draft.outWord}
          onChange={(v) => setField("outWord", v)}
          placeholder="Ex : doux · serré · présent · un peu plus là"
        />
      </ScanPhaseShell>
    );
  }

  return null;
}
