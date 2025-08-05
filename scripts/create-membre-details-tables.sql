-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE,
    sexe VARCHAR(50),
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    profession VARCHAR(255),
    departement VARCHAR(255),
    arrondissement VARCHAR(255),
    date_adhesion DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Actif', -- e.g., Actif, Inactif, Suspendu
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Planifiée', -- e.g., Planifiée, Terminée, Annulée
    participants_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create executive_members table
CREATE TABLE IF NOT EXISTS executive_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create member_cards table
CREATE TABLE IF NOT EXISTS member_cards (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'Active', -- e.g., Active, Expirée, Perdue
    card_type VARCHAR(50), -- e.g., Standard, Premium
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Insert initial members (example)
INSERT INTO members (nom, prenom, date_naissance, sexe, adresse, telephone, email, profession, departement, arrondissement, date_adhesion, statut, notes) VALUES
('Kouadio', 'Marc', '1990-05-15', 'Homme', '123 Rue de la Paix, Brazzaville', '+242 06 111 2233', 'marc.kouadio@example.com', 'Ingénieur', 'Brazzaville', 'Makélékélé', '2020-01-10', 'Actif', 'Membre très engagé dans les activités de sensibilisation.')
ON CONFLICT (email) DO NOTHING;

INSERT INTO members (nom, prenom, date_naissance, sexe, adresse, telephone, email, profession, departement, arrondissement, date_adhesion, statut, notes) VALUES
('Diallo', 'Fatoumata', '1988-11-22', 'Femme', '456 Avenue de l''Espoir, Pointe-Noire', '+242 05 444 5566', 'fatoumata.diallo@example.com', 'Infirmière', 'Pointe-Noire', 'Lumumba', '2019-03-20', 'Actif', 'Spécialisée en premiers secours, formatrice bénévole.')
ON CONFLICT (email) DO NOTHING;

-- Insert initial activities (example)
INSERT INTO activities (name, description, activity_date, location, status, participants_count) VALUES
('Campagne de Don de Sang', 'Collecte de sang pour les hôpitaux locaux.', '2024-07-15', 'Hôpital Central', 'Terminée', 120)
ON CONFLICT DO NOTHING;

INSERT INTO activities (name, description, activity_date, location, status, participants_count) VALUES
('Formation Premiers Secours', 'Formation certifiante aux gestes de premiers secours.', '2024-08-01', 'Centre Communautaire', 'Planifiée', 30)
ON CONFLICT DO NOTHING;

-- Insert initial executive members (example)
INSERT INTO executive_members (name, title, email, phone, bio) VALUES
('Dr. Émile Ngoma', 'Président National', 'emile.ngoma@example.com', '+242 06 123 4567', 'Leader expérimenté de la Croix Rouge Congolaise.')
ON CONFLICT (email) DO NOTHING;

INSERT INTO executive_members (name, title, email, phone, bio) VALUES
('Mme. Chantal Mboumba', 'Secrétaire Générale', 'chantal.mboumba@example.com', '+242 06 765 4321', 'Responsable de l''administration et de la coordination.')
ON CONFLICT (email) DO NOTHING;

-- Insert initial member cards (example)
INSERT INTO member_cards (member_id, card_number, issue_date, expiry_date, status, card_type) VALUES
((SELECT id FROM members WHERE email = 'marc.kouadio@example.com'), 'CRC-2020-001', '2020-01-10', '2025-01-10', 'Active', 'Standard')
ON CONFLICT (card_number) DO NOTHING;

INSERT INTO member_cards (member_id, card_number, issue_date, expiry_date, status, card_type) VALUES
((SELECT id FROM members WHERE email = 'fatoumata.diallo@example.com'), 'CRC-2019-002', '2019-03-20', '2024-03-20', 'Expirée', 'Premium')
ON CONFLICT (card_number) DO NOTHING;
