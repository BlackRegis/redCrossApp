"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination"
import { Search, Plus, Edit, Trash2, Eye, Filter, Download } from 'lucide-react'
import Link from "next/link"

interface Membre {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  departement: string
  arrondissement?: string
  statut: "Actif" | "Inactif" | "Suspendu"
  dateAdhesion?: string
  dateNaissance?: string
  age?: number
  profession?: string
  typeAdhesion?: string
  numeroCarte?: string
  sexe?: "M" | "F"
  adresse?: string
}

const membresData: Membre[] = [
  {
    id: "1",
    nom: "Mukendi",
    prenom: "Jean",
    email: "jean.mukendi@email.com",
    telephone: "+242 123 456 789",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    statut: "Actif",
    dateAdhesion: "2023-01-15",
    dateNaissance: "1985-03-20",
    age: 39,
    profession: "Médecin",
    typeAdhesion: "Membre Actif",
    numeroCarte: "CRC-BZV-001",
    sexe: "M",
    adresse: "Avenue Félix Éboué, Bacongo",
  },
  {
    id: "2",
    nom: "Kabila",
    prenom: "Marie",
    email: "marie.kabila@email.com",
    telephone: "+242 987 654 321",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    statut: "Actif",
    dateAdhesion: "2023-03-20",
    dateNaissance: "1990-07-15",
    age: 34,
    profession: "Infirmière",
    typeAdhesion: "Volontaire",
    numeroCarte: "CRC-BZV-002",
    sexe: "F",
    adresse: "Rue Monseigneur Augouard, Poto-Poto",
  },
  {
    id: "3",
    nom: "Kouadio",
    prenom: "Marc",
    telephone: "+242 06 111 2233",
    email: "marc.kouadio@example.com",
    departement: "Brazzaville",
    statut: "Actif",
  },
  {
    id: "4",
    nom: "Diallo",
    prenom: "Fatoumata",
    telephone: "+242 05 444 5566",
    email: "fatoumata.diallo@example.com",
    departement: "Pointe-Noire",
    statut: "Actif",
  },
  {
    id: "5",
    nom: "Nzouzi",
    prenom: "Christian",
    telephone: "+242 04 777 8899",
    email: "christian.nzouzi@example.com",
    departement: "Niari",
    statut: "Inactif",
  },
  {
    id: "6",
    nom: "Brazza",
    prenom: "Congo",
    telephone: "+242 06 123 4567",
    email: "brazza.congo@example.com",
    departement: "Brazzaville",
    statut: "Actif",
  },
  {
    id: "7",
    nom: "Pointe",
    prenom: "Noire",
    telephone: "+242 05 987 6543",
    email: "pointe.noire@example.com",
    departement: "Pointe-Noire",
    statut: "Actif",
  },
  // Ajout de données supplémentaires pour tester la pagination
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 8}`,
    nom: `Nom${i + 8}`,
    prenom: `Prénom${i + 8}`,
    email: `membre${i + 8}@email.com`,
    telephone: `+242 ${String(i + 100).padStart(3, "0")} 123 456`,
    departement: ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"][i % 6],
    arrondissement: ["Bacongo", "Poto-Poto", "Pointe-Noire", "Dolisie", "Nkayi", "Kinkala"][i % 6],
    statut: (["Actif", "Inactif", "Suspendu"] as const)[i % 3],
    dateAdhesion: `2023-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    dateNaissance: `198${i % 10}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    age: 25 + (i % 30),
    profession: ["Médecin", "Infirmière", "Enseignant", "Ingénieur", "Comptable", "Juriste"][i % 6],
    typeAdhesion: ["Volontaire", "Membre Actif", "Membre Bienfaiteur"][i % 3],
    numeroCarte: `CRC-TEST-${String(i + 8).padStart(3, "0")}`,
    sexe: (i % 2 === 0 ? "M" : "F") as "M" | "F",
    adresse: `Adresse test ${i + 8}`,
  })),
]

const ITEMS_PER_PAGE = 15

export default function MembresPage() {
  const [membres, setMembres] = useState<Membre[]>(membresData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterArrondissement, setFilterArrondissement] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAge, setFilterAge] = useState("all")
  const [filterSexe, setFilterSexe] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const departements = ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"]
  const arrondissements = {
    Brazzaville: ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï"],
    Kouilou: ["Pointe-Noire"],
    Niari: ["Dolisie"],
    Bouenza: ["Nkayi"],
    Pool: ["Kinkala"],
    Plateaux: ["Djambala"],
  }

  const filteredMembres = membres.filter((membre) => {
    const matchesSearch =
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.profession?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartement = filterDepartement === "all" || membre.departement === filterDepartement
    const matchesArrondissement = filterArrondissement === "all" || membre.arrondissement === filterArrondissement
    const matchesStatut = filterStatut === "all" || membre.statut === filterStatut
    const matchesSexe = filterSexe === "all" || membre.sexe === filterSexe

    let matchesAge = true
    if (filterAge !== "all") {
      switch (filterAge) {
        case "18-25":
          matchesAge = membre.age >= 18 && membre.age <= 25
          break
        case "26-35":
          matchesAge = membre.age >= 26 && membre.age <= 35
          break
        case "36-45":
          matchesAge = membre.age >= 36 && membre.age <= 45
          break
        case "46+":
          matchesAge = membre.age >= 46
          break
      }
    }

    return matchesSearch && matchesDepartement && matchesArrondissement && matchesStatut && matchesAge && matchesSexe
  })

  // Pagination
  const totalPages = Math.ceil(filteredMembres.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedMembres = filteredMembres.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getStatutColor = (statut: string) => {
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

  const clearFilters = () => {
    setFilterDepartement("all")
    setFilterArrondissement("all")
    setFilterStatut("all")
    setFilterAge("all")
    setFilterSexe("all")
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-600 mt-1">Gérez tous les membres de la Croix Rouge</p>
        </div>
        <Link href="/membres/nouveau">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Membre
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMembres.length}</div>
            <p className="text-xs text-muted-foreground">sur {membres.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredMembres.filter((m) => m.statut === "Actif").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Âge Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(filteredMembres.reduce((sum, m) => sum + m.age!, 0) / filteredMembres.length || 0)} ans
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Répartition H/F</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-bold">{filteredMembres.filter((m) => m.sexe === "M").length}H</span> /{" "}
              <span className="font-bold">{filteredMembres.filter((m) => m.sexe === "F").length}F</span>
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
              <CardDescription>Filtrez la liste des membres selon vos critères</CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom, email, profession..."
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
              <label className="text-sm font-medium">Arrondissement</label>
              <Select
                value={filterArrondissement}
                onValueChange={setFilterArrondissement}
                disabled={!filterDepartement || filterDepartement === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les arrondissements</SelectItem>
                  {filterDepartement &&
                    arrondissements[filterDepartement as keyof typeof arrondissements]?.map((arr) => (
                      <SelectItem key={arr} value={arr}>
                        {arr}
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
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tranche d'âge</label>
              <Select value={filterAge} onValueChange={setFilterAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les âges</SelectItem>
                  <SelectItem value="18-25">18-25 ans</SelectItem>
                  <SelectItem value="26-35">26-35 ans</SelectItem>
                  <SelectItem value="36-45">36-45 ans</SelectItem>
                  <SelectItem value="46+">46+ ans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sexe</label>
              <Select value={filterSexe} onValueChange={setFilterSexe}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="M">Homme</SelectItem>
                  <SelectItem value="F">Femme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Membres ({filteredMembres.length})</CardTitle>
          <CardDescription>
            Page {currentPage} sur {totalPages}
          </CardDescription>
          <div className="relative mt-4">
            <Input
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Informations</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>N° Carte</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembres.map((membre) => (
                  <TableRow key={membre.id}>
                    <TableCell className="font-medium">
                      {membre.prenom} {membre.nom}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{membre.email}</div>
                        <div className="text-sm text-muted-foreground">{membre.telephone}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{membre.adresse}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{membre.departement}</div>
                        <div className="text-sm text-muted-foreground">{membre.arrondissement}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{membre.typeAdhesion}</div>
                        <div className="text-xs text-muted-foreground">
                          Né(e) le {new Date(membre.dateNaissance!).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(membre.statut)}>{membre.statut}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{membre.numeroCarte}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/membres/${membre.id}`}>
                        <Button variant="ghost" size="sm" title="Voir les détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
        </CardContent>
      </Card>
    </div>
  )
}
