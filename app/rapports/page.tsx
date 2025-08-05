"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Users, Activity, CreditCard, Building2, Download, Filter, TrendingUp, PieChartIcon } from "lucide-react"
import { Search } from "lucide-react" // Import Search component

interface RapportMembre {
  id: string
  nom: string
  prenom: string
  departement: string
  arrondissement: string
  statut: "Actif" | "Inactif" | "Suspendu"
  age: number
  typeAdhesion: string
  activitesParticipees: number
  formationsSuivies: number
}

interface RapportActivite {
  id: string
  titre: string
  type: string
  statut: "Planifiée" | "En cours" | "Terminée" | "Annulée"
  dateDebut: string
  dateFin: string
  lieu: string
  participants: number
  participantsMax: number
}

interface RapportCarte {
  id: string
  numeroCarte: string
  nomMembre: string
  prenomMembre: string
  statut: "Active" | "Expirée" | "Perdue" | "Bloquée"
  dateEmission: string
  dateExpiration: string
  departement: string
}

const rapportsMembresData: RapportMembre[] = [
  {
    id: "1",
    nom: "Mukendi",
    prenom: "Jean",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    statut: "Actif",
    age: 39,
    typeAdhesion: "Membre Actif",
    activitesParticipees: 5,
    formationsSuivies: 3,
  },
  {
    id: "2",
    nom: "Kabila",
    prenom: "Marie",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    statut: "Actif",
    age: 34,
    typeAdhesion: "Volontaire",
    activitesParticipees: 8,
    formationsSuivies: 2,
  },
  {
    id: "3",
    nom: "Tshisekedi",
    prenom: "Paul",
    departement: "Kouilou",
    arrondissement: "Pointe-Noire",
    statut: "Inactif",
    age: 45,
    typeAdhesion: "Membre Bienfaiteur",
    activitesParticipees: 1,
    formationsSuivies: 0,
  },
  {
    id: "4",
    nom: "Ngouabi",
    prenom: "Sophie",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    statut: "Actif",
    age: 32,
    typeAdhesion: "Volontaire",
    activitesParticipees: 6,
    formationsSuivies: 4,
  },
  {
    id: "5",
    nom: "Sassou",
    prenom: "André",
    departement: "Niari",
    arrondissement: "Dolisie",
    statut: "Actif",
    age: 36,
    typeAdhesion: "Membre Actif",
    activitesParticipees: 10,
    formationsSuivies: 5,
  },
]

const rapportsActivitesData: RapportActivite[] = [
  {
    id: "1",
    titre: "Formation Premiers Secours",
    type: "Formation",
    statut: "Terminée",
    dateDebut: "2024-01-15",
    dateFin: "2024-01-15",
    lieu: "Centre Communautaire Bacongo",
    participants: 25,
    participantsMax: 30,
  },
  {
    id: "2",
    titre: "Campagne Don de Sang",
    type: "Don de sang",
    statut: "En cours",
    dateDebut: "2024-01-20",
    dateFin: "2024-01-20",
    lieu: "Hôpital Général de Pointe-Noire",
    participants: 80,
    participantsMax: 100,
  },
  {
    id: "3",
    titre: "Distribution de Kits Alimentaires",
    type: "Secours",
    statut: "Terminée",
    dateDebut: "2023-12-24",
    dateFin: "2023-12-24",
    lieu: "Centre Social Ouenzé",
    participants: 50,
    participantsMax: 50,
  },
  {
    id: "4",
    titre: "Sensibilisation au VIH/SIDA",
    type: "Sensibilisation",
    statut: "Planifiée",
    dateDebut: "2024-02-01",
    dateFin: "2024-02-01",
    lieu: "Marché Central Dolisie",
    participants: 0,
    participantsMax: 150,
  },
]

const rapportsCartesData: RapportCarte[] = [
  {
    id: "1",
    numeroCarte: "CRC-BZV-001",
    nomMembre: "Mukendi",
    prenomMembre: "Jean",
    statut: "Active",
    dateEmission: "2023-01-15",
    dateExpiration: "2025-01-15",
    departement: "Brazzaville",
  },
  {
    id: "2",
    numeroCarte: "CRC-BZV-002",
    nomMembre: "Kabila",
    prenomMembre: "Marie",
    statut: "Active",
    dateEmission: "2023-03-20",
    dateExpiration: "2025-03-20",
    departement: "Brazzaville",
  },
  {
    id: "3",
    numeroCarte: "CRC-KOU-001",
    nomMembre: "Tshisekedi",
    prenomMembre: "Paul",
    statut: "Expirée",
    dateEmission: "2022-11-10",
    dateExpiration: "2024-11-10",
    departement: "Kouilou",
  },
  {
    id: "4",
    numeroCarte: "CRC-BZV-003",
    nomMembre: "Ngouabi",
    prenomMembre: "Sophie",
    statut: "Active",
    dateEmission: "2023-05-12",
    dateExpiration: "2025-05-12",
    departement: "Brazzaville",
  },
]

