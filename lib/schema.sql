-- Schéma de base de données pour l'application Croix Rouge Congo

-- Table des paramètres d'application
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    nom_organisation VARCHAR(255) NOT NULL DEFAULT 'Croix Rouge Congo',
    sigle VARCHAR(50) DEFAULT 'CRC',
    adresse_siege TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    site_web VARCHAR(255),
    description TEXT,
    couleur_primaire VARCHAR(7) DEFAULT '#DC2626',
    couleur_secondaire VARCHAR(7) DEFAULT '#1F2937',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paramètres du pays
CREATE TABLE IF NOT EXISTS pays_settings (
    id SERIAL PRIMARY KEY,
    nom_pays VARCHAR(255) NOT NULL DEFAULT 'République du Congo',
    code_pays VARCHAR(3) DEFAULT 'COG',
    capitale VARCHAR(255) DEFAULT 'Brazzaville',
    langue VARCHAR(100) DEFAULT 'Français',
    monnaie VARCHAR(100) DEFAULT 'Franc CFA',
    code_monnaie VARCHAR(3) DEFAULT 'XAF',
    fuseau_horaire VARCHAR(50) DEFAULT 'Africa/Brazzaville',
    prefixe_telephone VARCHAR(10) DEFAULT '+242',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des départements
CREATE TABLE IF NOT EXISTS departements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE,
    chef_lieu VARCHAR(255),
    population INTEGER,
    superficie DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des arrondissements
CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE,
    departement_id INTEGER REFERENCES departements(id) ON DELETE CASCADE,
    population INTEGER,
    superficie DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres
CREATE TABLE IF NOT EXISTS membres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE,
    sexe VARCHAR(10) CHECK (sexe IN ('homme', 'femme', 'autre')),
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    profession VARCHAR(255),
    departement_id INTEGER REFERENCES departements(id),
    arrondissement_id INTEGER REFERENCES arrondissements(id),
    date_adhesion DATE,
    statut VARCHAR(50) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Inactif', 'Suspendu')),
    numero_carte VARCHAR(50) UNIQUE,
    photo_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_debut DATE,
    date_fin DATE,
    lieu VARCHAR(255),
    formateur VARCHAR(255),
    certificat_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des activités
CREATE TABLE IF NOT EXISTS activites (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    lieu VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'Planifiée' CHECK (statut IN ('Planifiée', 'En cours', 'Terminée', 'Annulée')),
    participants_max INTEGER,
    budget DECIMAL(10,2),
    responsable_id INTEGER REFERENCES membres(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des participants aux activités
CREATE TABLE IF NOT EXISTS activite_participants (
    id SERIAL PRIMARY KEY,
    activite_id INTEGER REFERENCES activites(id) ON DELETE CASCADE,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    statut VARCHAR(50) DEFAULT 'Inscrit' CHECK (statut IN ('Inscrit', 'Présent', 'Absent')),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(activite_id, membre_id)
);

-- Table des cartes de membres
CREATE TABLE IF NOT EXISTS cartes_membres (
    id SERIAL PRIMARY KEY,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    numero_carte VARCHAR(50) UNIQUE NOT NULL,
    date_emission DATE NOT NULL,
    date_expiration DATE,
    statut VARCHAR(50) DEFAULT 'Active' CHECK (statut IN ('Active', 'Expirée', 'Suspendue', 'Remplacée')),
    type_carte VARCHAR(50) DEFAULT 'Standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des bureaux exécutifs
CREATE TABLE IF NOT EXISTS bureaux_executifs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('nation', 'departement', 'arrondissement')),
    niveau VARCHAR(100) NOT NULL,
    departement_id INTEGER REFERENCES departements(id) ON DELETE CASCADE,
    arrondissement_id INTEGER REFERENCES arrondissements(id) ON DELETE CASCADE,
    description TEXT,
    statut VARCHAR(50) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Inactif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres du bureau exécutif
CREATE TABLE IF NOT EXISTS bureau_membres (
    id SERIAL PRIMARY KEY,
    bureau_id INTEGER REFERENCES bureaux_executifs(id) ON DELETE CASCADE,
    membre_id INTEGER REFERENCES membres(id) ON DELETE CASCADE,
    poste VARCHAR(100) NOT NULL CHECK (poste IN ('Président', 'Vice-Président', 'Secrétaire Général', 'Secrétaire Adjoint', 'Trésorier', 'Trésorier Adjoint', 'Commissaire aux Comptes', 'Membre')),
    date_nomination DATE NOT NULL,
    date_fin_mandat DATE NOT NULL,
    statut VARCHAR(50) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Démissionnaire', 'Révocatoire')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bureau_id, poste)
);

-- Table des dons
CREATE TABLE IF NOT EXISTS dons (
    id SERIAL PRIMARY KEY,
    donateur_nom VARCHAR(255),
    donateur_email VARCHAR(255),
    montant DECIMAL(10,2) NOT NULL,
    devise VARCHAR(3) DEFAULT 'XAF',
    type_don VARCHAR(100),
    description TEXT,
    date_don DATE NOT NULL,
    statut VARCHAR(50) DEFAULT 'Reçu' CHECK (statut IN ('Reçu', 'En attente', 'Annulé')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des données initiales
INSERT INTO app_settings (nom_organisation, sigle, adresse_siege, telephone, email) 
VALUES ('Croix Rouge Congo', 'CRC', 'Brazzaville, République du Congo', '+242 06 123 4567', 'contact@croixrouge.cg')
ON CONFLICT DO NOTHING;

INSERT INTO pays_settings (nom_pays, code_pays, capitale, langue, monnaie, code_monnaie) 
VALUES ('République du Congo', 'COG', 'Brazzaville', 'Français', 'Franc CFA', 'XAF')
ON CONFLICT DO NOTHING;

-- Insertion de quelques départements de test
INSERT INTO departements (nom, code, chef_lieu, population, superficie) VALUES
('Brazzaville', 'BRA', 'Brazzaville', 2000000, 100.0),
('Pointe-Noire', 'PNR', 'Pointe-Noire', 1000000, 50.0),
('Niari', 'NIA', 'Dolisie', 500000, 25000.0),
('Pool', 'POO', 'Kinkala', 300000, 15000.0)
ON CONFLICT DO NOTHING;

-- Insertion de quelques arrondissements de test
INSERT INTO arrondissements (nom, code, departement_id, population, superficie) VALUES
('Makélékélé', 'MAK', 1, 500000, 25.0),
('Bacongo', 'BAC', 1, 300000, 15.0),
('Poto-Poto', 'POT', 1, 400000, 20.0),
('Moungali', 'MOU', 1, 200000, 10.0)
ON CONFLICT DO NOTHING; 