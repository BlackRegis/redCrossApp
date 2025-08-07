import { Client } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

// Données des départements de la République du Congo
const departements = [
  {
    nom: 'Brazzaville',
    code: 'BRA',
    chef_lieu: 'Brazzaville',
    population: 2000000,
    superficie: 100.0,
    arrondissements: [
      { nom: 'Makélékélé', code: 'BRA-MAK', population: 500000, superficie: 25.0 },
      { nom: 'Bacongo', code: 'BRA-BAC', population: 300000, superficie: 15.0 },
      { nom: 'Poto-Poto', code: 'BRA-POT', population: 400000, superficie: 20.0 },
      { nom: 'Moungali', code: 'BRA-MOU', population: 200000, superficie: 10.0 },
      { nom: 'Ouenzé', code: 'BRA-OUE', population: 250000, superficie: 12.0 },
      { nom: 'Talangaï', code: 'BRA-TAL', population: 180000, superficie: 8.0 },
      { nom: 'Mfilou', code: 'BRA-MFI', population: 120000, superficie: 6.0 },
      { nom: 'Djiri', code: 'BRA-DJI', population: 50000, superficie: 4.0 }
    ]
  },
  {
    nom: 'Pointe-Noire',
    code: 'PNR',
    chef_lieu: 'Pointe-Noire',
    population: 1000000,
    superficie: 50.0,
    arrondissements: [
      { nom: 'Loandjili', code: 'PNR-LOA', population: 200000, superficie: 10.0 },
      { nom: 'Tié-Tié', code: 'PNR-TIE', population: 150000, superficie: 8.0 },
      { nom: 'Ngoyo', code: 'PNR-NGO', population: 180000, superficie: 9.0 },
      { nom: 'Tchiamba-Nzassi', code: 'PNR-TCH', population: 120000, superficie: 6.0 },
      { nom: 'Mvouti', code: 'PNR-MVO', population: 100000, superficie: 5.0 },
      { nom: 'Hinda', code: 'PNR-HIN', population: 80000, superficie: 4.0 },
      { nom: 'Nkayi', code: 'PNR-NKA', population: 60000, superficie: 3.0 },
      { nom: 'Madingou', code: 'PNR-MAD', population: 40000, superficie: 2.0 },
      { nom: 'Bouansa', code: 'PNR-BOU', population: 30000, superficie: 1.5 },
      { nom: 'Mouyondzi', code: 'PNR-MOU', population: 20000, superficie: 1.0 }
    ]
  },
  {
    nom: 'Niari',
    code: 'NIA',
    chef_lieu: 'Dolisie',
    population: 500000,
    superficie: 25000.0,
    arrondissements: [
      { nom: 'Dolisie', code: 'NIA-DOL', population: 150000, superficie: 500.0 },
      { nom: 'Mossendjo', code: 'NIA-MOS', population: 80000, superficie: 300.0 },
      { nom: 'Boko-Songho', code: 'NIA-BOK', population: 60000, superficie: 250.0 },
      { nom: 'Kibangou', code: 'NIA-KIB', population: 40000, superficie: 200.0 },
      { nom: 'Loudima', code: 'NIA-LOU', population: 35000, superficie: 180.0 },
      { nom: 'Madingou', code: 'NIA-MAD', population: 30000, superficie: 150.0 },
      { nom: 'Bouansa', code: 'NIA-BOU', population: 25000, superficie: 120.0 },
      { nom: 'Mouyondzi', code: 'NIA-MOU', population: 20000, superficie: 100.0 },
      { nom: 'Mfouati', code: 'NIA-MFO', population: 15000, superficie: 80.0 },
      { nom: 'Divénié', code: 'NIA-DIV', population: 10000, superficie: 60.0 }
    ]
  },
  {
    nom: 'Pool',
    code: 'POO',
    chef_lieu: 'Kinkala',
    population: 300000,
    superficie: 15000.0,
    arrondissements: [
      { nom: 'Kinkala', code: 'POO-KIN', population: 80000, superficie: 400.0 },
      { nom: 'Mindouli', code: 'POO-MIN', population: 60000, superficie: 300.0 },
      { nom: 'Boko', code: 'POO-BOK', population: 45000, superficie: 250.0 },
      { nom: 'Mayama', code: 'POO-MAY', population: 35000, superficie: 200.0 },
      { nom: 'Kimba', code: 'POO-KIM', population: 25000, superficie: 150.0 },
      { nom: 'Ngabé', code: 'POO-NGA', population: 20000, superficie: 120.0 },
      { nom: 'Mbanza-Ndounga', code: 'POO-MBA', population: 15000, superficie: 100.0 },
      { nom: 'Kindamba', code: 'POO-KIN2', population: 10000, superficie: 80.0 }
    ]
  },
  {
    nom: 'Bouenza',
    code: 'BOU',
    chef_lieu: 'Madingou',
    population: 400000,
    superficie: 12000.0,
    arrondissements: [
      { nom: 'Madingou', code: 'BOU-MAD', population: 100000, superficie: 500.0 },
      { nom: 'Bouansa', code: 'BOU-BOU', population: 80000, superficie: 400.0 },
      { nom: 'Mouyondzi', code: 'BOU-MOU', population: 60000, superficie: 300.0 },
      { nom: 'Mfouati', code: 'BOU-MFO', population: 50000, superficie: 250.0 },
      { nom: 'Divénié', code: 'BOU-DIV', population: 40000, superficie: 200.0 },
      { nom: 'Loutété', code: 'BOU-LOU', population: 30000, superficie: 150.0 },
      { nom: 'Nkayi', code: 'BOU-NKA', population: 25000, superficie: 120.0 },
      { nom: 'Yamba', code: 'BOU-YAM', population: 15000, superficie: 80.0 }
    ]
  },
  {
    nom: 'Lékoumou',
    code: 'LEK',
    chef_lieu: 'Sibiti',
    population: 250000,
    superficie: 20000.0,
    arrondissements: [
      { nom: 'Sibiti', code: 'LEK-SIB', population: 80000, superficie: 600.0 },
      { nom: 'Komono', code: 'LEK-KOM', population: 60000, superficie: 500.0 },
      { nom: 'Zanaga', code: 'LEK-ZAN', population: 45000, superficie: 400.0 },
      { nom: 'Bambama', code: 'LEK-BAM', population: 35000, superficie: 300.0 },
      { nom: 'Mayéyé', code: 'LEK-MAY', population: 25000, superficie: 200.0 }
    ]
  },
  {
    nom: 'Cuvette',
    code: 'CUV',
    chef_lieu: 'Owando',
    population: 350000,
    superficie: 48000.0,
    arrondissements: [
      { nom: 'Owando', code: 'CUV-OWA', population: 100000, superficie: 800.0 },
      { nom: 'Etoumbi', code: 'CUV-ETO', population: 80000, superficie: 600.0 },
      { nom: 'Oyo', code: 'CUV-OYO', population: 60000, superficie: 500.0 },
      { nom: 'Makoua', code: 'CUV-MAK', population: 45000, superficie: 400.0 },
      { nom: 'Mossaka', code: 'CUV-MOS', population: 35000, superficie: 300.0 },
      { nom: 'Ngoko', code: 'CUV-NGO', population: 25000, superficie: 200.0 }
    ]
  },
  {
    nom: 'Cuvette-Ouest',
    code: 'CUO',
    chef_lieu: 'Ewo',
    population: 200000,
    superficie: 26000.0,
    arrondissements: [
      { nom: 'Ewo', code: 'CUO-EWO', population: 60000, superficie: 500.0 },
      { nom: 'Kéllé', code: 'CUO-KEL', population: 45000, superficie: 400.0 },
      { nom: 'Mbomo', code: 'CUO-MBO', population: 35000, superficie: 300.0 },
      { nom: 'Okoyo', code: 'CUO-OKO', population: 25000, superficie: 200.0 },
      { nom: 'Tchikapika', code: 'CUO-TCH', population: 20000, superficie: 150.0 },
      { nom: 'Mbandza-Ndounga', code: 'CUO-MBA', population: 15000, superficie: 100.0 }
    ]
  },
  {
    nom: 'Sangha',
    code: 'SAN',
    chef_lieu: 'Ouésso',
    population: 150000,
    superficie: 55000.0,
    arrondissements: [
      { nom: 'Ouésso', code: 'SAN-OUE', population: 50000, superficie: 600.0 },
      { nom: 'Sembé', code: 'SAN-SEM', population: 35000, superficie: 500.0 },
      { nom: 'Souanké', code: 'SAN-SOU', population: 25000, superficie: 400.0 },
      { nom: 'Mokéko', code: 'SAN-MOK', population: 20000, superficie: 300.0 },
      { nom: 'Pikounda', code: 'SAN-PIK', population: 15000, superficie: 200.0 },
      { nom: 'Ngbala', code: 'SAN-NGB', population: 5000, superficie: 100.0 }
    ]
  },
  {
    nom: 'Likouala',
    code: 'LIK',
    chef_lieu: 'Impfondo',
    population: 180000,
    superficie: 66000.0,
    arrondissements: [
      { nom: 'Impfondo', code: 'LIK-IMP', population: 60000, superficie: 800.0 },
      { nom: 'Bétou', code: 'LIK-BET', population: 40000, superficie: 600.0 },
      { nom: 'Enyellé', code: 'LIK-ENY', population: 30000, superficie: 500.0 },
      { nom: 'Liranga', code: 'LIK-LIR', population: 25000, superficie: 400.0 },
      { nom: 'Dongou', code: 'LIK-DON', population: 15000, superficie: 300.0 },
      { nom: 'Epéna', code: 'LIK-EPE', population: 10000, superficie: 200.0 }
    ]
  },
  {
    nom: 'Plateaux',
    code: 'PLA',
    chef_lieu: 'Djambala',
    population: 220000,
    superficie: 38500.0,
    arrondissements: [
      { nom: 'Djambala', code: 'PLA-DJA', population: 70000, superficie: 600.0 },
      { nom: 'Gamboma', code: 'PLA-GAM', population: 55000, superficie: 500.0 },
      { nom: 'Mpouya', code: 'PLA-MPO', population: 40000, superficie: 400.0 },
      { nom: 'Ngo', code: 'PLA-NGO', population: 30000, superficie: 300.0 },
      { nom: 'Abala', code: 'PLA-ABA', population: 25000, superficie: 250.0 }
    ]
  },
  {
    nom: 'Kouilou',
    code: 'KOU',
    chef_lieu: 'Loango',
    population: 120000,
    superficie: 13694.0,
    arrondissements: [
      { nom: 'Loango', code: 'KOU-LOA', population: 40000, superficie: 400.0 },
      { nom: 'Hinda', code: 'KOU-HIN', population: 30000, superficie: 300.0 },
      { nom: 'Nkayi', code: 'KOU-NKA', population: 25000, superficie: 250.0 },
      { nom: 'Madingou', code: 'KOU-MAD', population: 15000, superficie: 200.0 },
      { nom: 'Bouansa', code: 'KOU-BOU', population: 10000, superficie: 150.0 }
    ]
  }
];