const repartitionStatutMembres = [
  { name: "Actif", value: 4, color: "#22c55e" },
  { name: "Inactif", value: 1, color: "#6b7280" },
  { name: "Suspendu", value: 0, color: "#ef4444" },
]

const activitesParMois = [
  { month: "Jan", activites: 2 },
  { month: "Fév", activites: 1 },
  { month: "Mar", activites: 3 },
  { month: "Avr", activites: 2 },
  { month: "Mai", activites: 4 },
  { month: "Juin", activites: 3 },
]

export default function RapportsPage() {
  const [activeTab, setActiveTab] = useState("membres")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterStatutMembre, setFilterStatutMembre] = useState("all")
  const [filterTypeActivite, setFilterTypeActivite] = useState("all")
  const [filterStatutActivite, setFilterStatutActivite] = useState("all")
  const [filterStatutCarte, setFilterStatutCarte] = useState("all")

  const departements = ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"]
  const typesActivite = ["Formation", "Don de sang", "Secours", "Sensibilisation", "Collecte"]

  const filteredRapportsMembres = rapportsMembresData.filter((membre) => {
    const matchesSearch =
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartement = filterDepartement === "all" || membre.departement === filterDepartement
    const matchesStatut = filterStatutMembre === "all" || membre.statut === filterStatutMembre

    return matchesSearch && matchesDepartement && matchesStatut
  })

  const filteredRapportsActivites = rapportsActivitesData.filter((activite) => {
    const matchesSearch = activite.titre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterTypeActivite === "all" || activite.type === filterTypeActivite
    const matchesStatut = filterStatutActivite === "all" || activite.statut === filterStatutActivite
    return matchesSearch && matchesType && matchesStatut
  })

  const filteredRapportsCartes = rapportsCartesData.filter((carte) => {
    const matchesSearch =
      carte.numeroCarte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.nomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.prenomMembre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = filterStatutCarte === "all" || carte.statut === filterStatutCarte
    const matchesDepartement = filterDepartement === "all" || carte.departement === filterDepartement
    return matchesSearch && matchesStatut && matchesDepartement
  })

  const getStatutMembreColor = (statut: string) => {
    switch (statut) {
      case "Actif":
        return "bg-green-100 text-green-800"
      case "Inactif":
        return "bg-gray-100 text-gray-800"
      case "Suspendu":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatutActiviteColor = (statut: string) => {
    switch (statut) {
      case "Planifiée":
        return "bg-blue-100 text-blue-800"
      case "En cours":
        return "bg-green-100 text-green-800"
      case "Terminée":
        return "bg-gray-100 text-gray-800"
      case "Annulée":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatutCarteColor = (statut: string) => {
    switch (statut) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expirée":
        return "bg-orange-100 text-orange-800"
      case "Perdue":
        return "bg-red-100 text-red-800"
      case "Bloquée":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeActiviteColor = (type: string) => {
    switch (type) {
      case "Formation":
        return "bg-purple-100 text-purple-800"
      case "Don de sang":
        return "bg-red-100 text-red-800"
      case "Secours":
        return "bg-orange-100 text-orange-800"
      case "Sensibilisation":
        return "bg-yellow-100 text-yellow-800"
      case "Collecte":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterDepartement("all")
    setFilterStatutMembre("all")
    setFilterTypeActivite("all")
    setFilterStatutActivite("all")
    setFilterStatutCarte("all")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Générateur de Rapports</h1>
          <p className="text-gray-600 mt-1">
            Créez et exportez des rapports détaillés sur les données de la Croix Rouge
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Download className="h-4 w-4 mr-2" />
          Exporter le Rapport
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rapportsMembresData.length}</div>
            <p className="text-xs text-muted-foreground">Membres analysés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports Activités</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rapportsActivitesData.length}</div>
            <p className="text-xs text-muted-foreground">Activités analysées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports Cartes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rapportsCartesData.length}</div>
            <p className="text-xs text-muted-foreground">Cartes analysées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports Organisation</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Structure analysée</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Types de Rapports</CardTitle>
          <CardDescription>Sélectionnez le type de rapport que vous souhaitez générer</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="membres">
                <Users className="h-4 w-4 mr-2" />
                Membres
              </TabsTrigger>
              <TabsTrigger value="activites">
                <Activity className="h-4 w-4 mr-2" />
                Activités
              </TabsTrigger>
              <TabsTrigger value="cartes">
                <CreditCard className="h-4 w-4 mr-2" />
                Cartes
              </TabsTrigger>
            </TabsList>

            {/* Rapports Membres */}
            <TabsContent value="membres" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres pour Membres
                      </CardTitle>
                      <CardDescription>Appliquez des filtres pour affiner les données des membres</CardDescription>
                    </div>
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      Effacer les filtres
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recherche</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Nom, prénom..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Département</label>
                      <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les départements</SelectItem>
                          {departements.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={filterStatutMembre} onValueChange={setFilterStatutMembre}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="Actif">Actif</SelectItem>
                          <SelectItem value="Inactif">Inactif</SelectItem>
                          <SelectItem value="Suspendu">Suspendu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Répartition des Membres par Statut
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        actif: { label: "Actif", color: "#22c55e" },
                        inactif: { label: "Inactif", color: "#6b7280" },
                        suspendu: { label: "Suspendu", color: "#ef4444" },
                      }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={repartitionStatutMembres}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {repartitionStatutMembres.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Activités et Formations par Membre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        activites: { label: "Activités", color: "hsl(var(--chart-1))" },
                        formations: { label: "Formations", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[250px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredRapportsMembres}>
                          <XAxis dataKey="prenom" angle={-45} textAnchor="end" height={80} fontSize={12} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="activitesParticipees" fill="var(--color-activites)" name="Activités" />
                          <Bar dataKey="formationsSuivies" fill="var(--color-formations)" name="Formations" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom Complet</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Arrondissement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Âge</TableHead>
                      <TableHead>Type Adhésion</TableHead>
                      <TableHead>Activités</TableHead>
                      <TableHead>Formations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRapportsMembres.map((membre) => (
                      <TableRow key={membre.id}>
                        <TableCell className="font-medium">
                          {membre.prenom} {membre.nom}
                        </TableCell>
                        <TableCell>{membre.departement}</TableCell>
                        <TableCell>{membre.arrondissement}</TableCell>
                        <TableCell>
                          <span className={getStatutMembreColor(membre.statut)}>{membre.statut}</span>
                        </TableCell>
                        <TableCell>{membre.age}</TableCell>
                        <TableCell>{membre.typeAdhesion}</TableCell>
                        <TableCell>{membre.activitesParticipees}</TableCell>
                        <TableCell>{membre.formationsSuivies}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Rapports Activités */}
            <TabsContent value="activites" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres pour Activités
                      </CardTitle>
                      <CardDescription>Appliquez des filtres pour affiner les données des activités</CardDescription>
                    </div>
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      Effacer les filtres
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recherche</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Titre, lieu..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type d'Activité</label>
                      <Select value={filterTypeActivite} onValueChange={setFilterTypeActivite}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          {typesActivite.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={filterStatutActivite} onValueChange={setFilterStatutActivite}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="Planifiée">Planifiée</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="Terminée">Terminée</SelectItem>
                          <SelectItem value="Annulée">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Activités par Mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      activites: { label: "Activités", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activitesParMois}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="activites" stroke="var(--color-activites)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Participants</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRapportsActivites.map((activite) => (
                      <TableRow key={activite.id}>
                        <TableCell className="font-medium">{activite.titre}</TableCell>
                        <TableCell>
                          <span className={getTypeActiviteColor(activite.type)}>{activite.type}</span>
                        </TableCell>
                        <TableCell>
                          <span className={getStatutActiviteColor(activite.statut)}>{activite.statut}</span>
                        </TableCell>
                        <TableCell>
                          {new Date(activite.dateDebut).toLocaleDateString("fr-FR")} -{" "}
                          {new Date(activite.dateFin).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>{activite.lieu}</TableCell>
                        <TableCell>
                          {activite.participants}/{activite.participantsMax}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Rapports Cartes */}
            <TabsContent value="cartes" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres pour Cartes
                      </CardTitle>
                      <CardDescription>Appliquez des filtres pour affiner les données des cartes</CardDescription>
                    </div>
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      Effacer les filtres
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recherche</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Numéro, nom du membre..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={filterStatutCarte} onValueChange={setFilterStatutCarte}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Expirée">Expirée</SelectItem>
                          <SelectItem value="Perdue">Perdue</SelectItem>
                          <SelectItem value="Bloquée">Bloquée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Département</label>
                      <Select value={filterDepartement} onValueChange={setFilterDepartement}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les départements</SelectItem>
                          {departements.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro de Carte</TableHead>
                      <TableHead>Membre</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Date Emission</TableHead>
                      <TableHead>Date Expiration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRapportsCartes.map((carte) => (
                      <TableRow key={carte.id}>
                        <TableCell className="font-medium">{carte.numeroCarte}</TableCell>
                        <TableCell>
                          {carte.prenomMembre} {carte.nomMembre}
                        </TableCell>
                        <TableCell>
                          <span className={getStatutCarteColor(carte.statut)}>{carte.statut}</span>
                        </TableCell>
                        <TableCell>{carte.departement}</TableCell>
                        <TableCell>{new Date(carte.dateEmission).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{new Date(carte.dateExpiration).toLocaleDateString("fr-FR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
