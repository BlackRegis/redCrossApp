import { Client } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

// Types de cartes disponibles
const typesCartes = [
  'Standard',
  'Premium',
  'Bénévole',
  'Formateur',
  'Administrateur'
];

// Statuts des cartes
const statutsCartes = [
  'Active',
  'Expirée', 
  'Suspendue',
  'Remplacée'
];

// Fonctions utilitaires
function generateCardNumber(membreId, type) {
  const timestamp = Date.now().toString().slice(-6);
  const typeCode = type.substring(0, 3).toUpperCase();
  return `CRC-${typeCode}-${String(membreId).padStart(4, '0')}-${timestamp}`;
}

function generateEmissionDate() {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function generateExpirationDate(emissionDate, statut) {
  const emission = new Date(emissionDate);
  
  switch (statut) {
    case 'Active':
      // Carte active : expiration dans 1-3 ans
      const activeExpiration = new Date(emission);
      activeExpiration.setFullYear(activeExpiration.getFullYear() + Math.floor(Math.random() * 3) + 1);
      return activeExpiration.toISOString().split('T')[0];
    
    case 'Expirée':
      // Carte expirée : expiration dans le passé
      const expiredExpiration = new Date(emission);
      expiredExpiration.setFullYear(expiredExpiration.getFullYear() + Math.floor(Math.random() * 2) + 1);
      expiredExpiration.setMonth(expiredExpiration.getMonth() - Math.floor(Math.random() * 12));
      return expiredExpiration.toISOString().split('T')[0];
    
    case 'Suspendue':
      // Carte suspendue : expiration dans le futur mais suspendue
      const suspendedExpiration = new Date(emission);
      suspendedExpiration.setFullYear(suspendedExpiration.getFullYear() + Math.floor(Math.random() * 2) + 1);
      return suspendedExpiration.toISOString().split('T')[0];
    
    case 'Remplacée':
      // Carte remplacée : expiration dans le passé récent
      const replacedExpiration = new Date(emission);
      replacedExpiration.setFullYear(replacedExpiration.getFullYear() + Math.floor(Math.random() * 2) + 1);
      replacedExpiration.setMonth(replacedExpiration.getMonth() - Math.floor(Math.random() * 6));
      return replacedExpiration.toISOString().split('T')[0];
    
    default:
      return null;
  }
}

async function seedCartes() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('🚀 Début du seeding des cartes de membres...');
    
    await client.connect();
    console.log('✅ Connexion à la base de données établie');

    // Nettoyer les cartes existantes
    console.log('🧹 Nettoyage des cartes existantes...');
    await client.query('DELETE FROM cartes_membres');
    console.log('✅ Cartes existantes supprimées');

    // Récupérer tous les membres
    const membresResult = await client.query('SELECT id, nom, prenom, statut FROM membres ORDER BY id');
    const membres = membresResult.rows;
    
    if (membres.length === 0) {
      console.log('⚠️  Aucun membre trouvé. Veuillez d\'abord exécuter le seeding des membres.');
      return;
    }

    console.log(`📋 ${membres.length} membres trouvés`);

    // Répartition des statuts de cartes
    const repartitionStatuts = {
      'Active': Math.floor(membres.length * 0.6),      // 60% de cartes actives
      'Expirée': Math.floor(membres.length * 0.2),     // 20% de cartes expirées
      'Suspendue': Math.floor(membres.length * 0.15),  // 15% de cartes suspendues
      'Remplacée': Math.floor(membres.length * 0.05)   // 5% de cartes remplacées
    };

    console.log('📊 Répartition prévue des statuts:');
    Object.entries(repartitionStatuts).forEach(([statut, nombre]) => {
      console.log(`   - ${statut}: ${nombre} cartes`);
    });

    let cartesCreees = 0;
    let statutIndex = 0;
    const statutsArray = Object.entries(repartitionStatuts).flatMap(([statut, nombre]) => 
      Array(nombre).fill(statut)
    );

    // Mélanger les statuts pour une distribution aléatoire
    for (let i = statutsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [statutsArray[i], statutsArray[j]] = [statutsArray[j], statutsArray[i]];
    }

    // Créer les cartes pour chaque membre
    for (let i = 0; i < membres.length; i++) {
      const membre = membres[i];
      const statut = statutsArray[i] || 'Active'; // Par défaut Active si pas assez de statuts
      const typeCarte = typesCartes[Math.floor(Math.random() * typesCartes.length)];
      const numeroCarte = generateCardNumber(membre.id, typeCarte);
      const dateEmission = generateEmissionDate();
      const dateExpiration = generateExpirationDate(dateEmission, statut);

      try {
        await client.query(`
          INSERT INTO cartes_membres (
            membre_id, numero_carte, date_emission, date_expiration, statut, type_carte
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          membre.id,
          numeroCarte,
          dateEmission,
          dateExpiration,
          statut,
          typeCarte
        ]);

        cartesCreees++;
        
        if (cartesCreees % 10 === 0) {
          console.log(`✅ ${cartesCreees} cartes créées`);
        }

      } catch (error) {
        console.log(`⚠️  Erreur lors de la création de la carte pour ${membre.prenom} ${membre.nom}:`, error.message);
      }
    }

    // Statistiques finales
    console.log('\n📊 Statistiques finales des cartes:');
    
    const statsResult = await client.query(`
      SELECT 
        statut,
        COUNT(*) as nombre,
        type_carte,
        COUNT(*) as nombre_par_type
      FROM cartes_membres 
      GROUP BY statut, type_carte
      ORDER BY statut, type_carte
    `);

    const statsParStatut = await client.query(`
      SELECT 
        statut,
        COUNT(*) as nombre
      FROM cartes_membres 
      GROUP BY statut
      ORDER BY statut
    `);

    console.log('\n📋 Répartition par statut:');
    statsParStatut.rows.forEach(row => {
      console.log(`   - ${row.statut}: ${row.nombre} cartes`);
    });

    console.log('\n📋 Répartition par type:');
    const statsParType = await client.query(`
      SELECT 
        type_carte,
        COUNT(*) as nombre
      FROM cartes_membres 
      GROUP BY type_carte
      ORDER BY type_carte
    `);

    statsParType.rows.forEach(row => {
      console.log(`   - ${row.type_carte}: ${row.nombre} cartes`);
    });

    // Exemples de cartes créées
    console.log('\n🎯 Exemples de cartes créées:');
    const exemplesResult = await client.query(`
      SELECT 
        cm.numero_carte,
        cm.statut,
        cm.type_carte,
        cm.date_emission,
        cm.date_expiration,
        m.prenom,
        m.nom
      FROM cartes_membres cm
      JOIN membres m ON cm.membre_id = m.id
      ORDER BY cm.id
      LIMIT 5
    `);

    exemplesResult.rows.forEach((carte, index) => {
      console.log(`   ${index + 1}. ${carte.prenom} ${carte.nom} - ${carte.numero_carte} (${carte.statut})`);
    });

    console.log('\n🎉 Seeding des cartes terminé avec succès !');
    console.log(`✨ ${cartesCreees} cartes de membres créées !`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding des cartes:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Exécuter le seeding des cartes
seedCartes(); 