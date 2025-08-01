INSERT INTO red_cross_colors (name, hex_code) VALUES
('Red', '#ED1C24')
ON CONFLICT (name) DO UPDATE SET hex_code = EXCLUDED.hex_code;

INSERT INTO app_settings (setting_key, setting_value) VALUES
('app_name', 'Croix-Rouge Congolaise'),
('contact_email', 'contact@croixrouge.cg'),
('phone_number', '+242060000000')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

INSERT INTO departements (nom) VALUES
('Brazzaville'),
('Pointe-Noire'),
('Niari')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO arrondissements (nom, departement_id) VALUES
('Makélékélé', (SELECT id FROM departements WHERE nom = 'Brazzaville')),
('Bacongo', (SELECT id FROM departements WHERE nom = 'Brazzaville')),
('Tié-Tié', (SELECT id FROM departements WHERE nom = 'Pointe-Noire'))
ON CONFLICT (nom, departement_id) DO NOTHING;

INSERT INTO membres (nom, prenom, date_naissance, lieu_naissance, sexe, nationalite, adresse, telephone, email, profession, departement_id, arrondissement_id, photo_url, numero_carte, date_delivrance_carte, date_expiration_carte) VALUES
('Doe', 'John', '1990-05-15', 'Brazzaville', 'M', 'Congolaise', '123 Rue de la Paix', '+242061234567', 'john.doe@example.com', 'Ingénieur', (SELECT id FROM departements WHERE nom = 'Brazzaville'), (SELECT id FROM arrondissements WHERE nom = 'Makélékélé'), '/placeholder.svg?height=100&width=100', 'CRC-001-2023', '2023-01-01', '2024-12-31')
ON CONFLICT (email) DO NOTHING;

INSERT INTO executive_bureaus (name, start_date, end_date, is_active) VALUES
('Bureau Exécutif 2023-2025', '2023-01-01', '2025-12-31', TRUE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO bureau_members (bureau_id, member_id, role, start_date, end_date) VALUES
((SELECT id FROM executive_bureaus WHERE name = 'Bureau Exécutif 2023-2025'), (SELECT id FROM membres WHERE email = 'john.doe@example.com'), 'Président', '2023-01-01', '2025-12-31')
ON CONFLICT (bureau_id, member_id, role) DO NOTHING;

INSERT INTO activities (name, description, start_date, end_date, location, status) VALUES
('Campagne de Don de Sang', 'Collecte de sang dans plusieurs quartiers de Brazzaville.', '2024-03-10', '2024-03-12', 'Brazzaville', 'Completed'),
('Formation Premiers Secours', 'Formation certifiante aux premiers secours pour les nouveaux membres.', '2024-04-05', '2024-04-07', 'Pointe-Noire', 'Planned')
ON CONFLICT (name) DO NOTHING;

INSERT INTO activity_participants (activity_id, member_id, role) VALUES
((SELECT id FROM activities WHERE name = 'Campagne de Don de Sang'), (SELECT id FROM membres WHERE email = 'john.doe@example.com'), 'Organisateur')
ON CONFLICT (activity_id, member_id) DO NOTHING;
