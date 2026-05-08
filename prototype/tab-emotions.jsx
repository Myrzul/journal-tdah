// Onglet NOMMER MES ÉMOTIONS — outil de granularité émotionnelle.
// Rattaché à la rubrique 03 (Émotions) — couleur rose --ch-emotions.
// Fusionne roue des émotions + nuances lexicales en boussole 2 axes ACT
// (plaisant ↔ déplaisant × haute ↔ basse énergie). 4 niveaux : corps → famille
// → émotion → nuance. Couches TCC (intensité, déclencheur, pensée, corps) +
// ACT (fonction, défusion, acceptation) toggables.
//
// Anti-jugement : aucun score, aucune félicitation, aucune alarme. La granularité
// n'est pas un objectif à atteindre — c'est un terrain à explorer.

const { useState: useStE, useEffect: useEfE, useRef: useRfE } = React;

const E_DRAFT = 'jtdah-emotions-draft-v1';
const PINK_E = '#FF8AB8';

// ====================================================================
// LEXIQUE — 6 familles Ekman+, ~6 émotions chacune, ~5-6 nuances par émo.
// Source : fusion lexique + nuances émotionnelles, vérifié contre TCC/ACT.
// Quadrant ACT : he-p (haute énergie + plaisant), be-p, he-d, be-d.
// ====================================================================
const FAMILIES = {
  joie: {
    label: 'Joie', color: '#F5C24D', sym: '☀',
    bodyHints: 'tiède · ample · poitrine ouverte · ralenti agréable',
    emotions: {
      sereine:  { label:'Sereine',  q:'be-p', nuances:['paisible','tranquille','apaisé','en paix','détendu','serein','reposé'] },
      joyeuse:  { label:'Joyeuse',  q:'he-p', nuances:['heureux','content','joyeux','ravi','enjoué','réjoui','gai'] },
      vibrante: { label:'Vibrante', q:'he-p', nuances:['enthousiaste','exalté','électrisé','euphorique','transporté','exubérant','pétillant'] },
      tendre:   { label:'Tendre',   q:'be-p', nuances:['ému','touché','attendri','reconnaissant','comblé','aimant','accueillant'] },
      fiere:    { label:'Fière',    q:'he-p', nuances:['satisfait','fier','accompli','valorisé','confiant','légitime','digne'] },
      curieuse: { label:'Curieuse', q:'he-p', nuances:['intéressé','intrigué','captivé','émerveillé','fasciné','inspiré','attentif'] },
    },
  },
  tristesse: {
    label: 'Tristesse', color: '#5B7FB8', sym: '☂',
    bodyHints: 'lourd · creux dans la poitrine · gorge serrée · larmes proches',
    emotions: {
      melancolique: { label:'Mélancolique', q:'be-d', nuances:['nostalgique','mélancolique','songeur','rêveur','pensif','rétroactif'] },
      affligee:     { label:'Affligée',     q:'be-d', nuances:['triste','attristé','peiné','chagriné','navré','éploré'] },
      desespoir:    { label:'Désespérée',   q:'be-d', nuances:['désespéré','anéanti','brisé','abattu','effondré','dévasté'] },
      solitaire:    { label:'Solitaire',    q:'be-d', nuances:['seul','isolé','abandonné','délaissé','exclu','incompris'] },
      decue:        { label:'Déçue',        q:'be-d', nuances:['déçu','désenchanté','désillusionné','dépité','résigné'] },
      vide:         { label:'Vidée',        q:'be-d', nuances:['vidé','las','blasé','éteint','apathique','engourdi','éreinté'] },
    },
  },
  colere: {
    label: 'Colère', color: '#E8294E', sym: '⚡',
    bodyHints: 'chaud · monté dans la tête · mâchoire serrée · poings · poitrine bombée',
    emotions: {
      irritee:    { label:'Irritée',    q:'he-d', nuances:['irrité','agacé','contrarié','énervé','gêné','crispé'] },
      frustree:   { label:'Frustrée',   q:'he-d', nuances:['frustré','exaspéré','à bout','impuissant','bloqué','contraint'] },
      indignee:   { label:'Indignée',   q:'he-d', nuances:['révolté','indigné','scandalisé','outré','en colère','offensé'] },
      furieuse:   { label:'Furieuse',   q:'he-d', nuances:['furieux','enragé','hors de soi','fou de rage','déchaîné','explosé'] },
      amere:      { label:'Amère',      q:'be-d', nuances:['aigri','rancunier','amer','jaloux','envieux','vexé'] },
      mefiante:   { label:'Méfiante',   q:'he-d', nuances:['méfiant','suspicieux','sur la défensive','sceptique','dubitatif'] },
    },
  },
  peur: {
    label: 'Peur', color: '#9B6BD9', sym: '◈',
    bodyHints: 'froid · ventre qui se contracte · souffle court · pulsations · tremblements',
    emotions: {
      inquiete:   { label:'Inquiète',   q:'he-d', nuances:['inquiet','soucieux','préoccupé','tracassé','soucieux','tendu'] },
      anxieuse:   { label:'Anxieuse',   q:'he-d', nuances:['anxieux','angoissé','oppressé','stressé','nerveux','sur les nerfs'] },
      apeuree:    { label:'Apeurée',    q:'he-d', nuances:['effrayé','apeuré','alarmé','terrorisé','paralysé','panique'] },
      insecure:   { label:'Insécure',   q:'be-d', nuances:['vulnérable','fragile','sans défense','exposé','démuni','perdu'] },
      honteuse:   { label:'Honteuse',   q:'be-d', nuances:['honteux','embarrassé','gêné','mal à l\u2019aise','humilié','rougi'] },
      coupable:   { label:'Coupable',   q:'be-d', nuances:['coupable','fautif','en faute','regrettant','remords','condamné'] },
    },
  },
  degout: {
    label: 'Dégoût', color: '#3FA77A', sym: '☣',
    bodyHints: 'lèvres serrées · nausée légère · recul · grimace',
    emotions: {
      reticente:  { label:'Réticente',  q:'be-d', nuances:['réticent','hésitant','peu enclin','sceptique','partagé'] },
      aversive:   { label:'Aversive',   q:'he-d', nuances:['dégoûté','écœuré','repoussé','rebuté','révulsé'] },
      meprisante: { label:'Méprisante', q:'he-d', nuances:['méprisant','dédaigneux','hautain','condescendant','distant'] },
      saturee:    { label:'Saturée',    q:'be-d', nuances:['saturé','écœuré','lassé','blasé','overdosé','plein'] },
    },
  },
  surprise: {
    label: 'Surprise', color: '#F26B2C', sym: '✦',
    bodyHints: 'sursaut · souffle suspendu · yeux ouverts · pulsation soudaine',
    emotions: {
      etonnee:      { label:'Étonnée',      q:'he-p', nuances:['surpris','curieux','étonné','interrogatif','attentif'] },
      intriguee:    { label:'Intriguée',    q:'he-p', nuances:['intrigué','perplexe','déconcerté','interloqué','interrogateur'] },
      bouleversee:  { label:'Bouleversée',  q:'he-d', nuances:['bouleversé','choqué','sidéré','abasourdi','stupéfait','désarçonné'] },
      emerveillee:  { label:'Émerveillée',  q:'he-p', nuances:['émerveillé','ébahi','ébloui','subjugué','transporté','enchanté'] },
    },
  },
};

