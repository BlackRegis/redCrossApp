"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import {
  Search,
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  Filter,
  Printer,
  User,
  Crown,
  Calendar,
  MapPin,
  Phone,
  Mail,
  PlusCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CarteMembre {
  id: string
  numeroCarte: string
  nomComplet: string
  prenom: string
  nom: string
  departement: string
  arrondissement: string
  dateEmission: string
  dateExpiration: string
  statut: "Active" | "Expirée" | "Suspendue" | "En attente"
  typeAdhesion: string
  photo?: string
  email: string
  telephone: string
  dateNaissance: string
  age: number
  sexe: "M" | "F"
  profession: string
  estMembreBureau: boolean
  posteBureau?: string
  niveauBureau?: string
  adresse: string
}

// Sample card data (centralized as requested)
const cardsData = [
  {
    id: "card-001",
    memberId: "1",
    memberName: "John Doe",
    type: "Membre Actif",
    issueDate: "2023-01-15",
    expiryDate: "2025-01-15",
    status: "Valide",
    imageUrl: "/placeholder.svg?height=150&width=250&text=Carte+001",
  },
  {
    id: "card-002",
    memberId: "2",
    memberName: "Alice Smith",
    type: "Bénévole",
    issueDate: "2023-03-01",
    expiryDate: "2025-03-01",
    status: "Valide",
    imageUrl: "/placeholder.svg?height=150&width=250&text=Carte+002",
  },
  {
    id: "card-003",
    memberId: "3",
    memberName: "Robert Brown",
    type: "Donateur",
    issueDate: "2023-09-10",
    expiryDate: "2024-09-10",
    status: "Expirée",
    imageUrl: "/placeholder.svg?height=150&width=250&text=Carte+003",
  },
  {
    id: "card-004",
    memberId: "4",
    memberName: "Chantal Ngoma",
    type: "Membre Actif",
    issueDate: "2024-01-01",
    expiryDate: "2026-01-01",
    status: "Valide",
    imageUrl: "/placeholder.svg?height=150&width=250&text=Carte+004",
  },
]

