CREATE TABLE IF NOT EXISTS red_cross_colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hex_code VARCHAR(7) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT
);

CREATE TABLE IF NOT EXISTS departements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    departement_id INTEGER NOT NULL REFERENCES departements(id) ON DELETE CASCADE,
    UNIQUE(nom, departement_id)
);

CREATE TABLE IF NOT EXISTS membres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(255),
    sexe VARCHAR(10),
    nationalite VARCHAR(255),
    adresse VARCHAR(255),
    telephone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    profession VARCHAR(255),
    date_adhesion DATE NOT NULL DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Actif',
    departement_id INTEGER REFERENCES departements(id) ON DELETE SET NULL,
    arrondissement_id INTEGER REFERENCES arrondissements(id) ON DELETE SET NULL,
    photo_url TEXT,
    numero_carte VARCHAR(50) UNIQUE,
    date_delivrance_carte DATE,
    date_expiration_carte DATE
);

CREATE TABLE IF NOT EXISTS executive_bureaus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bureau_members (
    id SERIAL PRIMARY KEY,
    bureau_id INTEGER NOT NULL REFERENCES executive_bureaus(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    UNIQUE(bureau_id, member_id, role)
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Planned'
);

CREATE TABLE IF NOT EXISTS activity_participants (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    role VARCHAR(255),
    UNIQUE(activity_id, member_id)
);