const FAM_KEYS = ['joie','tristesse','colere','peur','degout','surprise'];

// Quadrants → familles probables (ordre de pertinence)
const QUADRANT_FAMS = {
  'he-p': ['joie','surprise'],            // énergie haute · agréable
  'be-p': ['joie'],                        // énergie basse · agréable (calme, tendresse)
  'he-d': ['colere','peur','surprise'],   // énergie haute · désagréable
  'be-d': ['tristesse','peur','degout'],  // énergie basse · désagréable
};

// ====================================================================
// PHASES — déroulé de l'outil (tap progressif)
// ====================================================================
const PHASES_E = [
  { id:'porte',     n:1, label:'Entrée',    title:"Comment ça se passe ?" },
  { id:'boussole',  n:2, label:'Boussole',  title:"Place un point" },
  { id:'famille',   n:3, label:'Famille',   title:"Quelle famille s'approche ?" },
  { id:'emotion',   n:4, label:'Émotion',   title:"Quelle nuance ?" },
  { id:'mot',       n:5, label:'Mot juste', title:"Le mot qui sonne juste" },
  { id:'couches',   n:6, label:'Examen',    title:"Si tu veux, on creuse" },
  { id:'trace',     n:7, label:'Trace',     title:"Garde-le pour toi" },
];

