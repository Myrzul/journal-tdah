# Comment utiliser ce projet avec Claude Code

## Setup initial (à faire une fois)

1. **Place les fichiers à la racine de ton repo** :
   ```
   outilstdah/
   ├── CLAUDE.md
   ├── .claude/
   │   └── agents/
   │       ├── frontend-designer.md
   │       ├── backend-architect.md
   │       ├── db-engineer.md
   │       └── security-rgpd-auditor.md
   ├── (le reste de ton repo)
   ```

2. **Commit & push** sur GitHub.

3. **Installe Claude Code** si pas déjà fait :
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

4. **Lance Claude Code dans le dossier du repo** :
   ```bash
   cd outilstdah
   claude
   ```
   Claude Code lit automatiquement `CLAUDE.md` à chaque session et reconnaît les sub-agents dans `.claude/agents/`.

## Première session — la migration

Premier prompt à donner à Claude Code :

```
Lis CLAUDE.md, puis explore le prototype existant
(Journal TDAH.html, styles.css, *.jsx). Propose-moi un plan
de migration vers Next.js : structure de projet, ordre de
mise en place, dépendances. N'exécute rien tant que je n'ai
pas validé.
```

Il va lire la constitution, le prototype, et te proposer un plan structuré. Tu valides (ou ajustes), il exécute.

## Sessions suivantes — exemples de prompts

### Mode séquentiel (par défaut)
```
Implémente l'authentification Better Auth avec email/password
et vérification email. Suis CLAUDE.md.
```

### Mode parallèle (gain de temps sur tâches indépendantes)
```
Lance trois sub-agents en parallèle :
- frontend-designer pour créer la page profil
- backend-architect pour le router oRPC account
- db-engineer pour ajouter la table user_settings
Coordonne les trois et reporte-moi quand tout est prêt.
```

### Mode review (avant de merger)
```
Avant que je merge cette branche, lance le sub-agent
security-rgpd-auditor sur les changements et fais-moi
un rapport.
```

### Mode planning sans exécution
```
Si je voulais ajouter une feature de partage de journal
avec un thérapeute (lecture seule, lien expirable), comment
tu structurerais ça ? Plan détaillé, sans implémenter.
```

## Bonnes pratiques

- **Toujours valider le plan** avant que Claude Code parte sur du gros boulot
- **Petits commits fréquents** > gros commits massifs
- **Une feature = une branche** > merger sur main directement
- **Si quelque chose te paraît bizarre** dans ce que Claude propose → demande-lui d'expliquer avant de valider
- **Tu peux mettre à jour CLAUDE.md** au fil du projet quand de nouvelles règles émergent — c'est fait pour évoluer

## Coût des agents parallèles

Lancer 3 sub-agents en parallèle ≈ 3× le coût d'une seule session sur les tokens. Avec un plan Claude Max, c'est gérable. Avec Pro, garde un usage modéré et privilégie le séquentiel pour les tâches courtes.

Tu peux mettre une tâche en background avec **Ctrl+B** pendant qu'elle tourne, et continuer à prompt sur autre chose.

## Si tu te perds

```
/agents
```
liste les sub-agents disponibles dans le projet.

```
/help
```
liste les commandes Claude Code.

Pour réinitialiser le contexte d'une conversation qui dérive :
```
/clear
```
Claude Code repartira propre, mais relira CLAUDE.md.