const cartesData: CarteMembre[] = [
  {
    id: "1",
    numeroCarte: "CRC-BZV-001",
    nomComplet: "Jean Mukendi",
    prenom: "Jean",
    nom: "Mukendi",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    dateEmission: "2023-01-15",
    dateExpiration: "2025-01-15",
    statut: "Active",
    typeAdhesion: "Membre Actif",
    photo: "/placeholder.svg?height=150&width=120&text=Jean+M",
    email: "jean.mukendi@email.com",
    telephone: "+242 123 456 789",
    dateNaissance: "1985-03-20",
    age: 39,
    sexe: "M",
    profession: "Médecin",
    estMembreBureau: true,
    posteBureau: "Président",
    niveauBureau: "National",
    adresse: "Avenue Félix Éboué, Bacongo",
  },
  {
    id: "2",
    numeroCarte: "CRC-BZV-002",
    nomComplet: "Marie Kabila",
    prenom: "Marie",
    nom: "Kabila",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    dateEmission: "2023-03-20",
    dateExpiration: "2025-03-20",
    statut: "Active",
    typeAdhesion: "Volontaire",
    photo: "/placeholder.svg?height=150&width=120&text=Marie+K",
    email: "marie.kabila@email.com",
    telephone: "+242 987 654 321",
    dateNaissance: "1990-07-15",
    age: 34,
    sexe: "F",
    profession: "Infirmière",
    estMembreBureau: true,
    posteBureau: "Secrétaire Général",
    niveauBureau: "National",
    adresse: "Rue Monseigneur Augouard, Poto-Poto",
  },
  {
    id: "3",
    numeroCarte: "CRC-KOU-001",
    nomComplet: "Paul Tshisekedi",
    prenom: "Paul",
    nom: "Tshisekedi",
    departement: "Kouilou",
    arrondissement: "Pointe-Noire",
    dateEmission: "2022-11-10",
    dateExpiration: "2024-11-10",
    statut: "Expirée",
    typeAdhesion: "Membre Bienfaiteur",
    photo: "/placeholder.svg?height=150&width=120&text=Paul+T",
    email: "paul.tshisekedi@email.com",
    telephone: "+242 555 123 456",
    dateNaissance: "1978-12-05",
    age: 45,
    sexe: "M",
    profession: "Enseignant",
    estMembreBureau: false,
    adresse: "Boulevard Pierre Savorgnan de Brazza, Pointe-Noire",
  },
  {
    id: "4",
    numeroCarte: "CRC-BZV-003",
    nomComplet: "Sophie Ngouabi",
    prenom: "Sophie",
    nom: "Ngouabi",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    dateEmission: "2023-05-12",
    dateExpiration: "2025-05-12",
    statut: "Active",
    typeAdhesion: "Volontaire",
    photo: "/placeholder.svg?height=150&width=120&text=Sophie+N",
    email: "sophie.ngouabi@email.com",
    telephone: "+242 666 789 123",
    dateNaissance: "1992-09-30",
    age: 32,
    sexe: "F",
    profession: "Pharmacienne",
    estMembreBureau: true,
    posteBureau: "Président",
    niveauBureau: "Départemental",
    adresse: "Avenue Amiral Cabral, Moungali",
  },
  {
    id: "5",
    numeroCarte: "CRC-NIA-001",
    nomComplet: "André Sassou",
    prenom: "André",
    nom: "Sassou",
    departement: "Niari",
    arrondissement: "Dolisie",
    dateEmission: "2023-02-28",
    dateExpiration: "2025-02-28",
    statut: "Active",
    typeAdhesion: "Membre Actif",
    photo: "/placeholder.svg?height=150&width=120&text=André+S",
    email: "andre.sassou@email.com",
    telephone: "+242 777 456 789",
    dateNaissance: "1988-04-18",
    age: 36,
    sexe: "M",
    profession: "Ingénieur",
    estMembreBureau: false,
    adresse: "Quartier Résidentiel, Dolisie",
  },
  {
    id: "6",
    numeroCarte: "CRC-BZV-004",
    nomComplet: "Claudine Opangault",
    prenom: "Claudine",
    nom: "Opangault",
    departement: "Brazzaville",
    arrondissement: "Ouenzé",
    dateEmission: "2022-08-15",
    dateExpiration: "2024-08-15",
    statut: "Suspendue",
    typeAdhesion: "Volontaire",
    photo: "/placeholder.svg?height=150&width=120&text=Claudine+O",
    email: "claudine.opangault@email.com",
    telephone: "+242 888 321 654",
    dateNaissance: "1995-11-22",
    age: 29,
    sexe: "F",
    profession: "Juriste",
    estMembreBureau: false,
    adresse: "Avenue de la Paix, Ouenzé",
  },
  {
    id: "7",
    numeroCarte: "CRC-BOU-001",
    nomComplet: "Michel Lissouba",
    prenom: "Michel",
    nom: "Lissouba",
    departement: "Bouenza",
    arrondissement: "Nkayi",
    dateEmission: "2023-04-10",
    dateExpiration: "2025-04-10",
    statut: "Active",
    typeAdhesion: "Membre Bienfaiteur",
    photo: "/placeholder.svg?height=150&width=120&text=Michel+L",
    email: "michel.lissouba@email.com",
    telephone: "+242 999 147 258",
    dateNaissance: "1980-06-12",
    age: 44,
    sexe: "M",
    profession: "Comptable",
    estMembreBureau: false,
    adresse: "Centre-ville, Nkayi",
  },
  {
    id: "8",
    numeroCarte: "CRC-BZV-005",
    nomComplet: "Jeanne Kolelas",
    prenom: "Jeanne",
    nom: "Kolelas",
    departement: "Brazzaville",
    arrondissement: "Talangaï",
    dateEmission: "2023-06-05",
    dateExpiration: "2025-06-05",
    statut: "En attente",
    typeAdhesion: "Volontaire",
    photo: "/placeholder.svg?height=150&width=120&text=Jeanne+K",
    email: "jeanne.kolelas@email.com",
    telephone: "+242 111 369 852",
    dateNaissance: "1987-01-28",
    age: 37,
    sexe: "F",
    profession: "Sage-femme",
    estMembreBureau: true,
    posteBureau: "Secrétaire Général",
    niveauBureau: "Arrondissement",
    adresse: "Quartier Plateau des 15 ans, Talangaï",
  },
  // Ajout de données supplémentaires pour tester la pagination
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `${i + 9}`,
    numeroCarte: `CRC-TEST-${String(i + 1).padStart(3, "0")}`,
    nomComplet: `Membre Test ${i + 1}`,
    prenom: `Prénom${i + 1}`,
    nom: `Nom${i + 1}`,
    departement: ["Brazzaville", "Kouilou", "Niari"][i % 3],
    arrondissement: ["Bacongo", "Poto-Poto", "Pointe-Noire"][i % 3],
    dateEmission: "2023-06-01",
    dateExpiration: "2025-06-01",
    statut: (["Active", "Expirée", "Suspendue", "En attente"] as const)[i % 4],
    typeAdhesion: ["Volontaire", "Membre Actif", "Membre Bienfaiteur"][i % 3],
    photo: `/placeholder.svg?height=150&width=120&text=Test+${i + 1}`,
    email: `test${i + 1}@email.com`,
    telephone: `+242 ${String(i + 1).padStart(3, "0")} 123 456`,
    dateNaissance: `198${i % 10}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    age: 30 + (i % 20),
    sexe: (i % 2 === 0 ? "M" : "F") as "M" | "F",
    profession: ["Médecin", "Infirmière", "Enseignant", "Ingénieur"][i % 4],
    estMembreBureau: i % 5 === 0,
    posteBureau: i % 5 === 0 ? ["Président", "Secrétaire Général", "Trésorier"][i % 3] : undefined,
    niveauBureau: i % 5 === 0 ? ["National", "Départemental", "Arrondissement"][i % 3] : undefined,
    adresse: `Adresse test ${i + 1}`,
  })),
]

const ITEMS_PER_PAGE = 10

export default function CartesPage() {
  const [cartes, setCartes] = useState<CarteMembre[]>(cartesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCarte, setSelectedCarte] = useState<CarteMembre | null>(null)
  const [activeTab, setActiveTab] = useState("toutes")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterBureau, setFilterBureau] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const departements = ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"]

  const filteredCartes = cartes.filter((carte) => {
    const matchesSearch =
      carte.numeroCarte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carte.profession.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartement = filterDepartement === "all" || carte.departement === filterDepartement
    const matchesStatut = filterStatut === "all" || carte.statut === filterStatut
    const matchesType = filterType === "all" || carte.typeAdhesion === filterType
    const matchesBureau =
      filterBureau === "all" || (filterBureau === "oui" ? carte.estMembreBureau : !carte.estMembreBureau)

    let matchesTab = true
    if (activeTab === "actives") matchesTab = carte.statut === "Active"
    if (activeTab === "expirees") matchesTab = carte.statut === "Expirée"
    if (activeTab === "bureau") matchesTab = carte.estMembreBureau

    return matchesSearch && matchesDepartement && matchesStatut && matchesType && matchesBureau && matchesTab
  })

  const filteredCards = cardsData.filter(
    (card) =>
      card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredCartes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCartes = filteredCartes.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expirée":
        return "bg-red-100 text-red-800"
      case "Suspendue":
        return "bg-yellow-100 text-yellow-800"
      case "En attente":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isExpiringSoon = (dateExpiration: string) => {
    const expDate = new Date(dateExpiration)
    const today = new Date()
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const clearFilters = () => {
    setFilterDepartement("all")
    setFilterStatut("all")
    setFilterType("all")
    setFilterBureau("all")
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedCarte(null) // Clear selection when changing page
  }

  const handleView = (id: string) => {
    console.log("Voir la carte:", id)
    // Implement modal or navigation to card detail view
  }

  const handleDownload = (id: string) => {
    console.log("Télécharger la carte:", id)
    // Implement card download logic
    alert(`Carte ${id} téléchargée (simulation)`)
  }

  const handleRevoke = (id: string) => {
    console.log("Révoquer la carte:", id)
    // Implement card revocation logic
    if (confirm("Êtes-vous sûr de vouloir révoquer cette carte ?")) {
      alert(`Carte ${id} révoquée (simulation)`)
    }
  }

  const renderCartePreview = (carte: CarteMembre) => {
    const isMembreBureau = carte.estMembreBureau
    const cardBgColor = isMembreBureau ? "from-red-800 to-red-900" : "from-red-600 to-red-700"

    return (
      <div className={`bg-gradient-to-br ${cardBgColor} text-white p-6 rounded-xl shadow-lg relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-bold">CROIX ROUGE</h3>
            <p className="text-sm opacity-90">RÉPUBLIQUE DU CONGO</p>
            {isMembreBureau && (
              <div className="flex items-center mt-1">
                <Crown className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">{carte.posteBureau}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">N° CARTE</p>
            <p className="font-mono text-sm font-bold">{carte.numeroCarte}</p>
          </div>
        </div>

        {/* Photo and Info */}
        <div className="flex items-center space-x-4 mb-4 relative z-10">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={carte.photo || "/placeholder.svg"} />
            <AvatarFallback className="bg-white text-red-600 font-bold">
              {carte.prenom.charAt(0)}
              {carte.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-bold text-lg">{carte.nomComplet}</h4>
            <p className="text-sm opacity-90">{carte.typeAdhesion}</p>
            <p className="text-xs opacity-75">{carte.profession}</p>
          </div>
        </div>

        {/* Location and dates */}
        <div className="space-y-1 text-xs opacity-75 relative z-10">
          <div className="flex justify-between">
            <span>
              {carte.arrondissement}, {carte.departement}
            </span>
            <span>Né(e) le: {new Date(carte.dateNaissance).toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex justify-between">
            <span>Émise: {new Date(carte.dateEmission).toLocaleDateString("fr-FR")}</span>
            <span>Expire: {new Date(carte.dateExpiration).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {/* SIM chip */}
        <div className="absolute bottom-4 right-4 relative z-10">
          <Image src="/images/sim-chip.png" alt="Puce SIM" width={24} height={24} className="opacity-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cartes</h1>
          <p className="text-gray-600 mt-1">Gérez les cartes de membre de la Croix Rouge</p>
        </div>
        <Link href="/cartes/nouvelle">
          <Button className="bg-red-600 hover:bg-red-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle Carte
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
            <CardTitle className="text-sm font-medium">Expirées</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredCartes.filter((c) => c.statut === "Expirée").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureau Exécutif</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredCartes.filter((c) => c.estMembreBureau).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirent Bientôt</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredCartes.filter((c) => isExpiringSoon(c.dateExpiration)).length}
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
              <CardDescription>Filtrez la liste des cartes selon vos critères</CardDescription>
            </div>
            <Button variant="outline" onClick={clearFilters} size="sm">
              Effacer les filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="N° carte, nom, profession..."
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
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expirée">Expirée</SelectItem>
                  <SelectItem value="Suspendue">Suspendue</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'adhésion</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Volontaire">Volontaire</SelectItem>
                  <SelectItem value="Membre Actif">Membre Actif</SelectItem>
                  <SelectItem value="Membre Bienfaiteur">Membre Bienfaiteur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bureau Exécutif</label>
              <Select value={filterBureau} onValueChange={setFilterBureau}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="oui">Membres du bureau</SelectItem>
                  <SelectItem value="non">Membres ordinaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Cartes ({filteredCartes.length})</CardTitle>
              <CardDescription>
                Page {currentPage} sur {totalPages}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="toutes">Toutes</TabsTrigger>
                  <TabsTrigger value="actives">Actives</TabsTrigger>
                  <TabsTrigger value="expirees">Expirées</TabsTrigger>
                  <TabsTrigger value="bureau">Bureau</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Membre</TableHead>
                          <TableHead>N° Carte</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>Validité</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedCartes.map((carte) => (
                          <TableRow
                            key={carte.id}
                            className={`cursor-pointer hover:bg-gray-50 ${
                              selectedCarte?.id === carte.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setSelectedCarte(carte)}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={carte.photo || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {carte.prenom.charAt(0)}
                                    {carte.nom.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium flex items-center gap-2">
                                    {carte.nomComplet}
                                    {carte.estMembreBureau && <Crown className="h-3 w-3 text-yellow-600" />}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {carte.typeAdhesion} • {carte.profession}
                                  </div>
                                  {carte.estMembreBureau && (
                                    <div className="text-xs text-yellow-600 font-medium">
                                      {carte.posteBureau} - {carte.niveauBureau}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{carte.numeroCarte}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{carte.departement}</div>
                                <div className="text-sm text-muted-foreground">{carte.arrondissement}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">
                                  Expire: {new Date(carte.dateExpiration).toLocaleDateString("fr-FR")}
                                </div>
                                {isExpiringSoon(carte.dateExpiration) && (
                                  <div className="text-xs text-orange-600 font-medium">Expire bientôt!</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatutColor(carte.statut)}>{carte.statut}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" title="Voir les détails">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Imprimer">
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Renouveler">
                                  <RefreshCw className="h-4 w-4" />
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

        {/* Card Preview Sidebar */}
        <div className="space-y-6">
          {selectedCarte ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu de la Carte</CardTitle>
                  <CardDescription>
                    {selectedCarte.estMembreBureau ? "Carte Bureau Exécutif" : "Carte Membre Standard"}
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderCartePreview(selectedCarte)}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations Détaillées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{selectedCarte.nomComplet}</div>
                        <div className="text-sm text-muted-foreground">
                          Né(e) le {new Date(selectedCarte.dateNaissance).toLocaleDateString("fr-FR")} •{" "}
                          {selectedCarte.sexe === "M" ? "Homme" : "Femme"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCarte.email}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCarte.telephone}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>{selectedCarte.adresse}</div>
                        <div className="text-muted-foreground">
                          {selectedCarte.arrondissement}, {selectedCarte.departement}
                        </div>
                      </div>
                    </div>

                    {selectedCarte.estMembreBureau && (
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <div className="text-sm">
                          <div className="font-medium text-yellow-700">{selectedCarte.posteBureau}</div>
                          <div className="text-muted-foreground">Niveau {selectedCarte.niveauBureau}</div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Statut:</span>
                          <Badge className={getStatutColor(selectedCarte.statut)} variant="secondary">
                            {selectedCarte.statut}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{selectedCarte.typeAdhesion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profession:</span>
                          <span className="font-medium">{selectedCarte.profession}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Link href={`/membres/${selectedCarte.id}`}>
                      <Button className="w-full bg-transparent" variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Voir le Profil Complet
                      </Button>
                    </Link>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimer la Carte
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renouveler
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner une carte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cliquez sur une carte dans la liste pour voir son aperçu et ses détails.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Cards Data Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Liste des Cartes de Membre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Carte</TableHead>
                    <TableHead>Membre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date d'Émission</TableHead>
                    <TableHead>Date d'Expiration</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.length > 0 ? (
                    filteredCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-medium">{card.id}</TableCell>
                        <TableCell>{card.memberName}</TableCell>
                        <TableCell>{card.type}</TableCell>
                        <TableCell>{card.issueDate}</TableCell>
                        <TableCell>{card.expiryDate}</TableCell>
                        <TableCell>{card.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleView(card.id)} className="mr-2">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Voir</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(card.id)} className="mr-2">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Télécharger</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRevoke(card.id)}>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Révoquer</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Aucune carte trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
