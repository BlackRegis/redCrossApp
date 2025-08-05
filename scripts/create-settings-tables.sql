CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_settings (setting_key, setting_value) VALUES
('app_name', 'Croix Rouge Congolaise - Système de Gestion')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO app_settings (setting_key, setting_value) VALUES
('contact_email', 'contact@croixrougecongo.org')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO app_settings (setting_key, setting_value) VALUES
('phone_number', '+242 06 123 4567')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO app_settings (setting_key, setting_value) VALUES
('address', '123 Rue de l''Indépendance, Brazzaville, Congo')
ON CONFLICT (setting_key) DO NOTHING;

-- Table for departments
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    head_name VARCHAR(255),
    contact_email VARCHAR(255),
    phone_number VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for arrondissements
CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, name)
);

-- Seed some initial data for departments (if not already present)
INSERT INTO departments (name, head_name, contact_email, phone_number) VALUES
('Brazzaville', 'Jean Dupont', 'brazzaville@crc.org', '+242 06 111 2233'),
('Pointe-Noire', 'Marie Curie', 'pointenoire@crc.org', '+242 06 444 5566'),
('Pool', 'Pierre Martin', 'pool@crc.org', '+242 05 777 8899')
ON CONFLICT (name) DO NOTHING;

-- Seed some initial data for arrondissements (if not already present)
-- Note: You might need to adjust department_id based on actual IDs after department insertion
INSERT INTO arrondissements (department_id, name, population) VALUES
((SELECT id FROM departments WHERE name = 'Brazzaville'), 'Moungali', 120000),
((SELECT id FROM departments WHERE name = 'Brazzaville'), 'Makélékélé', 150000),
((SELECT id FROM departments WHERE name = 'Brazzaville'), 'Poto-Poto', 100000),
((SELECT id FROM departments WHERE name = 'Pointe-Noire'), 'Lumumba', 90000),
((SELECT id FROM departments WHERE name = 'Pointe-Noire'), 'Tié-Tié', 110000),
((SELECT id FROM departments WHERE name = 'Pool'), 'Kinkala', 50000),
((SELECT id FROM departments WHERE name = 'Pool'), 'Mindouli', 40000)
ON CONFLICT (department_id, name) DO NOTHING;
