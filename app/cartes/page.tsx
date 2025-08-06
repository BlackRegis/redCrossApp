"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, Eye, Printer } from 'lucide-react'
import Image from "next/image"

interface Carte {
  id: string
  numero: string
  type: "Membre Actif" | "Volontaire" | "Membre Bienfaiteur"
  nomMembre: string
  prenomMembre: string
  statut: "Active" | "Expirée" | "En attente"
  dateEmission: string
  dateExpiration: string
  departement: string
  imageUrl: string
}

const cartesData: Carte[] = [
  {
    id: "1",
    numero: "CRC-BZV-001",
    type: "Membre Actif",
    nomMembre: "Mukendi",
    prenomMembre: "Jean",
    statut: "Active",
    dateEmission: "2023-01-15",
    dateExpiration: "2025-01-15",
    departement: "Brazzaville",
    imageUrl: "/placeholder.svg?height=120&width=180&text=Carte+1",
  },
  {
    id: "2",
    numero: "CRC-BZV-002",
    type: "Volontaire",
    nomMembre: "Kabila",
    prenomMembre: "Marie",
    statut: "Active",
    dateEmission: "2023-03-20",
    dateExpiration: "2025-03-20",
    departement: "Brazzaville",
    imageUrl: "/placeholder.svg?height=120&width=180&text=Carte+2",
  },
  {
    id: "3",
    numero: "CRC-PNR-001",
    type: "Membre Bienfaiteur",
    nomMembre: "Diallo",
    prenomMembre: "Fatoumata",
    statut: "Expirée",
    dateEmission: "2022-05-01",
    dateExpiration: "2024-05-01",
    departement: "Pointe-Noire",
    imageUrl: "/placeholder.svg?height=120&width=180&text=Carte+3",
  },
  {
    id: "4",
    numero: "CRC-NIA-001",
    type: "Membre Actif",
    nomMembre: "Nzouzi",
    prenomMembre: "Christian",
    statut: "En attente",
    dateEmission: "2024-06-01",
    dateExpiration: "2026-06-01",
    departement: "Niari",
    imageUrl: "/placeholder.svg?height=120&width=180&text=Carte+4",
  },
  {
    id: "5",
    numero: "CRC-BZA-003",
    type: "Volontaire",
    nomMembre: "Kouadio",
    prenomMembre: "Marc",
    statut: "Active",
    dateEmission: "2023-02-01",
    dateExpiration: "2025-02-01",
    departement: "Brazzaville",
    imageUrl: "/placeholder.svg?height=120&width=180&text=Carte+5",
  },
]

export default function CartesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterDepartement, setFilterDepartement] = useState("all")

  const typesCarte = ["Membre Actif", "Volontaire", "Membre Bienfaiteur"]
  const statutsCarte = ["Active", "Expirée", "En attente"]
  const departements = ["Brazzaville", "Pointe-Noire", "Niari", "Kouilou", "Pool", "Plateaux"]

  const filteredCartes = cartesData.filter((carte) => {
    const matchesSearch =
      carte.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.nomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.prenomMembre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || carte.type === filterType
    const matchesStatut = filterStatut === "all" || carte.statut === filterStatut
    const matchesDepartement = filterDepartement === "all" || carte.departement === filterDepartement

    return matchesSearch && matchesType && matchesStatut && matchesDepartement
  })

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expirée":
        return "bg-red-100 text-red-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterStatut("all")
    setFilterDepartement("all")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cartes</h1>
          <p className="text-gray-600 mt-1">Gérez les cartes d'adhésion des membres de la Croix Rouge</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Générer Nouvelle Carte
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cartes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCartes.length}</div>
            <p className="text-xs text-muted-foreground">sur {cartesData.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Actives</CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredCartes.filter((c) => c.statut === "Expirée").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes en Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredCartes.filter((c) => c.statut === "En attente").length}
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
                <Search className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
              <CardDescription>Recherchez et filtrez les cartes d'adhésion</CardDescription>
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
              <Input
                placeholder="Numéro, nom du membre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de Carte</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typesCarte.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                  {statutsCarte.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
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
          </div>
        </CardContent>
      </Card>

      {/* Cards List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Cartes ({filteredCartes.length})</CardTitle>
          <CardDescription>Cliquez sur une carte pour voir les détails ou imprimer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCartes.length > 0 ? (
              filteredCartes.map((carte) => (
                <Card key={carte.id} className="relative overflow-hidden group">
                  <CardContent className="p-0">
                    <Image
                      src={carte.imageUrl || "/placeholder.svg"}
                      alt={`Carte ${carte.numero}`}
                      width={300}
                      height={200}
                      className="w-full h-auto object-cover rounded-t-md"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{carte.numero}</h3>
                      <p className="text-sm text-muted-foreground">
                        {carte.prenomMembre} {carte.nomMembre} ({carte.type})
                      </p>
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(carte.statut)}`}>
                          {carte.statut}
                        </span>
                        <span className="text-muted-foreground">
                          Exp: {new Date(carte.dateExpiration).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" size="icon" title="Voir les détails">
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="icon" title="Imprimer la carte">
                      <Printer className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Aucune carte trouvée avec les filtres actuels.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
