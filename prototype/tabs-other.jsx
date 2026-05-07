// Onglets Soir, Semaine, Boussole, Pensées, Listes
const { useState: useStX, useEffect: useEfX } = React;

/* ============= SOIR ============= */
const S_KEY = 'jtdah-soir-v3';
window.TabSoir = ({ priorities }) => {
  const I = window.Icons; const Mo = window.Monsters;
  const [s, setS] = useStX(() => {
    try { return JSON.parse(localStorage.getItem(S_KEY)) || {}; } catch { return {}; }
  });
  useEfX(() => { localStorage.setItem(S_KEY, JSON.stringify(s)); }, [s]);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  return (
    <>
      <window.IntroHand>
        La journée s'achève.<br/>
        <span style={{color:'var(--ink-2)'}}>Pas pour juger. Pour comprendre.</span>
      </window.IntroHand>

      <window.SectionLabel num="1">Bilan des priorités</window.SectionLabel>
      <window.Headline accent="(sans jugement)">Mes 3 priorités</window.Headline>
      <window.Card icon={I.Target} title="Avancement" sub="○ pas commencé · ◐ entamé · ● fait">
        {[0,1,2].map(i => (
          <div key={i} style={{margin:'14px 0'}}>
            <div style={{fontFamily:'var(--font-cond)', fontWeight:800, fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink-2)', marginBottom:6}}>
              P{i+1} : {priorities[i] || <span style={{color:'var(--muted)'}}>—</span>}
            </div>
            <window.Prog3 value={(s.prog || [null,null,null])[i]}
              onChange={v => {
                const next = [...(s.prog || [null,null,null])]; next[i] = v; set('prog', next);
              }}/>
          </div>
        ))}
        <window.Compare>
          Compare avec ton intention du matin. Pas pour t'en vouloir — pour repérer ce qui t'a éloigné(e).
        </window.Compare>
      </window.Card>

      <window.SectionLabel num="2">Émotions de la journée</window.SectionLabel>
      <window.Headline>Météo<br/><span className="accent">émotionnelle</span></window.Headline>
      <window.EmoGrid
        value={s.emoSoir}
        onChange={v => set('emoSoir', v)}
        items={[
          { id: 'calme',     label: 'Apaisé',    illu: Mo.Calme,     color:'#4DD0B0' },
          { id: 'fier',      label: 'Fier',      illu: Mo.Fier,      color:'#E8294E' },
          { id: 'reflexif',  label: 'Pensif',    illu: Mo.Reflexif,  color:'#B05BC9' },
          { id: 'energique', label: 'Vivant',    illu: Mo.Energique, color:'#F26B2C' },
          { id: 'inquiet',   label: 'Tendu',     illu: Mo.Inquiet,   color:'#F0B340' },
          { id: 'endormi',   label: 'Vidé',      illu: Mo.Endormi,   color:'#7C8A99' },
        ]}/>

      <window.SectionLabel num="3">Le moment marquant</window.SectionLabel>
      <window.Headline>Une scène<br/>de la journée</window.Headline>
      <window.Card icon={I.Sparkle} title="Le moment qui s'impose" sub="Beau ou difficile — le premier qui revient.">
        <window.FreeArea value={s.moment} onChange={v => set('moment', v)}
          placeholder="Quand je ferme les yeux, je revois…"/>
      </window.Card>

      <window.HandNote right>« Le mémorable n'est pas toujours grand. »</window.HandNote>

      <window.SectionLabel num="4">Trois gratitudes</window.SectionLabel>
      <window.Headline accent="qui a tenu bon">Petit · moyen · grand</window.Headline>
      <window.Card icon={I.Gem} title="Trois choses qui ont tenu bon">
        <window.Label>Petit</window.Label>
        <window.Field value={s.g1} onChange={v => set('g1', v)} placeholder="Un café chaud, une lumière douce…"/>
        <window.Label>Moyen</window.Label>
        <window.Field value={s.g2} onChange={v => set('g2', v)} placeholder="Un message, un moment d'eau claire…"/>
        <window.Label>Grand</window.Label>
        <window.Field value={s.g3} onChange={v => set('g3', v)} placeholder="Une décision, une rencontre…"/>
      </window.Card>

      <window.SectionLabel num="5">Une chose à laisser ici</window.SectionLabel>
      <window.Headline>Vide ton sac<br/><span className="accent">avant la nuit</span></window.Headline>
      <window.Card icon={I.MoonStar} title="Je dépose, j'allège">
        <window.FreeArea value={s.lacher} onChange={v => set('lacher', v)}
          placeholder="Ce que je laisse au jour qui passe, pour mieux dormir."/>
      </window.Card>

      <window.Retain title="LA NUIT TRIE CE QUE LE JOUR A SEMÉ." monster={Mo.Endormi}>
        Pose le bilan, pose-toi. Demain, tu reprendras. Pas avant.
      </window.Retain>
    </>
  );
};

/* ============= SEMAINE ============= */
const W_KEY = 'jtdah-semaine-v3';
window.TabSemaine = () => {
  const I = window.Icons; const Mo = window.Monsters;
  const days = ['LUN','MAR','MER','JEU','VEN','SAM','DIM'];
  const [s, setS] = useStX(() => {
    try { return JSON.parse(localStorage.getItem(W_KEY)) || {}; } catch { return {}; }
  });
  useEfX(() => { localStorage.setItem(W_KEY, JSON.stringify(s)); }, [s]);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));
  const cellState = (rowKey, day) => (s[rowKey] || {})[day];
  const setCell = (rowKey, day, value) => {
    const row = { ...(s[rowKey] || {}), [day]: value };
    set(rowKey, row);
  };
  const rows = [
    { key: 'sommeil',  label: 'Sommeil suffisant' },
    { key: 'mvt',      label: 'Mouvement / corps' },
    { key: 'connexion',label: 'Lien social positif' },
    { key: 'creation', label: 'Moment créatif / plaisir' },
    { key: 'recup',    label: 'Pause récupératrice' },
  ];

  return (
    <>
      <window.IntroHand>
        Une semaine, c'est plus utile qu'une journée.<br/>
        <span style={{color:'var(--ink-2)'}}>Le motif émerge dans la durée.</span>
      </window.IntroHand>

      <window.SectionLabel num="1">Tableau de la semaine</window.SectionLabel>
      <window.Headline accent="• ou ✗ chaque jour">5 piliers</window.Headline>
      <window.Card icon={I.Calendar} title="Suivi quotidien">
        <table className="bilan-table">
          <thead><tr>
            <th></th>{days.map(d => <th key={d}>{d}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.key}>
                <td>{r.label}</td>
                {days.map(d => {
                  const v = cellState(r.key, d);
                  return (
                    <td key={d}>
                      <button className={`b-radio ${v === 'ok' ? 'ok-on' : v === 'ko' ? 'ko-on' : ''}`}
                        onClick={() => {
                          const next = v === 'ok' ? 'ko' : v === 'ko' ? null : 'ok';
                          setCell(r.key, d, next);
                        }}>
                        {v === 'ok' ? '•' : v === 'ko' ? '✗' : ''}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </window.Card>

      <window.SectionLabel num="2">Bilan global</window.SectionLabel>
      <window.Headline>Ce que je<br/><span className="accent">retiens</span></window.Headline>
      <window.Card icon={I.Trophy} title="Ma plus belle réussite">
        <window.FreeArea value={s.win} onChange={v => set('win', v)}
          placeholder="Aussi petite soit-elle. Elle compte."/>
      </window.Card>
      <window.Card icon={I.Bulb} title="Ce que j'ai appris sur moi">
        <window.FreeArea value={s.learn} onChange={v => set('learn', v)}
          placeholder="Une observation, un déclic, un motif récurrent…"/>
      </window.Card>
      <window.Card icon={I.Seedling} title="Une chose à transporter dans la prochaine semaine">
        <window.FreeArea value={s.carry} onChange={v => set('carry', v)}
          placeholder="Une intention, un geste, une envie."/>
      </window.Card>

      <window.HLQuote>
        Sept jours, c'est assez<br/>pour voir une tendance.<br/>Pas un échec.
      </window.HLQuote>

      <window.Retain title="ON NE GAGNE PAS UNE SEMAINE — ON LA TRAVERSE." monster={Mo.Reflexif}>
        Le but n'est pas de cocher toutes les cases. C'est de remarquer celles qui te portent.
      </window.Retain>
    </>
  );
};

/* ============= BOUSSOLE ============= */
const B_KEY = 'jtdah-boussole-v3';
window.TabBoussole = () => {
  const I = window.Icons; const Mo = window.Monsters;
  const [s, setS] = useStX(() => {
    try { return JSON.parse(localStorage.getItem(B_KEY)) || {}; } catch { return {}; }
  });
  useEfX(() => { localStorage.setItem(B_KEY, JSON.stringify(s)); }, [s]);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  return (
    <>
      <window.IntroHand>
        Pas un plan de vie.<br/>
        <span style={{color:'var(--ink-2)'}}>Une direction. Une orientation.</span>
      </window.IntroHand>

      <window.SectionLabel num="1">Mes valeurs</window.SectionLabel>
      <window.Headline>Ce qui<br/><span className="accent">me tient debout</span></window.Headline>
      <window.Card icon={I.Heart} title="Choisis 3 valeurs" sub="Pas ce que tu devrais valoriser. Ce qui résonne quand tu lis le mot.">
        <window.PillarGrid
          value={s.values || []}
          onChange={v => set('values', v.slice(-3))}
          items={[
            { id:'liberte',    label:'Liberté',    icon: I.Wind },
            { id:'creation',   label:'Création',   icon: I.Brush },
            { id:'lien',       label:'Lien',       icon: I.Users },
            { id:'verite',     label:'Vérité',     icon: I.EyeOpen },
            { id:'douceur',    label:'Douceur',    icon: I.Flower },
            { id:'force',      label:'Force',      icon: I.Bolt },
            { id:'paix',       label:'Paix',       icon: I.Leaf },
            { id:'aventure',   label:'Aventure',   icon: I.StarBig },
            { id:'apprentis',  label:'Apprendre',  icon: I.Book },
          ]}/>
      </window.Card>

      <window.SectionLabel num="2">Mes envies de la saison</window.SectionLabel>
      <window.Headline accent="dans 3 mois">Ce que je voudrais</window.Headline>
      <window.Card icon={I.Compass} title="Trois envies — pas trois objectifs" sub="Plutôt « je voudrais ressentir / vivre… » que « je dois atteindre… »">
        <window.Label>Envie 1</window.Label>
        <window.Field value={s.e1} onChange={v => set('e1', v)} placeholder="Plus de moments lents…"/>
        <window.Label>Envie 2</window.Label>
        <window.Field value={s.e2} onChange={v => set('e2', v)} placeholder="Reprendre une pratique abandonnée…"/>
        <window.Label>Envie 3</window.Label>
        <window.Field value={s.e3} onChange={v => set('e3', v)} placeholder="Une rencontre, un voyage, un soin…"/>
      </window.Card>

      <window.SectionLabel num="3">Mes saboteurs</window.SectionLabel>
      <window.Headline>Ce qui me<br/><span className="accent">détourne</span></window.Headline>
      <window.Card icon={I.Cloud} title="Les motifs récurrents">
        <window.Chips
          value={s.sab || []}
          onChange={v => set('sab', v)}
          items={[
            { id:'perf',  label:'Perfectionnisme', icon: I.Gem },
            { id:'fuite', label:'Évitement',       icon: I.Wind },
            { id:'comp',  label:'Comparaison',     icon: I.Mix },
            { id:'tout',  label:'Tout-ou-rien',    icon: I.Bolt },
            { id:'plus',  label:'Toujours plus',   icon: I.More },
            { id:'sans',  label:'Pas-assez',       icon: I.Cloud },
          ]}/>
      </window.Card>

      <window.HLQuote>
        Je n'ai pas à choisir<br/>une vie parfaite.<br/>Je choisis la <span style={{color:'var(--dominant)'}}>prochaine direction</span>.
      </window.HLQuote>

      <window.Retain title="LA BOUSSOLE NE CHOISIT PAS LE CHEMIN. ELLE INDIQUE LE NORD." monster={Mo.Fier}>
        Tu peux dévier. Tu peux reculer. La boussole, elle, reste fiable — elle attend que tu lui demandes.
      </window.Retain>
    </>
  );
};

/* ============= PENSÉES ============= */
const P_KEY = 'jtdah-pensees-v3';
window.TabPensees = () => {
  const I = window.Icons; const Mo = window.Monsters;
  const [s, setS] = useStX(() => {
    try { return JSON.parse(localStorage.getItem(P_KEY)) || {}; } catch { return {}; }
  });
  useEfX(() => { localStorage.setItem(P_KEY, JSON.stringify(s)); }, [s]);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  return (
    <>
      <window.IntroHand>
        Quand ça tourne en boucle,<br/>
        <span style={{color:'var(--ink-2)'}}>écris-le. La page, elle, ne juge pas.</span>
      </window.IntroHand>

      <window.SectionLabel num="1">La pensée qui revient</window.SectionLabel>
      <window.Headline>Pose-la,<br/><span className="accent">examine-la</span></window.Headline>
      <window.Card icon={I.Cloud} title="La pensée — telle qu'elle est">
        <window.FreeArea value={s.thought} onChange={v => set('thought', v)}
          placeholder="« Je ne suis pas à la hauteur. » / « Tout va se planter. » / …"/>
      </window.Card>
      <window.Card icon={I.Bolt} title="L'émotion qu'elle déclenche">
        <window.Opt value={s.feel} onChange={v => set('feel', v)}
          items={[
            { id:'angoisse', label:'Angoisse',  icon: I.Cloud },
            { id:'colere',   label:'Colère',    icon: I.Bolt },
            { id:'tristesse',label:'Tristesse', icon: I.Drop },
            { id:'honte',    label:'Honte',     icon: I.Eye },
            { id:'peur',     label:'Peur',      icon: I.Shield },
          ]}/>
        <window.Label>Intensité</window.Label>
        <window.Scale value={s.intens} onChange={v => set('intens', v)} max={5} labelLow="LÉGÈRE" labelHigh="ÉCRASANTE"/>
      </window.Card>

      <window.SectionLabel num="2">Examen</window.SectionLabel>
      <window.Headline>Quatre<br/><span className="accent">questions</span></window.Headline>
      <window.Card icon={I.EyeOpen} title="Est-ce un fait, ou une interprétation ?">
        <window.FreeArea value={s.fait} onChange={v => set('fait', v)}
          placeholder="Qu'est-ce que je sais vraiment ? Qu'est-ce que j'invente ?"/>
      </window.Card>
      <window.Card icon={I.Users} title="Que dirais-je à un ami dans ma situation ?">
        <window.FreeArea value={s.ami} onChange={v => set('ami', v)}
          placeholder="Je serais probablement plus doux qu'envers moi-même…"/>
      </window.Card>
      <window.Card icon={I.Clock} title="Cette pensée sera-t-elle vraie dans une semaine ?">
        <window.Opt value={s.semaine} onChange={v => set('semaine', v)}
          items={[
            { id:'oui', label:'Probablement oui' },
            { id:'peut', label:'Peut-être' },
            { id:'non', label:'Sans doute pas' },
          ]}/>
      </window.Card>
      <window.Card icon={I.Seedling} title="Une version plus juste de cette pensée ?">
        <window.FreeArea value={s.juste} onChange={v => set('juste', v)}
          placeholder="« Je trouve ça difficile, et c'est OK de demander de l'aide. »"/>
      </window.Card>

      <window.HandNote>« Une pensée n'est pas un fait. Elle est juste de passage. »</window.HandNote>

      <window.Retain title="OBSERVER UNE PENSÉE, C'EST DÉJÀ S'EN DÉCROCHER." monster={Mo.Reflexif}>
        Tu n'as pas à la combattre. Tu la regardes passer, comme un nuage. Elle finit par bouger.
      </window.Retain>
    </>
  );
};

/* ============= LISTES ============= */
const L_KEY = 'jtdah-listes-v3';
window.TabListes = () => {
  const I = window.Icons; const Mo = window.Monsters;
  const [s, setS] = useStX(() => {
    try { return JSON.parse(localStorage.getItem(L_KEY)) || {}; } catch { return {}; }
  });
  useEfX(() => { localStorage.setItem(L_KEY, JSON.stringify(s)); }, [s]);

  const lists = [
    { key:'todo',   icon:I.Check,    title:'À faire (sans pression)' },
    { key:'idees',  icon:I.Bulb,     title:'Idées en vrac' },
    { key:'envies', icon:I.SparkleSmall, title:'Envies de soin' },
    { key:'memo',   icon:I.Mail,     title:'À ne pas oublier' },
    { key:'courses',icon:I.Cart,     title:'Courses & quotidien' },
  ];

  return (
    <>
      <window.IntroHand>
        Sortir de la tête.<br/>
        <span style={{color:'var(--ink-2)'}}>Mettre sur la page. Respirer.</span>
      </window.IntroHand>

      <window.SectionLabel num="•">Vider la tête</window.SectionLabel>
      <window.Headline>Tout ce qui<br/><span className="accent">tourne en boucle</span></window.Headline>

      {lists.map(l => (
        <window.ListBlock key={l.key} icon={l.icon} title={l.title}
          items={s[l.key] || []}
          onChange={v => setS(p => ({ ...p, [l.key]: v }))}/>
      ))}

      <window.HLQuote>
        Une tête en paix,<br/>c'est une tête<br/><span style={{color:'var(--dominant)'}}>vidée sur le papier</span>.
      </window.HLQuote>

      <window.Retain title="CE QUI EST ÉCRIT N'A PLUS BESOIN D'ÊTRE RETENU." monster={Mo.Calme}>
        Tu peux relâcher. La page se souvient pour toi.
      </window.Retain>
    </>
  );
};
