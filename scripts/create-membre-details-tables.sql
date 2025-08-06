CREATE TABLE IF NOT EXISTS membres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(50),
    departement VARCHAR(255) NOT NULL,
    arrondissement VARCHAR(255),
    statut VARCHAR(50) NOT NULL, -- e.g., 'Actif', 'Inactif', 'Suspendu'
    date_adhesion DATE,
    date_naissance DATE,
    age INTEGER,
    profession VARCHAR(255),
    type_adhesion VARCHAR(100), -- e.g., 'Membre Actif', 'Volontaire', 'Membre Bienfaiteur'
    numero_carte VARCHAR(100) UNIQUE,
    sexe VARCHAR(10), -- 'M' or 'F'
    adresse TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arrondissements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    departement_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departement_id) REFERENCES departements(id) ON DELETE CASCADE
);

-- Insert initial data for departements if table is empty
INSERT INTO departements (name)
SELECT 'Brazzaville' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Brazzaville');
INSERT INTO departements (name)
SELECT 'Pointe-Noire' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Pointe-Noire');
INSERT INTO departements (name)
SELECT 'Niari' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Niari');
INSERT INTO departements (name)
SELECT 'Kouilou' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Kouilou');
INSERT INTO departements (name)
SELECT 'Pool' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Pool');
INSERT INTO departements (name)
SELECT 'Plateaux' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Plateaux');
INSERT INTO departements (name)
SELECT 'Bouenza' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Bouenza');
INSERT INTO departements (name)
SELECT 'Lékoumou' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Lékoumou');
INSERT INTO departements (name)
SELECT 'Cuvette' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Cuvette');
INSERT INTO departements (name)
SELECT 'Sangha' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Sangha');
INSERT INTO departements (name)
SELECT 'Likouala' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Likouala');
INSERT INTO departements (name)
SELECT 'Cuvette-Ouest' WHERE NOT EXISTS (SELECT 1 FROM departements WHERE name = 'Cuvette-Ouest');

-- Insert initial data for arrondissements if table is empty
INSERT INTO arrondissements (name, departement_id)
SELECT 'Bacongo', (SELECT id FROM departements WHERE name = 'Brazzaville')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Bacongo' AND departement_id = (SELECT id FROM departements WHERE name = 'Brazzaville'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Poto-Poto', (SELECT id FROM departements WHERE name = 'Brazzaville')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Poto-Poto' AND departement_id = (SELECT id FROM departements WHERE name = 'Brazzaville'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Moungali', (SELECT id FROM departements WHERE name = 'Brazzaville')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Moungali' AND departement_id = (SELECT id FROM departements WHERE name = 'Brazzaville'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Ouenzé', (SELECT id FROM departements WHERE name = 'Brazzaville')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Ouenzé' AND departement_id = (SELECT id FROM departements WHERE name = 'Brazzaville'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Talangaï', (SELECT id FROM departements WHERE name = 'Brazzaville')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Talangaï' AND departement_id = (SELECT id FROM departements WHERE name = 'Brazzaville'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Lumumba', (SELECT id FROM departements WHERE name = 'Pointe-Noire')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Lumumba' AND departement_id = (SELECT id FROM departements WHERE name = 'Pointe-Noire'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Tié-Tié', (SELECT id FROM departements WHERE name = 'Pointe-Noire')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Tié-Tié' AND departement_id = (SELECT id FROM departements WHERE name = 'Pointe-Noire'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Mongo-Kamba', (SELECT id FROM departements WHERE name = 'Pointe-Noire')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Mongo-Kamba' AND departement_id = (SELECT id FROM departements WHERE name = 'Pointe-Noire'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Dolisie', (SELECT id FROM departements WHERE name = 'Niari')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Dolisie' AND departement_id = (SELECT id FROM departements WHERE name = 'Niari'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Nkayi', (SELECT id FROM departements WHERE name = 'Bouenza')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Nkayi' AND departement_id = (SELECT id FROM departements WHERE name = 'Bouenza'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Kinkala', (SELECT id FROM departements WHERE name = 'Pool')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Kinkala' AND departement_id = (SELECT id FROM departements WHERE name = 'Pool'));

INSERT INTO arrondissements (name, departement_id)
SELECT 'Djambala', (SELECT id FROM departements WHERE name = 'Plateaux')
WHERE NOT EXISTS (SELECT 1 FROM arrondissements WHERE name = 'Djambala' AND departement_id = (SELECT id FROM departements WHERE name = 'Plateaux'));
