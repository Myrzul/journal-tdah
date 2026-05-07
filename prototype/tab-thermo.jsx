// Onglet THERMOMÈTRE — outil métacognitif d'auto-évaluation TDAH
// Anti-gamification : palette qui s'apaise vers le rouge, langage 'observation', pas de score.

const { useState: useStT, useEffect: useEfT, useRef: useRfT } = React;
const T_KEY = 'jtdah-thermo-v1';
const T_HIST = 'jtdah-thermo-hist-v1';

// 5 niveaux d'activation (arousal physiologico-cognitif)
const LEVELS = [
  {
    n: 1,
    label: "CALME",
    sublabel: "Régulé·e",
    cog: "Je peux réfléchir, décider, m'exprimer clairement.",
    color: "#4DD0B0",   // turquoise apaisé
    cluster: ["serein", "posé", "présent", "ouvert", "disponible"],
    monster: "Calme",
    breath: false
  },
  {
    n: 2,
    label: "ATTENTIF",
    sublabel: "Vigilant·e",
    cog: "Je peux encore réfléchir, mais quelque chose me sollicite.",
    color: "#1B4FE5",   // bleu
    cluster: ["concentré", "alerte", "curieux", "engagé", "tendu léger"],
    monster: "Curieux",
    breath: false
  },
  {
    n: 3,
    label: "ACTIVÉ",
    sublabel: "Sous tension",
    cog: "Ma réflexion est impactée. Mes pensées s'accélèrent ou se brouillent.",
    color: "#B05BC9",   // violet — pas plus chaud
    cluster: ["agité", "anxieux", "frustré", "dispersé", "irritable"],
    monster: "Inquiet",
    breath: true
  },
  {
    n: 4,
    label: "DÉBORDÉ",
    sublabel: "Submergé·e",
    cog: "J'ai du mal à penser clairement. Mon corps prend le dessus.",
    color: "#7C8A99",   // gris-bleu — palette qui se vide, pas qui chauffe
    cluster: ["panique", "colère", "abattu", "honte", "dissocié"],
    monster: "Surprise",
    breath: true
  },
  {
    n: 5,
    label: "STOP",
    sublabel: "Surcharge / crise",
    cog: "Penser n'est plus possible maintenant. C'est un signal — pas un échec.",
    color: "#2A2A33",   // anthracite calme — surtout pas rouge alarmant
    cluster: ["sidéré", "submergé", "à bout", "immobile", "envie de fuir"],
    monster: "Endormi",
    breath: true
  },
];

// stratégies différenciées par niveau (escalade graduée vers le bas-régime)
const STRATEGIES = {
  1: [
    { id:'note',  label:'Noter ce qui va bien' },
    { id:'air',   label:'Une marche tranquille' },
    { id:'lire',  label:'Lire 10 min' },
    { id:'autre', label:'Profiter, simplement' },
  ],
  2: [
    { id:'pause', label:'Pause 2 min loin de l\'écran' },
    { id:'eau',   label:'Boire un grand verre d\'eau' },
    { id:'liste', label:'Écrire ce qui me sollicite' },
    { id:'one',   label:'Choisir UNE seule tâche' },
  ],
  3: [
    { id:'breath',label:'Cohérence cardiaque 3 min' },
    { id:'sortie',label:'Sortir 10 min — air, lumière' },
    { id:'corps', label:'Bouger : 20 jumping jacks' },
    { id:'froid', label:'Eau froide sur le visage' },
    { id:'voix',  label:'Appeler un proche fiable' },
  ],
  4: [
    { id:'stop',  label:'Tout arrêter — vraiment' },
    { id:'breath',label:'Respiration 4-7-8 (5 cycles)' },
    { id:'glace', label:'Glaçon dans la main 30 sec' },
    { id:'cocon', label:'Lieu calme, peu de stimulus' },
    { id:'voix',  label:'Parler à quelqu\'un de confiance' },
  ],
  5: [
    { id:'stop',  label:'Mettre tout en pause' },
    { id:'sec',   label:'Mise en sécurité physique' },
    { id:'aide',  label:'Demander de l\'aide MAINTENANT' },
    { id:'3114', label:'Appeler le 3114 (gratuit, 24/7)' },
  ],
};