// Données de test pour les membres
const noms = [
  'Mabiala', 'Nkounkou', 'Moukoko', 'Bouanga', 'Tchibota', 'Lissouba', 'Sassou', 'Kolelas', 'Milongo', 'Yhombi',
  'Makaya', 'Mampouya', 'Mouyabi', 'Moukila', 'Bouiti', 'Tchicaya', 'Loundou', 'Samba', 'Kimbembe', 'Yoka',
  'Mabika', 'Nkodia', 'Moukouyou', 'Bouanga', 'Tchibinda', 'Lounda', 'Samba', 'Kimbouala', 'Yombi', 'Mabiala',
  'Nkounkou', 'Moukoko', 'Bouanga', 'Tchibota', 'Lissouba', 'Sassou', 'Kolelas', 'Milongo', 'Yhombi', 'Makaya',
  'Mampouya', 'Mouyabi', 'Moukila', 'Bouiti', 'Tchicaya', 'Loundou', 'Samba', 'Kimbembe', 'Yoka', 'Mabika'
];

const prenoms = [
  'Jean', 'Pierre', 'Paul', 'Jacques', 'Michel', 'André', 'Claude', 'Philippe', 'François', 'Bernard',
  'Marie', 'Jeanne', 'Françoise', 'Monique', 'Claudine', 'Suzanne', 'Madeleine', 'Thérèse', 'Louise', 'Marguerite',
  'Alain', 'Patrick', 'Christian', 'Daniel', 'Robert', 'Henri', 'Louis', 'Georges', 'Marcel', 'René',
  'Catherine', 'Isabelle', 'Martine', 'Nathalie', 'Véronique', 'Christine', 'Dominique', 'Brigitte', 'Anne', 'Sophie',
  'Marc', 'Laurent', 'Stéphane', 'Nicolas', 'David', 'Thomas', 'Vincent', 'Sébastien', 'Guillaume', 'Antoine'
];

