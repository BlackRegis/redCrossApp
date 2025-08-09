import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, CreditCard, Building2, MapPin, TrendingUp, Calendar, Target, BarChart3, Award } from "lucide-react"
import { Client } from 'pg'
import { TrendChart } from "@/components/dashboard/TrendChart"
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics"
import MapCongo from "@/components/dashboard/MapCongo"

// Fonction pour récupérer les statistiques depuis la base de données
async function getDashboardStats() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    
    // Statistiques générales
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM membres) as total_membres,
        (SELECT COUNT(*) FROM membres WHERE statut = 'Actif') as membres_actifs,
        (SELECT COUNT(*) FROM activites) as total_activites,
        (SELECT COUNT(*) FROM activites WHERE statut = 'Planifiée') as activites_prevues,
        (SELECT COUNT(*) FROM cartes_membres) as total_cartes,
        (SELECT COUNT(*) FROM cartes_membres WHERE statut = 'Active') as cartes_actives,
        (SELECT COUNT(*) FROM departements) as total_departements,
        (SELECT SUM(budget) FROM activites) as budget_total,
        (SELECT COUNT(*) FROM activite_participants) as total_participants,
        (SELECT COUNT(DISTINCT membre_id) FROM activite_participants) as membres_participants,
        (SELECT COUNT(*) FROM activite_participants WHERE statut = 'Présent') as participants_presents
    `);

    // Taux de participation par département
    const participationParDept = await client.query(`
      SELECT 
        d.nom as departement,
        d.population,
        COUNT(DISTINCT m.id) as total_membres,
        COUNT(DISTINCT ap.membre_id) as membres_participants,
        CASE 
          WHEN COUNT(DISTINCT m.id) > 0 
          THEN ROUND((COUNT(DISTINCT ap.membre_id)::DECIMAL / COUNT(DISTINCT m.id)::DECIMAL) * 100, 1)
          ELSE 0 
        END as taux_participation
      FROM departements d
      LEFT JOIN arrondissements a ON d.id = a.departement_id
      LEFT JOIN membres m ON a.id = m.arrondissement_id
      LEFT JOIN activite_participants ap ON m.id = ap.membre_id
      GROUP BY d.id, d.nom, d.population
      ORDER BY taux_participation DESC
    `);

    // Activités récentes
    const activitesRecentes = await client.query(`
      SELECT 
        titre, 
        type, 
        date_debut, 
        statut,
        participants_max,
        (SELECT COUNT(*) FROM activite_participants ap WHERE ap.activite_id = a.id) as participants_inscrits
      FROM activites a
      ORDER BY date_debut DESC
      LIMIT 5
    `);

    // Top 5 des activités les plus populaires
    const topActivites = await client.query(`
      SELECT 
        a.titre,
        COUNT(ap.id) as nb_participants,
        a.participants_max,
        ROUND((COUNT(ap.id)::DECIMAL / a.participants_max::DECIMAL) * 100, 1) as taux_remplissage
      FROM activites a
      LEFT JOIN activite_participants ap ON a.id = ap.activite_id
      GROUP BY a.id, a.titre, a.participants_max
      ORDER BY nb_participants DESC
      LIMIT 5
    `);

    // Récupérer les statistiques des cartes depuis la nouvelle API
    let cartesStats = [];
    try {
      const cartesStatsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cartes/stats`);
      if (cartesStatsResponse.ok) {
        const cartesStatsData = await cartesStatsResponse.json();
        
        // Adapter le format pour la compatibilité
        cartesStats = cartesStatsData.statutsCalcules?.map((stat: { statut_calcule: string; nombre: number }) => ({
          statut: stat.statut_calcule,
          nombre: stat.nombre
        })) || [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des cartes:', error);
      cartesStats = [];
    }

    // Données de tendances (simulées pour l'exemple)
    const trendData = [
      { mois: 'Jan', activites: 8, participants: 45 },
      { mois: 'Fév', activites: 12, participants: 67 },
      { mois: 'Mar', activites: 15, participants: 89 },
      { mois: 'Avr', activites: 18, participants: 112 },
      { mois: 'Mai', activites: 22, participants: 134 },
      { mois: 'Juin', activites: 25, participants: 156 }
    ];

    // Calcul des métriques de performance
    const totalParticipantsMax = await client.query(`
      SELECT SUM(participants_max) as total_max
      FROM activites
    `);
    
    const totalMax = totalParticipantsMax.rows[0]?.total_max || 0;
    const statsData = stats.rows[0];
    const tauxRemplissage = totalMax > 0 ? (statsData.total_participants / totalMax) * 100 : 0;
    const tauxPresence = statsData.total_participants > 0 ? (statsData.participants_presents / statsData.total_participants) * 100 : 0;

    return {
      stats: statsData,
      participationParDept: participationParDept.rows,
      activitesRecentes: activitesRecentes.rows,
      topActivites: topActivites.rows,
      cartesStats: cartesStats,
      trendData,
      performanceMetrics: {
        tauxParticipation: statsData.total_membres > 0 ? (statsData.membres_participants / statsData.total_membres) * 100 : 0,
        tauxPresence,
        tauxRemplissage,
        budgetUtilise: statsData.budget_total ? statsData.budget_total * 0.75 : 0, // Simulé à 75%
        budgetTotal: statsData.budget_total || 0
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return null;
  } finally {
    await client.end();
  }
}



// Composant pour le graphique de participation
function ParticipationChart({ data }: { data: any[] }) {
  const maxTaux = Math.max(...data.map(d => d.taux_participation || 0));
  
  return (
    <div className="space-y-3">
      {data.slice(0, 8).map((dept, index) => {
        const taux = dept.taux_participation || 0;
        const pourcentage = maxTaux > 0 ? (taux / maxTaux) * 100 : 0;
        
        return (
          <div key={dept.departement} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium truncate">
              {dept.departement}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pourcentage}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm text-gray-600 text-right">
              {taux}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function HomePage() {
  const dashboardData = await getDashboardStats();
  
  if (!dashboardData) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>
        <div className="text-center text-gray-500">
          Erreur lors du chargement des données
        </div>
      </div>
    );
  }

  const { stats, participationParDept, activitesRecentes, topActivites, cartesStats, trendData, performanceMetrics } = dashboardData;
  
  // Calcul du taux de participation global
  const tauxParticipationGlobal = stats.total_membres > 0 
    ? Math.round((stats.membres_participants / stats.total_membres) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord - Croix Rouge Congo</h1>

      {/* Cartes de statistiques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_membres}</div>
            <p className="text-xs text-muted-foreground">
              {stats.membres_actifs} actifs ({(stats.membres_actifs / stats.total_membres * 100).toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_activites}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activites_prevues} prévues • {stats.total_participants} participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Participation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxParticipationGlobal.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.membres_participants} membres participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.budget_total ? `${(stats.budget_total / 1000000).toFixed(1)}M` : '0'} FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.cartes_actives} cartes actives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section principale avec carte et graphiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Carte du Congo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Répartition des Volontaires par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapCongo />
          </CardContent>
        </Card>

        {/* Taux de participation par département */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Taux de Participation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ParticipationChart data={participationParDept} />
          </CardContent>
        </Card>
      </div>

      {/* Section des métriques de performance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
        {/* Métriques de performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance de l'Organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceMetrics {...performanceMetrics} />
          </CardContent>
        </Card>

        {/* Graphique des tendances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Évolution des Activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendData} />
          </CardContent>
        </Card>
      </div>

      {/* Section des activités et statistiques détaillées */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitesRecentes.map((activite, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{activite.titre}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activite.date_debut).toLocaleDateString('fr-FR')} • {activite.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activite.statut === 'Terminée' ? 'bg-green-100 text-green-800' :
                      activite.statut === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activite.statut}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activite.participants_inscrits}/{activite.participants_max}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top activités populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activités les Plus Populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topActivites.map((activite, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{activite.titre}</p>
                    <p className="text-xs text-muted-foreground">
                      {activite.nb_participants} participants
                    </p>
                  </div>
                  <div className="text-right">
                                         <div className="text-sm font-bold text-green-600">
                       {Number(activite.taux_remplissage || 0).toFixed(2)}%
                     </div>
                    <div className="text-xs text-muted-foreground">
                      {activite.nb_participants}/{activite.participants_max}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques des cartes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Statut des Cartes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartesStats && cartesStats.length > 0 ? (
                cartesStats.map((stat: { statut: string; nombre: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        stat.statut === 'Active' ? 'bg-green-500' :
                        stat.statut === 'Expirée' ? 'bg-red-500' :
                        stat.statut === 'Suspendue' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-sm">{stat.statut}</span>
                    </div>
                    <span className="text-sm font-medium">{stat.nombre}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
