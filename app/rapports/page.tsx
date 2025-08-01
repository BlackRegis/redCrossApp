import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart, LineChart, PieChart } from "lucide-react" // Placeholder icons for charts
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

// Placeholder data for reports
const memberStatusData = [
  { name: "Actif", value: 300, fill: "hsl(var(--primary))" },
  { name: "Inactif", value: 50, fill: "hsl(var(--muted-foreground))" },
  { name: "Nouveau", value: 20, fill: "hsl(var(--secondary))" },
]

const activityStatusData = [
  { name: "Planifié", count: 15 },
  { name: "En Cours", count: 8 },
  { name: "Terminé", count: 25 },
  { name: "Annulé", count: 3 },
]

const recentActivities = [
  { id: 1, name: "Campagne de Don de Sang", date: "2024-03-10", status: "Terminé" },
  { id: 2, name: "Formation Premiers Secours", date: "2024-04-05", status: "Planifié" },
  { id: 3, name: "Distribution de Kits d'Hygiène", date: "2024-02-20", status: "Terminé" },
  { id: 4, name: "Sensibilisation au Paludisme", date: "2024-05-01", status: "En Cours" },
]

export default function RapportsPage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Rapports et Statistiques</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Member Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Statut des Membres
            </CardTitle>
            <CardDescription>Répartition des membres par statut.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Actif: { label: "Actif", color: "hsl(var(--primary))" },
                Inactif: { label: "Inactif", color: "hsl(var(--muted-foreground))" },
                Nouveau: { label: "Nouveau", color: "hsl(var(--secondary))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memberStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Card 2: Activity Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Statut des Activités
            </CardTitle>
            <CardDescription>Nombre d'activités par statut.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Nombre d'activités", color: "hsl(var(--primary))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Card 3: Recent Activities Table */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Activités Récentes
            </CardTitle>
            <CardDescription>Aperçu des dernières activités.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activité</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.status === "Terminé"
                            ? "default"
                            : activity.status === "En Cours"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card 4: Placeholder for more detailed reports */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Rapport Détaillé des Adhésions
            </CardTitle>
            <CardDescription>Tendances des nouvelles adhésions au fil du temps.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center bg-muted/50 rounded-lg border border-dashed">
              <p className="text-muted-foreground">Graphique des adhésions à venir ici...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="text-center text-muted-foreground">
        <p>Des rapports plus détaillés et personnalisables seront disponibles prochainement.</p>
      </div>
    </div>
  )
}
