-- Création des tables pour les paramètres

-- Table des paramètres d'application
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    nom_organisation VARCHAR(255) NOT NULL,
    sigle VARCHAR(10),
    adresse_siege TEXT,
    telephone VARCHAR(20),
    email VARCHAR(100),
    site_web VARCHAR(100),
    description TEXT,
    logo_url VARCHAR(255),
    couleur_primaire VARCHAR(7) DEFAULT '#dc2626',
    couleur_secondaire VARCHAR(7) DEFAULT '#991b1b',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des paramètres du pays hôte
CREATE TABLE IF NOT EXISTS pays_settings (
    id SERIAL PRIMARY KEY,
    nom_pays VARCHAR(100) NOT NULL,
    code_pays VARCHAR(2) NOT NULL,
    capitale VARCHAR(100),
    langue VARCHAR(50),
    monnaie VARCHAR(50),
    code_monnaie VARCHAR(3),
    fuseau_horaire VARCHAR(10),
    prefixe_telephone VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des départements
CREATE TABLE IF NOT EXISTS departements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    chef_lieu VARCHAR(100),
    population INTEGER,
    superficie DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des arrondissements
CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    departement_id INTEGER REFERENCES departements(id) ON DELETE CASCADE,
    population INTEGER,
    superficie DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(nom, departement_id),
    UNIQUE(code, departement_id)
);

-- Insertion des données par défaut
INSERT INTO app_settings (nom_organisation, sigle, adresse_siege, telephone, email, site_web, description) 
VALUES (
    'Croix Rouge de la République du Congo',
    'CRC',
    'Avenue Félix Éboué, Brazzaville',
    '+242 123 456 789',
    'contact@croixrouge-congo.org',
    'www.croixrouge-congo.org',
    'Organisation humanitaire dédiée à l''aide aux populations vulnérables'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO pays_settings (nom_pays, code_pays, capitale, langue, monnaie, code_monnaie, fuseau_horaire, prefixe_telephone)
VALUES (
    'République du Congo',
    'CG',
    'Brazzaville',
    'Français',
    'Franc CFA',
    'XAF',
    'UTC+1',
    '+242'
) ON CONFLICT (id) DO NOTHING;

-- Insertion des départements par défaut
INSERT INTO departements (nom, code, chef_lieu, population, superficie) VALUES
('Brazzaville', 'BZV', 'Brazzaville', 1838000, 100),
('Kouilou', 'KOU', 'Pointe-Noire', 91000, 13650),
('Niari', 'NIA', 'Dolisie', 95000, 25942),
('Bouenza', 'BOU', 'Madingou', 309000, 12266),
('Pool', 'POL', 'Kinkala', 236000, 33955),
('Plateaux', 'PLA', 'Djambala', 174000, 38400)
ON CONFLICT (nom) DO NOTHING;

-- Insertion des arrondissements par défaut
INSERT INTO arrondissements (nom, code, departement_id, population) VALUES
('Bacongo', 'BCG', (SELECT id FROM departements WHERE code = 'BZV'), 156000),
('Poto-Poto', 'PTP', (SELECT id FROM departements WHERE code = 'BZV'), 134000),
('Moungali', 'MGL', (SELECT id FROM departements WHERE code = 'BZV'), 98000),
('Ouenzé', 'OUZ', (SELECT id FROM departements WHERE code = 'BZV'), 87000),
('Talangaï', 'TLG', (SELECT id FROM departements WHERE code = 'BZV'), 76000),
('Pointe-Noire', 'PTN', (SELECT id FROM departements WHERE code = 'KOU'), 234000),
('Dolisie', 'DOL', (SELECT id FROM departements WHERE code = 'NIA'), 123000),
('Nkayi', 'NKY', (SELECT id FROM departements WHERE code = 'BOU'), 89000),
('Kinkala', 'KNK', (SELECT id FROM departements WHERE code = 'POL'), 67000),
('Djambala', 'DJB', (SELECT id FROM departements WHERE code = 'PLA'), 45000)
ON CONFLICT (nom, departement_id) DO NOTHING;