// THERMOMÈTRE-CRÉATURE — le tube est le corps d'un monstre, le bulbe sa tête.
// L'expression du visage et la posture changent selon le niveau.
// `mercuryColor` = couleur du liquide (palette qui s'apaise par niveau)
// `limbColor`    = couleur des bras/antenne (sur fond coloré on passe en blanc)
const ThermoVisual = ({ level, limbColor = '#0E0E10', mercuryColor = '#1B4FE5', onPick }) => {
  const ref = useRfT(null);
  const dragging = useRfT(false);
  const [tick, setTick] = useStT(0);
  // animated mercury level (smooth interpolation toward `level`)
  const [animLvl, setAnimLvl] = useStT(level || 1);

  // animate gentle: bubbles + mouth breath + arm sway
  useEfT(() => {
    let raf;
    const loop = () => { setTick(t => (t + 1) % 100000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // smooth easing of mercury toward level (with overshoot)
  useEfT(() => {
    let raf;
    const target = level || 1;
    const step = () => {
      setAnimLvl(prev => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.005) return target;
        // ease-out + slight overshoot via velocity scaled by diff
        const next = prev + diff * 0.12;
        raf = requestAnimationFrame(step);
        return next;
      });
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [level]);

  const W = 220, H = 460;
  const cx = W / 2;
  const tubeTop = 120, tubeBot = 340;   // mercury column track
  const tubeH = tubeBot - tubeTop;
  const tubeW = 56;                     // tube width
  const headR = 60;                     // bulb / head radius
  const headCy = 388;

  const lvl = level || 1;
  const animFillRatio = animLvl / 5;
  const fillTop = tubeBot - animFillRatio * tubeH;

  // compute level from pointer Y (relative to whole svg)
  const compute = (clientY) => {
    const rect = ref.current.getBoundingClientRect();
    const yLocal = (clientY - rect.top) * (H / rect.height);
    const ratio = Math.max(0, Math.min(1, (tubeBot - yLocal) / tubeH));
    return Math.max(1, Math.min(5, Math.round(ratio * 5 + 0.0001)));
  };
  const handleMove = (e) => {
    if (!dragging.current) return;
    const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (cy != null) onPick(compute(cy));
  };
  const start = (e) => {
    dragging.current = true;
    const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (cy != null) onPick(compute(cy));
  };
  const stop = () => { dragging.current = false; };
  useEfT(() => {
    const m = (e) => handleMove(e);
    const u = () => stop();
    window.addEventListener('mousemove', m);
    window.addEventListener('mouseup', u);
    window.addEventListener('touchmove', m, {passive:true});
    window.addEventListener('touchend', u);
    return () => {
      window.removeEventListener('mousemove', m);
      window.removeEventListener('mouseup', u);
      window.removeEventListener('touchmove', m);
      window.removeEventListener('touchend', u);
    };
  });

  // breathing scale on head — slower at low arousal, faster at high
  const breathSpeed = 0.04 + (lvl - 1) * 0.025;
  const breath = 1 + Math.sin(tick * breathSpeed) * 0.018;

  // arm sway speed
  const swaySpeed = 0.03 + (lvl - 1) * 0.04;
  const sway = Math.sin(tick * swaySpeed) * (lvl >= 4 ? 8 : 3);
  const swayR = -sway;

  // antenna shake amount
  const antennaShake = lvl >= 4 ? Math.sin(tick * 0.5) * 4 : Math.sin(tick * 0.04) * 1.5;

  // wavy mercury top (organic surface)
  const waveAmp = 4;
  const waveFreq = 0.15;
  const wavePts = [];
  const segs = 16;
  for (let i = 0; i <= segs; i++) {
    const x = cx - tubeW/2 + (i / segs) * tubeW;
    const y = fillTop + Math.sin(tick * 0.08 + i * waveFreq * 2) * waveAmp;
    wavePts.push([x, y]);
  }
  const meniscus =
    `M ${cx - tubeW/2} ${tubeBot} ` +
    `L ${cx - tubeW/2} ${fillTop} ` +
    wavePts.map(p => `L ${p[0]} ${p[1]}`).join(' ') +
    ` L ${cx + tubeW/2} ${fillTop} L ${cx + tubeW/2} ${tubeBot} Z`;

  // bubbles rising in mercury (count varies with level)
  const bubbleCount = Math.max(2, lvl + 1);
  const bubbles = [];
  for (let i = 0; i < bubbleCount; i++) {
    const speed = 0.5 + (lvl * 0.25);
    const t = (tick * speed + i * 47) % 100;
    const yProgress = t / 100;
    const by = tubeBot - yProgress * (tubeBot - fillTop - 8);
    if (by > fillTop + 8 && by < tubeBot - 4) {
      bubbles.push({
        x: cx + Math.sin(tick * 0.05 + i * 1.7) * (tubeW/2 - 10),
        y: by,
        r: 3 + (i % 3)
      });
    }
  }

  // expressions per level
  const expressions = {
    1: { // calme — yeux fermés-souriants ^ ^
      eyes: (x, y) => (
        <g>
          <path d={`M ${x-8} ${y+2} Q ${x} ${y-4} ${x+8} ${y+2}`} stroke="#0E0E10" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      ),
      mouth: () => <path d={`M ${cx-14} ${headCy+18} Q ${cx} ${headCy+28} ${cx+14} ${headCy+18}`} stroke="#0E0E10" strokeWidth="3" fill="none" strokeLinecap="round"/>,
      cheeks: true,
    },
    2: { // attentif — yeux ronds, regard de côté
      eyes: (x, y) => (
        <g>
          <circle cx={x} cy={y} r="7" fill="white"/>
          <circle cx={x+2} cy={y+1} r="3.2" fill="#0E0E10"/>
        </g>
      ),
      mouth: () => <line x1={cx-10} y1={headCy+20} x2={cx+10} y2={headCy+20} stroke="#0E0E10" strokeWidth="3" strokeLinecap="round"/>,
      cheeks: true,
    },
    3: { // activé — petits points seuls
      eyes: (x, y) => (
        <g>
          <circle cx={x} cy={y+2} r="2.5" fill="#0E0E10"/>
        </g>
      ),
      mouth: () => <path d={`M ${cx-14} ${headCy+22} q 4 -6 8 0 q 4 6 8 0 q 4 -6 8 0`}
                         transform={`translate(-15 0)`} stroke="#0E0E10" strokeWidth="2.8" fill="none" strokeLinecap="round"/>,
      cheeks: false,
    },
    4: { // débordé — points écarquillés seuls
      eyes: (x, y) => (
        <g>
          <circle cx={x} cy={y+2} r="3.2" fill="#0E0E10"/>
        </g>
      ),
      mouth: () => (
        <g>
          <ellipse cx={cx} cy={headCy+22} rx="9" ry="6" fill="#0E0E10"/>
          <path d={`M ${cx-9} ${headCy+22} Q ${cx} ${headCy+28} ${cx+9} ${headCy+22}`} fill="#FF8AB8"/>
        </g>
      ),
      cheeks: false,
      tearLeft: true,
    },
    5: { // STOP / crise — yeux clos serrés, larmes, bouche petite tremblante
      eyes: (x, y, side) => (
        <g>
          <path d={`M ${x-9} ${y-8} L ${x+8} ${y-3}`} stroke="#0E0E10" strokeWidth="3" strokeLinecap="round"/>
          <path d={`M ${x-9} ${y} Q ${x} ${y-4} ${x+9} ${y}`} stroke="#0E0E10" strokeWidth="3" fill="none" strokeLinecap="round"/>
          {/* tear */}
          <path d={`M ${x + (side==='r'?6:-6)} ${y+6} q 0 6 -3 9 q -3 -3 -3 -9`} fill="#1B4FE5" opacity="0.8"/>
        </g>
      ),
      mouth: () => <path d={`M ${cx-8} ${headCy+24} q 2 -2 4 0 q 2 2 4 0 q 2 -2 4 0`} stroke="#0E0E10" strokeWidth="2.5" fill="none" strokeLinecap="round"/>,
      cheeks: false,
    },
  };
  const expr = expressions[lvl];

  // arm path — pendulum from shoulder
  const armLen = 60;
  const armBaseY = headCy - 8;
  const Larm = {
    x1: cx - headR + 8, y1: armBaseY,
    x2: cx - headR + 8 - 18 + sway, y2: armBaseY + armLen + sway/2
  };
  const Rarm = {
    x1: cx + headR - 8, y1: armBaseY,
    x2: cx + headR - 8 + 18 + swayR, y2: armBaseY + armLen + swayR/2
  };

  return (
    <svg ref={ref} width="100%" height={H} viewBox={`0 0 ${W} ${H}`}
         onMouseDown={start} onTouchStart={start}
         preserveAspectRatio="xMidYMid meet"
         style={{display:'block', cursor:'ns-resize', userSelect:'none', touchAction:'none', maxWidth:240}}>
      <defs>
        <clipPath id="tube-clip">
          <rect x={cx - tubeW/2 + 2} y={tubeTop + 2} width={tubeW - 4} height={tubeH - 4} rx={(tubeW-4)/2}/>
        </clipPath>
      </defs>

      {/* antenna with eye-blob on top */}
      <line x1={cx} y1={tubeTop} x2={cx + antennaShake} y2={tubeTop - 28}
            stroke="#0E0E10" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx={cx + antennaShake} cy={tubeTop - 32} r="7" fill={mercuryColor} stroke="#0E0E10" strokeWidth="2.5"/>
      <circle cx={cx + antennaShake + 1} cy={tubeTop - 32} r="2.5" fill="#0E0E10"/>

      {/* tube outer (body) */}
      <rect x={cx - tubeW/2} y={tubeTop} width={tubeW} height={tubeH} rx={tubeW/2}
            fill="white" stroke="#0E0E10" strokeWidth="3.5"/>

      {/* tick marks — pastilles cliquables avec numéro toujours lisible */}
      {[1,2,3,4,5].map(t => {
        const y = tubeBot - (t/5) * tubeH;
        const on = lvl === t;
        return (
          <g key={t} style={{cursor:'pointer'}} onClick={(e) => { e.stopPropagation(); onPick(t); }}>
            {/* left pill (number) */}
            <rect x={cx - tubeW/2 - 40} y={y - 14} width="28" height="28" rx="14"
                  fill={on ? '#0E0E10' : 'white'} stroke="#0E0E10" strokeWidth="2.5"/>
            <text x={cx - tubeW/2 - 26} y={y + 6} textAnchor="middle"
                  fontFamily="Archivo Black, sans-serif" fontSize="16"
                  fill={on ? 'white' : '#0E0E10'}>{t}</text>
            {/* right tick */}
            <line x1={cx + tubeW/2 + 4} y1={y} x2={cx + tubeW/2 + 16} y2={y}
                  stroke="#0E0E10" strokeWidth={on ? 5 : 3} strokeLinecap="round"/>
          </g>
        );
      })}

      {/* mercury (clipped wave) */}
      <g clipPath="url(#tube-clip)">
        <path d={meniscus} fill={mercuryColor} style={{transition:'fill .4s ease'}}/>
        {/* highlight stripe */}
        <rect x={cx - tubeW/2 + 6} y={fillTop + 4} width="6" height={tubeBot - fillTop - 8}
              rx="3" fill="white" opacity="0.28"/>
        {/* bubbles */}
        {bubbles.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r}
                  fill="white" opacity="0.65"/>
        ))}
      </g>

      {/* arms (behind head) */}
      <line x1={Larm.x1} y1={Larm.y1} x2={Larm.x2} y2={Larm.y2}
            stroke={limbColor} strokeWidth="9" strokeLinecap="round"/>
      <line x1={Rarm.x1} y1={Rarm.y1} x2={Rarm.x2} y2={Rarm.y2}
            stroke={limbColor} strokeWidth="9" strokeLinecap="round"/>
      {/* hands */}
      <circle cx={Larm.x2} cy={Larm.y2} r="10" fill="white" stroke="#0E0E10" strokeWidth="3"/>
      <circle cx={Rarm.x2} cy={Rarm.y2} r="10" fill="white" stroke="#0E0E10" strokeWidth="3"/>

      {/* head (bulb) — breathes — always full of mercury (it's the reservoir) */}
      <g transform={`translate(${cx} ${headCy}) scale(${breath}) translate(${-cx} ${-headCy})`}>
        {/* head — toujours blanc cassé pour que le visage reste lisible */}
        <circle cx={cx} cy={headCy} r={headR} fill="#FAF7F2" stroke="#0E0E10" strokeWidth="3.5"/>

        {/* cheeks — toujours visibles, teintées de la couleur du niveau */}
        <ellipse cx={cx - 26} cy={headCy + 14} rx="9" ry="6" fill={mercuryColor} opacity="0.35"
                 style={{transition:'fill .4s ease'}}/>
        <ellipse cx={cx + 26} cy={headCy + 14} rx="9" ry="6" fill={mercuryColor} opacity="0.35"
                 style={{transition:'fill .4s ease'}}/>
        {/* eyes */}
        {expr.eyes(cx - 18, headCy - 4, 'l')}
        {expr.eyes(cx + 18, headCy - 4, 'r')}
        {/* mouth */}
        {expr.mouth()}

        {/* feet */}
        <ellipse cx={cx - 22} cy={headCy + headR - 2} rx="14" ry="6" fill="#0E0E10"/>
        <ellipse cx={cx + 22} cy={headCy + headR - 2} rx="14" ry="6" fill="#0E0E10"/>
      </g>
    </svg>
  );
};

// Variant B : 5 paliers en cartes horizontales (tap rapide)
const ThermoSteps = ({ level, onPick }) => (
  <div style={{display:'grid', gridTemplateColumns:'1fr', gap:10}}>
    {LEVELS.slice().reverse().map(L => {
      const on = level === L.n;
      return (
        <button key={L.n} type="button" onClick={() => onPick(L.n)}
          style={{
            display:'flex', alignItems:'center', gap:14,
            padding:'14px 16px', borderRadius: 20,
            border: '2px solid #0E0E10',
            background: on ? L.color : 'white',
            color: on ? 'white' : '#0E0E10',
            boxShadow: on ? '4px 4px 0 #0E0E10' : 'none',
            transform: on ? 'translate(-2px,-2px)' : 'none',
            transition: 'all .15s',
            textAlign:'left', cursor:'pointer',
            fontFamily:'inherit'
          }}>
          <span style={{
            fontFamily:'var(--font-display)', fontSize:22,
            width:36, textAlign:'center'
          }}>{L.n}</span>
          <span style={{display:'flex', flexDirection:'column', flex:1}}>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:16,
              letterSpacing:'-0.01em'
            }}>{L.label}</span>
            <span style={{
              fontSize:12, opacity:0.85, marginTop:2,
              fontFamily:'var(--font-cond)', letterSpacing:'.04em',
              textTransform:'uppercase', fontWeight:700
            }}>{L.sublabel}</span>
          </span>
        </button>
      );
    })}
  </div>
);

