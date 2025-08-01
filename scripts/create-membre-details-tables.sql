CREATE TABLE IF NOT EXISTS membres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(255),
    sexe VARCHAR(10),
    nationalite VARCHAR(255),
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    profession VARCHAR(255),
    date_adhesion DATE,
    type_membre VARCHAR(50), -- e.g., "Actif", "Passif", "Honneur"
    statut VARCHAR(50), -- e.g., "Actif", "Inactif", "Suspendu"
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cartes (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    numero_carte VARCHAR(255) UNIQUE NOT NULL,
    date_emission DATE NOT NULL,
    date_expiration DATE NOT NULL,
    statut VARCHAR(50), -- e.g., "Active", "Expirée", "Perdue"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activites (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    lieu VARCHAR(255),
    statut VARCHAR(50), -- e.g., "Planifiée", "En cours", "Terminée", "Annulée"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    departement_id INTEGER NOT NULL REFERENCES departements(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nom, departement_id)
);

CREATE TABLE IF NOT EXISTS bureaux_executifs (
    id SERIAL PRIMARY KEY,
    nom_bureau VARCHAR(255) NOT NULL UNIQUE,
    date_creation DATE NOT NULL,
    date_fin_mandat DATE NOT NULL,
    statut VARCHAR(50), -- e.g., "Actif", "Inactif", "Archivé"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bureau_membres (
    id SERIAL PRIMARY KEY,
    bureau_executif_id INTEGER NOT NULL REFERENCES bureaux_executifs(id) ON DELETE CASCADE,
    membre_id INTEGER NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL,
    date_debut_role DATE NOT NULL,
    date_fin_role DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bureau_executif_id, membre_id, role)
);
