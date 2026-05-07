// Composants réutilisables — patrons visuels du guide.

const { useState, useEffect, useRef } = React;

/* SectionLabel : « 01 — INTROSPECTION » */
window.SectionLabel = ({ num, children }) => (
  <div className="section-label">
    {num != null && <span className="snum">{num}</span>}
    <span>{children}</span>
  </div>
);

window.Headline = ({ children, accent }) => (
  <h2 className="section-headline">
    {children}{accent && <> <span className="accent">{accent}</span></>}
  </h2>
);

/* Card */
window.Card = ({ icon: Icon, iconColor, title, sub, children, shadowed = true }) => (
  <div className={`card ${shadowed ? 'shadowed' : ''}`}>
    <div className="card-head">
      {Icon && <span className="ic"><Icon size={22} color={iconColor || 'var(--ink)'} /></span>}
      <h3 className="card-title">{title}</h3>
    </div>
    {sub && <p className="card-sub">{sub}</p>}
    {children}
  </div>
);

/* Card colored full */
window.CardColor = ({ ribbon, title, sub, children }) => (
  <div className="card-color">
    {ribbon && <div className="ribbon">{ribbon}</div>}
    {title && <h3 className="card-title">{title}</h3>}
    {sub && <p className="card-sub">{sub}</p>}
    {children}
  </div>
);

/* Hand note */
window.HandNote = ({ children, right }) => (
  <div className={`handnote ${right ? 'right' : ''}`}>{children}</div>
);

window.IntroHand = ({ children }) => (
  <div className="intro-hand">{children}</div>
);

/* Highlight quote noire */
window.HLQuote = ({ children }) => (
  <div className="hl-quote">
    <div className="hl-quote-text">{children}</div>
  </div>
);

/* À retenir bloc full-bleed */
window.Retain = ({ title, children, monster: Mascot }) => (
  <div className="retain-block">
    <span className="retain-tab">À RETENIR</span>
    <h3>{title}</h3>
    <p>{children}</p>
    {Mascot && (
      <div className="retain-mascot">
        <Mascot color="#0E0E10"/>
      </div>
    )}
  </div>
);

/* Compare box */
window.Compare = ({ children }) => (
  <div className="compare-box">{children}</div>
);

/* Scale 1-5 dots */
window.Scale = ({ value, onChange, labelLow = "BAS", labelHigh = "HAUT", max = 5 }) => (
  <div className="scale">
    <div className="scale-labels"><span>{labelLow}</span><span>{labelHigh}</span></div>
    <div className="scale-dots">
      {Array.from({ length: max }, (_, i) => (
        <button key={i} type="button"
          className={`s-dot ${value > i ? 'on' : ''}`}
          onClick={() => onChange(i + 1)} aria-label={`${i+1}/${max}`}/>
      ))}
    </div>
  </div>
);

/* Emotion grid — illu + label. Chaque mascotte porte sa propre couleur ;
   en sélection, on garde la couleur (cell prend l'aplat dominant). */
window.EmoGrid = ({ items, value, onChange }) => (
  <div className="emo-grid">
    {items.map(it => {
      const Illu = it.illu;
      const on = value === it.id;
      const monsterColor = it.color || '#FF8AB8';
      return (
        <button key={it.id} type="button"
          className={`emo-cell ${on ? 'on' : ''}`}
          onClick={() => onChange(on ? null : it.id)}>
          <span className="emo-illu"><Illu color={on ? 'white' : monsterColor}/></span>
          <span>{it.label}</span>
        </button>
      );
    })}
  </div>
);

/* Chips multi-sélect */
window.Chips = ({ items, value = [], onChange, small }) => (
  <div className="chips">
    {items.map(it => {
      const id = typeof it === 'string' ? it : it.id;
      const label = typeof it === 'string' ? it : it.label;
      const Icon = typeof it === 'object' ? it.icon : null;
      const on = value.includes(id);
      return (
        <button key={id} type="button"
          className={`chip ${on ? 'on' : ''}`}
          onClick={() => onChange(on ? value.filter(v => v !== id) : [...value, id])}>
          {Icon && <span className="chip-ic"><Icon size={14} color={on ? 'white' : 'var(--ink)'}/></span>}
          {label}
        </button>
      );
    })}
  </div>
);

/* Single opt buttons */
window.Opt = ({ items, value, onChange }) => (
  <div className="opt-row">
    {items.map(it => {
      const id = typeof it === 'string' ? it : it.id;
      const label = typeof it === 'string' ? it : it.label;
      const Icon = typeof it === 'object' ? it.icon : null;
      const on = value === id;
      return (
        <button key={id} type="button"
          className={`opt-btn ${on ? 'on' : ''}`}
          onClick={() => onChange(on ? null : id)}>
          {Icon && <span className="ic"><Icon size={14} color={on ? 'white' : 'var(--ink)'}/></span>}
          {label}
        </button>
      );
    })}
  </div>
);