const professions = [
  'Médecin', 'Infirmier', 'Enseignant', 'Ingénieur', 'Avocat', 'Comptable', 'Administrateur', 'Technicien',
  'Étudiant', 'Retraité', 'Commerçant', 'Artisan', 'Agriculteur', 'Chauffeur', 'Secrétaire', 'Gestionnaire',
  'Architecte', 'Pharmacien', 'Dentiste', 'Vétérinaire', 'Journaliste', 'Traducteur', 'Interprète', 'Consultant'
];

// Données de test pour les activités
const activites = [
  {
    titre: 'Formation aux premiers secours',
    description: 'Formation complète aux gestes de premiers secours pour les bénévoles',
    type: 'Formation',
    lieu: 'Centre de formation CRC, Brazzaville',
    participants_max: 25,
    budget: 1500000
  },
  {
    titre: 'Campagne de don du sang',
    description: 'Collecte de sang pour les hôpitaux de Brazzaville',
    type: 'Collecte',
    lieu: 'Place de la République, Brazzaville',
    participants_max: 15,
    budget: 800000
  },
  {
    titre: 'Distribution de kits d\'hygiène',
    description: 'Distribution de kits d\'hygiène dans les quartiers défavorisés',
    type: 'Humanitaire',
    lieu: 'Quartiers de Bacongo et Poto-Poto',
    participants_max: 20,
    budget: 2000000
  },
  {
    titre: 'Formation à la réduction des risques',
    description: 'Formation sur la prévention des catastrophes naturelles',
    type: 'Formation',
    lieu: 'Salle de conférence CRC',
    participants_max: 30,
    budget: 1200000
  },
  {
    titre: 'Visite aux personnes âgées',
    description: 'Visite et accompagnement des personnes âgées isolées',
    type: 'Social',
    lieu: 'Centres pour personnes âgées, Brazzaville',
    participants_max: 12,
    budget: 500000
  },
  {
    titre: 'Sensibilisation sur le VIH/SIDA',
    description: 'Campagne de sensibilisation et de prévention du VIH/SIDA',
    type: 'Sensibilisation',
    lieu: 'Université Marien Ngouabi',
    participants_max: 18,
    budget: 900000
  },
  {
    titre: 'Formation aux techniques de sauvetage',
    description: 'Formation avancée aux techniques de sauvetage en milieu aquatique',
    type: 'Formation',
    lieu: 'Piscine municipale, Pointe-Noire',
    participants_max: 15,
    budget: 1800000
  },
  {
    titre: 'Distribution de repas chauds',
    description: 'Distribution de repas chauds aux sans-abri',
    type: 'Humanitaire',
    lieu: 'Centre-ville de Brazzaville',
    participants_max: 10,
    budget: 600000
  },
  {
    titre: 'Formation aux soins infirmiers de base',
    description: 'Formation aux soins infirmiers de base pour les bénévoles',
    type: 'Formation',
    lieu: 'École d\'infirmiers, Brazzaville',
    participants_max: 22,
    budget: 1600000
  },
  {
    titre: 'Campagne de vaccination',
    description: 'Campagne de vaccination contre la grippe saisonnière',
    type: 'Santé',
    lieu: 'Centres de santé communautaires',
    participants_max: 16,
    budget: 1100000
  }
];

