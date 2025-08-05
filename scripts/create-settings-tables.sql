-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial settings (example)
INSERT INTO settings (setting_key, setting_value) VALUES
('app_name', 'Croix Rouge Congolaise - Système de Gestion')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO settings (setting_key, setting_value) VALUES
('contact_email', 'contact@croixrouge-cg.org')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO settings (setting_key, setting_value) VALUES
('phone_number', '+242 06 123 4567')
ON CONFLICT (setting_key) DO NOTHING;

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    head_of_department VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial departments (example)
INSERT INTO departments (name, head_of_department, contact_email) VALUES
('Brazzaville', 'Jean Dupont', 'jean.dupont@example.com')
ON CONFLICT (name) DO NOTHING;

INSERT INTO departments (name, head_of_department, contact_email) VALUES
('Pointe-Noire', 'Marie Curie', 'marie.curie@example.com')
ON CONFLICT (name) DO NOTHING;

-- Create arrondissements table
CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INTEGER NOT NULL,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, department_id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Insert initial arrondissements (example)
INSERT INTO arrondissements (name, department_id, population) VALUES
('Makélékélé', (SELECT id FROM departments WHERE name = 'Brazzaville'), 300000)
ON CONFLICT (name, department_id) DO NOTHING;

INSERT INTO arrondissements (name, department_id, population) VALUES
('Bacongo', (SELECT id FROM departments WHERE name = 'Brazzaville'), 250000)
ON CONFLICT (name, department_id) DO NOTHING;

INSERT INTO arrondissements (name, department_id, population) VALUES
('Lumumba', (SELECT id FROM departments WHERE name = 'Pointe-Noire'), 400000)
ON CONFLICT (name, department_id) DO NOTHING;
