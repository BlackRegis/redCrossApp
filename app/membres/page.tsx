"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, Download } from "lucide-react"
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

const membresData: Membre[] = []

const ITEMS_PER_PAGE = 15

export default function MembresPage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [departements, setDepartements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartement, setFilterDepartement] = useState("all")
  const [filterArrondissement, setFilterArrondissement] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAge, setFilterAge] = useState("all")
  const [filterSexe, setFilterSexe] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Charger les membres
        const membresResponse = await fetch('/api/membres')
        const membresData = await membresResponse.json()
        console.log('Membres chargés:', membresData)
        setMembres(membresData)
        
        // Charger les départements
        const departementsResponse = await fetch('/api/departements')
        const departementsData = await departementsResponse.json()
        setDepartements(departementsData)
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Obtenir les noms des départements pour les filtres
  const departementsNoms = departements.map(d => d.nom)
  
  // Créer un objet arrondissements pour les filtres
  const arrondissements = departements.reduce((acc, dept) => {
    acc[dept.nom] = dept.arrondissements.map((arr: { nom: string }) => arr.nom)
    return acc
  }, {} as Record<string, string[]>)

  const filteredMembres = membres.filter((membre) => {
    // Recherche
    const matchesSearch = searchTerm === "" || 
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (membre.email && membre.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (membre.profession && membre.profession.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtre département
    const matchesDepartement = filterDepartement === "all" || 
      (membre.departement && membre.departement === filterDepartement)

    // Filtre arrondissement
    const matchesArrondissement = filterArrondissement === "all" || 
      (membre.arrondissement && membre.arrondissement === filterArrondissement)

    // Filtre statut
    const matchesStatut = filterStatut === "all" || 
      (membre.statut && membre.statut === filterStatut)

    // Filtre sexe
    const matchesSexe = filterSexe === "all" || 
      (membre.sexe && membre.sexe === filterSexe)

    // Filtre âge
    let matchesAge = true
    if (filterAge !== "all" && membre.age) {
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
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
               {filteredMembres.length > 0 
                 ? Math.round(filteredMembres.reduce((sum, m) => sum + (m.age || 0), 0) / filteredMembres.length) 
                 : 0} ans
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
                  {departementsNoms.map((dept) => (
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
                    arrondissements[filterDepartement as keyof typeof arrondissements]?.map((arr: string) => (
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
                        <Button variant="ghost" size="sm">
                          Voir Détails
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
