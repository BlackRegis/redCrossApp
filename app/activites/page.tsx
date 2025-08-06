"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye, Filter, Download } from 'lucide-react'
import Link from "next/link"

interface Activite {
  id: string
  nom: string
  type: string
  departement: string
  dateDebut: string
  dateFin: string
  statut: "Planifiée" | "En cours" | "Terminée" | "Annulée"
  responsable: string
  description: string
}

const activitesData: Activite[] = [
  {
    id: "1",
    nom: "Campagne de sensibilisation au paludisme",
    type: "Santé",
    departement: "Brazzaville",
    dateDebut: "2024-03-15",
    dateFin: "2024-03-20",
    statut: "Terminée",
    responsable: "Dr. Jean-Luc MABIALA",
    description: "Campagne de sensibilisation et de distribution de moustiquaires imprégnées dans les quartiers de Brazzaville.",
  },
  {
    id: "2",
    nom: "Distribution de kits d'hygiène",
    type: "Humanitaire",
    departement: "Pointe-Noire",
    dateDebut: "2024-03-10",
    dateFin: "2024-03-12",
    statut: "Terminée",
    responsable: "Mme. Sylvie NDZAMBA",
    description: "Distribution de kits d'hygiène aux familles déplacées suite aux inondations.",
  },
  {
    id: "3",
    nom: "Formation aux premiers secours",
    type: "Formation",
    departement: "Dolisie",
    dateDebut: "2024-04-01",
    dateFin: "2024-04-05",
    statut: "Planifiée",
    responsable: "M. Alain NGOMA",
    description: "Formation certifiante aux gestes de premiers secours pour les volontaires locaux.",
  },
  {
    id: "4",
    nom: "Collecte de sang",
    type: "Santé",
    departement: "Brazzaville",
    dateDebut: "2024-04-10",
    dateFin: "2024-04-10",
    statut: "Planifiée",
    responsable: "Mme. Chantal MBOUMBA",
    description: "Journée de collecte de sang en partenariat avec l'hôpital central.",
  },
  {
    id: "5",
    nom: "Atelier sur la gestion des catastrophes",
    type: "Formation",
    departement: "Kouilou",
    dateDebut: "2024-03-25",
    dateFin: "2024-03-27",
    statut: "En cours",
    responsable: "M. Patrick ONDONGO",
    description: "Atelier de renforcement des capacités pour les équipes d'intervention rapide.",
  },
]

export default function ActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>(activitesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")

  const typesActivite = ["Santé", "Humanitaire", "Formation", "Logistique"]
  const departements = ["Brazzaville", "Pointe-Noire", "Dolisie", "Kouilou", "Niari", "Pool", "Plateaux"]

  const filteredActivites = activites.filter((activite) => {
    const matchesSearch =
      activite.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activite.responsable.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || activite.type === filterType
    const matchesDepartement = filterDepartement === "all" || activite.departement === filterDepartement
    const matchesStatut = filterStatut === "all" || activite.statut === filterStatut

    return matchesSearch && matchesType && matchesDepartement && matchesStatut
  })

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Planifiée":
        return "bg-blue-100 text-blue-800"
      case "En cours":
        return "bg-yellow-100 text-yellow-800"
      case "Terminée":
        return "bg-green-100 text-green-800"
      case "Annulée":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearFilters = () => {
    setFilterType("all")
    setFilterDepartement("all")
    setFilterStatut("all")
    setSearchTerm("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Activités</h1>
          <p className="text-gray-600 mt-1">Gérez toutes les activités de la Croix Rouge</p>
        </div>
        <Link href="/activites/nouvelle">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Activité
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredActivites.length}</div>
            <p className="text-xs text-muted-foreground">sur {activites.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredActivites.filter((a) => a.statut === "Planifiée").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredActivites.filter((a) => a.statut === "Terminée").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredActivites.filter((a) => a.statut === "En cours").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
              <CardDescription>Filtrez la liste des activités selon vos critères</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Effacer les filtres
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom, responsable, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'activité</label>
              <Select value={filterType} onValueChange={setFilterType}>
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
              <Select value={filterStatut} onValueChange={setFilterStatut}>
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

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Activités ({filteredActivites.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activité</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivites.length > 0 ? (
                  filteredActivites.map((activite) => (
                    <TableRow key={activite.id}>
                      <TableCell>
                        <div className="font-medium">{activite.nom}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {activite.description}
                        </div>
                      </TableCell>
                      <TableCell>{activite.type}</TableCell>
                      <TableCell>{activite.departement}</TableCell>
                      <TableCell>
                        {new Date(activite.dateDebut).toLocaleDateString("fr-FR")} -{" "}
                        {new Date(activite.dateFin).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatutColor(activite.statut)}>{activite.statut}</Badge>
                      </TableCell>
                      <TableCell>{activite.responsable}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" title="Voir les détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Aucune activité trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
