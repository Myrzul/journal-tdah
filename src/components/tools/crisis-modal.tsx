"use client";

type Contact = {
  name: string;
  tel: string;
};

type Props = {
  contacts: Contact[];
  onClose: () => void;
  onBreath: () => void;
};

/**
 * Modale d'aide d'urgence (déclenchée niveau 5 / bouton SOS).
 * Pas une alerte agressive : un cocon avec 3114 + contacts + respiration.
 */
export function CrisisModal({ contacts, onClose, onBreath }: Props) {
  const validContacts = contacts.filter((c) => c.name && c.tel);

  return (
    <div className="crisis-overlay" role="dialog" aria-modal="true" aria-label="Aide d'urgence">
      <div className="crisis-card">
        <div className="crisis-eyebrow">Pause clinique · niveau 5</div>
        <h2 className="crisis-title">
          Tu n'es pas seul·e
          <br />
          maintenant.
        </h2>
        <p className="crisis-intro">
          Ce que tu ressens est un signal de surcharge, pas un échec. Le plus important, là, c'est
          de ne pas rester seul·e devant l'écran. Quelques options, douces :
        </p>

        <div className="crisis-actions">
          <a href="tel:3114" className="crisis-action primary">
            <span aria-hidden="true" style={{ fontSize: 24 }}>
              ☎
            </span>
            <span style={{ flex: 1 }}>APPELER LE 3114</span>
            <span className="crisis-action-meta">Gratuit · 24h/24</span>
          </a>

          {validContacts.map((c, i) => (
            <a key={`${c.tel}-${i}`} href={`tel:${c.tel}`} className="crisis-action secondary">
              <span aria-hidden="true" style={{ fontSize: 18 }}>
                ☎
              </span>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span className="crisis-action-meta">{c.tel}</span>
            </a>
          ))}

          <button type="button" onClick={onBreath} className="crisis-action dark">
            <span aria-hidden="true">≈</span>
            <span style={{ flex: 1 }}>RESPIRER 1 MINUTE AVEC MOI</span>
          </button>
        </div>

        <p className="crisis-quote">« Je n'ai rien à prouver, là. »</p>

        <button type="button" onClick={onClose} className="crisis-later">
          Plus tard, fermer
        </button>
      </div>
    </div>
  );
}
