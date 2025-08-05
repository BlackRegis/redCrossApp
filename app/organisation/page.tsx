"use client"

import React from "react"

import { Pagination } from "@/components/ui/pagination"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tree, TreeItem, TreeGroup } from "@/components/ui/tree"
import { ChevronRight, ChevronDown, Users, MapPin, Building } from "lucide-react"

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

const organizationDataNew = {
  name: "Croix Rouge Congolaise",
  type: "Organisation Humanitaire",
  headquarters: "Brazzaville, Congo",
  departments: [
    {
      id: "dep-1",
      name: "Département de Brazzaville",
      head: "Jean Dupont",
      arrondissements: [
        { id: "arr-1-1", name: "Moungali", members: 120 },
        { id: "arr-1-2", name: "Makélékélé", members: 150 },
        { id: "arr-1-3", name: "Poto-Poto", members: 100 },
      ],
    },
    {
      id: "dep-2",
      name: "Département de Pointe-Noire",
      head: "Marie Curie",
      arrondissements: [
        { id: "arr-2-1", name: "Lumumba", members: 90 },
        { id: "arr-2-2", name: "Tié-Tié", members: 110 },
      ],
    },
    {
      id: "dep-3",
      name: "Département du Pool",
      head: "Pierre Martin",
      arrondissements: [
        { id: "arr-3-1", name: "Kinkala", members: 50 },
        { id: "arr-3-2", name: "Mindouli", members: 40 },
      ],
    },
  ],
}

export default function OrganisationPage() {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([])
  const [expandedArrondissements, setExpandedArrondissements] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<OrganisationNode | null>(null)
  const [openNodes, setOpenNodes] = useState<string[]>(["congo", "brazzaville"])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDeptPage, setCurrentDeptPage] = useState(1)
  const [arrondissementPages, setArrondissementPages] = useState<{ [key: string]: number }>({})

  const toggleDepartment = (id: string) => {
    setExpandedDepartments((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleArrondissement = (id: string) => {
    setExpandedArrondissements((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleNode = (nodeId: string) => {
    setOpenNodes((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nation":
        return <Building className="h-4 w-4 text-blue-600" />
      case "departement":
        return <MapPin className="h-4 w-4 text-green-600" />
      case "arrondissement":
        return <Users className="h-4 w-4 text-orange-600" />
      default:
        return <Building className="h-4 w-4" />
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
        <TreeItem
          level={level}
          isExpanded={isOpen}
          onToggle={() => hasChildren && toggleNode(node.id)}
          icon={isOpen ? <ChevronDown /> : <ChevronRight />}
        >
          {getTypeIcon(node.type)}
          {node.nom} (Responsable: {node.responsable})
        </TreeItem>
        {hasChildren && node.type === "departement" && (
          <TreeGroup isExpanded={isOpen}>
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
          </TreeGroup>
        )}
      </div>
    )
  }

  const clearSearch = () => {
    setSearchTerm("")
    setCurrentDeptPage(1)
    setSelectedNode(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Structure de l'Organisation</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Nom:</strong> {organizationDataNew.name}
          </p>
          <p>
            <strong>Type:</strong> {organizationDataNew.type}
          </p>
          <p>
            <strong>Siège Social:</strong> {organizationDataNew.headquarters}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Départements et Arrondissements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tree>
            {organisationData.children?.map((department) => (
              <React.Fragment key={department.id}>
                <TreeItem
                  level={0}
                  isExpanded={expandedDepartments.includes(department.id)}
                  onToggle={() => toggleDepartment(department.id)}
                  icon={expandedDepartments.includes(department.id) ? <ChevronDown /> : <ChevronRight />}
                >
                  {getTypeIcon(department.type)}
                  {department.nom} (Responsable: {department.responsable})
                </TreeItem>
                <TreeGroup isExpanded={expandedDepartments.includes(department.id)}>
                  {department.children?.map((arrondissement) => (
                    <TreeItem key={arrondissement.id} level={1}>
                      {getTypeIcon(arrondissement.type)}
                      {arrondissement.nom} (Membres: {arrondissement.nombreMembres})
                    </TreeItem>
                  ))}
                </TreeGroup>
              </React.Fragment>
            ))}
          </Tree>
        </CardContent>
      </Card>
    </div>
  )
}
