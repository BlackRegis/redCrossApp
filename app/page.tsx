import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, Users, Activity, CreditCard } from "lucide-react" // Example icons
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Placeholder data for dashboard
const membersData = [
  { month: "Jan", new: 30, total: 300 },
  { month: "Feb", new: 25, total: 325 },
  { month: "Mar", new: 40, total: 365 },
  { month: "Apr", new: 35, total: 400 },
  { month: "May", new: 50, total: 450 },
]

const activitiesData = [
  { month: "Jan", completed: 5, planned: 10 },
  { month: "Feb", completed: 7, planned: 8 },
  { month: "Mar", completed: 10, planned: 12 },
  { month: "Apr", completed: 8, planned: 15 },
  { month: "May", completed: 12, planned: 10 },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Total Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">+20.1% depuis le mois dernier</p>
          </CardContent>
        </Card>

        {/* Card 2: Total Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activités Terminées</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60</div>
            <p className="text-xs text-muted-foreground">+15% depuis le mois dernier</p>
          </CardContent>
        </Card>

        {/* Card 3: Cards Issued */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cartes Délivrées</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">400</div>
            <p className="text-xs text-muted-foreground">+10% depuis le mois dernier</p>
          </CardContent>
        </Card>

        {/* Chart 1: Member Growth */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Croissance des Membres
            </CardTitle>
            <CardDescription>Nouveaux membres et total des membres par mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                new: { label: "Nouveaux Membres", color: "hsl(var(--primary))" },
                total: { label: "Total Membres", color: "hsl(var(--secondary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={membersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="new" stroke="var(--color-new)" name="Nouveaux" />
                  <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Activities Status */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Statut des Activités
            </CardTitle>
            <CardDescription>Activités terminées vs. planifiées.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: { label: "Terminées", color: "hsl(var(--primary))" },
                planned: { label: "Planifiées", color: "hsl(var(--muted-foreground))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activitiesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" fill="var(--color-completed)" name="Terminées" />
                  <Bar dataKey="planned" fill="var(--color-planned)" name="Planifiées" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
