"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CreditCardIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import {
  Search,
  CreditCard,
  DownloadIcon,
  RefreshCw,
  Filter,
  Printer,
  User,
  Crown,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"

interface Membre {
  id: number
  nom: string
  prenom: string
  type_membre: string
  date_adhesion: string
}

interface Carte {
  id: number
  membre_id: number
  numero_carte: string
  date_emission: string
  date_expiration: string
  statut: string
  nom_membre: string
  prenom_membre: string
  type_membre: string
}

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

const ITEMS_PER_PAGE = 10

export default function CartesPage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [cartes, setCartes] = useState<Carte[]>([])
  const [newCardData, setNewCardData] = useState({
    membre_id: "",
    date_emission: "",
    date_expiration: "",
    statut: "Active",
  })
  const [selectedCarte, setSelectedCarte] = useState<Carte | null>(null)
  const [activeTab, setActiveTab] = useState("toutes")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterBureau, setFilterBureau] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const departements = ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"]

  useEffect(() => {
    fetchMembres()
    fetchCartes()
  }, [])

  const fetchMembres = async () => {
    try {
      const response = await fetch("/api/membres")
      if (!response.ok) throw new Error("Failed to fetch members")
      const data = await response.json()
      setMembres(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des membres.")
      console.error("Error fetching members:", error)
    }
  }

  const fetchCartes = async () => {
    try {
      const response = await fetch("/api/cartes")
      if (!response.ok) throw new Error("Failed to fetch cards")
      const data = await response.json()
      setCartes(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des cartes.")
      console.error("Error fetching cards:", error)
    }
  }

  const handleNewCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewCardData((prev) => ({ ...prev, [id]: value }))
  }

  const handleNewCardSelectChange = (id: string, value: string) => {
    setNewCardData((prev) => ({ ...prev, [id]: value }))
  }

  const handleGenerateCard = async () => {
    if (!newCardData.membre_id || !newCardData.date_emission || !newCardData.date_expiration) {
      toast.error("Veuillez remplir tous les champs pour générer une carte.")
      return
    }
    try {
      const response = await fetch("/api/cartes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCardData),
      })
      if (!response.ok) throw new Error("Failed to generate card")
      toast.success("Carte générée avec succès!")
      setNewCardData({ membre_id: "", date_emission: "", date_expiration: "", statut: "Active" })
      fetchCartes()
    } catch (error) {
      toast.error("Erreur lors de la génération de la carte.")
      console.error("Error generating card:", error)
    }
  }

  const handleDownloadCard = (card: Carte) => {
    // Placeholder for actual card download logic (e.g., PDF generation)
    toast.info(`Téléchargement de la carte ${card.numero_carte} pour ${card.nom_membre} ${card.prenom_membre}...`)
    console.log("Simulating download for card:", card)
  }

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
      case "Perdue":
        return "bg-gray-100 text-gray-800"
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
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedCarte(null) // Clear selection when changing page
  }

  const renderCartePreview = (carte: Carte) => {
    const isMembreBureau = carte.statut === "Active" // Placeholder for bureau membership check
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
                <span className="text-xs font-medium">Bureau Exécutif</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">N° CARTE</p>
            <p className="font-mono text-sm font-bold">{carte.numero_carte}</p>
          </div>
        </div>

        {/* Photo and Info */}
        <div className="flex items-center space-x-4 mb-4 relative z-10">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-white text-red-600 font-bold">
              {carte.prenom_membre.charAt(0)}
              {carte.nom_membre.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-bold text-lg">
              {carte.nom_membre} {carte.prenom_membre}
            </h4>
            <p className="text-sm opacity-90">{carte.type_membre}</p>
            {/* Placeholder for profession */}
          </div>
        </div>

        {/* Location and dates */}
        <div className="space-y-1 text-xs opacity-75 relative z-10">
          <div className="flex justify-between">
            {/* Placeholder for location */}
            <span>Né(e) le: {new Date("1985-03-20").toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex justify-between">
            <span>Émise: {new Date(carte.date_emission).toLocaleDateString("fr-FR")}</span>
            <span>Expire: {new Date(carte.date_expiration).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {/* SIM chip */}
        <div className="absolute bottom-4 right-4 relative z-10">
          <Image src="/images/sim-chip.png" alt="Puce SIM" width={24} height={24} className="opacity-80" />
        </div>
      </div>
    )
  }

  const filteredCartes = cartes.filter((carte) => {
    const matchesDepartement = filterDepartement === "all" || carte.departement === filterDepartement
    const matchesStatut = filterStatut === "all" || carte.statut === filterStatut
    const matchesType = filterType === "all" || carte.type_membre === filterType
    const matchesBureau =
      filterBureau === "all" || (filterBureau === "oui" ? carte.statut === "Active" : carte.statut !== "Active")

    let matchesTab = true
    if (activeTab === "actives") matchesTab = carte.statut === "Active"
    if (activeTab === "expirees") matchesTab = carte.statut === "Expirée"
    if (activeTab === "bureau") matchesTab = carte.statut === "Active"

    return matchesDepartement && matchesStatut && matchesType && matchesBureau && matchesTab
  })

  // Pagination
  const totalPages = Math.ceil(filteredCartes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCartes = filteredCartes.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cartes</h1>
          <p className="text-gray-600 mt-1">Gérez les cartes de membre de la Croix Rouge</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Carte
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cartes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cartes.length}</div>
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
              {cartes.filter((c) => c.statut === "Active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirées</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cartes.filter((c) => c.statut === "Expirée").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureau Exécutif</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {cartes.filter((c) => c.statut === "Active").length}
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
              {cartes.filter((c) => isExpiringSoon(c.date_expiration)).length}
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
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input id="search" placeholder="N° carte, nom, profession..." className="pl-8" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
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
              <Label htmlFor="statut">Statut</Label>
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
                  <SelectItem value="Perdue">Perdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type_membre">Type d'adhésion</Label>
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
              <Label htmlFor="bureau">Bureau Exécutif</Label>
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
              <CardTitle>Liste des Cartes ({cartes.length})</CardTitle>
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
                  <div className="rounded-md border">{/* Placeholder for table */}</div>

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
                    {selectedCarte.statut === "Active" ? "Carte Bureau Exécutif" : "Carte Membre Standard"}
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
                        <div className="font-medium">
                          {selectedCarte.nom_membre} {selectedCarte.prenom_membre}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {/* Placeholder for date of birth and gender */}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email Placeholder</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Phone Placeholder</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>Adresse Placeholder</div>
                        <div className="text-muted-foreground">Arrondissement Placeholder, Département Placeholder</div>
                      </div>
                    </div>

                    {selectedCarte.statut === "Active" && (
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <div className="text-sm">
                          <div className="font-medium text-yellow-700">Poste Bureau Placeholder</div>
                          <div className="text-muted-foreground">Niveau Bureau Placeholder</div>
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
                          <span className="font-medium">{selectedCarte.type_membre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profession:</span>
                          <span className="font-medium">Profession Placeholder</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Link href={`/membres/${selectedCarte.membre_id}`}>
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
                      <DownloadIcon className="h-4 w-4 mr-2" />
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

      {/* Generate New Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Générer une Nouvelle Carte</CardTitle>
          <CardDescription>Créez une carte d'identité pour un membre.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="membre_id">Membre</Label>
            <Select
              onValueChange={(value) => handleNewCardSelectChange("membre_id", value)}
              value={newCardData.membre_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un membre" />
              </SelectTrigger>
              <SelectContent>
                {membres.map((membre) => (
                  <SelectItem key={membre.id} value={String(membre.id)}>
                    {membre.nom} {membre.prenom} ({membre.type_membre})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_emission">Date d'Émission</Label>
            <Input id="date_emission" type="date" value={newCardData.date_emission} onChange={handleNewCardChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_expiration">Date d'Expiration</Label>
            <Input
              id="date_expiration"
              type="date"
              value={newCardData.date_expiration}
              onChange={handleNewCardChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select onValueChange={(value) => handleNewCardSelectChange("statut", value)} value={newCardData.statut}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expirée">Expirée</SelectItem>
                <SelectItem value="Perdue">Perdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full flex justify-end">
            <Button onClick={handleGenerateCard}>
              <Plus className="h-4 w-4 mr-2" /> Générer Carte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List of Issued Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Cartes de Membre Émises</CardTitle>
          <CardDescription>Liste de toutes les cartes de membre émises.</CardDescription>
        </CardHeader>
        <CardContent>
          {cartes.length === 0 ? (
            <p className="text-center text-muted-foreground">Aucune carte de membre émise.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCartes.map((card) => (
                <Card
                  key={card.id}
                  className="relative overflow-hidden rounded-lg shadow-lg"
                  onClick={() => setSelectedCarte(card)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-90" />
                  <div className="relative z-10 p-4 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCardIcon className="h-8 w-8" />
                      <span className="text-xs font-semibold">CROIX-ROUGE CONGOLAISE</span>
                    </div>
                    <div className="text-lg font-bold mb-1">
                      {card.nom_membre} {card.prenom_membre}
                    </div>
                    <div className="text-sm mb-4">Type: {card.type_membre}</div>
                    <div className="flex justify-between text-xs">
                      <div>
                        <p>N° Carte:</p>
                        <p className="font-semibold">{card.numero_carte}</p>
                      </div>
                      <div>
                        <p>Émise:</p>
                        <p className="font-semibold">{new Date(card.date_emission).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p>Expire:</p>
                        <p className="font-semibold">{new Date(card.date_expiration).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadCard(card)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" /> Télécharger
                      </Button>
                    </div>
                  </div>
                  <Image
                    src="/public/images/sim-chip.png"
                    alt="Card Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 z-0 opacity-10"
                  />
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
