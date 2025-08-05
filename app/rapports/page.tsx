import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, LineChart, PieChart } from "lucide-react" // Using Lucide icons for charts

// Sample data for reports
const reportSummaries = [
  {
    id: "sum1",
    title: "Résumé des Membres",
    description: "Vue d'ensemble des statistiques des membres.",
    icon: <BarChart className="h-6 w-6 text-muted-foreground" />,
    data: [
      { label: "Total Membres", value: 1234 },
      { label: "Membres Actifs", value: 1000 },
      { label: "Nouveaux ce mois-ci", value: 50 },
    ],
  },
  {
    id: "sum2",
    title: "Statistiques des Activités",
    description: "Performance et participation aux activités.",
    icon: <LineChart className="h-6 w-6 text-muted-foreground" />,
    data: [
      { label: "Activités Terminées", value: 15 },
      { label: "Participants Totaux", value: 850 },
      { label: "Activités à venir", value: 5 },
    ],
  },
  {
    id: "sum3",
    title: "Distribution des Cartes",
    description: "Répartition des types de cartes émises.",
    icon: <PieChart className="h-6 w-6 text-muted-foreground" />,
    data: [
      { label: "Cartes Standard", value: 900 },
      { label: "Cartes Premium", value: 87 },
      { label: "Cartes Expirées", value: 30 },
    ],
  },
]

export default function RapportsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Rapports et Analyses</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportSummaries.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{report.title}</CardTitle>
              {report.icon}
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{report.description}</CardDescription>
              <div className="space-y-2">
                {report.data.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.label}:</span>
                    <span className="font-semibold">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Rapport Détaillé des Membres (Exemple)</CardTitle>
          <CardDescription>Liste des membres avec des détails supplémentaires pour l'analyse.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Date d'Adhésion</TableHead>
                <TableHead className="text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* This data would typically come from a more comprehensive members data source */}
              <TableRow>
                <TableCell>Kouadio</TableCell>
                <TableCell>Marc</TableCell>
                <TableCell>Brazzaville</TableCell>
                <TableCell>2020-01-10</TableCell>
                <TableCell className="text-right">Actif</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Diallo</TableCell>
                <TableCell>Fatoumata</TableCell>
                <TableCell>Pointe-Noire</TableCell>
                <TableCell>2019-03-20</TableCell>
                <TableCell className="text-right">Actif</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nzouzi</TableCell>
                <TableCell>Christian</TableCell>
                <TableCell>Niari</TableCell>
                <TableCell>2022-09-01</TableCell>
                <TableCell className="text-right">Inactif</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
