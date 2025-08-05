"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Sample data for reports (centralized as requested)
const reportsData = {
  memberStats: [
    { name: "Actifs", count: 8 },
    { name: "Inactifs", count: 2 },
    { name: "Nouveaux (ce mois)", count: 3 },
  ],
  activityStats: [
    { name: "Terminées", count: 15 },
    { name: "En cours", count: 5 },
    { name: "Planifiées", count: 8 },
  ],
  departmentMembers: [
    { name: "Brazzaville", members: 40 },
    { name: "Pointe-Noire", members: 30 },
    { name: "Niari", members: 15 },
    { name: "Pool", members: 10 },
    { name: "Kouilou", members: 5 },
  ],
  monthlyActivities: [
    { month: "Jan", count: 5 },
    { month: "Fév", count: 7 },
    { month: "Mar", count: 6 },
    { month: "Avr", count: 9 },
    { month: "Mai", count: 8 },
    { month: "Juin", count: 10 },
  ],
  recentActivities: [
    { id: "A001", name: "Campagne de sensibilisation VIH", date: "2024-05-20", status: "Terminée" },
    { id: "A002", name: "Distribution de vivres", date: "2024-05-22", status: "En cours" },
    { id: "A003", name: "Formation en gestion de crise", date: "2024-05-25", status: "Planifiée" },
  ],
}

export default function RapportsPage() {
  const [reportType, setReportType] = useState("members")
  const [timeframe, setTimeframe] = useState("monthly")

  return (
    <div className="flex-1 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Rapports & Statistiques</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques des Membres</CardTitle>
                <CardDescription>Répartition des membres par statut.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={reportsData.memberStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Nombre de Membres" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques des Activités</CardTitle>
                <CardDescription>Statut actuel des activités.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={reportsData.activityStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Nombre d'Activités" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
                <CardDescription>Les dernières activités enregistrées.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsData.recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.id}</TableCell>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapport Détaillé des Membres</CardTitle>
              <CardDescription>Analyse des membres par département.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="member-timeframe">Période</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger id="member-timeframe" className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportsData.departmentMembers}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="members" fill="#ffc658" name="Nombre de Membres" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapport Détaillé des Activités</CardTitle>
              <CardDescription>Évolution du nombre d'activités par mois.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="activity-timeframe">Période</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger id="activity-timeframe" className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportsData.monthlyActivities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Nombre d'Activités"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
