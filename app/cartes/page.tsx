"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Filter,
  Printer,
  User,
  Crown,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCartes } from "@/lib/hooks/useCartes"
import { useDepartements } from "@/lib/hooks/useDepartements"

interface Carte {
  id: string
  numeroCarte: string
  dateEmission: string
  dateExpiration: string
  statut: string
  statutCalcule: string
  typeCarte: string
  createdAt: string
  updatedAt: string
  membre: {
    id: string
    nom: string
    prenom: string
    email: string
    telephone: string
    statut: string
    departement?: string
    arrondissement?: string
  }
}

const ITEMS_PER_PAGE = 10

export default function CartesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCarte, setSelectedCarte] = useState<CarteMembre | null>(null)
  const [activeTab, setActiveTab] = useState("toutes")

  // Hooks personnalisés
  const { 
    cartes, 
    loading, 
    error, 
    filters, 
    pagination, 
    updateFilters, 
    setPage, 
    clearFilters 
  } = useCartes()
  
  const { departementNames } = useDepartements()

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Mettre à jour les filtres quand la recherche change
  useEffect(() => {
    updateFilters({ search: debouncedSearchTerm })
  }, [debouncedSearchTerm, updateFilters])

  // Mettre à jour les filtres quand l'onglet change
  useEffect(() => {
    updateFilters({ tab: activeTab })
  }, [activeTab, updateFilters])

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expirée":
        return "bg-red-100 text-red-800"
      case "Suspendue":
        return "bg-yellow-100 text-yellow-800"
      case "Remplacée":
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

  const handleClearFilters = () => {
    setSearchTerm("")
    setActiveTab("toutes")
    clearFilters()
  }

  const handlePageChange = (page: number) => {
    setPage(page)
    setSelectedCarte(null)
  }

  // Calculer les statistiques basées sur les données actuelles
  const cartesActives = cartes.filter(c => c.statutCalcule === "Active").length
  const cartesExpirees = cartes.filter(c => c.statutCalcule === "Expirée").length
  const cartesExpirantBientot = cartes.filter(c => isExpiringSoon(c.dateExpiration)).length

  const renderCartePreview = (carte: CarteMembre) => {
    const nomComplet = `${carte.membre.prenom} ${carte.membre.nom}`
    const cardBgColor = "from-red-600 to-red-700"

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
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">N° CARTE</p>
            <p className="font-mono text-sm font-bold">{carte.numeroCarte}</p>
          </div>
        </div>

        {/* Photo and Info */}
        <div className="flex items-center space-x-4 mb-4 relative z-10">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarFallback className="bg-white text-red-600 font-bold">
              {carte.membre.prenom.charAt(0)}
              {carte.membre.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-bold text-lg">{nomComplet}</h4>
            <p className="text-sm opacity-90">{carte.typeCarte}</p>
            <p className="text-xs opacity-75">{carte.membre.email}</p>
          </div>
        </div>

        {/* Location and dates */}
        <div className="space-y-1 text-xs opacity-75 relative z-10">
          <div className="flex justify-between">
            <span>
              {carte.membre.arrondissement || "N/A"}, {carte.membre.departement || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Émise: {new Date(carte.dateEmission).toLocaleDateString("fr-FR")}</span>
            <span>Expire: {new Date(carte.dateExpiration).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {/* SIM chip */}
        <div className="absolute bottom-4 right-4 relative z-10">
          <div className="w-6 h-6 bg-white opacity-20 rounded"></div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
            <p className="mt-4 text-gray-600">Chargement des cartes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Erreur de chargement</div>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mt-0">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cartes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cartes.length}</div>
            <p className="text-xs text-muted-foreground">sur {pagination.total} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{cartesActives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartes Expirées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cartesExpirees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirent Bientôt</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{cartesExpirantBientot}</div>
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
            <Button variant="outline" onClick={handleClearFilters} size="sm">
              Effacer les filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="N° carte, nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <Select 
                value={filters.departement} 
                onValueChange={(value) => updateFilters({ departement: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departementNames.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select 
                value={filters.statut} 
                onValueChange={(value) => updateFilters({ statut: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expirée">Expirée</SelectItem>
                  <SelectItem value="Suspendue">Suspendue</SelectItem>
                  <SelectItem value="Remplacée">Remplacée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de carte</label>
              <Select 
                value={filters.typeCarte} 
                onValueChange={(value) => updateFilters({ typeCarte: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Bénévole">Bénévole</SelectItem>
                  <SelectItem value="Formateur">Formateur</SelectItem>
                  <SelectItem value="Administrateur">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Cartes ({cartes.length})</CardTitle>
              <CardDescription>
                Page {pagination.currentPage} sur {pagination.totalPages}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="toutes">Toutes</TabsTrigger>
                  <TabsTrigger value="actives">Actives</TabsTrigger>
                  <TabsTrigger value="expirees">Expirées</TabsTrigger>
                  <TabsTrigger value="suspendues">Suspendues</TabsTrigger>
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
                        {cartes.map((carte) => {
                          const nomComplet = `${carte.membre.prenom} ${carte.membre.nom}`
                          return (
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
                                    <AvatarFallback>
                                      {carte.membre.prenom.charAt(0)}
                                      {carte.membre.nom.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium flex items-center gap-2">
                                      {nomComplet}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {carte.typeCarte} • {carte.membre.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{carte.numeroCarte}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{carte.membre.departement || "N/A"}</div>
                                  <div className="text-sm text-muted-foreground">{carte.membre.arrondissement || "N/A"}</div>
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
                                <Badge className={getStatutColor(carte.statutCalcule)}>{carte.statutCalcule}</Badge>
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
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Affichage de {((pagination.currentPage - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(pagination.currentPage * ITEMS_PER_PAGE, pagination.total)} sur {pagination.total} résultats
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <div className="text-sm">
                        Page {pagination.currentPage} sur {pagination.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
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
                  <CardDescription>Carte Membre {selectedCarte.typeCarte}</CardDescription>
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
                        <div className="font-medium">{selectedCarte.membre.prenom} {selectedCarte.membre.nom}</div>
                        <div className="text-sm text-muted-foreground">
                          Membre {selectedCarte.membre.statut}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCarte.membre.email}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCarte.membre.telephone}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>{selectedCarte.membre.arrondissement || "N/A"}</div>
                        <div className="text-muted-foreground">
                          {selectedCarte.membre.departement || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Statut:</span>
                          <Badge className={getStatutColor(selectedCarte.statutCalcule)} variant="secondary">
                            {selectedCarte.statutCalcule}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{selectedCarte.typeCarte}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Émise:</span>
                          <span className="font-medium">{new Date(selectedCarte.dateEmission).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expire:</span>
                          <span className="font-medium">{new Date(selectedCarte.dateExpiration).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Link href={`/membres/${selectedCarte.membre.id}`}>
                      <Button className="w-full bg-transparent" variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Voir le Profil Complet
                      </Button>
                    </Link>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimer la Carte
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