import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, CreditCard, Building2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+20.1% depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités Planifiées</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+3 nouvelles activités</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Émises</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,800</div>
            <p className="text-xs text-muted-foreground">+150 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureaux Locaux</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 nouveaux bureaux</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Campagne de Don de Sang</p>
                  <p className="text-sm text-muted-foreground">20 Mai 2024 - Brazzaville</p>
                </div>
                <span className="text-sm text-green-500">Terminée</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Formation Premiers Secours</p>
                  <p className="text-sm text-muted-foreground">10 Juin 2024 - Pointe-Noire</p>
                </div>
                <span className="text-sm text-blue-500">À venir</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Distribution d'aide humanitaire</p>
                  <p className="text-sm text-muted-foreground">05 Mai 2024 - Dolisie</p>
                </div>
                <span className="text-sm text-green-500">Terminée</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des Membres</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart or more detailed stats */}
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Graphique des membres (à implémenter)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
