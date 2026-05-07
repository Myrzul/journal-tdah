# CLAUDE.md — Constitution du projet Journal

> Ce fichier est lu par Claude Code à chaque session. Il définit le contexte, les standards techniques, les règles de design et les non-négociables. Toute déviation doit être explicitement validée par l'humain avant exécution.

---

## 1. Contexte

**Projet :** Journal — application web mobile compagnon du guide *Apprivoiser son TDAH*.
**Domaine de production :** `journal.symbiose-psychologie.com`
**Porteur :** Symbiose Psychologie SARL (Baptiste Marrillet, psychologue spécialisé en neuropsychologie).
**Public :** acheteurs adultes francophones du guide. Présence d'un TDAH probable mais non requise.
**Modèle :** offert avec l'achat du guide (59€ sur Podia). Pas d'inscription libre.
**Mission de l'app :** journal de bord interactif, modulaire, sécurisé, qui aide à externaliser la charge mentale, suivre son fonctionnement et identifier ses patterns.

**État actuel du repo :** prototype React via Babel-standalone (CDN) — `Journal TDAH.html`, `styles.css`, `*.jsx`. À migrer vers une vraie app Next.js conforme à cette constitution. Le design existant est la **référence absolue** : la migration ne le modifie pas, elle l'incarne dans la nouvelle stack.

---

## 2. Stack technique — ce que tu dois maîtriser impeccablement

### Framework & rendering
- **Next.js 15+** (App Router uniquement, jamais Pages Router)
- **React 19+** avec Server Components par défaut, Client Components seulement quand nécessaire (interactivité, hooks, browser APIs)
- **TypeScript strict** — `strict: true`, `noUncheckedIndexedAccess: true`, pas de `any` sauf cas dûment justifié et commenté

### Données & API
- **Neon Postgres** région **eu-central-1 (Frankfurt)** — non négociable, RGPD
- **Drizzle ORM** + drizzle-kit pour migrations (jamais de SQL brut sauf cas extrêmes documentés)
- **oRPC** pour la couche API typesafe entre client et serveur
- **TanStack Query** (intégré via oRPC) pour le cache serveur côté client
- **Zod** pour la validation, schémas partagés client/serveur

### Auth & sécurité
- **Better Auth** — email + password + 2FA TOTP optionnelle
- Vérification email obligatoire à la première connexion
- Sessions 30 jours avec rotation
- Hash mots de passe : argon2id (défaut Better Auth)
- Rate limiting sur tous les endpoints sensibles

### Styling & UI
- **Tailwind CSS v4** (CSS-first config, intègre les CSS variables existantes)
- **shadcn/ui** parcimonieusement — uniquement Dialog, Sheet, Tooltip, Popover, Input, Button, et les restyler selon la charte
- **Framer Motion** pour les animations (page transitions, mascot bounce, dominant color change)
- **Lucide React** pour les icônes système. Les mascots et l'umbrella sont des SVG custom (à préserver tels quels).

### Stockage & assets
- **Vercel Blob** pour les fichiers (exports PDF/ZIP, futurs uploads)
- Images statiques via `next/image`, fonts via `next/font` (Archivo Black, Archivo Narrow, Inter, Caveat)

### Email
- **Resend** pour les emails transactionnels (invitation, vérification, reset)
- Templates en React (`@react-email/components`)
- Emails envoyés depuis un domaine vérifié (DKIM, SPF, DMARC)

### Hébergement & infra
- **Vercel** régions UE (à configurer explicitement, pas le défaut)
- **Variables d'environnement** : Vercel env, jamais en clair dans le repo, jamais commitées
- **Webhooks** : Podia → `/api/webhooks/podia` avec vérification de signature

