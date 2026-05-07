// Tweaks panel custom React.
const { useState: useStateT, useEffect: useEffectT } = React;

window.TweaksPanel = ({ tweaks, setTweak, onClose, palette }) => {
  return (
    <div className="tweaks-panel">
      <h3>
        Tweaks
        <button className="close" onClick={onClose} aria-label="Fermer">✕</button>
      </h3>

      <div className="tw-row">
        <span className="tw-label">Onglet d'ouverture</span>
        <div className="tw-swatches">
          {palette.map(p => (
            <button key={p.id} className={`tw-sw ${tweaks.dominantTab === p.id ? 'on' : ''}`}
              style={{ background: p.color }}
              onClick={() => setTweak('dominantTab', p.id)}
              title={p.label} />
          ))}
        </div>
      </div>

      <div className="tw-row">
        <span className="tw-label">Mascottes</span>
        <button className="tw-toggle" onClick={() => setTweak('mascot', !tweaks.mascot)}>
          <span>Monstres visibles</span>
          <span className={`tw-state ${tweaks.mascot ? 'is-on' : 'is-off'}`}>
            {tweaks.mascot ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      <div className="tw-row">
        <span className="tw-label">Notes manuscrites</span>
        <button className="tw-toggle" onClick={() => setTweak('hand', !tweaks.hand)}>
          <span>Bulles « Caveat »</span>
          <span className={`tw-state ${tweaks.hand ? 'is-on' : 'is-off'}`}>
            {tweaks.hand ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      <div className="tw-row">
        <span className="tw-label">Densité</span>
        <button className="tw-toggle" onClick={() => setTweak('compact', !tweaks.compact)}>
          <span>Mode compact</span>
          <span className={`tw-state ${tweaks.compact ? 'is-on' : 'is-off'}`}>
            {tweaks.compact ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );
};

/* trigger button (top-right) */
window.TweaksTrigger = ({ onClick }) => (
  <button onClick={onClick} aria-label="Tweaks"
    style={{
      position:'fixed', top: 20, right: 20, zIndex: 199,
      width: 44, height: 44, borderRadius: '50%',
      border: '2px solid #0E0E10', background: 'white',
      cursor: 'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow: '4px 4px 0 #0E0E10'
    }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E0E10" strokeWidth="2.4" strokeLinecap="round">
      <circle cx="6" cy="6" r="2"/><line x1="6" y1="9" x2="6" y2="20"/>
      <circle cx="12" cy="14" r="2"/><line x1="12" y1="4" x2="12" y2="11"/>
      <line x1="12" y1="17" x2="12" y2="20"/>
      <circle cx="18" cy="9" r="2"/><line x1="18" y1="12" x2="18" y2="20"/>
      <line x1="18" y1="4" x2="18" y2="6"/>
    </svg>
  </button>
);
