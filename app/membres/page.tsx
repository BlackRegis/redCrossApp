"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter, Download } from "lucide-react"
import Link from "next/link"

interface Membre {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  departement: string
  arrondissement: string
  statut: "Actif" | "Inactif" | "Suspendu"
  dateAdhesion: string
  dateNaissance: string
  age: number
  profession: string
  typeAdhesion: string
  numeroCarte: string
  sexe: "M" | "F"
  adresse: string
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
    nom: "Tshisekedi",
    prenom: "Paul",
    email: "paul.tshisekedi@email.com",
    telephone: "+242 555 123 456",
    departement: "Kouilou",
    arrondissement: "Pointe-Noire",
    statut: "Inactif",
    dateAdhesion: "2022-11-10",
    dateNaissance: "1978-12-05",
    age: 45,
    profession: "Enseignant",
    typeAdhesion: "Membre Bienfaiteur",
    numeroCarte: "CRC-KOU-001",
    sexe: "M",
    adresse: "Boulevard Pierre Savorgnan de Brazza, Pointe-Noire",
  },
  {
    id: "4",
    nom: "Ngouabi",
    prenom: "Sophie",
    email: "sophie.ngouabi@email.com",
    telephone: "+242 666 789 123",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    statut: "Actif",
    dateAdhesion: "2023-05-12",
    dateNaissance: "1992-09-30",
    age: 32,
    profession: "Pharmacienne",
    typeAdhesion: "Volontaire",
    numeroCarte: "CRC-BZV-003",
    sexe: "F",
    adresse: "Avenue Amiral Cabral, Moungali",
  },
  {
    id: "5",
    nom: "Sassou",
    prenom: "André",
    email: "andre.sassou@email.com",
    telephone: "+242 777 456 789",
    departement: "Niari",
    arrondissement: "Dolisie",
    statut: "Actif",
    dateAdhesion: "2023-02-28",
    dateNaissance: "1988-04-18",
    age: 36,
    profession: "Ingénieur",
    typeAdhesion: "Membre Actif",
    numeroCarte: "CRC-NIA-001",
    sexe: "M",
    adresse: "Quartier Résidentiel, Dolisie",
  },
  {
    id: "6",
    nom: "Opangault",
    prenom: "Claudine",
    email: "claudine.opangault@email.com",
    telephone: "+242 888 321 654",
    departement: "Brazzaville",
    arrondissement: "Ouenzé",
    statut: "Suspendu",
    dateAdhesion: "2022-08-15",
    dateNaissance: "1995-11-22",
    age: 29,
    profession: "Juriste",
    typeAdhesion: "Volontaire",
    numeroCarte: "CRC-BZV-004",
    sexe: "F",
    adresse: "Avenue de la Paix, Ouenzé",
  },
  {
    id: "7",
    nom: "Lissouba",
    prenom: "Michel",
    email: "michel.lissouba@email.com",
    telephone: "+242 999 147 258",
    departement: "Bouenza",
    arrondissement: "Nkayi",
    statut: "Actif",
    dateAdhesion: "2023-04-10",
    dateNaissance: "1980-06-12",
    age: 44,
    profession: "Comptable",
    typeAdhesion: "Membre Bienfaiteur",
    numeroCarte: "CRC-BOU-001",
    sexe: "M",
    adresse: "Centre-ville, Nkayi",
  },
  {
    id: "8",
    nom: "Kolelas",
    prenom: "Jeanne",
    email: "jeanne.kolelas@email.com",
    telephone: "+242 111 369 852",
    departement: "Brazzaville",
    arrondissement: "Talangaï",
    statut: "Actif",
    dateAdhesion: "2023-06-05",
    dateNaissance: "1987-01-28",
    age: 37,
    profession: "Sage-femme",
    typeAdhesion: "Volontaire",
    numeroCarte: "CRC-BZV-005",
    sexe: "F",
    adresse: "Quartier Plateau des 15 ans, Talangaï",
  },
]

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
      membre.profession.toLowerCase().includes(searchTerm.toLowerCase())

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
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredMembres.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembres = filteredMembres.slice(startIndex, startIndex + itemsPerPage)

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
              {Math.round(filteredMembres.reduce((sum, m) => sum + m.age, 0) / filteredMembres.length || 0)} ans
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
                  <SelectItem value="Suspendu">Suspendu\
