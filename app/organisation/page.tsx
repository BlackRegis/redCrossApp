"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Building2, MapPin, Users, Plus, Edit, ChevronDown, ChevronRight, Search, Filter } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface OrganisationNode {
  id: string
  nom: string
  type: "nation" | "departement" | "arrondissement"
  nombreMembres: number
  responsable?: string
  children?: OrganisationNode[]
}

const organisationData: OrganisationNode = {
  id: "congo",
  nom: "République du Congo",
  type: "nation",
  nombreMembres: 1109,
  responsable: "Dr. Mukendi Jean",
  children: [
    {
      id: "brazzaville",
      nom: "Brazzaville",
      type: "departement",
      nombreMembres: 551,
      responsable: "Marie Kabila",
      children: [
        {
          id: "bacongo",
          nom: "Bacongo",
          type: "arrondissement",
          nombreMembres: 156,
          responsable: "Paul Tshisekedi",
        },
        {
          id: "poto-poto",
          nom: "Poto-Poto",
          type: "arrondissement",
          nombreMembres: 134,
          responsable: "Sophie Mukendi",
        },
        {
          id: "moungali",
          nom: "Moungali",
          type: "arrondissement",
          nombreMembres: 98,
          responsable: "Joseph Kabila",
        },
        {
          id: "ouenze",
          nom: "Ouenzé",
          type: "arrondissement",
          nombreMembres: 87,
          responsable: "André Tshisekedi",
        },
        {
          id: "talangai",
          nom: "Talangaï",
          type: "arrondissement",
          nombreMembres: 76,
          responsable: "Lucie Mukendi",
        },
      ],
    },
    {
      id: "kouilou",
      nom: "Kouilou",
      type: "departement",
      nombreMembres: 234,
      responsable: "Françoise Tshisekedi",
      children: [
        {
          id: "pointe-noire",
          nom: "Pointe-Noire",
          type: "arrondissement",
          nombreMembres: 234,
          responsable: "Michel Mukendi",
        },
      ],
    },
    {
      id: "niari",
      nom: "Niari",
      type: "departement",
      nombreMembres: 123,
      responsable: "Pierre Kabila",
      children: [
        {
          id: "dolisie",
          nom: "Dolisie",
          type: "arrondissement",
          nombreMembres: 123,
          responsable: "Jeanne Kabila",
        },
      ],
    },
    {
      id: "bouenza",
      nom: "Bouenza",
      type: "departement",
      nombreMembres: 89,
      responsable: "Claude Mukendi",
      children: [
        {
          id: "nkayi",
          nom: "Nkayi",
          type: "arrondissement",
          nombreMembres: 89,
          responsable: "Marie Tshisekedi",
        },
      ],
    },
    {
      id: "pool",
      nom: "Pool",
      type: "departement",
      nombreMembres: 67,
      responsable: "Jean-Claude Kabila",
      children: [
        {
          id: "kinkala",
          nom: "Kinkala",
          type: "arrondissement",
          nombreMembres: 67,
          responsable: "Sylvie Mukendi",
        },
      ],
    },
    {
      id: "plateaux",
      nom: "Plateaux",
      type: "departement",
      nombreMembres: 45,
      responsable: "Robert Tshisekedi",
      children: [
        {
          id: "djambala",
          nom: "Djambala",
          type: "arrondissement",
          nombreMembres: 45,
          responsable: "Pauline Kabila",
        },
      ],
    },
    // Ajout de départements supplémentaires pour tester la pagination
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `dept-${i + 7}`,
      nom: `Département Test ${i + 1}`,
      type: "departement" as const,
      nombreMembres: Math.floor(Math.random() * 200) + 50,
      responsable: `Responsable Test ${i + 1}`,
      children: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, j) => ({
        id: `arr-${i + 7}-${j + 1}`,
        nom: `Arrondissement ${i + 1}-${j + 1}`,
        type: "arrondissement" as const,
        nombreMembres: Math.floor(Math.random() * 100) + 20,
        responsable: `Responsable Arr ${i + 1}-${j + 1}`,
      })),
    })),
  ],
}

const DEPARTMENTS_PER_PAGE = 4
const ARRONDISSEMENTS_PER_PAGE = 6

