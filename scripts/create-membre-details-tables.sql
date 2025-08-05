CREATE TABLE IF NOT EXISTS formations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membre_id UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    organisme VARCHAR(255),
    date_debut DATE,
    date_fin DATE,
    certificat BOOLEAN DEFAULT FALSE,
    domaine VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS activites_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membre_id UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    date DATE,
    role VARCHAR(100),
    statut VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS distinctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membre_id UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_obtention DATE,
    niveau VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS historique_statut (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membre_id UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    ancien_statut VARCHAR(50),
    nouveau_statut VARCHAR(50) NOT NULL,
    date_changement TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    motif TEXT,
    auteur VARCHAR(255)
);
