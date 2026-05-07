// Onglet MATIN
const { useState: useStM, useEffect: useEfM } = React;
const M_KEY = 'jtdah-matin-v3';

window.TabMatin = ({ pushPriorities, dominant }) => {
  const I = window.Icons;
  const Mo = window.Monsters;
  const [s, setS] = useStM(() => {
    try { return JSON.parse(localStorage.getItem(M_KEY)) || {}; } catch { return {}; }
  });
  useEfM(() => { localStorage.setItem(M_KEY, JSON.stringify(s)); }, [s]);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  // sync prios -> soir
  useEfM(() => { pushPriorities && pushPriorities(s.prios || ['','','']); }, [s.prios]);

  return (
    <>
      <window.IntroHand>
        Comment je me sens, là, maintenant ?<br/>
        <span style={{color:'var(--ink-2)'}}>Pas de pression. On observe, c'est tout.</span>
      </window.IntroHand>

      <window.SectionLabel num="1">Mon état au réveil</window.SectionLabel>
      <window.Headline accent="(données, pas verdicts)">Je m'observe</window.Headline>

      <window.Card icon={I.Battery} title="Énergie corporelle" sub="De vide à pleine batterie.">
        <window.Scale value={s.energie} onChange={v => set('energie', v)} labelLow="VIDE" labelHigh="PLEINE"/>
      </window.Card>
      <window.Card icon={I.Cloud} title="État mental" sub="Brume, ou tête claire ?">
        <window.Scale value={s.mental} onChange={v => set('mental', v)} labelLow="BROUILLARD" labelHigh="LIMPIDE"/>
      </window.Card>
      <window.Card icon={I.Moon} title="Sommeil" sub="Comment était la nuit ?">
        <window.Scale value={s.sommeil} onChange={v => set('sommeil', v)} labelLow="AGITÉ" labelHigh="RÉPARATEUR"/>
        <window.Label>Heure du coucher · réveil</window.Label>
        <div style={{display:'flex', gap:10}}>
          <window.Field value={s.heureCouche} onChange={v => set('heureCouche', v)} placeholder="22h30"/>
          <window.Field value={s.heureReveil} onChange={v => set('heureReveil', v)} placeholder="07h00"/>
        </div>
      </window.Card>

      <window.HandNote>« Ces chiffres ne définissent pas ma journée. »</window.HandNote>

      <window.SectionLabel num="2">Mes émotions du matin</window.SectionLabel>
      <window.Headline>Je nomme<br/>ce que je ressens</window.Headline>
      <window.EmoGrid
        value={s.emotion}
        onChange={v => set('emotion', v)}
        items={[
          { id: 'calme',     label: 'Calme',     illu: Mo.Calme,     color:'#4DD0B0' },
          { id: 'curieux',   label: 'Curieux',   illu: Mo.Curieux,   color:'#1B4FE5' },
          { id: 'reflexif',  label: 'Réflexif',  illu: Mo.Reflexif,  color:'#B05BC9' },
          { id: 'energique', label: 'Énergique', illu: Mo.Energique, color:'#F26B2C' },
          { id: 'inquiet',   label: 'Inquiet',   illu: Mo.Inquiet,   color:'#F0B340' },
          { id: 'endormi',   label: 'Endormi',   illu: Mo.Endormi,   color:'#7C8A99' },
        ]}/>
      <window.Field multiline rows={2} value={s.emotionWhy}
        onChange={v => set('emotionWhy', v)}
        placeholder="Si je devais préciser… (optionnel)"/>

      <window.SectionLabel num="3">Routine du matin</window.SectionLabel>
      <window.Headline>Les petits<br/><span className="accent">gestes-ancres</span></window.Headline>
      <window.Card icon={I.Hand} title="Ce que j'ai déjà fait" sub="Coche au fil — sans culpabilité.">
        <window.Checklist
          value={s.routine || []}
          onChange={v => set('routine', v)}
          items={[
            { id: 'eau',     label: 'Boire un verre d\'eau', icon: I.Drop },
            { id: 'lumiere', label: 'M\'exposer à la lumière', icon: I.Sun },
            { id: 'corps',   label: 'Bouger 5 minutes',       icon: I.Run },
            { id: 'manger',  label: 'Manger quelque chose',   icon: I.Egg },
            { id: 'dents',   label: 'Hygiène (dents, douche)', icon: I.Tooth },
            { id: 'meds',    label: 'Traitement / vitamines', icon: I.Pill },
          ]}/>
      </window.Card>

      <window.HLQuote>
        Une routine n'est pas une prison —<br/>c'est un point d'appui.
      </window.HLQuote>

      <window.SectionLabel num="4">Intention du jour</window.SectionLabel>
      <window.Headline accent="aujourd'hui ?">Qu'est-ce que je<br/>veux <span className="accent">vraiment</span></window.Headline>

      <window.Card icon={I.Compass} title="Mon intention" sub="Un mot, une phrase. Pas un objectif — une direction.">
        <window.Field value={s.intention} onChange={v => set('intention', v)}
          placeholder="Ex : être patient avec moi-même"/>
      </window.Card>

      <window.Card icon={I.Target} title="Mes 3 priorités" sub="Pas plus. Sinon ce ne sont plus des priorités.">
        <window.PrioRow tag="P1 · INCONTOURNABLE" klass="t1"
          value={(s.prios||[])[0]} onChange={v => set('prios', [v, (s.prios||[])[1]||'', (s.prios||[])[2]||''])}
          placeholder="Ce qui doit être fait"/>
        <window.PrioRow tag="P2 · IMPORTANT" klass="t2"
          value={(s.prios||[])[1]} onChange={v => set('prios', [(s.prios||[])[0]||'', v, (s.prios||[])[2]||''])}
          placeholder="Ce qui ferait du bien"/>
        <window.PrioRow tag="P3 · BONUS" klass="t3"
          value={(s.prios||[])[2]} onChange={v => set('prios', [(s.prios||[])[0]||'', (s.prios||[])[1]||'', v])}
          placeholder="Si l'énergie le permet"/>
      </window.Card>

      <window.Card icon={I.Shield} title="Stratégies anti-débordement" sub="Si la journée déraille, voici mes filets.">
        <window.Chips
          value={s.strats || []}
          onChange={v => set('strats', v)}
          items={[
            { id:'pause', label:'Faire une pause', icon: I.Pause },
            { id:'liste', label:'Tout écrire', icon: I.Writing },
            { id:'air',   label:'Sortir 10 min', icon: I.Wind },
            { id:'aide',  label:'Demander de l\'aide', icon: I.Chat },
            { id:'mono',  label:'Une seule tâche', icon: I.Target },
            { id:'stop',  label:'Faire moins', icon: I.Hourglass },
          ]}/>
      </window.Card>

      <window.Retain title="LE MATIN POSE LE TON, PAS LE VERDICT." monster={Mo.Curieux}>
        Tu n'as pas à être au sommet pour démarrer. Tu dois juste démarrer doucement.
        Le reste se construit au fil des heures.
      </window.Retain>
    </>
  );
};
