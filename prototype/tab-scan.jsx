// Onglet SCAN CORPOREL — outil de régulation par pleine conscience corporelle.
// Rattaché à la rubrique 03 (Impulsivité & Émotions) — couleur rose --ch-emotions.
// Anti-jugement : pas de timer anxiogène, tap-tolérant (yeux fermés possibles),
// l'app ne félicite pas et ne s'alarme pas si beaucoup de zones sont tendues.

const { useState: useStS, useEffect: useEfS, useRef: useRfS } = React;

const S_DRAFT = 'jtdah-scan-draft-v1';
const S_HIST  = 'jtdah-scan-hist-v1';

const SCAN_PINK = '#FF8AB8';

// 8 régions corporelles dans l'ordre du balayage (haut → bas, puis dos)
const ZONES = [
  { id:'tete',    label:"Tête",            sub:"Cuir chevelu, tempes" },
  { id:'visage',  label:"Visage",          sub:"Front, yeux, mâchoire" },
  { id:'gorge',   label:"Gorge / nuque",   sub:"La charnière" },
  { id:'epaules', label:"Épaules",         sub:"Le souffle haut" },
  { id:'bras',    label:"Bras / mains",    sub:"Les outils du jour" },
  { id:'ventre',  label:"Ventre",          sub:"Le centre" },
  { id:'dos',     label:"Dos / lombaires", sub:"Le porteur silencieux" },
  { id:'jambes',  label:"Jambes / pieds",  sub:"Les racines" },
];

// 3 états — option « 3 cercles rouge / blanc / vert »
const STATES = {
  tendu:   { color:'#E8294E', label:'TENDU',   word:'tendue',  hint:'crispé · serré · brûlant' },
  neutre:  { color:'#FAF7F2', label:'NEUTRE',  word:'neutre',  hint:'présent, sans plus' },
  detendu: { color:'#4DD0B0', label:'DÉTENDU', word:'détendue',hint:'tiède · relâché · ample' },
};

const PHASES = [
  { id:'amorce',   n:1, label:'Amorce',   title:"Cinq respirations",
    sub:"On pose le rythme. La fleur s'ouvre quand tu inspires, se ferme quand tu expires." },
  { id:'global',   n:2, label:'Présence', title:"Conscience globale",
    sub:"Sans détailler. Le corps comme un seul tenant. Son poids, sa température, sa présence." },
  { id:'balayage', n:3, label:'Balayage', title:"Huit régions",
    sub:"Une par une. Tu poses l'attention, tu remarques, tu glisses vers la suivante. Pas d'analyse." },
  { id:'emotions', n:4, label:'Accueil',  title:"Émotions présentes",
    sub:"Si une émotion vient, elle peut être là. Tu la nommes ou pas. Tu ne la résous pas." },
  { id:'ancrage',  n:5, label:'Ancrage',  title:"Le contact",
    sub:"Le poids dans le siège ou les pieds dans le sol. La gravité est ton alliée silencieuse." },
  { id:'retour',   n:6, label:'Retour',   title:"Doucement",
    sub:"Tu reviens. Pas d'à-coups. Bouge un doigt, un pied. Le monde est encore là." },
  { id:'notation', n:7, label:'Trace',    title:"Si tu veux",
    sub:"Un mot. Une sensation. Une émotion. Ou rien — c'est aussi une réponse." },
];

// =====================================================================
// SILHOUETTE — carte corporelle abstraite, 8 zones colorables
// =====================================================================
// Vue de face, formes anatomiques en blocs simples. Le "dos" est représenté
// par un petit panneau déporté à droite (relié par trait pointillé au lombaire),
// pour rester lisible sans deuxième silhouette.

