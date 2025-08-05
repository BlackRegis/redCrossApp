import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, CreditCard, Building2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex-1 p-6">
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
            <CardTitle className="text-sm font-medium">Activités Prévues</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 nouvelles cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Émises</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,800</div>
            <p className="text-xs text-muted-foreground">+50 depuis la semaine dernière</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Départements Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Couverture nationale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu des Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for a chart or list of recent activities */}
            <div className="h-[350px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Graphique des activités ou liste
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Membres Récents</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a list of recent members */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36&text=JD" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">Brazzaville</p>
                </div>
                <div className="ml-auto font-medium">Actif</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36&text=AS" alt="Avatar" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Alice Smith</p>
                  <p className="text-sm text-muted-foreground">Pointe-Noire</p>
                </div>
                <div className="ml-auto font-medium">Actif</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36&text=RB" alt="Avatar" />
                  <AvatarFallback>RB</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Robert Brown</p>
                  <p className="text-sm text-muted-foreground">Dolisie</p>
                </div>
                <div className="ml-auto font-medium">Bénévole</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