### Testing & qualité
- **Vitest** pour les tests unitaires (logique métier, validation, helpers)
- **Playwright** pour E2E (flux critiques uniquement : signup, login, journal, export, suppression)
- **Biome** pour linting + formatting (config unique, plus rapide qu'ESLint+Prettier)
- **TypeScript** : aucun `tsc` error toléré sur main

### Monitoring
- **Sentry** pour les erreurs (avec PII filtering strict)
- **Vercel Analytics** : OFF au MVP (pas de tracking, pas de cookie banner nécessaire)

### Génération PDF
- **@react-pdf/renderer** pour l'export RGPD (compatible serverless Vercel)

### Forms & dates
- **react-hook-form** + Zod resolver
- **date-fns** avec locale `fr` pour toute manipulation de date

---

## 3. Design system — la charte est sacrée

### Principe absolu
Le design existant (cf. `styles.css` du prototype + extraction de la charte du guide *Apprivoiser son TDAH*) est **la référence**. Toute proposition de design qui s'en écarte doit être explicitement validée par l'humain avant implémentation. Tu ne fais pas de "modernisation" silencieuse, tu n'introduis pas de nouvelles couleurs, tu n'inventes pas de typographies.

### Tokens à respecter (extraits)

```css
/* Palette par chapitre — utilisée comme accent par section de l'app */
--ch-observer: #1B4FE5;       /* Bleu cobalt */
--ch-soin: #B05BC9;           /* Violet/lavande */
--ch-emotions: #FF8AB8;       /* Rose bonbon */
--ch-attention: #FF1F8F;      /* Magenta vif */
--ch-motivation: #E8294E;     /* Rouge corail */
--ch-temps: #F26B2C;          /* Orange */
--ch-environnement: #F0B340;  /* Jaune moutarde */
--ch-interactions: #4DD0B0;   /* Vert menthe */
--ch-evolution: #14B8A6;      /* Turquoise */
--ch-controle: #1FBF7A;       /* Vert émeraude */

/* Système */
--ink: #0E0E10;
--paper: #F4F1EA;
--surface: #FFFFFF;
--surface-alt: #F4F4F2;

/* Typo */
--font-display: 'Archivo Black', system-ui, sans-serif;
--font-cond: 'Archivo Narrow', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-hand: 'Caveat', cursive;

/* Rayons */
--r-md: 12px; --r-lg: 20px; --r-xl: 28px;
--r-2xl: 36px; --r-3xl: 48px; --r-pill: 999px;
```

### Signatures visuelles non négociables

1. **Couleur dominante par section** — chaque onglet/section a SA couleur, qui teinte le header et certains accents. Variable CSS `--dominant` mise à jour dynamiquement.
2. **Header full-bleed coloré** avec parapluie + numéro de section + monstre mascotte par tab.
3. **Typographie display Archivo Black** très compressée pour les H1/H2 — déclarative, en MAJUSCULES.
4. **Typographie eyebrow** (lettrée espacée, `letter-spacing: 0.18em`) pour les titres de section.
5. **Cards arrondies généreusement** (28-36px de border-radius) avec ombre douce.
6. **Bulles manuscrites en Caveat** pour les questions adressées au lecteur ("Quels sont mes symptômes à moi ?").
7. **Mascots monstres** en SVG noir avec joues roses — préservées telles quelles depuis `monsters.jsx`.
8. **Parapluie** comme signature graphique (umbrella component existant).

### UX TDAH-aware — règles de fond

- **Une action principale par écran**, pas de surcharge cognitive
- **Sauvegarde automatique** (debounce 800ms à 1s), jamais de bouton "Enregistrer" obligatoire
- **Aucune validation bloquante** — l'utilisateur peut quitter à tout moment, on garde son brouillon
- **Aucun streak punitif** — pas de "vous avez rompu votre série de 12 jours". Interdit. Ce serait contre-thérapeutique.
- **Feedback discret** — petite animation à la sauvegarde, pas de pop-up
- **Mobile-first strict** — design pensé pour 375px, le desktop est un bonus
- **Accessibilité WCAG 2.1 AA minimum** — contraste, focus visible, ARIA labels, navigation clavier

### Animations
- Transitions de tabs : fade + translate Y léger via Framer Motion
- Monstre mascotte : bounce 800ms à chaque changement d'onglet
- Header : transition de couleur dominante 500ms ease
- Apparitions au scroll : `IntersectionObserver` + Framer Motion `whileInView`
- Pas d'animations infinies, pas de carrousels auto-play (anxiogène)

---

## 4. Sécurité & RGPD — non négociable

### Catégorie de données
L'app traite des **données de santé au sens article 9 du RGPD**. Conséquences :
- Base légale : consentement explicite à l'inscription (case à cocher non pré-cochée)
- Politique de confidentialité doit explicitement mentionner art. 9
- Registre des traitements obligatoire
- DPO probable (à valider juridiquement)

### Règles techniques absolues

1. **Toute page applicative est derrière l'auth.** Routes publiques uniquement : landing/marketing, login, signup-via-invitation, reset, pages légales.
2. **Toute requête serveur valide l'utilisateur connecté ET son ownership des ressources.** Jamais de `WHERE id = ?` sans `AND user_id = currentUser.id`.
3. **Jamais de logs avec contenu utilisateur.** Filtrer le PII dans Sentry.
4. **Jamais de secrets en clair dans le code.** Variables d'environnement uniquement.
5. **CSP headers stricts** — pas de `unsafe-inline`, pas de `unsafe-eval`.
6. **Cookies de session** — `httpOnly`, `secure`, `sameSite: strict`.
7. **Rate limiting** — login (5/min), signup (3/h), reset (3/h), export (3/jour).
8. **Validation Zod systématique** sur toute entrée externe (form, query param, body).
9. **Pas d'IA sur les données utilisateur** sans consentement explicite séparé. Pas de feature "résumé IA de ton journal" au MVP, point.
10. **Hard delete = vraiment hard.** Suppression de compte = effacement de toutes les données utilisateur dans toutes les tables, sans soft delete préalable.

### Export RGPD
- Bouton "Télécharger mes données" dans le profil
- Génère un ZIP avec : `data.json` (toutes les données structurées) + `journal.pdf` (mise en page lisible)
- Logger l'événement (`ExportLog`) sans logger le contenu
- Lien de téléchargement valable 24h via Vercel Blob signed URL

### Suppression de compte
- Confirmation triple : mot de passe + email tapé + phrase "supprimer définitivement mon compte" tapée
- Hard delete immédiat dans toutes les tables (utiliser cascading deletes ou un service de suppression atomique)
- Email de confirmation post-suppression (à l'adresse précédente)
- Documenter la rétention dans les backups Neon (max 30 jours)

---

## 5. Conventions de code

### Structure de dossiers
```
src/
  app/                    # App Router pages
    (auth)/               # Login, signup, reset
    (app)/                # Pages applicatives (protégées)
    api/                  # Routes API (webhooks, etc.)
  components/
    ui/                   # shadcn primitives restylées
    journal/              # Composants spécifiques au journal
    monsters/             # SVG mascots
    layout/               # Header, nav, footer
  lib/
    db/                   # Schema Drizzle, queries
    auth/                 # Better Auth config
    rpc/                  # oRPC routers
    validations/          # Schemas Zod
    utils/                # Helpers
  styles/
    globals.css           # Tokens + reset
  emails/                 # Templates Resend
```

### Conventions
- **Nommage fichiers** : `kebab-case.tsx` pour les composants, `kebab-case.ts` pour le reste
- **Nommage composants** : `PascalCase`
- **Nommage hooks** : `useFooBar`
- **Nommage routes oRPC** : `domain.action` (ex : `journal.createMorningEntry`)
- **Imports** : absolus avec `@/` alias, jamais de relatifs `../../..`
- **Pas de barrel files** (`index.ts` qui réexporte) — ralentit le tree-shaking
- **Server Components par défaut**, "use client" minimal

### Git
- Branche principale : `main` (protégée)
- Branches de feature : `feat/nom-court`, `fix/nom-court`, `chore/nom-court`
- Commits : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- Une PR = une feature ou un fix. Petites PRs préférées.
- Ne jamais push direct sur main.

---

## 6. Workflow avec Baptiste

- **Tu ne décides jamais d'une feature.** Si tu vois un manque, tu le signales et tu attends.
- **Avant un changement structurel** (schéma DB, ajout de dépendance majeure, refonte de pattern) → tu demandes confirmation avec un résumé court.
- **Après un changement** → tu indiques précisément ce qui a changé, ce qui pourrait casser, et ce que Baptiste doit tester.
- **En cas de doute** → tu poses la question plutôt que de partir sur une supposition.
- **Tu mets à jour ce fichier CLAUDE.md** quand de nouvelles conventions sont décidées au fil du projet.

---

## 7. Sub-agents

Le projet définit 4 sub-agents spécialisés dans `.claude/agents/`. Tu les invoques quand pertinent :

- `frontend-designer` — pour tout travail sur le design, composants UI, animations, accessibility
- `backend-architect` — pour les API, server actions, oRPC routers, Better Auth
- `db-engineer` — pour les schémas Drizzle, migrations, queries complexes
- `security-rgpd-auditor` — review systématique avant chaque PR sur des fonctionnalités sensibles

Pour les tâches indépendantes (frontend d'un module + backend d'un autre, par exemple) : **tu lances en parallèle** plutôt que séquentiel. Pour les chaînes (DB → API → UI), tu fais en séquence.

---

## 8. Première mission

À la première session, tu dois :

1. Lire intégralement ce fichier
2. Lire les fichiers du prototype existant (`Journal TDAH.html`, `styles.css`, `*.jsx`) pour comprendre le design cible
3. Proposer (sans exécuter) un plan de migration vers Next.js : structure de projet, ordre de mise en place, dépendances à installer, points de vigilance
4. Attendre validation de Baptiste avant de toucher à quoi que ce soit

**Tu ne fais rien d'irréversible sans accord explicite.**

---

*Fin de la constitution. Dernière mise à jour : initialisation du projet.*
