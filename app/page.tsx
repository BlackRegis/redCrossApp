"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building2, CreditCard, Calendar } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import Link from "next/link"

const membresParArrondissement = [
  { arrondissement: "Bacongo", membres: 156, departement: "Brazzaville" },
  { arrondissement: "Poto-Poto", membres: 134, departement: "Brazzaville" },
  { arrondissement: "Moungali", membres: 98, departement: "Brazzaville" },
  { arrondissement: "Ouenzé", membres: 87, departement: "Brazzaville" },
  { arrondissement: "Talangaï", membres: 76, departement: "Brazzaville" },
  { arrondissement: "Pointe-Noire", membres: 234, departement: "Kouilou" },
  { arrondissement: "Dolisie", membres: 123, departement: "Niari" },
  { arrondissement: "Nkayi", membres: 89, departement: "Bouenza" },
]

const repartitionParDepartement = [
  { name: "Brazzaville", value: 551, color: "#dc2626" },
  { name: "Kouilou", value: 234, color: "#ea580c" },
  { name: "Niari", value: 123, color: "#d97706" },
  { name: "Bouenza", value: 89, color: "#ca8a04" },
  { name: "Pool", value: 67, color: "#65a30d" },
  { name: "Plateaux", value: 45, color: "#059669" },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur le tableau de bord</h1>
      <p className="text-gray-600">
        Ici, vous pouvez gérer les membres, les activités et l'organisation de la Croix Rouge.
      </p>
      <Button>Commencer</Button>

      {/* Header */}
      <div className="flex items-center justify-between mt-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la Croix Rouge - République du Congo</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,109</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Départements</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Actives</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,045</div>
            <p className="text-xs text-muted-foreground">94% des membres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Arrondissement</CardTitle>
            <CardDescription>Nombre de membres par arrondissement</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                membres: {
                  label: "Membres",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={membresParArrondissement}>
                  <XAxis dataKey="arrondissement" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="membres" fill="var(--color-membres)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Département</CardTitle>
            <CardDescription>Distribution des membres par département</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                brazzaville: { label: "Brazzaville", color: "#dc2626" },
                kouilou: { label: "Kouilou", color: "#ea580c" },
                niari: { label: "Niari", color: "#d97706" },
                bouenza: { label: "Bouenza", color: "#ca8a04" },
                pool: { label: "Pool", color: "#65a30d" },
                plateaux: { label: "Plateaux", color: "#059669" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repartitionParDepartement}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {repartitionParDepartement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/membres">
              <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
                <Users className="h-6 w-6" />
                Gérer les Membres
              </Button>
            </Link>
            <Link href="/organisation">
              <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
                <Building2 className="h-6 w-6" />
                Organisation
              </Button>
            </Link>
            <Link href="/cartes">
              <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
                <CreditCard className="h-6 w-6" />
                Cartes de Membre
              </Button>
            </Link>
            <Link href="/activites">
              <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
                <Calendar className="h-6 w-6" />
                Activités
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Formation premiers secours</p>
                <p className="text-xs text-muted-foreground">Bacongo - Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau membre ajouté</p>
                <p className="text-xs text-muted-foreground">Poto-Poto - Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Don de sang organisé</p>
                <p className="text-xs text-muted-foreground">Pointe-Noire - Hier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