// Cohérence cardiaque guidée : 5s in / 5s out
const Coherence = ({ onClose }) => {
  const [phase, setPhase] = useStT('in'); // in / out
  const [count, setCount] = useStT(5);
  const [cycle, setCycle] = useStT(0);
  useEfT(() => {
    const id = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => p === 'in' ? 'out' : 'in');
          if (phase === 'out') setCycle(x => x + 1);
          return 5;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const scale = phase === 'in' ? 1 : 0.5;
  return (
    <div style={{
      background:'#0E0E10', color:'white', borderRadius: 36,
      padding:'40px 32px', textAlign:'center', margin:'24px 0',
      border:'2px solid #0E0E10', position:'relative'
    }}>
      <button onClick={onClose} aria-label="Fermer"
        style={{position:'absolute', top:18, right:18,
          background:'transparent', border:'none', color:'white',
          fontSize:22, cursor:'pointer'}}>✕</button>
      <div style={{
        fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
        letterSpacing:'.18em', textTransform:'uppercase', opacity:.7,
        marginBottom: 8
      }}>Cohérence cardiaque · 5s/5s</div>
      <div style={{position:'relative', height:240, display:'flex',
        alignItems:'center', justifyContent:'center'}}>
        <div style={{
          width: 220, height: 220, borderRadius:'50%',
          background: 'radial-gradient(circle, #4DD0B0 0%, #1B4FE5 100%)',
          transform: `scale(${scale})`,
          transition: 'transform 5s ease-in-out',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexDirection:'column'
        }}>
          <div style={{fontFamily:'var(--font-display)', fontSize:38, color:'white'}}>
            {phase === 'in' ? 'INSPIRE' : 'EXPIRE'}
          </div>
          <div style={{fontFamily:'var(--font-display)', fontSize:48, color:'white', marginTop:4}}>
            {count}
          </div>
        </div>
      </div>
      <div style={{
        fontFamily:'var(--font-hand)', fontSize:24, marginTop:16, opacity:.9
      }}>
        Cycle {cycle + 1} — laisse-toi porter par le rythme.
      </div>
    </div>
  );
};

// Modale crise (niveau 5)
const CrisisModal = ({ contacts, onClose, onBreath }) => (
  <div style={{
    position:'fixed', inset:0, zIndex: 300,
    background:'rgba(14,14,16,0.92)',
    display:'flex', alignItems:'center', justifyContent:'center',
    padding: 16, animation: 'fadeIn .2s ease'
  }}>
    <div style={{
      background:'white', borderRadius: 32, padding:'32px 28px',
      maxWidth: 520, width:'100%', border:'2px solid #0E0E10',
      boxShadow: '6px 6px 0 #1B4FE5', position:'relative'
    }}>
      <div style={{
        fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
        letterSpacing:'.18em', textTransform:'uppercase', color:'#7C8A99',
        marginBottom: 8
      }}>Pause clinique · niveau 5</div>
      <h2 style={{
        fontFamily:'var(--font-display)', fontSize:30, lineHeight:1,
        textTransform:'uppercase', letterSpacing:'-.01em',
        marginBottom: 14
      }}>Tu n'es pas seul·e<br/>maintenant.</h2>
      <p style={{fontSize:15, lineHeight:1.6, color:'#4A4A55', marginBottom:18}}>
        Ce que tu ressens est un signal de surcharge — pas un échec. Le plus important, là,
        c'est de ne pas rester seul·e devant l'écran. Quelques options, douces :
      </p>

      <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:18}}>
        <a href="tel:3114" style={{
          display:'flex', alignItems:'center', gap:14,
          padding:'14px 18px', borderRadius:18,
          background:'#1B4FE5', color:'white', textDecoration:'none',
          border:'2px solid #0E0E10', boxShadow:'4px 4px 0 #0E0E10',
          fontFamily:'var(--font-display)', fontSize:15
        }}>
          <span style={{fontSize:24}}>☎</span>
          <span style={{flex:1}}>APPELER LE 3114</span>
          <span style={{fontFamily:'var(--font-cond)', fontSize:11, opacity:.85}}>
            GRATUIT · 24H/24
          </span>
        </a>
        {contacts.filter(c => c.name && c.tel).map((c, i) => (
          <a key={i} href={`tel:${c.tel}`} style={{
            display:'flex', alignItems:'center', gap:14,
            padding:'14px 18px', borderRadius:18,
            background:'white', color:'#0E0E10', textDecoration:'none',
            border:'2px solid #0E0E10',
            fontFamily:'var(--font-cond)', fontWeight:700, fontSize:14,
            textTransform:'uppercase', letterSpacing:'.04em'
          }}>
            <span style={{fontSize:18}}>☎</span>
            <span style={{flex:1}}>{c.name}</span>
            <span style={{fontFamily:'var(--font-body)', fontWeight:500,
              textTransform:'none', letterSpacing:0, fontSize:13}}>{c.tel}</span>
          </a>
        ))}
        <button onClick={onBreath} style={{
          padding:'14px 18px', borderRadius:18,
          background:'#0E0E10', color:'white',
          border:'2px solid #0E0E10', cursor:'pointer',
          fontFamily:'var(--font-display)', fontSize:14,
          textAlign:'left', display:'flex', alignItems:'center', gap:14
        }}>
          <span>≈</span>
          <span style={{flex:1}}>RESPIRER 1 MINUTE AVEC MOI</span>
        </button>
      </div>

      <p style={{fontFamily:'var(--font-hand)', fontSize:22,
        color:'#0E0E10', textAlign:'center', marginTop:8}}>
        « Je n'ai rien à prouver, là. »
      </p>

      <button onClick={onClose} style={{
        marginTop: 14, width:'100%',
        background:'transparent', border:'none', cursor:'pointer',
        fontFamily:'var(--font-cond)', fontWeight:700, fontSize:11,
        letterSpacing:'.16em', textTransform:'uppercase', color:'#7C8A99',
        padding:'8px'
      }}>Plus tard — fermer</button>
    </div>
  </div>
);

