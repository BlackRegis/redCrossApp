import { Client } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('🚀 Début de la migration de la base de données...');
    
    await client.connect();
    console.log('✅ Connexion à la base de données établie');
    
    // Lire le fichier de schéma
    const schemaPath = resolve(__dirname, '../lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Exécution du schéma SQL...');
    
    // Exécuter le schéma complet
    try {
      await client.query(schema);
      console.log('✅ Schéma exécuté avec succès !');
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'exécution du schéma:', error.message);
      console.log('📝 Tentative d\'exécution requête par requête...');
      
      // Diviser et exécuter requête par requête
      const queries = schema
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith('--'));
      
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        if (query.trim()) {
          try {
            await client.query(query);
            console.log(`✅ Requête ${i + 1}/${queries.length} exécutée`);
          } catch (err) {
            console.log(`⚠️  Requête ${i + 1}/${queries.length} ignorée:`, err.message);
          }
        }
      }
    }
    
    console.log('🎉 Migration terminée !');
    
    // Vérifier les tables créées
    const testResult = await client.query('SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log(`📊 Nombre de tables créées: ${testResult.rows[0].total_tables}`);
    
    const tablesResult = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name');
    console.log('📋 Tables disponibles:', tablesResult.rows.map(row => row.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Exécuter la migration
runMigrations(); 