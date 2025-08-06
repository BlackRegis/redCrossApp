CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR(255) NOT NULL,
    app_description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL, -- Assuming user_id comes from an auth system
    theme VARCHAR(50) DEFAULT 'system',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data for app_settings if table is empty
INSERT INTO app_settings (app_name, app_description, contact_email, contact_phone, address, logo_url)
SELECT 'Croix Rouge Congo', 'Application de gestion des membres et activités de la Croix Rouge Congolaise', 'contact@croixrouge.cg', '+242 06 123 4567', '123 Avenue de la Paix, Brazzaville, Congo', '/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM app_settings);

-- Insert initial data for a default user_settings (example)
-- This would typically be handled during user registration
-- INSERT INTO user_settings (user_id, theme, notifications_enabled, language)
-- SELECT 'default_user_id', 'system', TRUE, 'fr'
-- WHERE NOT EXISTS (SELECT 1 FROM user_settings WHERE user_id = 'default_user_id');
