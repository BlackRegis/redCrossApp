CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    nationality VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    profession VARCHAR(255),
    blood_group VARCHAR(10),
    allergies TEXT,
    medical_history TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    membership_date DATE,
    membership_type VARCHAR(50), -- e.g., 'Actif', 'Bénévole', 'Donateur'
    department VARCHAR(255),
    arrondissement VARCHAR(255),
    status VARCHAR(50), -- e.g., 'Actif', 'Inactif', 'Suspendu'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for frequently searched columns
CREATE INDEX IF NOT EXISTS idx_members_last_name ON members (last_name);
CREATE INDEX IF NOT EXISTS idx_members_department ON members (department);
CREATE INDEX IF NOT EXISTS idx_members_arrondissement ON members (arrondissement);
CREATE INDEX IF NOT EXISTS idx_members_status ON members (status);

-- Table for member cards
CREATE TABLE IF NOT EXISTS member_cards (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    card_number VARCHAR(255) UNIQUE NOT NULL,
    card_type VARCHAR(50) NOT NULL, -- e.g., 'Standard', 'Premium'
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'Active', 'Expired', 'Revoked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for member_id in member_cards
CREATE INDEX IF NOT EXISTS idx_member_cards_member_id ON member_cards (member_id);

-- Seed some initial data for members (if not already present)
INSERT INTO members (
    first_name, last_name, date_of_birth, place_of_birth, nationality, address,
    phone, email, profession, blood_group, allergies, medical_history,
    emergency_contact_name, emergency_contact_phone,
    membership_date, membership_type, department, arrondissement, status
) VALUES
('John', 'Doe', '1990-05-15', 'Brazzaville', 'Congolaise', '123 Rue de la Paix, Moungali',
 '+242 06 123 4567', 'john.doe@example.com', 'Ingénieur', 'A+', 'Aucune', 'Aucun',
 'Jane Doe', '+242 05 765 4321',
 '2020-01-10', 'Actif', 'Brazzaville', 'Moungali', 'Actif')
ON CONFLICT (email) DO NOTHING;

INSERT INTO members (
    first_name, last_name, date_of_birth, place_of_birth, nationality, address,
    phone, email, profession, blood_group, allergies, medical_history,
    emergency_contact_name, emergency_contact_phone,
    membership_date, membership_type, department, arrondissement, status
) VALUES
('Alice', 'Smith', '1988-11-22', 'Pointe-Noire', 'Congolaise', '456 Avenue des Martyrs, Lumumba',
 '+242 05 987 6543', 'alice.smith@example.com', 'Médecin', 'O-', 'Pénicilline', 'Asthme',
 'Bob Smith', '+242 06 111 2233',
 '2019-03-01', 'Bénévole', 'Pointe-Noire', 'Lumumba', 'Actif')
ON CONFLICT (email) DO NOTHING;

INSERT INTO members (
    first_name, last_name, date_of_birth, place_of_birth, nationality, address,
    phone, email, profession, blood_group, allergies, medical_history,
    emergency_contact_name, emergency_contact_phone,
    membership_date, membership_type, department, arrondissement, status
) VALUES
('Robert', 'Brown', '1995-07-01', 'Dolisie', 'Congolaise', '789 Rue du Marché, Tié-Tié',
 '+242 06 222 3344', 'robert.brown@example.com', 'Étudiant', 'B+', 'Aucune', 'Aucun',
 'Sarah Brown', '+242 05 444 5566',
 '2021-09-15', 'Donateur', 'Pointe-Noire', 'Tié-Tié', 'Actif')
ON CONFLICT (email) DO NOTHING;

-- Seed some initial data for member cards (if not already present)
INSERT INTO member_cards (member_id, card_number, card_type, issue_date, expiry_date, status) VALUES
((SELECT id FROM members WHERE email = 'john.doe@example.com'), 'CRC-M-001', 'Standard', '2023-01-15', '2025-01-15', 'Active')
ON CONFLICT (card_number) DO NOTHING;

INSERT INTO member_cards (member_id, card_number, card_type, issue_date, expiry_date, status) VALUES
((SELECT id FROM members WHERE email = 'alice.smith@example.com'), 'CRC-B-002', 'Premium', '2023-03-01', '2025-03-01', 'Active')
ON CONFLICT (card_number) DO NOTHING;

INSERT INTO member_cards (member_id, card_number, card_type, issue_date, expiry_date, status) VALUES
((SELECT id FROM members WHERE email = 'robert.brown@example.com'), 'CRC-D-003', 'Standard', '2023-09-10', '2024-09-10', 'Expired')
ON CONFLICT (card_number) DO NOTHING;
