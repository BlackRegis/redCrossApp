import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Activity, CreditCard } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>

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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 nouvelles activités</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Émises</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,890</div>
            <p className="text-xs text-muted-foreground">+150 depuis la semaine dernière</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dons Collectés</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,789,000 XAF</div>
            <p className="text-xs text-muted-foreground">+5.2% depuis le mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Campagne de sensibilisation au paludisme</p>
                  <p className="text-sm text-muted-foreground">Brazzaville, 15 Mars 2024</p>
                </div>
                <span className="text-sm font-medium text-green-600">Terminée</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Distribution de kits d'hygiène</p>
                  <p className="text-sm text-muted-foreground">Pointe-Noire, 10 Mars 2024</p>
                </div>
                <span className="text-sm font-medium text-green-600">Terminée</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Formation aux premiers secours</p>
                  <p className="text-sm text-muted-foreground">Dolisie, 22 Février 2024</p>
                </div>
                <span className="text-sm font-medium text-green-600">Terminée</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nouveaux Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Jean Mukendi</p>
                  <p className="text-sm text-muted-foreground">Brazzaville, Membre Actif</p>
                </div>
                <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marie Kabila</p>
                  <p className="text-sm text-muted-foreground">Pointe-Noire, Volontaire</p>
                </div>
                <span className="text-sm text-muted-foreground">Il y a 5 jours</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pierre Dupont</p>
                  <p className="text-sm text-muted-foreground">Dolisie, Membre Bienfaiteur</p>
                </div>
                <span className="text-sm text-muted-foreground">Il y a 1 semaine</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