// ====================================================================
// BOUSSOLE — pad 2D
// ====================================================================
const Boussole = ({ point, onPlace, onClear }) => {
  const ref = useRfE(null);
  const [drag, setDrag] = useStE(false);

  const update = (clientX, clientY) => {
    const r = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const y = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
    onPlace({ x, y });
  };

  const onDown = (e) => {
    setDrag(true);
    const t = e.touches ? e.touches[0] : e;
    update(t.clientX, t.clientY);
  };
  const onMove = (e) => {
    if (!drag) return;
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    update(t.clientX, t.clientY);
  };
  const onUp = () => setDrag(false);

  useEfE(() => {
    if (!drag) return;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [drag]);

  // Quadrant labels
  const quadrants = [
    { x:'25%', y:'25%', t:'éveillé · agréable',   tone:'#E89A5C' },
    { x:'75%', y:'25%', t:'éveillé · pénible',    tone:'#E8294E' },
    { x:'25%', y:'75%', t:'calme · agréable',     tone:'#4DD0B0' },
    { x:'75%', y:'75%', t:'calme · pénible',      tone:'#5B7FB8' },
  ];

  return (
    <div style={{position:'relative'}}>
      <div ref={ref}
        onMouseDown={onDown} onTouchStart={onDown}
        style={{
          position:'relative', width:'100%', aspectRatio:'1',
          maxWidth:340, margin:'0 auto',
          background:'#FAF7F2',
          border:'2.4px solid #0E0E10', borderRadius:18,
          boxShadow:'4px 4px 0 #0E0E10',
          cursor: drag ? 'grabbing' : 'crosshair',
          touchAction:'none', userSelect:'none', overflow:'hidden',
        }}>

        {/* axes */}
        <div style={{position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'#0E0E10', opacity:0.18}}/>
        <div style={{position:'absolute', top:'50%', left:0, right:0, height:1, background:'#0E0E10', opacity:0.18}}/>

        {/* axe labels */}
        <div style={{position:'absolute', top:8, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10, letterSpacing:'.18em', color:'#0E0E10', textTransform:'uppercase'}}>↑ ÉNERGIE HAUTE</div>
        <div style={{position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10, letterSpacing:'.18em', color:'#0E0E10', textTransform:'uppercase'}}>↓ ÉNERGIE BASSE</div>
        <div style={{position:'absolute', left:8, top:'50%', transform:'translateY(-50%) rotate(-90deg)', transformOrigin:'left center', fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10, letterSpacing:'.18em', color:'#0E0E10', textTransform:'uppercase', whiteSpace:'nowrap'}}>← DÉPLAISANT</div>
        <div style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%) rotate(90deg)', transformOrigin:'right center', fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10, letterSpacing:'.18em', color:'#0E0E10', textTransform:'uppercase', whiteSpace:'nowrap'}}>PLAISANT →</div>

        {/* quadrant tone hints */}
        {quadrants.map((q, i) => (
          <div key={i} style={{
            position:'absolute', left:q.x, top:q.y, transform:'translate(-50%, -50%)',
            width:80, height:80, borderRadius:'50%',
            background:q.tone, opacity:0.08,
          }}/>
        ))}

        {/* point */}
        {point && (
          <div style={{
            position:'absolute',
            left: `${point.x * 100}%`, top: `${point.y * 100}%`,
            transform:'translate(-50%, -50%)',
            width: 28, height: 28, borderRadius:'50%',
            background: PINK_E, border:'2.4px solid #0E0E10',
            boxShadow:'2px 2px 0 #0E0E10',
            pointerEvents:'none',
            transition: drag ? 'none' : 'left .2s, top .2s',
          }}/>
        )}
      </div>

      {/* quadrant resolved */}
      {point && (
        <div style={{textAlign:'center', marginTop:14, fontFamily:'var(--font-cond)', fontSize:13, color:'var(--ink-2)'}}>
          Tu as posé ton ressenti dans la zone <b style={{color:'#0E0E10'}}>{
            (point.y < 0.5 ? 'éveillée · ' : 'calme · ') + (point.x < 0.5 ? 'pénible' : 'agréable')
          }</b>.
          <button onClick={onClear} style={{
            display:'block', margin:'10px auto 0',
            background:'transparent', border:'none',
            fontFamily:'var(--font-cond)', fontSize:11,
            letterSpacing:'.1em', textTransform:'uppercase',
            color:'var(--ink-2)', cursor:'pointer', textDecoration:'underline'
          }}>Replacer le point</button>
        </div>
      )}
    </div>
  );
};

// ====================================================================
// CARTE FAMILLE / ÉMOTION / NUANCE — boutons larges tap-friendly
// ====================================================================
const PickCard = ({ label, sub, onClick, color, selected, large }) => (
  <button onClick={onClick} style={{
    display:'flex', flexDirection:'column', alignItems:'flex-start', gap:4,
    padding: large ? '18px 16px' : '14px 14px',
    background: selected ? color : '#FAF7F2',
    color: selected ? '#0E0E10' : '#0E0E10',
    border:'2.4px solid #0E0E10', borderRadius:14,
    boxShadow: selected ? '2px 2px 0 #0E0E10' : '4px 4px 0 #0E0E10',
    cursor:'pointer', textAlign:'left',
    fontFamily:'var(--font-cond)', fontWeight:800,
    transform: selected ? 'translate(2px, 2px)' : 'none',
    transition:'transform .12s, box-shadow .12s',
    width:'100%',
  }}>
    <span style={{fontSize: large ? 17 : 15, letterSpacing:'.04em', textTransform:'uppercase'}}>{label}</span>
    {sub && <span style={{fontSize:11, fontWeight:500, color:'var(--ink-2)', textTransform:'none', letterSpacing:0}}>{sub}</span>}
  </button>
);

// ====================================================================
// SLIDER 0-10 — Intensité (TCC standard)
// ====================================================================
const Slider10 = ({ value, onChange }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--font-cond)', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink-2)', marginBottom:6}}>
      <span>0 · à peine</span>
      <span>10 · écrasante</span>
    </div>
    <input type="range" min={0} max={10} step={1} value={value ?? 0}
      onChange={e => onChange(parseInt(e.target.value, 10))}
      style={{
        width:'100%', height:14,
        accentColor: PINK_E,
      }}/>
    <div style={{textAlign:'center', marginTop:8, fontFamily:'var(--font-display)', fontSize:36, color:PINK_E, lineHeight:1}}>
      {value ?? 0}<span style={{fontSize:16, color:'var(--ink-2)'}}> /10</span>
    </div>
  </div>
);