export default function OrganisationPage() {
  const [selectedNode, setSelectedNode] = useState<OrganisationNode | null>(null)
  const [openNodes, setOpenNodes] = useState<string[]>(["congo", "brazzaville"])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDeptPage, setCurrentDeptPage] = useState(1)
  const [arrondissementPages, setArrondissementPages] = useState<{ [key: string]: number }>({})

  const toggleNode = (nodeId: string) => {
    setOpenNodes((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nation":
        return <Building2 className="h-4 w-4 text-blue-600" />
      case "departement":
        return <MapPin className="h-4 w-4 text-green-600" />
      case "arrondissement":
        return <Users className="h-4 w-4 text-orange-600" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "nation":
        return "bg-blue-100 text-blue-800"
      case "departement":
        return "bg-green-100 text-green-800"
      case "arrondissement":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filtrer les départements selon la recherche
  const filteredDepartments =
    organisationData.children?.filter(
      (dept) =>
        dept.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.responsable?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  // Pagination des départements
  const totalDeptPages = Math.ceil(filteredDepartments.length / DEPARTMENTS_PER_PAGE)
  const startDeptIndex = (currentDeptPage - 1) * DEPARTMENTS_PER_PAGE
  const paginatedDepartments = filteredDepartments.slice(startDeptIndex, startDeptIndex + DEPARTMENTS_PER_PAGE)

  const handleDeptPageChange = (page: number) => {
    setCurrentDeptPage(page)
    setSelectedNode(null) // Clear selection when changing page
  }

  const handleArrondissementPageChange = (deptId: string, page: number) => {
    setArrondissementPages((prev) => ({ ...prev, [deptId]: page }))
  }

  const getPaginatedArrondissements = (departement: OrganisationNode) => {
    if (!departement.children) return []

    const currentPage = arrondissementPages[departement.id] || 1
    const startIndex = (currentPage - 1) * ARRONDISSEMENTS_PER_PAGE
    return departement.children.slice(startIndex, startIndex + ARRONDISSEMENTS_PER_PAGE)
  }

  const getArrondissementTotalPages = (departement: OrganisationNode) => {
    if (!departement.children) return 0
    return Math.ceil(departement.children.length / ARRONDISSEMENTS_PER_PAGE)
  }

  const renderNode = (node: OrganisationNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isOpen = openNodes.includes(node.id)

    return (
      <div key={node.id} className="space-y-2">
        <Collapsible open={isOpen} onOpenChange={() => hasChildren && toggleNode(node.id)}>
          <Card
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedNode?.id === node.id ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() => setSelectedNode(node)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {hasChildren && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleNode(node.id)
                        }}
                      >
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                  {!hasChildren && <div className="w-4" />}
                  {getTypeIcon(node.type)}
                  <div>
                    <h3 className="font-semibold">{node.nom}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getTypeColor(node.type)}>
                        {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{node.nombreMembres} membres</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {node.responsable && (
                <p className="text-sm text-muted-foreground mt-2">Responsable: {node.responsable}</p>
              )}
            </CardContent>
          </Card>

          {hasChildren && node.type === "departement" && (
            <CollapsibleContent className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
              {/* Arrondissements paginés */}
              <div className="space-y-2">
                {getPaginatedArrondissements(node).map((child) => renderNode(child, level + 1))}
              </div>

              {/* Pagination des arrondissements */}
              {node.children && node.children.length > ARRONDISSEMENTS_PER_PAGE && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={arrondissementPages[node.id] || 1}
                    totalPages={getArrondissementTotalPages(node)}
                    onPageChange={(page) => handleArrondissementPageChange(node.id, page)}
                  />
                </div>
              )}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    )
  }

  const clearSearch = () => {
    setSearchTerm("")
    setCurrentDeptPage(1)
    setSelectedNode(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Structure Organisationnelle</h1>
          <p className="text-gray-600 mt-1">Hiérarchie de la Croix Rouge - République du Congo</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Départements</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filteredDepartments.length}</div>
            <p className="text-xs text-muted-foreground">sur {organisationData.children?.length || 0} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrondissements</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredDepartments.reduce((total, dept) => total + (dept.children?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{organisationData.nombreMembres}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Actuelle</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentDeptPage}</div>
            <p className="text-xs text-muted-foreground">sur {totalDeptPages} pages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Hiérarchie Organisationnelle</CardTitle>
                  <CardDescription>
                    Structure complète de l'organisation (cliquez pour développer/réduire)
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un département ou responsable..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {searchTerm && (
                  <Button variant="outline" onClick={clearSearch} size="sm">
                    Effacer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Niveau National (toujours affiché) */}
                {renderNode(organisationData)}

                {/* Départements paginés */}
                <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                  <div className="space-y-4">{paginatedDepartments.map((dept) => renderNode(dept, 1))}</div>

                  {/* Pagination des départements */}
                  {totalDeptPages > 1 && (
                    <div className="flex justify-center pt-4">
                      <Pagination
                        currentPage={currentDeptPage}
                        totalPages={totalDeptPages}
                        onPageChange={handleDeptPageChange}
                      />
                    </div>
                  )}

                  {filteredDepartments.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucun département trouvé pour "{searchTerm}"</p>
                      <Button variant="outline" onClick={clearSearch} className="mt-2 bg-transparent">
                        Effacer la recherche
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedNode ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedNode.type)}
                  Détails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedNode.nom}</h3>
                  <Badge className={getTypeColor(selectedNode.type)}>
                    {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membres:</span>
                    <span className="font-semibold">{selectedNode.nombreMembres}</span>
                  </div>
                  {selectedNode.responsable && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Responsable:</span>
                      <span className="font-semibold">{selectedNode.responsable}</span>
                    </div>
                  )}
                  {selectedNode.children && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subdivisions:</span>
                      <span className="font-semibold">{selectedNode.children.length}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Voir les Membres
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner un élément</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Cliquez sur un élément de la hiérarchie pour voir ses détails.</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Page actuelle:</span>
                <span className="font-semibold">
                  {currentDeptPage} / {totalDeptPages}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Départements affichés:</span>
                <span className="font-semibold">{paginatedDepartments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total départements:</span>
                <span className="font-semibold">{filteredDepartments.length}</span>
              </div>
              {searchTerm && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recherche:</span>
                    <span className="font-semibold text-sm">"{searchTerm}"</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques Globales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Départements:</span>
                <span className="font-semibold">{organisationData.children?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Arrondissements:</span>
                <span className="font-semibold">
                  {organisationData.children?.reduce((total, dept) => total + (dept.children?.length || 0), 0) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Membres:</span>
                <span className="font-semibold">{organisationData.nombreMembres}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
