# 🗄️ Configuration de la Base de Données PostgreSQL

## 📋 Prérequis

### Option 1: Vercel Postgres (Recommandé pour le déploiement)

1. **Créer un projet Vercel**
   ```bash
   # Installer Vercel CLI
   npm i -g vercel
   
   # Se connecter à Vercel
   vercel login
   
   # Créer un projet
   vercel
   ```

2. **Ajouter Vercel Postgres**
   - Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sélectionner votre projet
   - Aller dans l'onglet "Storage"
   - Cliquer sur "Create Database" → "Postgres"
   - Suivre les instructions

3. **Variables d'environnement automatiques**
   - `POSTGRES_URL` sera automatiquement configuré
   - Aucune configuration supplémentaire nécessaire

### Option 2: PostgreSQL Local

1. **Installer PostgreSQL**
   ```bash
   # Windows (avec Chocolatey)
   choco install postgresql
   
   # macOS (avec Homebrew)
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Créer la base de données**
   ```bash
   # Se connecter à PostgreSQL
   sudo -u postgres psql
   
   # Créer la base de données
   CREATE DATABASE redcross_db;
   
   # Créer un utilisateur
   CREATE USER redcross_user WITH PASSWORD 'votre_mot_de_passe';
   
   # Donner les permissions
   GRANT ALL PRIVILEGES ON DATABASE redcross_db TO redcross_user;
   
   # Quitter
   \q
   ```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env.local` :
   ```env
   POSTGRES_URL="postgresql://redcross_user:votre_mot_de_passe@localhost:5432/redcross_db"
   POSTGRES_HOST="localhost"
   POSTGRES_DATABASE="redcross_db"
   POSTGRES_USERNAME="redcross_user"
   POSTGRES_PASSWORD="votre_mot_de_passe"
   ```

### Option 3: Services Cloud

#### **Neon (PostgreSQL Serverless)**
1. Aller sur [neon.tech](https://neon.tech)
2. Créer un compte et un projet
3. Copier l'URL de connexion
4. Configurer `POSTGRES_URL` dans les variables d'environnement

#### **Supabase**
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un projet
3. Aller dans Settings → Database
4. Copier l'URL de connexion
5. Configurer `POSTGRES_URL` dans les variables d'environnement

## 🚀 Installation et Migration

### 1. Installer les dépendances
```bash
pnpm install
```

### 2. Tester la connexion
```bash
pnpm db:test
```

### 3. Exécuter les migrations
```bash
pnpm db:migrate
```

### 4. Vérifier les tables créées
```bash
# Se connecter à la base de données
psql $POSTGRES_URL

# Lister les tables
\dt

# Vérifier les données
SELECT * FROM app_settings;
SELECT * FROM departements;
```

## 📊 Structure de la Base de Données

### Tables principales :
- **`app_settings`** - Paramètres de l'application
- **`pays_settings`** - Paramètres du pays
- **`departements`** - Départements du Congo
- **`arrondissements`** - Arrondissements
- **`membres`** - Membres de la Croix Rouge
- **`formations`** - Formations des membres
- **`activites`** - Activités organisées
- **`activite_participants`** - Participants aux activités
- **`cartes_membres`** - Cartes de membres
- **`dons`** - Dons reçus

### Relations :
- Un département peut avoir plusieurs arrondissements
- Un membre appartient à un département et un arrondissement
- Un membre peut avoir plusieurs formations
- Une activité peut avoir plusieurs participants
- Un membre peut avoir plusieurs cartes

## 🔧 Développement

### Mode développement avec mock
Si vous n'avez pas de base de données configurée, l'application utilise un mock :

```typescript
// lib/db.ts
import { sql } from '@vercel/postgres'

// En cas d'erreur de connexion, utiliser le mock
export const sql = process.env.POSTGRES_URL 
  ? require('@vercel/postgres').sql
  : mockSql
```

### Variables d'environnement de développement
```env
# .env.local
POSTGRES_URL="postgresql://..."
NEXT_PUBLIC_APP_NAME="Croix Rouge Congo"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚀 Déploiement

### Vercel
1. Pousser le code sur GitHub
2. Connecter le repository à Vercel
3. Ajouter Vercel Postgres dans le projet
4. Les variables d'environnement seront automatiquement configurées

### Autres plateformes
1. Configurer les variables d'environnement `POSTGRES_URL`
2. Exécuter les migrations : `pnpm db:migrate`
3. Déployer l'application

## 🛠️ Maintenance

### Sauvegardes
```bash
# Sauvegarder la base de données
pg_dump $POSTGRES_URL > backup.sql

# Restaurer la base de données
psql $POSTGRES_URL < backup.sql
```

### Monitoring
- Vérifier les logs de connexion
- Surveiller les performances des requêtes
- Maintenir les index sur les colonnes fréquemment utilisées

## 🔒 Sécurité

### Bonnes pratiques
- Ne jamais commiter les mots de passe dans le code
- Utiliser des variables d'environnement
- Limiter les permissions de l'utilisateur de base de données
- Faire des sauvegardes régulières
- Utiliser des connexions SSL en production

### Variables sensibles
```env
# Ne jamais commiter ces valeurs
POSTGRES_URL="postgresql://user:password@host:port/database"
POSTGRES_PASSWORD="votre_mot_de_passe_secret"
``` 