const Silhouette = ({ states, activeZone, onZoneClick, scale = 1, dimUnvisited = false, visited = null }) => {
  const W = 240, H = 480;
  const fill = (id) => {
    const st = states[id];
    if (st) return STATES[st].color;
    return '#FAF7F2'; // papier crème
  };
  const stroke = (id) => {
    if (activeZone === id) return SCAN_PINK;
    return '#0E0E10';
  };
  const sw = (id) => activeZone === id ? 4 : 2.2;
  const opacity = (id) => {
    if (!dimUnvisited) return 1;
    if (!visited) return 1;
    if (visited.includes(id) || activeZone === id) return 1;
    return 0.35;
  };
  const click = (id) => onZoneClick && onZoneClick(id);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth: 240*scale, display:'block'}}
         preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="hatch-scan" patternUnits="userSpaceOnUse" width="6" height="6"
                 patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#0E0E10" strokeWidth="0.6" opacity="0.18"/>
        </pattern>
      </defs>

      {/* TÊTE — calotte supérieure */}
      <g style={{cursor:'pointer'}} opacity={opacity('tete')} onClick={() => click('tete')}>
        <path d="M 120 18 Q 88 18 80 50 Q 78 60 80 68 L 160 68 Q 162 60 160 50 Q 152 18 120 18 Z"
              fill={fill('tete')} stroke={stroke('tete')} strokeWidth={sw('tete')} strokeLinejoin="round"/>
        {activeZone === 'tete' && <circle cx="120" cy="40" r="3" fill={SCAN_PINK}/>}
      </g>

      {/* VISAGE — bas de tête, mâchoire */}
      <g style={{cursor:'pointer'}} opacity={opacity('visage')} onClick={() => click('visage')}>
        <path d="M 80 68 L 160 68 Q 158 90 140 96 Q 120 100 100 96 Q 82 90 80 68 Z"
              fill={fill('visage')} stroke={stroke('visage')} strokeWidth={sw('visage')} strokeLinejoin="round"/>
      </g>

      {/* GORGE / NUQUE */}
      <g style={{cursor:'pointer'}} opacity={opacity('gorge')} onClick={() => click('gorge')}>
        <path d="M 104 96 L 136 96 L 138 116 Q 120 120 102 116 Z"
              fill={fill('gorge')} stroke={stroke('gorge')} strokeWidth={sw('gorge')} strokeLinejoin="round"/>
      </g>

      {/* ÉPAULES / POITRINE — trapèze haut */}
      <g style={{cursor:'pointer'}} opacity={opacity('epaules')} onClick={() => click('epaules')}>
        <path d="M 102 116 L 138 116 Q 168 120 184 138 Q 188 152 184 168 L 56 168 Q 52 152 56 138 Q 72 120 102 116 Z"
              fill={fill('epaules')} stroke={stroke('epaules')} strokeWidth={sw('epaules')} strokeLinejoin="round"/>
      </g>

      {/* BRAS — deux pilules latérales */}
      <g style={{cursor:'pointer'}} opacity={opacity('bras')} onClick={() => click('bras')}>
        {/* gauche */}
        <path d="M 56 144 Q 38 152 32 200 Q 30 248 38 280 Q 50 290 60 286 Q 64 248 64 200 Q 64 158 56 144 Z"
              fill={fill('bras')} stroke={stroke('bras')} strokeWidth={sw('bras')} strokeLinejoin="round"/>
        {/* droite */}
        <path d="M 184 144 Q 202 152 208 200 Q 210 248 202 280 Q 190 290 180 286 Q 176 248 176 200 Q 176 158 184 144 Z"
              fill={fill('bras')} stroke={stroke('bras')} strokeWidth={sw('bras')} strokeLinejoin="round"/>
      </g>

      {/* VENTRE — torse central bas */}
      <g style={{cursor:'pointer'}} opacity={opacity('ventre')} onClick={() => click('ventre')}>
        <path d="M 70 168 L 170 168 Q 174 220 168 268 Q 168 280 156 282 L 84 282 Q 72 280 72 268 Q 66 220 70 168 Z"
              fill={fill('ventre')} stroke={stroke('ventre')} strokeWidth={sw('ventre')} strokeLinejoin="round"/>
      </g>

      {/* JAMBES — deux pilules verticales */}
      <g style={{cursor:'pointer'}} opacity={opacity('jambes')} onClick={() => click('jambes')}>
        <path d="M 80 282 L 116 282 Q 122 360 118 440 Q 116 458 100 458 Q 84 458 82 440 Q 76 360 80 282 Z"
              fill={fill('jambes')} stroke={stroke('jambes')} strokeWidth={sw('jambes')} strokeLinejoin="round"/>
        <path d="M 124 282 L 160 282 Q 164 360 158 440 Q 156 458 140 458 Q 124 458 122 440 Q 118 360 124 282 Z"
              fill={fill('jambes')} stroke={stroke('jambes')} strokeWidth={sw('jambes')} strokeLinejoin="round"/>
      </g>

      {/* DOS — badge déporté à droite, relié par trait pointillé au lombaire */}
      <g style={{cursor:'pointer'}} opacity={opacity('dos')} onClick={() => click('dos')}>
        <path d="M 175 220 Q 200 215 220 220 L 222 224"
              stroke="#0E0E10" strokeWidth="1.4" fill="none" strokeDasharray="3 3"/>
        <rect x="200" y="226" width="36" height="64" rx="10"
              fill={fill('dos')} stroke={stroke('dos')} strokeWidth={sw('dos')}/>
        <text x="218" y="250" textAnchor="middle"
              fontFamily="Archivo Narrow, sans-serif" fontWeight="800"
              fontSize="9" fill="#0E0E10" letterSpacing="0.1em">DOS</text>
        <path d="M 210 258 Q 218 264 226 258 Q 218 272 210 258 Z"
              fill="none" stroke="#0E0E10" strokeWidth="1.4" strokeLinejoin="round"/>
        <text x="218" y="282" textAnchor="middle"
              fontFamily="Archivo Narrow, sans-serif" fontWeight="800"
              fontSize="7" fill="#0E0E10" letterSpacing="0.08em">LOMB.</text>
      </g>
    </svg>
  );
};