// ====================================================================
// MODE "JE NE SAIS PAS" — questions corporelles d'abord
// ====================================================================
const Inconnu = ({ onResolve, onCancel }) => {
  const I = window.Icons;
  const [step, setStep] = useStE(0);
  const [a, setA] = useStE({});

  const Qs = [
    {
      key:'energie',
      q:"Mon énergie, en ce moment ?",
      sub:"Une seule observation. Pas une analyse.",
      options:[
        { id:'haute',  label:'Haute', sub:'agité · tendu · vibrant · pressé' },
        { id:'basse',  label:'Basse', sub:'lent · lourd · épuisé · dans le creux' },
        { id:'mixte',  label:'Mixte', sub:'figé · qui hésite entre les deux' },
      ],
    },
    {
      key:'plaisir',
      q:"C'est plutôt ?",
      sub:"Plaisant ou pénible — ne cherche pas l'exactitude.",
      options:[
        { id:'plaisant',  label:'Plaisant',   sub:'agréable, même si flou' },
        { id:'penible',   label:'Pénible',    sub:'inconfortable, je voudrais que ça change' },
        { id:'neutre',    label:'Indéterminé',sub:'ni l\u2019un ni l\u2019autre, ou les deux à la fois' },
      ],
    },
    {
      key:'mouvement',
      q:"Mon corps a tendance à ?",
      sub:"L'impulsion sous l'émotion.",
      options:[
        { id:'approche', label:'M\u2019approcher',  sub:'curiosité, désir, ouverture' },
        { id:'retrait',  label:'M\u2019éloigner',   sub:'fuite, retrait, mise à distance' },
        { id:'repousse', label:'Repousser',         sub:'rejet, dégoût, colère' },
        { id:'fige',     label:'Me figer',          sub:'rien ne bouge, suspendu' },
      ],
    },
  ];

  const next = (val) => {
    const cur = Qs[step];
    const upd = { ...a, [cur.key]: val };
    setA(upd);
    if (step + 1 < Qs.length) {
      setStep(step + 1);
    } else {
      // Résolution → quadrant + familles probables
      const he = upd.energie === 'haute' || upd.energie === 'mixte';
      const p  = upd.plaisir === 'plaisant';
      const q = (he ? 'he' : 'be') + '-' + (p ? 'p' : 'd');
      let fams = QUADRANT_FAMS[q] || [];
      // ajustement par mouvement
      if (upd.mouvement === 'repousse' && !fams.includes('degout')) fams = ['colere','degout',...fams];
      if (upd.mouvement === 'retrait' && !fams.includes('peur'))   fams = ['peur',...fams];
      if (upd.mouvement === 'approche')                            fams = fams.filter(f => f !== 'tristesse');
      if (upd.mouvement === 'fige')                                fams = ['peur','tristesse',...fams];
      // dedupe
      fams = Array.from(new Set(fams));
      onResolve({ quadrant:q, fams, point: { x: p ? 0.75 : 0.25, y: he ? 0.25 : 0.75 } });
    }
  };

  const cur = Qs[step];

  return (
    <window.Card icon={window.Icons.EyeOpen} title={`Question ${step + 1}/3`} sub={cur.sub}>
      <p style={{
        margin:'2px 0 14px', fontFamily:'var(--font-cond)', fontWeight:800,
        fontSize:18, letterSpacing:'.02em',
      }}>{cur.q}</p>
      <div style={{display:'grid', gap:10}}>
        {cur.options.map(o => (
          <PickCard key={o.id} label={o.label} sub={o.sub} onClick={() => next(o.id)} color={PINK_E}/>
        ))}
      </div>
      <button onClick={onCancel} style={{
        display:'block', margin:'14px auto 0',
        background:'transparent', border:'none',
        fontFamily:'var(--font-cond)', fontSize:11,
        letterSpacing:'.1em', textTransform:'uppercase',
        color:'var(--ink-2)', cursor:'pointer', textDecoration:'underline'
      }}>Revenir à l'entrée</button>
    </window.Card>
  );
};

