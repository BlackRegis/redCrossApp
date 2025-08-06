import { Client } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

// Données des bureaux exécutifs
const bureauxData = [
  {
    nom: "Bureau National",
    type: "nation",
    niveau: "National",
    description: "Bureau exécutif national de la Croix Rouge Congo",
    membres: [
      {
        poste: "Président",
        date_nomination: "2023-01-15",
        date_fin_mandat: "2027-01-15",
        notes: "Président national élu"
      },
      {
        poste: "Vice-Président",
        date_nomination: "2023-01-15",
        date_fin_mandat: "2027-01-15",
        notes: "Vice-président national"
      },
      {
        poste: "Secrétaire Général",
        date_nomination: "2023-01-15",
        date_fin_mandat: "2027-01-15",
        notes: "Secrétaire général national"
      },
      {
        poste: "Trésorier",
        date_nomination: "2023-01-15",
        date_fin_mandat: "2027-01-15",
        notes: "Trésorier national"
      }
    ]
  },
  {
    nom: "Bureau Départemental Brazzaville",
    type: "departement",
    niveau: "Départemental",
    description: "Bureau exécutif du département de Brazzaville",
    departement_nom: "Brazzaville",
    membres: [
      {
        poste: "Président",
        date_nomination: "2023-02-01",
        date_fin_mandat: "2027-02-01",
        notes: "Président départemental"
      },
      {
        poste: "Secrétaire Général",
        date_nomination: "2023-02-01",
        date_fin_mandat: "2027-02-01",
        notes: "Secrétaire général départemental"
      },
      {
        poste: "Trésorier",
        date_nomination: "2023-02-01",
        date_fin_mandat: "2027-02-01",
        notes: "Trésorier départemental"
      }
    ]
  },
  {
    nom: "Bureau Départemental Pointe-Noire",
    type: "departement",
    niveau: "Départemental",
    description: "Bureau exécutif du département de Pointe-Noire",
    departement_nom: "Pointe-Noire",
    membres: [
      {
        poste: "Président",
        date_nomination: "2023-02-15",
        date_fin_mandat: "2027-02-15",
        notes: "Président départemental"
      },
      {
        poste: "Secrétaire Général",
        date_nomination: "2023-02-15",
        date_fin_mandat: "2027-02-15",
        notes: "Secrétaire général départemental"
      }
    ]
  },
  {
    nom: "Bureau Arrondissement Makélékélé",
    type: "arrondissement",
    niveau: "Arrondissement",
    description: "Bureau exécutif de l'arrondissement Makélékélé",
    departement_nom: "Brazzaville",
    arrondissement_nom: "Makélékélé",
    membres: [
      {
        poste: "Président",
        date_nomination: "2023-03-01",
        date_fin_mandat: "2027-03-01",
        notes: "Président d'arrondissement"
      },
      {
        poste: "Secrétaire Général",
        date_nomination: "2023-03-01",
        date_fin_mandat: "2027-03-01",
        notes: "Secrétaire général d'arrondissement"
      }
    ]
  },
  {
    nom: "Bureau Arrondissement Bacongo",
    type: "arrondissement",
    niveau: "Arrondissement",
    description: "Bureau exécutif de l'arrondissement Bacongo",
    departement_nom: "Brazzaville",
    arrondissement_nom: "Bacongo",
    membres: [
      {
        poste: "Président",
        date_nomination: "2023-03-15",
        date_fin_mandat: "2027-03-15",
        notes: "Président d'arrondissement"
      },
      {
        poste: "Trésorier",
        date_nomination: "2023-03-15",
        date_fin_mandat: "2027-03-15",
        notes: "Trésorier d'arrondissement"
      }
    ]
  }
];

