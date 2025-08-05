"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Search, Plus, Trash2, Eye, Filter, Download, CreditCard, Printer } from "lucide-react"
import Image from "next/image"

interface Carte {
  id: string
  numeroCarte: string
  nomMembre: string
  prenomMembre: string
  statut: "Active" | "Expirée" | "Perdue" | "Bloquée"
  dateEmission: string
  dateExpiration: string
  typeAdhesion: string
  departement: string
  arrondissement: string
  photoMembre: string
  qrCode: string
}

const cartesData: Carte[] = [
  {
    id: "1",
    numeroCarte: "CRC-BZV-001",
    nomMembre: "Mukendi",
    prenomMembre: "Jean",
    statut: "Active",
    dateEmission: "2023-01-15",
    dateExpiration: "2025-01-15",
    typeAdhesion: "Membre Actif",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    photoMembre: "/placeholder.svg?height=50&width=50&text=JM",
    qrCode: "/placeholder.svg?height=50&width=50&text=QR1",
  },
  {
    id: "2",
    numeroCarte: "CRC-BZV-002",
    nomMembre: "Kabila",
    prenomMembre: "Marie",
    statut: "Active",
    dateEmission: "2023-03-20",
    dateExpiration: "2025-03-20",
    typeAdhesion: "Volontaire",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    photoMembre: "/placeholder.svg?height=50&width=50&text=MK",
    qrCode: "/placeholder.svg?height=50&width=50&text=QR2",
  },
  {
    id: "3",
    numeroCarte: "CRC-KOU-001",
    nomMembre: "Tshisekedi",
    prenomMembre: "Paul",
    statut: "Expirée",
    dateEmission: "2022-11-10",
    dateExpiration: "2024-11-10",
    typeAdhesion: "Membre Bienfaiteur",
    departement: "Kouilou",
    arrondissement: "Pointe-Noire",
    photoMembre: "/placeholder.svg?height=50&width=50&text=PT",
    qrCode: "/placeholder.svg?height=50&width=50&text=QR3",
  },
  {
    id: "4",
    numeroCarte: "CRC-BZV-003",
    nomMembre: "Ngouabi",
    prenomMembre: "Sophie",
    statut: "Active",
    dateEmission: "2023-05-12",
    dateExpiration: "2025-05-12",
    typeAdhesion: "Volontaire",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    photoMembre: "/placeholder.svg?height=50&width=50&text=SN",
    qrCode: "/placeholder.svg?height=50&width=50&text=QR4",
  },
  {
    id: "5",
    numeroCarte: "CRC-NIA-001",
    nomMembre: "Sassou",
    prenomMembre: "André",
    statut: "Active",
    dateEmission: "2023-02-28",
    dateExpiration: "2025-02-28",
    typeAdhesion: "Membre Actif",
    departement: "Niari",
    arrondissement: "Dolisie",
    photoMembre: "/placeholder.svg?height=50&width=50&text=AS",
    qrCode: "/placeholder.svg?height=50&width=50&text=QR5",
  },
]

export default function CartesPage() {
  const [cartes, setCartes] = useState<Carte[]>(cartesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterTypeAdhesion, setFilterTypeAdhesion] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const departements = ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"]
  const typesAdhesion = ["Membre Actif", "Volontaire", "Membre Bienfaiteur", "Membre d'Honneur"]

  const filteredCartes = cartes.filter((carte) => {
    const matchesSearch =
      carte.numeroCarte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.nomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.prenomMembre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatut = filterStatut === "all" || carte.statut === filterStatut
    const matchesDepartement = filterDepartement === "all" || carte.departement === filterDepartement
    const matchesTypeAdhesion = filterTypeAdhesion === "all" || carte.typeAdhesion === filterTypeAdhesion

    return matchesSearch && matchesStatut && matchesDepartement && matchesTypeAdhesion
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredCartes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCartes = filteredCartes.slice(startIndex, startIndex + itemsPerPage)

  const getStatutColor = (statut: string) => {
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

  const clearFilters = () => {
    setSearchTerm("")
    setFilterStatut("all")
    setFilterDepartement("all")
    setFilterTypeAdhesion("all")
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cartes de Membre</h1>
          <p className="text-gray-600 mt-1">Générez, suivez et gérez les cartes d'identification des membres</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Carte
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cartes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCartes.length}</div>
            <p className="text-xs text-muted-foreground">sur {cartes.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Actives</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredCartes.filter((c) => c.statut === "Active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Expirées</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredCartes.filter((c) => c.statut === "Expirée").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Imprimer</CardTitle>
            <Printer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5</div>
            <p className="text-xs text-muted-foreground">Nouvelles demandes</p>
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
              <CardDescription>Filtrez la liste des cartes selon vos critères</CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Select value={filterStatut} onValueChange={setFilterStatut}>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'Adhésion</label>
              <Select value={filterTypeAdhesion} onValueChange={setFilterTypeAdhesion}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typesAdhesion.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Cartes ({filteredCartes.length})</CardTitle>
          <CardDescription>Aperçu et gestion des cartes de membre.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro de Carte</TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead>Type Adhésion</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCartes.map((carte) => (
                  <TableRow key={carte.id}>
                    <TableCell className="font-medium">{carte.numeroCarte}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={carte.photoMembre || "/placeholder.svg"}
                          alt={`${carte.prenomMembre} ${carte.nomMembre}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div>
                          {carte.prenomMembre} {carte.nomMembre}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{carte.typeAdhesion}</TableCell>
                    <TableCell>
                      <div>{carte.departement}</div>
                      <div className="text-sm text-muted-foreground">{carte.arrondissement}</div>
                    </TableCell>
                    <TableCell>
                      <div>Émise: {new Date(carte.dateEmission).toLocaleDateString("fr-FR")}</div>
                      <div className="text-sm text-muted-foreground">
                        Expire: {new Date(carte.dateExpiration).toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutColor(carte.statut)}>{carte.statut}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  )
}
