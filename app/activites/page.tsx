"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { Search, Plus, Calendar, MapPin, Users, Clock, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface Activite {
  id: string
  titre: string
  description: string
  type: "Formation" | "Don de sang" | "Secours" | "Sensibilisation" | "Collecte"
  statut: "Planifiée" | "En cours" | "Terminée" | "Annulée"
  dateDebut: string
  dateFin: string
  lieu: string
  departement: string
  arrondissement: string
  responsable: string
  participants: number
  participantsMax: number
}

const activitesData: Activite[] = [
  {
    id: "1",
    titre: "Formation Premiers Secours",
    description: "Formation aux gestes de premiers secours pour les nouveaux volontaires",
    type: "Formation",
    statut: "En cours",
    dateDebut: "2024-01-15T09:00:00",
    dateFin: "2024-01-15T17:00:00",
    lieu: "Centre Communautaire Bacongo",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    responsable: "Dr. Marie Kabila",
    participants: 25,
    participantsMax: 30,
  },
  {
    id: "2",
    titre: "Campagne Don de Sang",
    description: "Collecte de sang pour les hôpitaux de Pointe-Noire",
    type: "Don de sang",
    statut: "Planifiée",
    dateDebut: "2024-01-20T08:00:00",
    dateFin: "2024-01-20T16:00:00",
    lieu: "Hôpital Général de Pointe-Noire",
    departement: "Kouilou",
    arrondissement: "Pointe-Noire",
    responsable: "Paul Tshisekedi",
    participants: 0,
    participantsMax: 100,
  },
  // Ajout de données supplémentaires pour tester la pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 3}`,
    titre: `Activité Test ${i + 3}`,
    description: `Description de l'activité test ${i + 3}`,
    type: (["Formation", "Don de sang", "Secours", "Sensibilisation", "Collecte"] as const)[i % 5],
    statut: (["Planifiée", "En cours", "Terminée", "Annulée"] as const)[i % 4],
    dateDebut: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}T09:00:00`,
    dateFin: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}T17:00:00`,
    lieu: `Lieu test ${i + 3}`,
    departement: ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"][i % 6],
    arrondissement: ["Bacongo", "Poto-Poto", "Pointe-Noire", "Dolisie", "Nkayi", "Kinkala"][i % 6],
    responsable: `Responsable ${i + 3}`,
    participants: Math.floor(Math.random() * 50),
    participantsMax: 50 + Math.floor(Math.random() * 50),
  })),
]

const ITEMS_PER_PAGE = 12

export default function ActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>(activitesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("toutes")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredActivites = activites.filter((activite) => {
    const matchesSearch =
      activite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activite.lieu.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "toutes") return matchesSearch
    if (activeTab === "planifiees") return matchesSearch && activite.statut === "Planifiée"
    if (activeTab === "en-cours") return matchesSearch && activite.statut === "En cours"
    if (activeTab === "terminees") return matchesSearch && activite.statut === "Terminée"

    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredActivites.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedActivites = filteredActivites.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getStatutColor = (statut: string) => {
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

  const getTypeColor = (type: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Activités</h1>
          <p className="text-gray-600 mt-1">Planifiez et suivez toutes les activités de la Croix Rouge</p>
        </div>
        <Link href="/activites/nouvelle">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Activité
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activités</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredActivites.length}</div>
            <p className="text-xs text-muted-foreground">sur {activites.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredActivites.filter((a) => a.statut === "En cours").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredActivites.filter((a) => a.statut === "Planifiée").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredActivites.reduce((sum, a) => sum + a.participants, 0)}</div>
            <p className="text-xs text-muted-foreground">Total inscrits</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Liste des Activités ({filteredActivites.length})</CardTitle>
              <CardDescription>
                Page {currentPage} sur {totalPages}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="toutes">Toutes</TabsTrigger>
              <TabsTrigger value="planifiees">Planifiées</TabsTrigger>
              <TabsTrigger value="en-cours">En cours</TabsTrigger>
              <TabsTrigger value="terminees">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activité</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Lieu</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActivites.map((activite) => (
                      <TableRow key={activite.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{activite.titre}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{activite.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(activite.type)}>{activite.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(activite.dateDebut)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {activite.lieu}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {activite.arrondissement}, {activite.departement}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{activite.responsable}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {activite.participants}/{activite.participantsMax}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{
                                width: `${(activite.participants / activite.participantsMax) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatutColor(activite.statut)}>{activite.statut}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
