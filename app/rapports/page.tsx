"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, BarChart, LineChart, PieChart, Plus } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Rapport {
  id: string
  titre: string
  type: string
  periode: string
  dateGeneration: string
  auteur: string
}

const rapportsData: Rapport[] = [
  {
    id: "1",
    titre: "Rapport Annuel des Membres 2023",
    type: "Membres",
    periode: "Annuel",
    dateGeneration: "2024-01-10",
    auteur: "Service des Statistiques",
  },
  {
    id: "2",
    titre: "Analyse des Activités du T4 2023",
    type: "Activités",
    periode: "Trimestriel",
    dateGeneration: "2024-01-05",
    auteur: "Département des Opérations",
  },
  {
    id: "3",
    titre: "Synthèse des Dons Collectés 2023",
    type: "Finances",
    periode: "Annuel",
    dateGeneration: "2024-01-12",
    auteur: "Département des Finances",
  },
  {
    id: "4",
    titre: "Rapport Mensuel des Nouvelles Adhésions - Mars 2024",
    type: "Membres",
    periode: "Mensuel",
    dateGeneration: "2024-04-01",
    auteur: "Service des Adhésions",
  },
  {
    id: "5",
    titre: "Évaluation des Formations 2023",
    type: "Activités",
    periode: "Annuel",
    dateGeneration: "2024-02-20",
    auteur: "Département de la Formation",
  },
]

export default function RapportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPeriode, setFilterPeriode] = useState("all")

  const typesRapport = ["Membres", "Activités", "Finances", "Organisation"]
  const periodesRapport = ["Annuel", "Trimestriel", "Mensuel", "Hebdomadaire"]

  const filteredRapports = rapportsData.filter((rapport) => {
    const matchesSearch =
      rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.auteur.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || rapport.type === filterType
    const matchesPeriode = filterPeriode === "all" || rapport.periode === filterPeriode

    return matchesSearch && matchesType && matchesPeriode
  })

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterPeriode("all")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rapports</h1>
          <p className="text-gray-600 mt-1">Accédez et générez divers rapports pour la Croix Rouge</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Générer Nouveau Rapport
        </Button>
      </div>

      {/* Stats Cards / Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <BarChart className="h-12 w-12 text-red-600 mb-3" />
          <CardTitle className="text-lg">Rapports Membres</CardTitle>
          <p className="text-sm text-muted-foreground">Statistiques sur les adhésions, démographie, etc.</p>
          <Button variant="outline" className="mt-4">
            Voir les rapports
          </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <LineChart className="h-12 w-12 text-red-600 mb-3" />
          <CardTitle className="text-lg">Rapports Activités</CardTitle>
          <p className="text-sm text-muted-foreground">Suivi des campagnes, formations, interventions.</p>
          <Button variant="outline" className="mt-4">
            Voir les rapports
          </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <PieChart className="h-12 w-12 text-red-600 mb-3" />
          <CardTitle className="text-lg">Rapports Financiers</CardTitle>
          <p className="text-sm text-muted-foreground">Dons, dépenses, budgets.</p>
          <Button variant="outline" className="mt-4">
            Voir les rapports
          </Button>
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
              <p className="text-sm text-muted-foreground">Filtrez la liste des rapports disponibles</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Effacer les filtres
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter la liste
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
                  placeholder="Titre, auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de Rapport</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typesRapport.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={filterPeriode} onValueChange={setFilterPeriode}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  {periodesRapport.map((periode) => (
                    <SelectItem key={periode} value={periode}>
                      {periode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Disponibles ({filteredRapports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre du Rapport</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Date de Génération</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRapports.length > 0 ? (
                  filteredRapports.map((rapport) => (
                    <TableRow key={rapport.id}>
                      <TableCell className="font-medium">{rapport.titre}</TableCell>
                      <TableCell>{rapport.type}</TableCell>
                      <TableCell>{rapport.periode}</TableCell>
                      <TableCell>{new Date(rapport.dateGeneration).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{rapport.auteur}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" title="Télécharger le rapport">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Aucun rapport trouvé.
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