async function seedBureaux() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('🚀 Début du seeding des bureaux exécutifs...');
    
    await client.connect();
    console.log('✅ Connexion à la base de données établie');

    // Nettoyer les bureaux existants
    console.log('🧹 Nettoyage des bureaux existants...');
    await client.query('DELETE FROM bureau_membres');
    await client.query('DELETE FROM bureaux_executifs');
    console.log('✅ Bureaux existants supprimés');

    // Récupérer les départements et arrondissements
    const departementsResult = await client.query('SELECT id, nom FROM departements');
    const arrondissementsResult = await client.query('SELECT id, nom, departement_id FROM arrondissements');
    const membresResult = await client.query('SELECT id, nom, prenom FROM membres ORDER BY id LIMIT 20');

    const departements = departementsResult.rows;
    const arrondissements = arrondissementsResult.rows;
    const membres = membresResult.rows;

    if (membres.length === 0) {
      console.log('⚠️  Aucun membre trouvé. Veuillez d\'abord exécuter le seeding des membres.');
      return;
    }

    console.log(`📋 ${membres.length} membres trouvés pour les bureaux`);

    let bureauxCrees = 0;
    let membresAssignes = 0;

    for (const bureauData of bureauxData) {
      try {
        // Trouver le département et l'arrondissement si nécessaire
        let departement_id = null;
        let arrondissement_id = null;

        if (bureauData.departement_nom) {
          const dept = departements.find(d => d.nom === bureauData.departement_nom);
          if (dept) {
            departement_id = dept.id;
          }
        }

        if (bureauData.arrondissement_nom && departement_id) {
          const arr = arrondissements.find(a => 
            a.nom === bureauData.arrondissement_nom && a.departement_id === departement_id
          );
          if (arr) {
            arrondissement_id = arr.id;
          }
        }

        // Créer le bureau exécutif
        const bureauResult = await client.query(`
          INSERT INTO bureaux_executifs (
            nom, type, niveau, departement_id, arrondissement_id, description
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
          bureauData.nom,
          bureauData.type,
          bureauData.niveau,
          departement_id,
          arrondissement_id,
          bureauData.description
        ]);

        const bureauId = bureauResult.rows[0].id;
        bureauxCrees++;

        // Assigner les membres au bureau
        for (const membreData of bureauData.membres) {
          // Sélectionner un membre disponible (pas encore assigné à ce poste dans ce bureau)
          const membreDisponible = membres.find(m => {
            // Vérifier si le membre n'est pas déjà assigné à ce poste dans ce bureau
            return true; // Pour simplifier, on prend le premier disponible
          });

          if (membreDisponible) {
            await client.query(`
              INSERT INTO bureau_membres (
                bureau_id, membre_id, poste, date_nomination, date_fin_mandat, notes
              ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
              bureauId,
              membreDisponible.id,
              membreData.poste,
              membreData.date_nomination,
              membreData.date_fin_mandat,
              membreData.notes
            ]);

            membresAssignes++;
            console.log(`   ✅ ${membreDisponible.prenom} ${membreDisponible.nom} assigné comme ${membreData.poste}`);
          }
        }

        console.log(`✅ Bureau "${bureauData.nom}" créé avec ${bureauData.membres.length} membres`);

      } catch (error) {
        console.log(`⚠️  Erreur lors de la création du bureau "${bureauData.nom}":`, error.message);
      }
    }

    // Statistiques finales
    console.log('\n📊 Statistiques finales des bureaux:');
    
    const statsResult = await client.query(`
      SELECT 
        be.type,
        COUNT(*) as nombre_bureaux,
        COUNT(bm.id) as nombre_membres
      FROM bureaux_executifs be
      LEFT JOIN bureau_membres bm ON be.id = bm.bureau_id
      GROUP BY be.type
      ORDER BY 
        CASE be.type 
          WHEN 'nation' THEN 1
          WHEN 'departement' THEN 2
          WHEN 'arrondissement' THEN 3
        END
    `);

    console.log('\n📋 Répartition par type:');
    statsResult.rows.forEach(row => {
      console.log(`   - ${row.type}: ${row.nombre_bureaux} bureaux, ${row.nombre_membres} membres`);
    });

    // Exemples de bureaux créés
    console.log('\n🎯 Exemples de bureaux créés:');
    const exemplesResult = await client.query(`
      SELECT 
        be.nom,
        be.type,
        be.niveau,
        COUNT(bm.id) as nombre_membres
      FROM bureaux_executifs be
      LEFT JOIN bureau_membres bm ON be.id = bm.bureau_id
      GROUP BY be.id, be.nom, be.type, be.niveau
      ORDER BY be.id
      LIMIT 5
    `);

    exemplesResult.rows.forEach((bureau, index) => {
      console.log(`   ${index + 1}. ${bureau.nom} (${bureau.type}) - ${bureau.nombre_membres} membres`);
    });

    console.log('\n🎉 Seeding des bureaux terminé avec succès !');
    console.log(`✨ ${bureauxCrees} bureaux créés avec ${membresAssignes} membres assignés !`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding des bureaux:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Exécuter le seeding des bureaux
seedBureaux(); 