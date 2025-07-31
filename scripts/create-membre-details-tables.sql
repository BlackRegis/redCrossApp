-- Tables pour les détails des membres

-- Table des formations des membres
CREATE TABLE IF NOT EXISTS formations (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    organisme VARCHAR(255),
    date_debut DATE,
    date_fin DATE,
    certificat BOOLEAN DEFAULT FALSE,
    domaine VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des participations aux activités
CREATE TABLE IF NOT EXISTS activite_participants (
    id SERIAL PRIMARY KEY,
    activite_id INTEGER REFERENCES activites(id) ON DELETE CASCADE,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    role VARCHAR(100),
    statut VARCHAR(50) DEFAULT 'Participé',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(activite_id, membre_id)
);

-- Table des distinctions
CREATE TABLE IF NOT EXISTS distinctions (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_obtention DATE,
    niveau VARCHAR(50) DEFAULT 'Local',
    organisme_delivrant VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table de l'historique des statuts
CREATE TABLE IF NOT EXISTS historique_statuts (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    ancien_statut VARCHAR(50),
    nouveau_statut VARCHAR(50),
    date_changement TIMESTAMP DEFAULT NOW(),
    motif TEXT,
    auteur VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ajout de colonnes supplémentaires à la table membres
ALTER TABLE membres ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(255);
ALTER TABLE membres ADD COLUMN IF NOT EXISTS situation_matrimoniale VARCHAR(50);
ALTER TABLE membres ADD COLUMN IF NOT EXISTS nombre_enfants INTEGER DEFAULT 0;
ALTER TABLE membres ADD COLUMN IF NOT EXISTS niveau_etude VARCHAR(255);
ALTER TABLE membres ADD COLUMN IF NOT EXISTS competences TEXT[];
ALTER TABLE membres ADD COLUMN IF NOT EXISTS langues TEXT[];
ALTER TABLE membres ADD COLUMN IF NOT EXISTS est_membre_bureau BOOLEAN DEFAULT FALSE;
ALTER TABLE membres ADD COLUMN IF NOT EXISTS poste_bureau VARCHAR(100);
ALTER TABLE membres ADD COLUMN IF NOT EXISTS niveau_bureau VARCHAR(50);
ALTER TABLE membres ADD COLUMN IF NOT EXISTS date_nomination_bureau DATE;
ALTER TABLE membres ADD COLUMN IF NOT EXISTS mandat_fin_bureau DATE;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_formations_membre_id ON formations(membre_id);
CREATE INDEX IF NOT EXISTS idx_activite_participants_membre_id ON activite_participants(membre_id);
CREATE INDEX IF NOT EXISTS idx_distinctions_membre_id ON distinctions(membre_id);
CREATE INDEX IF NOT EXISTS idx_historique_statuts_membre_id ON historique_statuts(membre_id);