// ====================================================================
// COMPOSANT PRINCIPAL
// ====================================================================
window.TabEmotions = ({ tcc = true, act = true, families: famsTweak = 6 }) => {
  const I = window.Icons; const Mo = window.Monsters;

  const [draft, setDraft] = useStE(() => {
    try { return JSON.parse(localStorage.getItem(E_DRAFT)) || {}; } catch { return {}; }
  });
  useEfE(() => { localStorage.setItem(E_DRAFT, JSON.stringify(draft)); }, [draft]);

  const [phase, setPhase] = useStE(draft.phase || 'porte');
  const [unknownMode, setUnknownMode] = useStE(false);
  const [showAct, setShowAct] = useStE(false);

  const set = (patch) => setDraft(p => ({ ...p, ...patch }));

  const goPhase = (id) => {
    setPhase(id);
    set({ phase: id });
  };

  const reset = () => {
    setDraft({ phase:'porte' });
    setPhase('porte');
    setUnknownMode(false);
    setShowAct(false);
  };

  // sélection famille → restreint au quadrant si point posé
  const allowedFams = draft.point
    ? (() => {
        const he = draft.point.y < 0.5;
        const p  = draft.point.x >= 0.5;
        const q = (he ? 'he' : 'be') + '-' + (p ? 'p' : 'd');
        const base = QUADRANT_FAMS[q] || FAM_KEYS;
        // toujours afficher TOUTES, mais on remonte les pertinentes
        return [...base, ...FAM_KEYS.filter(f => !base.includes(f))];
      })()
    : FAM_KEYS;

  const fam = draft.family ? FAMILIES[draft.family] : null;
  const emo = fam && draft.emotion ? fam.emotions[draft.emotion] : null;

  // ============== PHASE: PORTE D'ENTRÉE ==============
  if (phase === 'porte') {
    return (
      <>
        <window.IntroHand>
          Mettre un mot sur ce qui se passe.<br/>
          <span style={{color:'var(--ink-2)'}}>Pas pour ranger. Pour mieux entendre.</span>
        </window.IntroHand>

        <window.SectionLabel num="•">Choisis ta porte d'entrée</window.SectionLabel>
        <window.Headline accent="comme tu peux">Trois façons d'entrer</window.Headline>

        <div style={{display:'grid', gap:12}}>
          <PickCard large label="Je sens quelque chose et je veux le nommer"
            sub="Tu sais qu'il y a quelque chose, tu veux trouver le mot juste."
            onClick={() => goPhase('boussole')} color={PINK_E}/>

          <PickCard large label="Je ne sais pas ce que je ressens"
            sub="On commence par le corps, on remonte vers le mot. Trois questions douces."
            onClick={() => { setUnknownMode(true); }} color={PINK_E}/>

          <PickCard large label="C'est confus, mélangé, plusieurs choses à la fois"
            sub="C'est valable. Tu peux nommer plusieurs émotions à la suite."
            onClick={() => goPhase('boussole')} color={PINK_E}/>
        </div>

        {unknownMode && (
          <div style={{marginTop:18}}>
            <window.SectionLabel num="?">Trois questions corporelles</window.SectionLabel>
            <Inconnu
              onResolve={({ quadrant, fams, point }) => {
                set({ point, suggestedFams: fams });
                setUnknownMode(false);
                goPhase('famille');
              }}
              onCancel={() => setUnknownMode(false)}/>
          </div>
        )}

        <window.HandNote>
          « Plus on nomme finement,<br/>moins l'émotion nous emporte. »
        </window.HandNote>

        <window.Card icon={I.Hand} title="Si tu es bloqué·e dans le corps"
          sub="Parfois le mot ne vient pas parce que la sensation est trop forte. Tu peux faire un scan corporel d'abord, puis revenir.">
          <window.HintLink>Aller au scan corporel</window.HintLink>
        </window.Card>
      </>
    );
  }

  // ============== PROGRESS BREADCRUMB ==============
  const ProgressBar = () => {
    const order = ['boussole','famille','emotion','mot','couches','trace'];
    const idx = order.indexOf(phase);
    return (
      <div style={{
        display:'flex', gap:4, justifyContent:'space-between',
        margin:'4px 0 18px', padding:'8px 0',
        borderTop:'1.4px solid var(--ink-2)', borderBottom:'1.4px solid var(--ink-2)',
      }}>
        {order.map((p, i) => {
          const labels = ['Boussole','Famille','Émotion','Mot','Examen','Trace'];
          const reached = i <= idx;
          const active = i === idx;
          return (
            <button key={p} onClick={() => reached && goPhase(p)} style={{
              flex:1, padding:'4px 2px',
              background:'transparent',
              border:'none',
              borderTop: active ? `3px solid ${PINK_E}` : '3px solid transparent',
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10,
              letterSpacing:'.08em', textTransform:'uppercase',
              color: reached ? '#0E0E10' : 'var(--muted)',
              cursor: reached ? 'pointer' : 'default',
            }}>{labels[i]}</button>
          );
        })}
      </div>
    );
  };

  // ============== PHASE: BOUSSOLE ==============
  if (phase === 'boussole') {
    return (
      <>
        <window.IntroHand>Place un point — où en es-tu ?</window.IntroHand>
        <ProgressBar/>
        <window.SectionLabel num="1">La boussole des émotions</window.SectionLabel>
        <window.Headline accent="2 axes ACT">Énergie × plaisir</window.Headline>

        <window.Card icon={I.Compass} title="Pose ton ressenti"
          sub="Glisse ton doigt jusqu'au point qui te ressemble. Pas besoin d'être précis — un ordre de grandeur suffit.">
          <Boussole
            point={draft.point}
            onPlace={(p) => set({ point: p, suggestedFams: undefined })}
            onClear={() => set({ point: undefined })}/>
        </window.Card>

        <div style={{display:'flex', gap:10, marginTop:14}}>
          <button onClick={() => goPhase('porte')} style={navBtnStyle()}>← Retour</button>
          <button onClick={() => goPhase('famille')}
            disabled={!draft.point}
            style={primaryBtnStyle(!!draft.point)}>
            Continuer →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: FAMILLE ==============
  if (phase === 'famille') {
    return (
      <>
        <window.IntroHand>Quelle famille s'approche le plus ?</window.IntroHand>
        <ProgressBar/>
        <window.SectionLabel num="2">Les six grandes familles</window.SectionLabel>
        <window.Headline accent="(Ekman+)">La porte d'entrée du vocabulaire</window.Headline>

        {draft.point && draft.suggestedFams && draft.suggestedFams.length > 0 && (
          <p style={{
            fontFamily:'var(--font-cond)', fontSize:13, color:'var(--ink-2)',
            margin:'0 0 14px', padding:'10px 14px',
            background:'#FFF6FA', border:'1.4px dashed #0E0E10', borderRadius:10,
          }}>
            <b>Suggestion d'après tes réponses</b> : commence par regarder
            {' '}<b style={{color:PINK_E}}>{draft.suggestedFams.slice(0,2).map(k => FAMILIES[k].label).join(' ou ')}</b>.
            {' '}Tu peux ignorer si ça ne colle pas.
          </p>
        )}

        <div style={{display:'grid', gap:10, gridTemplateColumns:'repeat(2, 1fr)'}}>
          {allowedFams.map(k => {
            const f = FAMILIES[k];
            const suggested = draft.suggestedFams && draft.suggestedFams.includes(k);
            return (
              <button key={k} onClick={() => { set({ family: k, emotion: undefined, nuance: undefined }); goPhase('emotion'); }}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'flex-start', gap:4,
                  padding:'14px 12px',
                  background: '#FAF7F2',
                  border:'2.4px solid #0E0E10',
                  borderRadius:14,
                  boxShadow: suggested ? `0 0 0 3px ${PINK_E}, 4px 4px 0 #0E0E10` : '4px 4px 0 #0E0E10',
                  cursor:'pointer', textAlign:'left',
                  position:'relative',
                }}>
                <div style={{display:'flex', alignItems:'center', gap:10, width:'100%'}}>
                  <span style={{
                    width:30, height:30, borderRadius:'50%', background:f.color,
                    border:'2px solid #0E0E10', display:'inline-flex',
                    alignItems:'center', justifyContent:'center',
                    fontSize:14, color:'#0E0E10',
                  }}>{f.sym}</span>
                  <span style={{fontFamily:'var(--font-display)', fontSize:18, color:'#0E0E10'}}>{f.label}</span>
                </div>
                <span style={{
                  fontFamily:'var(--font-cond)', fontSize:10, color:'var(--ink-2)',
                  fontWeight:500, textTransform:'none', letterSpacing:0, lineHeight:1.3,
                }}>{f.bodyHints}</span>
              </button>
            );
          })}
        </div>

        <div style={{display:'flex', gap:10, marginTop:18}}>
          <button onClick={() => goPhase('boussole')} style={navBtnStyle()}>← Boussole</button>
          <button onClick={reset} style={navBtnStyle()}>↻ Recommencer</button>
        </div>
      </>
    );
  }

  // ============== PHASE: ÉMOTION ==============
  if (phase === 'emotion' && fam) {
    return (
      <>
        <window.IntroHand>
          {fam.label} — quelle nuance s'approche ?
        </window.IntroHand>
        <ProgressBar/>
        <window.SectionLabel num="3">Émotions de la famille {fam.label}</window.SectionLabel>
        <window.Headline>Plus précis, <span className="accent">moins emportant</span></window.Headline>

        <div style={{display:'grid', gap:10}}>
          {Object.entries(fam.emotions).map(([k, e]) => (
            <PickCard key={k}
              label={e.label}
              sub={e.nuances.slice(0,3).join(' · ') + '…'}
              onClick={() => { set({ emotion: k, nuance: undefined }); goPhase('mot'); }}
              color={fam.color}/>
          ))}
        </div>

        <div style={{display:'flex', gap:10, marginTop:18}}>
          <button onClick={() => goPhase('famille')} style={navBtnStyle()}>← Familles</button>
        </div>
      </>
    );
  }

  // ============== PHASE: MOT JUSTE (NUANCE) ==============
  if (phase === 'mot' && fam && emo) {
    return (
      <>
        <window.IntroHand>
          Le mot qui sonne le plus juste, là, maintenant.
        </window.IntroHand>
        <ProgressBar/>
        <window.SectionLabel num="4">Nuances de « {emo.label} »</window.SectionLabel>
        <window.Headline accent="(ou écris le tien)">Choisis</window.Headline>

        <window.Card icon={I.Sparkle} title={`Famille : ${fam.label} · Émotion : ${emo.label}`}
          sub="Si aucun mot ne te parle, écris le tien — c'est lui qui compte.">
          <div style={{display:'flex', flexWrap:'wrap', gap:8, marginBottom:12}}>
            {emo.nuances.map(n => {
              const sel = draft.nuance === n;
              return (
                <button key={n} onClick={() => set({ nuance: n, customWord: '' })}
                  style={{
                    padding:'8px 14px',
                    background: sel ? PINK_E : 'white',
                    color: '#0E0E10',
                    border:'2px solid #0E0E10', borderRadius:999,
                    fontFamily:'var(--font-cond)', fontWeight:700, fontSize:13,
                    cursor:'pointer',
                    boxShadow: sel ? '2px 2px 0 #0E0E10' : '3px 3px 0 #0E0E10',
                    transform: sel ? 'translate(1px,1px)' : 'none',
                  }}>{n}</button>
              );
            })}
          </div>
          <window.Label>Ou ton mot à toi</window.Label>
          <window.Field
            value={draft.customWord}
            onChange={v => set({ customWord: v, nuance: v ? null : draft.nuance })}
            placeholder="Le mot qui résonne, même bizarre…"/>
        </window.Card>

        <div style={{display:'flex', gap:10, marginTop:18}}>
          <button onClick={() => goPhase('emotion')} style={navBtnStyle()}>← Émotions</button>
          <button onClick={() => goPhase('couches')}
            disabled={!draft.nuance && !draft.customWord}
            style={primaryBtnStyle(!!(draft.nuance || draft.customWord))}>
            Continuer →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: COUCHES ACT/TCC ==============
  if (phase === 'couches' && fam) {
    const word = draft.customWord || draft.nuance || emo?.label || fam.label;
    return (
      <>
        <window.IntroHand>
          <b style={{color:PINK_E}}>{word}</b>.<br/>
          <span style={{color:'var(--ink-2)'}}>Tu peux t'arrêter là, ou creuser un peu.</span>
        </window.IntroHand>
        <ProgressBar/>

        {/* Intensité TCC */}
        {tcc && (
          <>
            <window.SectionLabel num="5a">Intensité — TCC</window.SectionLabel>
            <window.Headline accent="0 à 10">Curseur clinique</window.Headline>
            <window.Card icon={I.Waves} title="À quel point c'est fort, là ?"
              sub="Pas un score à atteindre. Une mesure pour suivre, plus tard, comment ça bouge.">
              <Slider10 value={draft.intens ?? null} onChange={v => set({ intens: v })}/>
            </window.Card>
          </>
        )}

        {/* Déclencheur TCC */}
        {tcc && (
          <>
            <window.SectionLabel num="5b">Déclencheur — TCC</window.SectionLabel>
            <window.Headline>Quand est-ce <span className="accent">arrivé</span> ?</window.Headline>
            <window.Card icon={I.Clock} title="Le moment, la situation"
              sub="Quoi, qui, où — sans interprétation. Juste les faits.">
              <window.FreeArea value={draft.declench} onChange={v => set({ declench: v })}
                placeholder="Ce matin en lisant ce message… / Quand je me suis réveillé… / Pendant la réunion…"/>
            </window.Card>
          </>
        )}

        {/* Pensée associée TCC */}
        {tcc && (
          <>
            <window.SectionLabel num="5c">Pensée associée — TCC</window.SectionLabel>
            <window.Headline accent="qu'est-ce que je me dis ?">L'arrière-pensée</window.Headline>
            <window.Card icon={I.Cloud} title="La phrase qui passe dans la tête">
              <window.FreeArea value={draft.pensee} onChange={v => set({ pensee: v })}
                placeholder="« Je n'y arriverai pas. » / « Personne ne comprend. » / …"/>
            </window.Card>
          </>
        )}

        {/* Sensation corporelle TCC → lien scan */}
        {tcc && (
          <>
            <window.SectionLabel num="5d">Lien corporel — TCC</window.SectionLabel>
            <window.Headline>Où dans <span className="accent">le corps</span> ?</window.Headline>
            <window.Card icon={I.Hand} title="La sensation associée"
              sub={`Repères de la famille ${fam.label} : ${fam.bodyHints}`}>
              <window.FreeArea value={draft.corps} onChange={v => set({ corps: v })}
                placeholder="Une boule dans la gorge, du chaud sur le visage, du vide dans le ventre…"/>
              <window.HintLink>Faire un scan corporel détaillé</window.HintLink>
            </window.Card>
          </>
        )}

        {/* Toggle ACT */}
        {act && (
          <>
            <button onClick={() => setShowAct(s => !s)} style={{
              width:'100%', marginTop:12, padding:'12px 16px',
              background: showAct ? PINK_E : 'white',
              color: '#0E0E10',
              border:'2.4px solid #0E0E10', borderRadius:14,
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:13,
              letterSpacing:'.08em', textTransform:'uppercase',
              cursor:'pointer',
              boxShadow: showAct ? '2px 2px 0 #0E0E10' : '4px 4px 0 #0E0E10',
              transform: showAct ? 'translate(2px,2px)' : 'none',
            }}>
              {showAct ? '↓ Couche ACT déployée' : '+ Ajouter la couche ACT (acceptation)'}
            </button>

            {showAct && (
              <>
                {/* Fonction ACT */}
                <window.SectionLabel num="6a">Fonction — ACT</window.SectionLabel>
                <window.Headline accent="à quoi sert-elle ?">Cette émotion me dit…</window.Headline>
                <window.Card icon={I.EyeOpen} title="Le message de l'émotion"
                  sub="Toute émotion porte un signal : valeur menacée, besoin non satisfait, intuition juste. Pas une ennemie.">
                  <window.FreeArea value={draft.fonction} onChange={v => set({ fonction: v })}
                    placeholder="« Cette colère me dit que mon temps est précieux. » / « Cette tristesse me dit que ce lien comptait. »"/>
                </window.Card>

                {/* Défusion ACT */}
                <window.SectionLabel num="6b">Défusion — ACT</window.SectionLabel>
                <window.Headline>Prendre <span className="accent">du recul</span></window.Headline>
                <window.Card icon={I.Shield} title="Reformule en mode observateur"
                  sub="Au lieu de « je suis triste », essaie « je remarque que je me sens triste ». L'émotion devient quelque chose qui passe en toi, plutôt que toi.">
                  <window.FreeArea value={draft.defusion} onChange={v => set({ defusion: v })}
                    placeholder={`Je remarque que je me sens ${word}…`}/>
                </window.Card>

                {/* Acceptation ACT */}
                <window.SectionLabel num="6c">Acceptation — ACT</window.SectionLabel>
                <window.Headline accent="sans la combattre">Faire de la place</window.Headline>
                <window.Card icon={I.Heart} title="L'accueillir telle qu'elle est"
                  sub="Pas l'aimer. Juste arrêter de la repousser. Lui faire de la place comme à un visiteur — elle finira par bouger toute seule.">
                  <window.FreeArea value={draft.acceptation} onChange={v => set({ acceptation: v })}
                    placeholder="« Je laisse cette colère être là. Elle peut s'asseoir un moment. »"/>
                </window.Card>
              </>
            )}
          </>
        )}

        <div style={{display:'flex', gap:10, marginTop:18}}>
          <button onClick={() => goPhase('mot')} style={navBtnStyle()}>← Mot</button>
          <button onClick={() => goPhase('trace')} style={primaryBtnStyle(true)}>
            Voir ma trace →
          </button>
        </div>
      </>
    );
  }

  // ============== PHASE: TRACE FINALE ==============
  if (phase === 'trace' && fam) {
    const word = draft.customWord || draft.nuance || emo?.label || fam.label;
    return (
      <>
        <window.IntroHand>
          Voilà ce que tu as posé.<br/>
          <span style={{color:'var(--ink-2)'}}>Pas un verdict. Une photo de l'instant.</span>
        </window.IntroHand>
        <ProgressBar/>

        <window.SectionLabel num="•">Ton émotion nommée</window.SectionLabel>

        {/* CARTE FINALE — le mot en grand */}
        <div style={{
          padding:'24px 20px',
          background: fam.color,
          border:'2.4px solid #0E0E10', borderRadius:16,
          boxShadow:'4px 4px 0 #0E0E10',
          marginBottom:18,
        }}>
          <div style={{
            fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
            letterSpacing:'.18em', textTransform:'uppercase', color:'#0E0E10', opacity:0.7,
            marginBottom:6,
          }}>
            {fam.label} · {emo ? emo.label : '—'}
          </div>
          <div style={{
            fontFamily:'var(--font-display)', fontSize:42, lineHeight:1.05, color:'#0E0E10',
            wordBreak:'break-word',
          }}>{word}</div>
          {draft.intens != null && (
            <div style={{
              marginTop:12, display:'inline-block',
              padding:'4px 12px',
              background:'rgba(14,14,16,0.85)', color:'white', borderRadius:999,
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:12,
              letterSpacing:'.08em',
            }}>
              Intensité {draft.intens}/10
            </div>
          )}
        </div>

        {/* Récap couches remplies */}
        {(draft.declench || draft.pensee || draft.corps || draft.fonction || draft.defusion || draft.acceptation) && (
          <window.Card icon={I.Book} title="Ce que tu as exploré">
            {draft.declench && (
              <RecapRow label="Déclencheur" value={draft.declench}/>
            )}
            {draft.pensee && (
              <RecapRow label="Pensée associée" value={draft.pensee}/>
            )}
            {draft.corps && (
              <RecapRow label="Sensation corporelle" value={draft.corps}/>
            )}
            {draft.fonction && (
              <RecapRow label="Fonction (ACT)" value={draft.fonction}/>
            )}
            {draft.defusion && (
              <RecapRow label="Défusion (ACT)" value={draft.defusion}/>
            )}
            {draft.acceptation && (
              <RecapRow label="Acceptation (ACT)" value={draft.acceptation}/>
            )}
          </window.Card>
        )}

        <window.HandNote right>
          « Plus on nomme finement,<br/>moins l'émotion devient un brouillard. »
        </window.HandNote>

        {/* Liens vers autres outils */}
        <window.SectionLabel num="•">Aller plus loin (si tu veux)</window.SectionLabel>
        <div style={{display:'grid', gap:10}}>
          <PickCard label="Mesurer mon niveau d'activation"
            sub="Aller au thermomètre — utile si l'émotion est très intense."
            onClick={() => {}} color={PINK_E}/>
          <PickCard label="Faire un scan corporel"
            sub="Si l'émotion est encore présente dans le corps, lui faire de la place."
            onClick={() => {}} color={PINK_E}/>
        </div>

        <div style={{display:'flex', gap:10, marginTop:18}}>
          <button onClick={() => goPhase('couches')} style={navBtnStyle()}>← Examen</button>
          <button onClick={reset} style={primaryBtnStyle(true)}>
            ✓ Terminer · nouvelle entrée
          </button>
        </div>

        <window.Retain title="NOMMER, C'EST DÉJÀ COMMENCER À NE PLUS ÊTRE EMPORTÉ." monster={Mo.Reflexif}>
          La granularité émotionnelle — savoir distinguer « contrarié » de « furieux »,
          « las » de « désespéré » — est, en TCC comme en ACT, un facteur de protection.
          Tu n'as pas à le faire parfaitement. Tu as juste à essayer.
        </window.Retain>
      </>
    );
  }

  // fallback
  return null;
};

// ====================================================================
// HELPERS
// ====================================================================
const RecapRow = ({ label, value }) => (
  <div style={{margin:'10px 0'}}>
    <div style={{
      fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10,
      letterSpacing:'.12em', textTransform:'uppercase',
      color:'var(--ink-2)', marginBottom:4,
    }}>{label}</div>
    <div style={{
      fontFamily:'var(--font-cond)', fontSize:14, color:'#0E0E10',
      whiteSpace:'pre-wrap', lineHeight:1.4,
    }}>{value}</div>
  </div>
);

function navBtnStyle() {
  return {
    flex:'0 0 auto',
    padding:'12px 14px',
    background:'white', color:'#0E0E10',
    border:'2.4px solid #0E0E10', borderRadius:14,
    fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
    letterSpacing:'.08em', textTransform:'uppercase',
    cursor:'pointer',
    boxShadow:'3px 3px 0 #0E0E10',
  };
}
function primaryBtnStyle(enabled) {
  return {
    flex:1,
    padding:'12px 16px',
    background: enabled ? PINK_E : '#E0DCD4',
    color:'#0E0E10',
    border:'2.4px solid #0E0E10', borderRadius:14,
    fontFamily:'var(--font-cond)', fontWeight:800, fontSize:12,
    letterSpacing:'.08em', textTransform:'uppercase',
    cursor: enabled ? 'pointer' : 'not-allowed',
    boxShadow: enabled ? '4px 4px 0 #0E0E10' : 'none',
    opacity: enabled ? 1 : 0.5,
  };
}