/* Checklist */
window.Checklist = ({ items, value = [], onChange }) => (
  <div className="checklist">
    {items.map(it => {
      const id = typeof it === 'string' ? it : it.id;
      const label = typeof it === 'string' ? it : it.label;
      const Icon = typeof it === 'object' ? it.icon : null;
      const on = value.includes(id);
      return (
        <div key={id} className={`check-row ${on ? 'on' : ''}`}
          onClick={() => onChange(on ? value.filter(v => v !== id) : [...value, id])}>
          {Icon && <span className="ic"><Icon size={20} color={on ? 'white' : 'var(--ink)'} stroke={2.4}/></span>}
          <span>{label}</span>
          <span className="check-box">{on ? '✓' : ''}</span>
        </div>
      );
    })}
  </div>
);

/* Field input */
window.Field = ({ value, onChange, placeholder, multiline, rows = 1 }) => (
  multiline
    ? <textarea className="field" rows={rows} value={value || ''} placeholder={placeholder}
        onChange={e => onChange(e.target.value)} />
    : <input className="field" type="text" value={value || ''} placeholder={placeholder}
        onChange={e => onChange(e.target.value)} />
);

window.FreeArea = ({ value, onChange, placeholder }) => (
  <textarea className="free-area" value={value || ''} placeholder={placeholder}
    onChange={e => onChange(e.target.value)} />
);

window.Label = ({ children }) => <label className="flabel">{children}</label>;

/* Priorité */
window.PrioRow = ({ tag, klass, value, onChange, placeholder }) => (
  <div className="prio-row">
    <span className={`prio-tag ${klass}`}>{tag}</span>
    <input className="field" style={{marginTop:0, flex:1}} type="text" value={value || ''}
      placeholder={placeholder} onChange={e => onChange(e.target.value)}/>
  </div>
);

/* Progress 3 dots — pas / mi / fait */
window.Prog3 = ({ value, onChange, label }) => (
  <div className="prog3">
    {[0,1,2].map(i => (
      <button key={i} type="button"
        className={`p-dot p${i} ${value === i ? 'on' : ''}`}
        onClick={() => onChange(value === i ? null : i)}>
        {i === 0 ? '○' : i === 1 ? '◐' : '●'}
      </button>
    ))}
    {label && <span className="p-lbl">{label}</span>}
  </div>
);

/* Pillar grid */
window.PillarGrid = ({ items, value = [], onChange }) => (
  <div className="pillar-grid">
    {items.map(it => {
      const Icon = it.icon;
      const on = value.includes(it.id);
      return (
        <button key={it.id} type="button"
          className={`pillar-cell ${on ? 'on' : ''}`}
          onClick={() => onChange(on ? value.filter(v => v !== it.id) : [...value, it.id])}>
          <span className="pico"><Icon size={32} color={on ? 'white' : 'var(--ink)'} stroke={2.2}/></span>
          <span>{it.label}</span>
        </button>
      );
    })}
  </div>
);

/* List block (To-do, Mémo, etc.) */
window.ListBlock = ({ icon: Icon, title, items, onChange, placeholder = "Ajouter…" }) => {
  const update = (idx, patch) => {
    const next = items.map((it, i) => i === idx ? { ...it, ...patch } : it);
    onChange(next);
  };
  const add = () => onChange([...items, { id: Date.now() + '', text: '', done: false }]);
  return (
    <div className="list-block">
      <div className="head">
        {Icon && <span className="head-ic"><Icon size={22} color="var(--dominant)"/></span>}
        <h3 className="title">{title}</h3>
      </div>
      {items.map((it, idx) => (
        <div key={it.id} className="list-row">
          <button type="button"
            className={`lbox ${it.done ? 'on' : ''}`}
            onClick={() => update(idx, { done: !it.done })}>
            {it.done ? '✓' : ''}
          </button>
          <input type="text" value={it.text} className={it.done ? 'done' : ''}
            placeholder={placeholder}
            onChange={e => update(idx, { text: e.target.value })}/>
        </div>
      ))}
      <button type="button" className="list-add" onClick={add}>＋ Ajouter une ligne</button>
    </div>
  );
};

/* Hint link */
window.HintLink = ({ children }) => (
  <a className="hint-link" href="#" onClick={(e) => e.preventDefault()}>
    {children} <window.Icons.ArrowDR size={12}/>
  </a>
);
