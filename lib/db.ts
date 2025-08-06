import { Client } from 'pg';

// Configuration pour la base de données PostgreSQL
let sql: any;
let client: Client | null = null;

if (process.env.NODE_ENV === 'production') {
  // En production, utiliser @vercel/postgres
  import('@vercel/postgres').then(({ sql: vercelSql }) => {
    sql = vercelSql;
  });
} else {
  // En développement local, utiliser pg directement
  client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  // Créer une interface compatible avec @vercel/postgres
  sql = (strings: TemplateStringsArray, ...values: any[]) => {
    const query = strings.reduce((result, str, i) => {
      return result + str + (values[i] !== undefined ? `$${i + 1}` : '');
    }, '');
    
    return client!.query(query, values);
  };

  // Connecter le client au démarrage
  client.connect().catch(console.error);
}

export { sql };

// Fonction utilitaire pour vérifier la connexion
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connexion PostgreSQL réussie:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error);
    return false;
  }
} 