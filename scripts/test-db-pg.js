// Script de test de connexion à la base de données avec pg
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Client } from 'pg';

// Charger les variables d'environnement depuis .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

async function testConnection() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('🔍 Test de connexion à la base de données...');
    console.log('📡 URL de connexion:', process.env.POSTGRES_URL ? '✅ Configurée' : '❌ Manquante');
    
    await client.connect();
    console.log('✅ Connexion établie !');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Requête réussie:', result.rows[0]);
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    try {
      await client.end();
    } catch (e) {
      // Ignorer les erreurs de fermeture
    }
    return false;
  }
}

async function main() {
  try {
    const result = await testConnection();
    if (result) {
      console.log('✅ Test réussi ! La base de données est accessible.');
      process.exit(0);
    } else {
      console.log('❌ Test échoué ! Vérifiez votre configuration.');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
    process.exit(1);
  }
}

main(); 