// Fonctions utilitaires
function generatePhone() {
  const prefixes = ['+242 06', '+242 05', '+242 04'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix} ${number}`;
}

function generateBirthDate() {
  const start = new Date(1954, 0, 1);
  const end = new Date(2006, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function generateAdhesionDate() {
  const start = new Date(2019, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function generateCardNumber(index) {
  return `CRC-${String(index + 1).padStart(4, '0')}-${new Date().getFullYear()}`;
}

function generateFutureDate() {
  const start = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + 6);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString();
}

function generateEndDate(startDate) {
  const start = new Date(startDate);
  const daysToAdd = Math.floor(Math.random() * 3) + 1;
  start.setDate(start.getDate() + daysToAdd);
  return start.toISOString();
}

async function seedComplete() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('🚀 Début du seeding complet de la base de données...');
    
    await client.connect();
    console.log('✅ Connexion à la base de données établie');

    // Nettoyer la base de données
    console.log('🧹 Nettoyage de la base de données...');
    await client.query('DELETE FROM activite_participants');
    await client.query('DELETE FROM activites');
    await client.query('DELETE FROM formations');
    await client.query('DELETE FROM cartes_membres');
    await client.query('DELETE FROM dons');
    await client.query('UPDATE membres SET departement_id = NULL, arrondissement_id = NULL');
    await client.query('DELETE FROM membres');
    await client.query('DELETE FROM arrondissements');
    await client.query('DELETE FROM departements');
    console.log('✅ Base de données nettoyée');

    // 1. Créer les départements et arrondissements
    console.log('\n🌱 1. Création des départements et arrondissements...');
    const deptMap = new Map(); // Pour stocker les IDs des départements

    for (let i = 0; i < departements.length; i++) {
      const dept = departements[i];
      
      const deptResult = await client.query(`
        INSERT INTO departements (nom, code, chef_lieu, population, superficie)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [dept.nom, dept.code, dept.chef_lieu, dept.population, dept.superficie]);
      
      const deptId = deptResult.rows[0].id;
      deptMap.set(dept.code, deptId);
      console.log(`✅ Département "${dept.nom}" créé (ID: ${deptId})`);

      // Créer les arrondissements
      for (let j = 0; j < dept.arrondissements.length; j++) {
        const arr = dept.arrondissements[j];
        
        await client.query(`
          INSERT INTO arrondissements (nom, code, departement_id, population, superficie)
          VALUES ($1, $2, $3, $4, $5)
        `, [arr.nom, arr.code, deptId, arr.population, arr.superficie]);
        
        console.log(`   📍 Arrondissement "${arr.nom}" créé`);
      }
    }

    // 2. Créer les membres
    console.log('\n🌱 2. Création des membres...');
    const allArrondissements = await client.query('SELECT id, nom, departement_id FROM arrondissements');
    const memberIds = [];

    for (let i = 0; i < 50; i++) {
      const nom = noms[Math.floor(Math.random() * noms.length)];
      const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
      const profession = professions[Math.floor(Math.random() * professions.length)];
      const arrondissement = allArrondissements.rows[Math.floor(Math.random() * allArrondissements.rows.length)];
      
      const memberResult = await client.query(`
        INSERT INTO membres (
          nom, prenom, date_naissance, sexe, adresse, telephone, email, profession,
          departement_id, arrondissement_id, date_adhesion, statut, numero_carte, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `, [
        nom, prenom, generateBirthDate(), Math.random() > 0.5 ? 'homme' : 'femme',
        `${Math.floor(Math.random() * 100) + 1} rue ${nom}, ${arrondissement.nom}`,
        generatePhone(), `${prenom.toLowerCase()}.${nom.toLowerCase()}@example.com`,
        profession, arrondissement.departement_id, arrondissement.id,
        generateAdhesionDate(), Math.random() > 0.1 ? 'Actif' : 'Inactif',
        generateCardNumber(i), `Membre de test ${i + 1} - ${profession}`
      ]);
      
      memberIds.push(memberResult.rows[0].id);
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1} membres créés`);
      }
    }

    // 3. Créer les activités
    console.log('\n🌱 3. Création des activités...');
    const activeMemberIds = memberIds.filter((_, index) => index < 10); // Utiliser les 10 premiers membres

    for (let i = 0; i < activites.length; i++) {
      const activite = activites[i];
      const date_debut = generateFutureDate();
      const date_fin = generateEndDate(date_debut);
      const responsable = activeMemberIds[Math.floor(Math.random() * activeMemberIds.length)];
      
      await client.query(`
        INSERT INTO activites (
          titre, description, type, date_debut, date_fin, lieu, statut, 
          participants_max, budget, responsable_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        activite.titre, activite.description, activite.type, date_debut, date_fin,
        activite.lieu, 'Planifiée', activite.participants_max, activite.budget, responsable
      ]);
      
      console.log(`✅ Activité "${activite.titre}" créée`);
    }

    // 4. Créer les cartes de membres
    console.log('\n🌱 4. Création des cartes de membres...');
    const typesCartes = ['Standard', 'Premium', 'Bénévole', 'Formateur', 'Administrateur'];
    const statutsCartes = ['Active', 'Expirée', 'Suspendue', 'Remplacée'];
    
    // Répartition des statuts
    const repartitionStatuts = {
      'Active': Math.floor(memberIds.length * 0.6),      // 60% de cartes actives
      'Expirée': Math.floor(memberIds.length * 0.2),     // 20% de cartes expirées
      'Suspendue': Math.floor(memberIds.length * 0.15),  // 15% de cartes suspendues
      'Remplacée': Math.floor(memberIds.length * 0.05)   // 5% de cartes remplacées
    };

    const statutsArray = Object.entries(repartitionStatuts).flatMap(([statut, nombre]) => 
      Array(nombre).fill(statut)
    );

    // Mélanger les statuts
    for (let i = statutsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [statutsArray[i], statutsArray[j]] = [statutsArray[j], statutsArray[i]];
    }

    for (let i = 0; i < memberIds.length; i++) {
      const membreId = memberIds[i];
      const statut = statutsArray[i] || 'Active';
      const typeCarte = typesCartes[Math.floor(Math.random() * typesCartes.length)];
      const numeroCarte = `CRC-${typeCarte.substring(0, 3).toUpperCase()}-${String(membreId).padStart(4, '0')}-${Date.now().toString().slice(-6)}`;
      
      // Générer les dates
      const dateEmission = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      let dateExpiration = new Date(dateEmission);
      
      switch (statut) {
        case 'Active':
          dateExpiration.setFullYear(dateExpiration.getFullYear() + Math.floor(Math.random() * 3) + 1);
          break;
        case 'Expirée':
          dateExpiration.setFullYear(dateExpiration.getFullYear() + Math.floor(Math.random() * 2) + 1);
          dateExpiration.setMonth(dateExpiration.getMonth() - Math.floor(Math.random() * 12));
          break;
        case 'Suspendue':
          dateExpiration.setFullYear(dateExpiration.getFullYear() + Math.floor(Math.random() * 2) + 1);
          break;
        case 'Remplacée':
          dateExpiration.setFullYear(dateExpiration.getFullYear() + Math.floor(Math.random() * 2) + 1);
          dateExpiration.setMonth(dateExpiration.getMonth() - Math.floor(Math.random() * 6));
          break;
      }

      await client.query(`
        INSERT INTO cartes_membres (
          membre_id, numero_carte, date_emission, date_expiration, statut, type_carte
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        membreId,
        numeroCarte,
        dateEmission.toISOString().split('T')[0],
        dateExpiration.toISOString().split('T')[0],
        statut,
        typeCarte
      ]);
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1} cartes créées`);
      }
    }

    // Statistiques finales
    console.log('\n📊 Statistiques finales:');
    
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM departements) as departements_count,
        (SELECT COUNT(*) FROM arrondissements) as arrondissements_count,
        (SELECT COUNT(*) FROM membres) as membres_count,
        (SELECT COUNT(*) FROM activites) as activites_count,
        (SELECT COUNT(*) FROM cartes_membres) as cartes_count,
        (SELECT COUNT(*) FROM membres WHERE statut = 'Actif') as membres_actifs,
        (SELECT SUM(budget) FROM activites) as budget_total
    `);
    
    const finalStats = stats.rows[0];
    console.log(`   - Départements: ${finalStats.departements_count}`);
    console.log(`   - Arrondissements: ${finalStats.arrondissements_count}`);
    console.log(`   - Membres: ${finalStats.membres_count}`);
    console.log(`   - Membres actifs: ${finalStats.membres_actifs}`);
    console.log(`   - Activités: ${finalStats.activites_count}`);
    console.log(`   - Cartes de membres: ${finalStats.cartes_count}`);
    console.log(`   - Budget total: ${finalStats.budget_total?.toLocaleString('fr-FR')} FCFA`);

    // Statistiques des cartes
    const cartesStats = await client.query(`
      SELECT 
        statut,
        COUNT(*) as nombre
      FROM cartes_membres 
      GROUP BY statut
      ORDER BY statut
    `);
    
    console.log('\n📋 Répartition des cartes par statut:');
    cartesStats.rows.forEach(row => {
      console.log(`   - ${row.statut}: ${row.nombre} cartes`);
    });

    console.log('\n🎉 Seeding complet terminé avec succès !');
    console.log('✨ Votre base de données est maintenant prête pour les tests !');

  } catch (error) {
    console.error('❌ Erreur lors du seeding complet:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Exécuter le seeding complet
seedComplete(); 