// =====================================================================
// CONSTELLATION — variante : 8 points reliés (poétique)
// =====================================================================
const Constellation = ({ states, activeZone, onZoneClick }) => {
  // positions des points anatomiques sur 240×480
  const pts = {
    tete:    [120,  40],
    visage:  [120,  85],
    gorge:   [120, 110],
    epaules: [120, 145],
    bras:    [ 60, 220],
    ventre:  [120, 230],
    dos:     [180, 220],
    jambes:  [120, 380],
  };
  return (
    <svg viewBox="0 0 240 480" width="100%" style={{maxWidth: 240, display:'block'}}>
      {/* lignes entre points (ordre du balayage) */}
      <g stroke="#0E0E10" strokeWidth="1.2" fill="none" strokeDasharray="3 4" opacity="0.45">
        {ZONES.slice(0,-1).map((z, i) => {
          const [x1,y1] = pts[z.id]; const [x2,y2] = pts[ZONES[i+1].id];
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
        })}
      </g>
      {ZONES.map(z => {
        const [x,y] = pts[z.id];
        const st = states[z.id];
        const fill = st ? STATES[st].color : '#FAF7F2';
        const isActive = activeZone === z.id;
        return (
          <g key={z.id} style={{cursor:'pointer'}} onClick={() => onZoneClick && onZoneClick(z.id)}>
            {isActive && <circle cx={x} cy={y} r="22" fill={SCAN_PINK} opacity="0.18"/>}
            <circle cx={x} cy={y} r="14" fill={fill}
                    stroke={isActive ? SCAN_PINK : '#0E0E10'}
                    strokeWidth={isActive ? 3.5 : 2.2}/>
            <text x={x} y={y+30} textAnchor="middle"
                  fontFamily="Archivo Narrow, sans-serif" fontWeight="700" fontSize="9"
                  fill="#0E0E10" letterSpacing="0.06em">
              {z.label.split(' ')[0].toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// =====================================================================
// TRANCHES — variante : 8 bandes horizontales empilées
// =====================================================================
const Slices = ({ states, activeZone, onZoneClick }) => {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6, width:'100%', maxWidth:340}}>
      {ZONES.map(z => {
        const st = states[z.id];
        const bg = st ? STATES[st].color : '#FAF7F2';
        const isActive = activeZone === z.id;
        return (
          <button key={z.id} type="button" onClick={() => onZoneClick && onZoneClick(z.id)}
            style={{
              display:'flex', alignItems:'center', gap:14,
              padding:'14px 18px',
              borderRadius: 14,
              border: `${isActive ? 3 : 2}px solid ${isActive ? SCAN_PINK : '#0E0E10'}`,
              background: bg,
              color: '#0E0E10',
              fontFamily:'inherit', cursor:'pointer',
              boxShadow: isActive ? `4px 4px 0 ${SCAN_PINK}` : 'none',
              transition:'all .15s'
            }}>
            <span style={{
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
              letterSpacing:'.16em', width:24, opacity:.6
            }}>{String(ZONES.indexOf(z)+1).padStart(2,'0')}</span>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:14,
              textTransform:'uppercase', letterSpacing:'-.005em', flex:1, textAlign:'left'
            }}>{z.label}</span>
            {st && (
              <span style={{
                fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10,
                letterSpacing:'.12em', textTransform:'uppercase'
              }}>{STATES[st].label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// =====================================================================
// FLEUR RESPIRATOIRE — 5 cycles, animation lente, pas de chiffre anxiogène
// =====================================================================
const BreathFlower = ({ guided, onComplete }) => {
  const [tick, setTick] = useStS(0);
  const [cycle, setCycle] = useStS(0);
  const startRef = useRfS(Date.now());
  const PERIOD = guided ? 8000 : 6000; // 8s en mode guidé, 6s sinon
  const TARGET = 5;

  useEfS(() => {
    let raf;
    const loop = () => {
      const elapsed = Date.now() - startRef.current;
      const c = Math.min(TARGET, Math.floor(elapsed / PERIOD));
      setCycle(c);
      setTick(t => (t + 1) % 100000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const elapsed = (Date.now() - startRef.current) % PERIOD;
  const t = elapsed / PERIOD; // 0..1
  // 0..0.5 inspire (bloom), 0.5..1 expire (close)
  const phase = t < 0.5 ? 'in' : 'out';
  const ratio = phase === 'in' ? t * 2 : (1 - t) * 2;
  const eased = ratio < 0.5 ? 2*ratio*ratio : 1 - Math.pow(-2*ratio+2,2)/2;
  const bloom = 0.35 + eased * 0.65; // 0.35..1.0

  const W = 320, H = 320, cx = W/2, cy = H/2;
  const N = 6; // 6 pétales centraux (visuel) + 5 dots compteur
  const petalRot = (i) => i * (360/N);

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:18, padding:'12px 0'}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{maxWidth: 320, display:'block'}}>
        {/* 5 dots-compteur autour de la fleur */}
        {Array.from({length: TARGET}).map((_, i) => {
          const ang = (-90 + i * (360/TARGET)) * Math.PI/180;
          const r = 142;
          const x = cx + Math.cos(ang) * r;
          const y = cy + Math.sin(ang) * r;
          const filled = i < cycle;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="9" fill={filled ? SCAN_PINK : 'white'}
                      stroke="#0E0E10" strokeWidth="2"/>
              {filled && <circle cx={x} cy={y} r="3" fill="white"/>}
            </g>
          );
        })}

        {/* tige centrale (poétique) */}
        <line x1={cx} y1={cy} x2={cx} y2={cy + 80} stroke="#0E0E10" strokeWidth="1.4" strokeDasharray="2 4" opacity="0.4"/>

        {/* pétales */}
        <g transform={`translate(${cx} ${cy})`}>
          {Array.from({length: N}).map((_, i) => (
            <g key={i} transform={`rotate(${petalRot(i)}) scale(${bloom})`}>
              <ellipse cx="0" cy="-44" rx="22" ry="44"
                       fill={SCAN_PINK} stroke="#0E0E10" strokeWidth="2.2"
                       opacity={0.85}/>
            </g>
          ))}
          {/* coeur */}
          <circle r="20" fill="white" stroke="#0E0E10" strokeWidth="2.5"/>
          <circle r="6" fill="#0E0E10"/>
        </g>
      </svg>

      <div style={{
        fontFamily:'var(--font-display)', fontSize: 16,
        textTransform:'uppercase', letterSpacing:'-0.005em',
        color:'#0E0E10', textAlign:'center'
      }}>
        {phase === 'in' ? 'Inspire — la fleur s’ouvre' : 'Expire — la fleur se ferme'}
      </div>
      <div style={{
        fontFamily:'var(--font-cond)', fontWeight:700, fontSize:11,
        letterSpacing:'.16em', textTransform:'uppercase', color:'#7C8A99'
      }}>
        Cycle {Math.min(cycle+1, TARGET)} / {TARGET}
      </div>

      {cycle >= TARGET && (
        <button type="button" onClick={onComplete} style={{
          marginTop: 4, padding:'14px 24px', borderRadius: 999,
          background: SCAN_PINK, color:'#0E0E10', border:'2px solid #0E0E10',
          boxShadow: '4px 4px 0 #0E0E10', cursor:'pointer',
          fontFamily:'var(--font-display)', fontSize: 14,
          textTransform:'uppercase', letterSpacing:'.04em'
        }}>
          Continuer →
        </button>
      )}
    </div>
  );
};

// =====================================================================
// SWIPE PAD — pour le balayage zone-par-zone (haut=détendu / bas=tendu)
// =====================================================================
const SwipePad = ({ onChoose, currentState }) => {
  const padRef = useRfS(null);
  const [drag, setDrag] = useStS({ active:false, dy:0 });
  const startY = useRfS(0);

  const onPointerDown = (e) => {
    const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (y == null) return;
    startY.current = y;
    setDrag({ active:true, dy:0 });
  };
  const onPointerMove = (e) => {
    if (!drag.active) return;
    const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (y == null) return;
    setDrag({ active:true, dy: y - startY.current });
  };
  const onPointerUp = () => {
    if (!drag.active) return;
    const dy = drag.dy;
    const TH = 24; // seuil tolérant
    let s;
    if (dy < -TH) s = 'detendu';
    else if (dy > TH) s = 'tendu';
    else s = 'neutre';
    setDrag({ active:false, dy:0 });
    onChoose(s);
  };

  useEfS(() => {
    if (!drag.active) return;
    const m = (e) => onPointerMove(e);
    const u = () => onPointerUp();
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
  }, [drag]);

  // visualisation du drag : un curseur qui se décale
  const dy = Math.max(-90, Math.min(90, drag.dy));
  const previewState = dy < -24 ? 'detendu' : dy > 24 ? 'tendu' : 'neutre';

  return (
    <div ref={padRef}
      onMouseDown={onPointerDown} onTouchStart={onPointerDown}
      style={{
        position:'relative',
        background:'white',
        border:'2px solid #0E0E10',
        borderRadius: 24,
        padding:'24px 20px',
        userSelect:'none', touchAction:'none',
        cursor: drag.active ? 'grabbing' : 'grab',
        overflow:'hidden',
        minHeight: 240
      }}>
      {/* gradient haut/bas — vert / rouge */}
      <div style={{
        position:'absolute', inset: 4, borderRadius: 20,
        background: `linear-gradient(180deg,
          ${STATES.detendu.color}22 0%,
          transparent 30%, transparent 70%,
          ${STATES.tendu.color}22 100%)`,
        pointerEvents:'none'
      }}/>
      {/* repères haut / centre / bas */}
      <div style={{
        position:'absolute', top: 14, left: 0, right: 0, textAlign:'center',
        fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
        letterSpacing:'.16em', textTransform:'uppercase',
        color: STATES.detendu.color
      }}>↑ DÉTENDU</div>
      <div style={{
        position:'absolute', bottom: 14, left: 0, right: 0, textAlign:'center',
        fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
        letterSpacing:'.16em', textTransform:'uppercase',
        color: STATES.tendu.color
      }}>↓ TENDU</div>

      {/* curseur central */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform: `translate(-50%, calc(-50% + ${dy}px))`,
        transition: drag.active ? 'none' : 'transform .25s cubic-bezier(.2,.8,.2,1)',
        width: 130, height: 130, borderRadius:'50%',
        background: STATES[previewState].color,
        border:'2px solid #0E0E10',
        boxShadow:'4px 4px 0 #0E0E10',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexDirection:'column', gap: 4, color:'#0E0E10'
      }}>
        <span style={{
          fontFamily:'var(--font-display)', fontSize:14,
          textTransform:'uppercase', letterSpacing:'.04em'
        }}>{STATES[previewState].label}</span>
        <span style={{
          fontFamily:'var(--font-cond)', fontWeight:700, fontSize:10,
          letterSpacing:'.1em', textTransform:'uppercase', opacity:.7,
          maxWidth: 110, textAlign:'center', lineHeight: 1.2
        }}>{drag.active ? '— relâche pour valider' : 'glisse haut ou bas'}</span>
      </div>
    </div>
  );
};

// =====================================================================
// PHASE WRAPPER — chrome commun à toutes les phases (entête + nav)
// =====================================================================
const PhaseShell = ({ phase, onPrev, onNext, canNext, children, hideNext }) => (
  <div style={{
    background: 'white', border:'2px solid #0E0E10', borderRadius: 28,
    padding: '22px 22px 18px', position:'relative'
  }}>
    {/* progress bar */}
    <div style={{display:'flex', gap:4, marginBottom: 18}}>
      {PHASES.map(p => (
        <div key={p.id} style={{
          flex:1, height: 6, borderRadius: 3,
          background: p.n < phase.n ? '#0E0E10'
                    : p.n === phase.n ? SCAN_PINK
                    : '#E6E5E1'
        }}/>
      ))}
    </div>
    <div style={{
      fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
      letterSpacing:'.18em', textTransform:'uppercase', color:'#7C8A99',
      marginBottom: 6
    }}>
      Phase {phase.n} / 7 · {phase.label}
    </div>
    <h3 style={{
      fontFamily:'var(--font-display)', fontSize: 28, lineHeight: 1,
      textTransform:'uppercase', letterSpacing:'-.015em',
      marginBottom: 10
    }}>{phase.title}</h3>
    <p style={{
      fontSize: 14, lineHeight: 1.55, color:'#4A4A55', marginBottom: 18
    }}>{phase.sub}</p>

    {children}

    {!hideNext && (
      <div style={{display:'flex', gap:10, marginTop: 18}}>
        {phase.n > 1 && (
          <button type="button" onClick={onPrev} style={{
            padding:'12px 18px', borderRadius: 999,
            background:'transparent', color:'#0E0E10',
            border:'2px solid #0E0E10', cursor:'pointer',
            fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
            letterSpacing:'.14em', textTransform:'uppercase'
          }}>← Avant</button>
        )}
        <button type="button" onClick={onNext}
          disabled={!canNext}
          style={{
            flex:1, padding:'14px 20px', borderRadius: 999,
            background: canNext ? SCAN_PINK : '#E6E5E1',
            color:'#0E0E10', cursor: canNext ? 'pointer' : 'not-allowed',
            border:'2px solid #0E0E10',
            boxShadow: canNext ? '4px 4px 0 #0E0E10' : 'none',
            fontFamily:'var(--font-display)', fontSize:14,
            textTransform:'uppercase', letterSpacing:'.04em',
            transition:'all .15s'
          }}>
          {phase.n === 7 ? 'Terminer' : 'Phase suivante →'}
        </button>
      </div>
    )}
  </div>
);

// =====================================================================
// HISTORIQUE — focus qualitatif : juste les mots
// =====================================================================
const ScanHistory = ({ hist, onClear }) => {
  if (!hist || hist.length === 0) {
    return (
      <div style={{
        padding:'18px 20px', borderRadius: 20, border:'2px dashed #B5B5BD',
        color:'#7C8A99', fontSize:13, textAlign:'center',
        fontFamily:'var(--font-cond)', textTransform:'uppercase',
        letterSpacing:'.08em', fontWeight:700
      }}>
        Pas encore de scan enregistré
      </div>
    );
  }
  const last = hist.slice().reverse().slice(0, 12);
  return (
    <div style={{display:'flex', flexDirection:'column', gap: 10}}>
      {last.map((h, i) => {
        const d = new Date(h.t);
        return (
          <div key={i} style={{
            padding:'14px 16px',
            border:'1.5px solid #E6E5E1', borderRadius: 18,
            background:'white',
            display:'flex', alignItems:'flex-start', gap: 12
          }}>
            <div style={{
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:10,
              letterSpacing:'.12em', textTransform:'uppercase', color:'#7C8A99',
              minWidth: 64
            }}>
              {d.toLocaleDateString('fr-FR',{day:'2-digit', month:'short'})}<br/>
              {d.toLocaleTimeString('fr-FR',{hour:'2-digit', minute:'2-digit'})}
            </div>
            <div style={{flex:1}}>
              {h.word ? (
                <div style={{
                  fontFamily:'var(--font-hand)', fontSize: 22,
                  color:'#0E0E10', lineHeight: 1.2
                }}>« {h.word} »</div>
              ) : (
                <div style={{
                  fontFamily:'var(--font-cond)', fontWeight:700, fontSize:12,
                  letterSpacing:'.1em', textTransform:'uppercase',
                  color:'#7C8A99', fontStyle:'italic'
                }}>(sans mot — c'est valide)</div>
              )}
              {h.cycles && (
                <div style={{
                  fontFamily:'var(--font-cond)', fontWeight:700, fontSize:10,
                  letterSpacing:'.1em', textTransform:'uppercase', color:'#7C8A99',
                  marginTop: 4
                }}>
                  {h.cycles} resp. · {h.duration ? Math.round(h.duration/60) + ' min' : '—'}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <button type="button" onClick={onClear} style={{
        marginTop: 6, padding:'10px',
        background:'transparent', border:'none', cursor:'pointer',
        fontFamily:'var(--font-cond)', fontWeight:700, fontSize:10,
        letterSpacing:'.14em', textTransform:'uppercase', color:'#B5B5BD'
      }}>Effacer l'historique</button>
    </div>
  );
};

// =====================================================================
// MAIN — TabScan
// =====================================================================
window.TabScan = ({ guided = true, metaphor = 'silhouette' }) => {
  const I = window.Icons;
  const [draft, setDraft] = useStS(() => {
    try { return JSON.parse(localStorage.getItem(S_DRAFT)) || null; } catch { return null; }
  });
  const [hist, setHist] = useStS(() => {
    try { return JSON.parse(localStorage.getItem(S_HIST)) || []; } catch { return []; }
  });
  const [phase, setPhase] = useStS(0); // 0 = intro / non démarré, 1..7 = phases
  const [states, setStates] = useStS({}); // { tete:'tendu', ... }
  const [zoneIdx, setZoneIdx] = useStS(0); // index du balayage en cours
  const [emotion, setEmotion] = useStS('');
  const [emoChips, setEmoChips] = useStS([]);
  const [globalNoticed, setGlobalNoticed] = useStS(false);
  const [grounded, setGrounded] = useStS(false);
  const [returned, setReturned] = useStS(false);
  const [outWord, setOutWord] = useStS('');
  const startedAt = useRfS(null);

  useEfS(() => {
    localStorage.setItem(S_HIST, JSON.stringify(hist));
  }, [hist]);

  const start = () => {
    setStates({}); setZoneIdx(0); setEmotion(''); setEmoChips([]);
    setGlobalNoticed(false); setGrounded(false); setReturned(false); setOutWord('');
    startedAt.current = Date.now();
    setPhase(1);
  };

  const finish = () => {
    const duration = startedAt.current ? Math.round((Date.now() - startedAt.current)/1000) : 0;
    const tendu = Object.values(states).filter(s => s === 'tendu').length;
    const detendu = Object.values(states).filter(s => s === 'detendu').length;
    const neutre = Object.values(states).filter(s => s === 'neutre').length;
    setHist(h => [...h, {
      t: Date.now(),
      word: outWord || '',
      emotion: emotion || '',
      emoChips,
      states,
      cycles: 5,
      duration,
      tally: { tendu, neutre, detendu }
    }].slice(-60));
    setPhase(0);
  };

  const cur = PHASES.find(p => p.n === phase);
  const tally = {
    tendu: Object.values(states).filter(s => s === 'tendu').length,
    neutre: Object.values(states).filter(s => s === 'neutre').length,
    detendu: Object.values(states).filter(s => s === 'detendu').length,
  };

  // pick the right metaphor renderer
  const renderMap = (compact = false, dim = false, visited = null) => {
    const props = {
      states,
      activeZone: phase === 3 ? ZONES[zoneIdx]?.id : null,
      onZoneClick: phase === 3 ? (id) => {
        const idx = ZONES.findIndex(z => z.id === id);
        if (idx >= 0) setZoneIdx(idx);
      } : null,
    };
    if (metaphor === 'constellation') return <Constellation {...props}/>;
    if (metaphor === 'tranches')      return <Slices {...props}/>;
    return <Silhouette {...props} dimUnvisited={dim} visited={visited}/>;
  };

  // ======= INTRO (phase 0) =======
  if (phase === 0) {
    return (
      <>
        <window.IntroHand>
          Pas pour analyser.<br/>
          <span style={{color:'var(--ink-2)'}}>Pour <em>habiter</em> ce qui est là — sans rien régler.</span>
        </window.IntroHand>

        <window.SectionLabel num="03">Outil de la rubrique</window.SectionLabel>
        <window.Headline accent="& Émotions">Impulsivité</window.Headline>

        <div style={{
          background: SCAN_PINK,
          border:'2px solid #0E0E10', borderRadius: 36,
          padding:'32px 28px',
          color:'#0E0E10',
          marginBottom: 16,
          position:'relative', overflow:'hidden'
        }}>
          <div style={{
            position:'absolute', inset:0, opacity:0.12, pointerEvents:'none',
            backgroundImage:'radial-gradient(circle, #0E0E10 1px, transparent 1.4px)',
            backgroundSize:'14px 14px'
          }}/>
          <div style={{
            fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
            letterSpacing:'.18em', textTransform:'uppercase', position:'relative'
          }}>Pratique guidée · 7 phases</div>
          <h3 style={{
            fontFamily:'var(--font-display)', fontSize: 36, lineHeight:.95,
            textTransform:'uppercase', letterSpacing:'-.02em',
            margin:'10px 0 14px', position:'relative'
          }}>Scan corporel</h3>
          <p style={{
            fontSize: 14, lineHeight: 1.55, marginBottom: 18,
            maxWidth: 460, position:'relative'
          }}>
            Quand le mental bouillonne, l'attention dans le corps lui sert de contrepoids.
            Pas de timer. Pas de score. Tu poses ton attention, tu observes, tu repars.
          </p>

          {/* aperçu mini-silhouette */}
          <div style={{
            display:'flex', gap: 18, alignItems:'center',
            background: 'rgba(255,255,255,0.4)',
            border:'2px solid #0E0E10', borderRadius: 24,
            padding:'14px 18px', marginBottom: 18, position:'relative'
          }}>
            <div style={{width: 80, flexShrink: 0}}>
              <Silhouette states={{}} activeZone={null}/>
            </div>
            <ul style={{
              listStyle:'none', padding: 0, margin: 0, fontSize: 12,
              display:'flex', flexDirection:'column', gap: 4,
              fontFamily:'var(--font-cond)', fontWeight:700,
              letterSpacing:'.04em', color:'#0E0E10'
            }}>
              <li>1 · Cinq respirations</li>
              <li>2 · Conscience globale</li>
              <li>3 · Balayage des 8 zones</li>
              <li>4 · Accueil des émotions</li>
              <li>5 · Ancrage</li>
              <li>6 · Retour</li>
              <li>7 · Trace (facultative)</li>
            </ul>
          </div>

          <button type="button" onClick={start} style={{
            padding:'16px 28px', borderRadius: 999,
            background:'#0E0E10', color:'white', border:'2px solid #0E0E10',
            boxShadow:'4px 4px 0 white', cursor:'pointer',
            fontFamily:'var(--font-display)', fontSize: 15,
            textTransform:'uppercase', letterSpacing:'.04em', position:'relative'
          }}>
            Commencer le scan
          </button>
          <div style={{
            marginTop: 14, fontFamily:'var(--font-cond)',
            fontWeight:700, fontSize: 11, letterSpacing:'.12em',
            textTransform:'uppercase', opacity:.75, position:'relative'
          }}>
            Mode {guided ? 'guidé · animation lente' : 'silencieux · à ton rythme'}
          </div>
        </div>

        <window.SectionLabel num="•">Mes derniers scans</window.SectionLabel>
        <window.Headline accent="qualitatif">Trace</window.Headline>
        <window.Card icon={I.Writing} title="Mots de sortie" sub="Pas de visualisation, pas de moyenne. Juste ce que tu as posé.">
          <ScanHistory hist={hist} onClear={() => setHist([])}/>
        </window.Card>

        <window.HLQuote>
          Le corps n'invente pas.<br/>
          Il <span style={{color: SCAN_PINK}}>signale</span>.
        </window.HLQuote>

        <window.Retain title="OBSERVER, PAS RÉGLER.">
          La pleine conscience corporelle n'est pas un exercice à réussir. Tu ne « gagnes » rien à
          terminer. Tu n'as rien à corriger si tout est tendu. Tu écoutes ce qui est là — et c'est
          déjà l'acte.
        </window.Retain>
      </>
    );
  }

  // ======= PHASE 1 — Amorce respiratoire =======
  if (phase === 1) {
    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(0)}
        onNext={() => setPhase(2)} canNext={true} hideNext={false}>
        <BreathFlower guided={guided} onComplete={() => setPhase(2)}/>
        <div style={{
          marginTop: 8, padding:'14px 18px', borderRadius: 16,
          background:'#FAF7F2', border:'1.5px solid #E6E5E1',
          fontFamily:'var(--font-hand)', fontSize: 19, lineHeight: 1.25,
          color:'#4A4A55', textAlign:'center'
        }}>
          {guided
            ? "Aucune perfection demandée. Si ton souffle se cherche, ce n'est pas un échec."
            : "Avance quand tu te sens prêt·e — pas avant."}
        </div>
      </PhaseShell>
    );
  }

  // ======= PHASE 2 — Conscience globale =======
  if (phase === 2) {
    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(1)}
        onNext={() => setPhase(3)} canNext={globalNoticed}>
        <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems:'center'}}
             className="scan-2col">
          <div style={{display:'flex', justifyContent:'center'}}>
            {renderMap()}
          </div>
          <div>
            <p style={{
              fontFamily:'var(--font-hand)', fontSize: 22, lineHeight: 1.3,
              color:'#0E0E10', marginBottom: 14
            }}>
              Sens-tu ton corps comme une seule chose, là, posée dans l'espace ?
            </p>
            <p style={{fontSize: 13, color:'#7C8A99', lineHeight: 1.6, marginBottom: 16}}>
              Pas en détail. Juste sa <em>présence</em>. Sa température, son poids, son contour.
            </p>
            <button type="button" onClick={() => setGlobalNoticed(true)} style={{
              padding:'14px 18px', borderRadius: 18,
              background: globalNoticed ? SCAN_PINK : 'white',
              color:'#0E0E10', border:'2px solid #0E0E10',
              boxShadow: globalNoticed ? '4px 4px 0 #0E0E10' : 'none',
              cursor:'pointer', width:'100%',
              fontFamily:'var(--font-display)', fontSize: 13,
              textTransform:'uppercase', letterSpacing:'.04em',
              transition:'all .15s'
            }}>
              {globalNoticed ? '✓ Oui, je le sens' : 'J\'ai pris ce moment'}
            </button>
          </div>
        </div>
      </PhaseShell>
    );
  }

  // ======= PHASE 3 — Balayage zone par zone =======
  if (phase === 3) {
    const z = ZONES[zoneIdx];
    const visited = ZONES.slice(0, zoneIdx).map(zz => zz.id)
      .concat(states[z.id] ? [z.id] : []);
    const allDone = ZONES.every(zz => states[zz.id]);

    const choose = (s) => {
      setStates(p => ({ ...p, [z.id]: s }));
      // avance auto vers la zone suivante après brève pause
      setTimeout(() => {
        if (zoneIdx < ZONES.length - 1) setZoneIdx(zoneIdx + 1);
      }, 360);
    };

    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(2)}
        onNext={() => setPhase(4)} canNext={allDone}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap: 18}}
             className="scan-2col">
          <div style={{display:'flex', justifyContent:'center'}}>
            {renderMap(false, true, visited)}
          </div>
          <div>
            <div style={{
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
              letterSpacing:'.16em', textTransform:'uppercase', color:'#7C8A99',
              marginBottom: 4
            }}>
              Zone {zoneIdx+1} / 8
            </div>
            <h4 style={{
              fontFamily:'var(--font-display)', fontSize: 22, lineHeight: 1,
              textTransform:'uppercase', letterSpacing:'-.01em',
              marginBottom: 4
            }}>{z.label}</h4>
            <div style={{
              fontSize: 12, color:'#7C8A99', marginBottom: 14, lineHeight: 1.5
            }}>{z.sub}</div>

            <SwipePad onChoose={choose} currentState={states[z.id]}/>

            {/* fallback boutons explicites — tap-friendly */}
            <div style={{display:'flex', gap: 8, marginTop: 12}}>
              {(['detendu','neutre','tendu']).map(s => (
                <button key={s} type="button" onClick={() => choose(s)}
                  style={{
                    flex:1, padding:'12px 8px', borderRadius: 14,
                    background: states[z.id] === s ? STATES[s].color : 'white',
                    color: '#0E0E10',
                    border:'2px solid #0E0E10', cursor:'pointer',
                    fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
                    letterSpacing:'.1em', textTransform:'uppercase',
                    boxShadow: states[z.id] === s ? '3px 3px 0 #0E0E10' : 'none',
                    transition:'all .15s'
                  }}>{STATES[s].label}</button>
              ))}
            </div>

            {/* nav zones rapide */}
            <div style={{
              display:'flex', gap: 6, marginTop: 16, flexWrap:'wrap'
            }}>
              {ZONES.map((zz, i) => {
                const set = !!states[zz.id];
                const cur = i === zoneIdx;
                return (
                  <button key={zz.id} type="button" onClick={() => setZoneIdx(i)}
                    style={{
                      width: 28, height: 28, borderRadius:'50%',
                      background: states[zz.id] ? STATES[states[zz.id]].color : 'white',
                      border:`${cur ? 3 : 1.5}px solid ${cur ? SCAN_PINK : '#0E0E10'}`,
                      fontFamily:'var(--font-cond)', fontWeight:800, fontSize: 10,
                      cursor:'pointer', color:'#0E0E10'
                    }}>{i+1}</button>
                );
              })}
            </div>
          </div>
        </div>
      </PhaseShell>
    );
  }

  // ======= PHASE 4 — Accueil des émotions =======
  if (phase === 4) {
    const EMO_CHIPS = [
      'tristesse','colère','peur','joie','calme','agitation',
      'lassitude','tendresse','vide','dégoût','fierté','rien de net'
    ];
    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(3)}
        onNext={() => setPhase(5)} canNext={true}>
        <p style={{
          fontFamily:'var(--font-hand)', fontSize: 22, lineHeight: 1.25,
          color:'#0E0E10', marginBottom: 14
        }}>
          Si une émotion est là, tu peux la nommer. Ou pas. Aucun mot n'est mieux que le silence.
        </p>
        <window.Chips items={EMO_CHIPS} value={emoChips} onChange={setEmoChips}/>
        <window.Label>Et avec tes mots, si tu veux —</window.Label>
        <window.FreeArea value={emotion} onChange={setEmotion}
          placeholder="Là, dans le corps, ça ressemble à…"/>
      </PhaseShell>
    );
  }

  // ======= PHASE 5 — Ancrage =======
  if (phase === 5) {
    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(4)}
        onNext={() => setPhase(6)} canNext={grounded}>
        <div style={{
          background:'#FAF7F2', border:'2px solid #0E0E10', borderRadius: 24,
          padding:'24px 22px', display:'flex', flexDirection:'column',
          alignItems:'center', gap: 16, position:'relative', overflow:'hidden'
        }}>
          {/* lignes-sol */}
          <svg viewBox="0 0 200 80" width="100%" style={{maxWidth: 240}}>
            <g stroke="#0E0E10" strokeWidth="1.4" fill="none">
              <path d="M 20 20 Q 100 16 180 20"/>
              <path d="M 14 32 Q 100 28 186 32"/>
              <path d="M 8 46 Q 100 42 192 46" opacity="0.6"/>
              <path d="M 4 62 Q 100 58 196 62" opacity="0.4"/>
            </g>
            {/* deux empreintes */}
            <ellipse cx="80" cy="22" rx="14" ry="6" fill={SCAN_PINK} stroke="#0E0E10" strokeWidth="1.8"/>
            <ellipse cx="120" cy="22" rx="14" ry="6" fill={SCAN_PINK} stroke="#0E0E10" strokeWidth="1.8"/>
          </svg>
          <p style={{
            fontFamily:'var(--font-hand)', fontSize: 22, lineHeight: 1.25,
            color:'#0E0E10', textAlign:'center', maxWidth: 380
          }}>
            Sens le poids — dans ton siège, tes pieds, ta colonne. Le sol ne lâche pas.
          </p>
          <button type="button" onClick={() => setGrounded(true)} style={{
            padding:'14px 22px', borderRadius: 999,
            background: grounded ? SCAN_PINK : 'white',
            color:'#0E0E10', border:'2px solid #0E0E10',
            boxShadow: grounded ? '4px 4px 0 #0E0E10' : 'none',
            cursor:'pointer',
            fontFamily:'var(--font-display)', fontSize: 13,
            textTransform:'uppercase', letterSpacing:'.04em',
            transition:'all .15s'
          }}>{grounded ? '✓ Je sens le poids' : 'Je prends ce temps'}</button>
        </div>
      </PhaseShell>
    );
  }

  // ======= PHASE 6 — Retour =======
  if (phase === 6) {
    const steps = [
      { id:'doigt', label:'Bouger un doigt' },
      { id:'pied',  label:'Bouger un pied' },
      { id:'epaul', label:'Rouler les épaules' },
      { id:'oeil',  label:'Ouvrir les yeux (si fermés)' },
    ];
    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(5)}
        onNext={() => setPhase(7)} canNext={returned}>
        <p style={{fontSize: 14, color:'#4A4A55', marginBottom: 14, lineHeight: 1.55}}>
          Quatre micro-mouvements. Tu peux les coche-passer dans l'ordre, ou les sentir dans le corps.
        </p>
        <window.Checklist
          items={steps}
          value={returned ? steps.map(s => s.id) : []}
          onChange={(v) => setReturned(v.length === steps.length)}/>
        <button type="button" onClick={() => setReturned(true)} style={{
          marginTop: 10, padding:'10px 16px', borderRadius: 14,
          background:'transparent', border:'1.5px dashed #0E0E10',
          color:'#0E0E10', cursor:'pointer',
          fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
          letterSpacing:'.12em', textTransform:'uppercase'
        }}>Tout est là, je continue</button>
      </PhaseShell>
    );
  }

  // ======= PHASE 7 — Notation (facultative) =======
  if (phase === 7) {
    return (
      <PhaseShell phase={cur} onPrev={() => setPhase(6)}
        onNext={finish} canNext={true}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap: 18, marginBottom: 16}}
             className="scan-2col">
          <div style={{display:'flex', justifyContent:'center'}}>
            {renderMap()}
          </div>
          <div>
            {/* paysage corporel — lecture immédiate, sans jugement */}
            <div style={{
              fontFamily:'var(--font-cond)', fontWeight:800, fontSize:11,
              letterSpacing:'.16em', textTransform:'uppercase', color:'#7C8A99',
              marginBottom: 6
            }}>Paysage corporel du moment</div>
            <div style={{display:'flex', flexDirection:'column', gap: 6}}>
              {(['tendu','neutre','detendu']).map(k => (
                <div key={k} style={{
                  display:'flex', alignItems:'center', gap: 10,
                  fontSize: 13
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius:'50%',
                    background: STATES[k].color, border:'1.5px solid #0E0E10',
                    flexShrink: 0
                  }}/>
                  <span style={{
                    fontFamily:'var(--font-cond)', fontWeight:700, fontSize:11,
                    letterSpacing:'.1em', textTransform:'uppercase',
                    color:'#0E0E10', minWidth: 64
                  }}>{STATES[k].label}</span>
                  <span style={{color:'#4A4A55'}}>
                    {tally[k]} zone{tally[k] > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily:'var(--font-hand)', fontSize: 19, lineHeight: 1.3,
              color:'#4A4A55', marginTop: 14
            }}>
              Pas un score. Pas un diagnostic. Une <em>photo</em> qui change demain.
            </p>
          </div>
        </div>

        <p style={{
          fontFamily:'var(--font-display)', fontSize: 22, lineHeight: 1.05,
          textTransform:'uppercase', letterSpacing:'-.015em',
          marginBottom: 4
        }}>
          Qu'est-ce que tu emportes<br/>
          <span style={{color: SCAN_PINK}}>de ce scan&nbsp;?</span>
        </p>
        <p style={{fontSize: 12, color:'#7C8A99', marginBottom: 8, lineHeight: 1.5}}>
          Un mot suffit. Une sensation. Ou rien — c'est aussi une réponse.
        </p>
        <window.Field value={outWord} onChange={setOutWord}
          placeholder="Ex : doux · serré · présent · un peu plus là"/>
      </PhaseShell>
    );
  }

  return null;
};