// Mini timeline historique
const HistTimeline = ({ hist }) => {
  if (!hist || hist.length === 0) {
    return (
      <div style={{
        padding:'18px 20px', borderRadius: 20, border:'2px dashed #B5B5BD',
        color:'#7C8A99', fontSize:13, textAlign:'center',
        fontFamily:'var(--font-cond)', textTransform:'uppercase',
        letterSpacing:'.08em', fontWeight:700
      }}>Aucune observation enregistrée pour l'instant</div>
    );
  }
  const last = hist.slice(-12).reverse();
  return (
    <div style={{display:'flex', flexDirection:'column', gap:8}}>
      <div style={{display:'flex', alignItems:'flex-end',
        gap:6, height:90, padding:'0 4px', borderBottom:'2px solid #0E0E10'}}>
        {last.slice().reverse().map((h, i) => {
          const L = LEVELS.find(l => l.n === h.level) || LEVELS[0];
          const heightPct = (h.level / 5) * 100;
          return (
            <div key={i} style={{
              flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'flex-end', height:'100%'
            }}>
              <div style={{
                width:'100%', height:`${heightPct}%`,
                background: L.color, borderRadius:'8px 8px 0 0',
                border:'2px solid #0E0E10', borderBottom:'none',
                minHeight: 12
              }} title={`Niveau ${h.level} — ${L.label}`}/>
            </div>
          );
        })}
      </div>
      <div style={{display:'flex', justifyContent:'space-between',
        fontFamily:'var(--font-cond)', fontSize:10, color:'#7C8A99',
        textTransform:'uppercase', letterSpacing:'.08em', fontWeight:700,
        padding:'0 4px'}}>
        <span>+ ancien</span><span>plus récent →</span>
      </div>
      <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:6}}>
        {last.slice(0, 4).map((h, i) => {
          const L = LEVELS.find(l => l.n === h.level) || LEVELS[0];
          const d = new Date(h.t);
          return (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:10,
              fontSize:13, color:'#4A4A55'
            }}>
              <span style={{
                width:10, height:10, borderRadius:'50%', background:L.color,
                border:'2px solid #0E0E10'
              }}/>
              <span style={{fontFamily:'var(--font-cond)', fontWeight:700,
                textTransform:'uppercase', letterSpacing:'.04em', fontSize:11,
                color:'#0E0E10'}}>{L.label}</span>
              <span style={{flex:1, color:'#7C8A99', fontSize:12}}>
                {d.toLocaleDateString('fr-FR', {day:'2-digit', month:'short'})}
                {' · '}
                {d.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Bouton "Avant ça je…" — déclencheur guidé
const TriggerGuide = ({ value, onChange }) => {
  const prompts = [
    "Avant ça, j'étais en train de…",
    "Quelqu'un a dit ou fait…",
    "Mon corps signalait déjà…",
    "Je n'avais pas dormi / mangé / pausé…",
    "Une pensée tournait :…",
  ];
  return (
    <div style={{display:'flex', flexDirection:'column', gap:10}}>
      <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
        {prompts.map(p => (
          <button key={p} type="button"
            onClick={() => onChange((value || '') + (value ? '\n' : '') + p + ' ')}
            style={{
              fontFamily:'var(--font-hand)', fontSize:18,
              padding:'4px 12px', borderRadius: 999,
              border:'1.5px dashed #0E0E10', background:'transparent',
              color:'#0E0E10', cursor:'pointer'
            }}>
            « {p} »
          </button>
        ))}
      </div>
      <window.FreeArea value={value} onChange={onChange}
        placeholder="Ce qui a précédé. Pas une cause unique — un contexte."/>
    </div>
  );
};

window.TabThermo = ({ variant }) => {
  const I = window.Icons; const Mo = window.Monsters;
  const [s, setS] = useStT(() => {
    try { return JSON.parse(localStorage.getItem(T_KEY)) || {}; } catch { return {}; }
  });
  const [hist, setHist] = useStT(() => {
    try { return JSON.parse(localStorage.getItem(T_HIST)) || []; } catch { return []; }
  });
  const [breathOpen, setBreathOpen] = useStT(false);
  const [crisisOpen, setCrisisOpen] = useStT(false);
  const [autoBreath, setAutoBreath] = useStT(false);

  useEfT(() => { localStorage.setItem(T_KEY, JSON.stringify(s)); }, [s]);
  useEfT(() => { localStorage.setItem(T_HIST, JSON.stringify(hist)); }, [hist]);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  const level = s.level || null;
  const L = LEVELS.find(l => l.n === level);

  // déclenchement auto modale + respiration sur niveaux 3,4,5
  const pickLevel = (n) => {
    set('level', n);
    if (n === 5 && !crisisOpen) {
      setCrisisOpen(true);
    } else if ((n === 3 || n === 4) && !autoBreath) {
      // suggérer respiration une fois par session par niveau
      setAutoBreath(true);
    }
  };

  const saveObs = () => {
    if (!level) return;
    const entry = { t: Date.now(), level, body: s.body || '', trigger: s.trigger || '', coping: s.coping || '' };
    setHist(h => [...h, entry].slice(-60));
    // reset partiel
    setS({});
    setAutoBreath(false);
  };

  const Mascot = L ? Mo[L.monster] : Mo.Calme;

  return (
    <>
      <window.IntroHand>
        Pas pour te juger.<br/>
        <span style={{color:'var(--ink-2)'}}>Pour <em>nommer</em> ce qui se passe — et choisir une réponse à ta taille.</span>
      </window.IntroHand>

      <window.SectionLabel num="1">Niveau d'activation</window.SectionLabel>
      <window.Headline accent="à cet instant">Où en suis-je</window.Headline>

      <div style={{
        background: L ? L.color : '#F4F1EA',
        border:'2px solid #0E0E10', borderRadius: 36, padding:'24px',
        marginBottom: 16,
        transition: 'background .5s ease',
        color: L ? 'white' : '#0E0E10',
        position:'relative', overflow:'hidden'
      }}>
        {/* texture grain dots */}
        {L && (
          <div style={{
            position:'absolute', inset:0, opacity:0.08, pointerEvents:'none',
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1.4px)',
            backgroundSize: '14px 14px'
          }}/>
        )}
        {variant === 'steps' ? (
          <ThermoSteps level={level} onPick={pickLevel}/>
        ) : (
          <div style={{display:'grid',
            gridTemplateColumns:'auto 1fr', gap:24, alignItems:'center',
            position:'relative', zIndex:1}}>
            <ThermoVisual level={level || 1}
              limbColor={L ? '#FFFFFF' : '#0E0E10'}
              mercuryColor={L ? L.color : '#B5B5BD'}
              onPick={pickLevel}/>
            <div style={{position:'relative', zIndex:1}}>
              {L ? (
                <>
                  <div style={{
                    fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
                    letterSpacing:'.18em', textTransform:'uppercase', opacity:.85
                  }}>NIVEAU {L.n} · {L.sublabel}</div>
                  <h3 style={{
                    fontFamily:'var(--font-display)', fontSize:'clamp(26px,5vw,38px)',
                    lineHeight:.95, textTransform:'uppercase', letterSpacing:'-.015em',
                    margin:'8px 0 12px'
                  }}>{L.label}</h3>
                  <p style={{fontSize:14, lineHeight:1.5, opacity:.95, marginBottom:12}}>
                    {L.cog}
                  </p>
                  <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
                    {L.cluster.map(c => (
                      <span key={c} style={{
                        background:'rgba(255,255,255,0.18)',
                        border:'1.5px solid rgba(255,255,255,0.4)',
                        padding:'4px 10px', borderRadius:999,
                        fontSize:11, fontWeight:600,
                        textTransform:'uppercase', letterSpacing:'.04em'
                      }}>{c}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{
                  fontFamily:'var(--font-hand)', fontSize:26, color:'#0E0E10'
                }}>
                  Glisse le mercure, ou tape un chiffre — sans réfléchir.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {L && (
        <div style={{height:8, marginBottom:16}}/>
      )}

      {/* Auto-suggestion respiration niveaux 3-4 */}
      {autoBreath && level && level >= 3 && level <= 4 && !breathOpen && (
        <div style={{
          background:'#0E0E10', color:'white', padding:'16px 18px',
          borderRadius: 20, display:'flex', alignItems:'center', gap:14,
          marginBottom: 16, border:'2px solid #0E0E10'
        }}>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--font-display)', fontSize:14, marginBottom:2}}>
              UNE RESPIRATION D'ABORD ?
            </div>
            <div style={{fontSize:13, opacity:.85}}>
              3 minutes, sans rien à faire d'autre.
            </div>
          </div>
          <button onClick={() => setBreathOpen(true)} style={{
            padding:'10px 16px', borderRadius:999, background:'white',
            color:'#0E0E10', border:'2px solid white', cursor:'pointer',
            fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
            letterSpacing:'.12em', textTransform:'uppercase'
          }}>Oui</button>
          <button onClick={() => setAutoBreath(false)} aria-label="Plus tard"
            style={{
              background:'transparent', border:'none', color:'white',
              opacity:.6, cursor:'pointer', fontSize:18
            }}>✕</button>
        </div>
      )}

      {breathOpen && <Coherence onClose={() => setBreathOpen(false)}/>}

      {/* ABC : Antecedent / Behavior / Coping */}
      {L && (
        <>
          <window.SectionLabel num="2">Mon corps</window.SectionLabel>
          <window.Headline accent="qu'est-ce que je sens ?">Le corps parle</window.Headline>
          <window.Card icon={I.Hand} title="Traduction corporelle" sub="Tension, chaleur, vide, picotement, gorge serrée…">
            <window.FreeArea value={s.body} onChange={v => set('body', v)}
              placeholder="Là, dans mon corps, je remarque…"/>
          </window.Card>

          <window.SectionLabel num="3">Avant ça…</window.SectionLabel>
          <window.Headline>Le contexte<br/><span className="accent">qui a précédé</span></window.Headline>
          <window.Card icon={I.Cloud} title="Déclencheur(s) possible(s)" sub="Pas une cause unique, un contexte. Tape un début et complète.">
            <TriggerGuide value={s.trigger} onChange={v => set('trigger', v)}/>
          </window.Card>

          <window.SectionLabel num="4">Une réponse à ma taille</window.SectionLabel>
          <window.Headline accent={`niveau ${L.n}`}>Stratégies pour</window.Headline>
          <window.Card icon={I.Shield} title="Choisis-en une — pas dix" sub="Plus le niveau monte, plus la stratégie est simple et corporelle.">
            <window.Chips
              value={s.strats || []}
              onChange={v => set('strats', v)}
              items={STRATEGIES[L.n].map(st => ({ id: st.id, label: st.label }))}/>
            {L.breath && (
              <button onClick={() => setBreathOpen(true)} style={{
                marginTop: 14, padding:'10px 18px', borderRadius:999,
                background:'#0E0E10', color:'white', border:'2px solid #0E0E10',
                cursor:'pointer',
                fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
                letterSpacing:'.12em', textTransform:'uppercase'
              }}>≈ Respirer 3 min</button>
            )}
          </window.Card>

          <window.Card icon={I.Writing} title="Ce que je vais essayer" sub="Une seule. Concrète. Maintenant ou très bientôt.">
            <window.Field value={s.coping} onChange={v => set('coping', v)}
              placeholder="Ex : sortir 10 min, appeler X, écrire ce qui tourne…"/>
          </window.Card>

          {/* Save observation */}
          <button onClick={saveObs} style={{
            width:'100%', padding:'18px 20px', borderRadius: 28,
            background: L.color, color:'white', border:'2px solid #0E0E10',
            boxShadow: '4px 4px 0 #0E0E10', cursor:'pointer',
            fontFamily:'var(--font-display)', fontSize:15,
            letterSpacing:'-.005em', textTransform:'uppercase',
            marginBottom: 24, transition:'transform .12s'
          }}
          onMouseDown={e => e.currentTarget.style.transform='translate(2px,2px)'}
          onMouseUp={e => e.currentTarget.style.transform='none'}
          onMouseLeave={e => e.currentTarget.style.transform='none'}>
            Enregistrer cette observation
          </button>
        </>
      )}

      <window.SectionLabel num="•">Mes dernières observations</window.SectionLabel>
      <window.Headline accent="dans la durée">Ce qui se dessine</window.Headline>
      <window.Card icon={I.Calendar} title="Timeline — 12 derniers relevés" sub="Pas un score. Un motif que tu peux remarquer.">
        <HistTimeline hist={hist}/>
      </window.Card>

      <window.HLQuote>
        Un thermomètre ne juge pas la fièvre.<br/>
        Il <span style={{color:'var(--dominant)'}}>la nomme</span>.
      </window.HLQuote>

      <window.Retain title="NOMMER, C'EST DÉJÀ COMMENCER À RÉGULER." monster={Mo.Calme}>
        Tu n'as pas à descendre l'échelle pour avoir « réussi ». Tu peux juste observer où tu es, et choisir une réponse à ta taille.
      </window.Retain>

      {/* Bouton STOP toujours dispo */}
      <button onClick={() => setCrisisOpen(true)} style={{
        position:'fixed', bottom: 24, left: 24, zIndex: 195,
        width: 64, height: 64, borderRadius: '50%',
        background:'#0E0E10', color:'white',
        border:'2px solid #0E0E10', cursor:'pointer',
        fontFamily:'var(--font-display)', fontSize:13,
        letterSpacing:'.08em', boxShadow:'4px 4px 0 #1B4FE5'
      }} title="Aide d'urgence">SOS</button>

      {crisisOpen && (
        <CrisisModal
          contacts={[
            { name: s.contact1Name || 'Contact de confiance 1', tel: s.contact1Tel || '' },
            { name: s.contact2Name || 'Contact de confiance 2', tel: s.contact2Tel || '' },
          ]}
          onClose={() => setCrisisOpen(false)}
          onBreath={() => { setCrisisOpen(false); setBreathOpen(true); }}/>
      )}

      {/* Contacts pré-saisis */}
      <window.SectionLabel num="•">Mes contacts</window.SectionLabel>
      <window.Headline>Pré-saisir<br/><span className="accent">avant la crise</span></window.Headline>
      <window.Card icon={I.Phone} title="Pour que le bouton SOS fonctionne" sub="Renseigne ces contacts à froid — tu n'auras pas à chercher au mauvais moment.">
        <window.Label>Contact 1 — nom</window.Label>
        <window.Field value={s.contact1Name} onChange={v => set('contact1Name', v)}
          placeholder="Ex : Marie (sœur)"/>
        <window.Label>Téléphone</window.Label>
        <window.Field value={s.contact1Tel} onChange={v => set('contact1Tel', v)}
          placeholder="06 12 34 56 78"/>
        <window.Label>Contact 2 — nom</window.Label>
        <window.Field value={s.contact2Name} onChange={v => set('contact2Name', v)}
          placeholder="Ex : Médecin traitant"/>
        <window.Label>Téléphone</window.Label>
        <window.Field value={s.contact2Tel} onChange={v => set('contact2Tel', v)}
          placeholder="01 23 45 67 89"/>
        <p style={{
          marginTop: 14, fontSize: 12, color:'#7C8A99',
          fontFamily:'var(--font-cond)', textTransform:'uppercase',
          letterSpacing:'.08em', fontWeight:700
        }}>Données stockées localement, jamais envoyées.</p>
      </window.Card>
    </>
  );
};
