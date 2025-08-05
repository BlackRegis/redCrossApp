"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building2, MapPin, Users, Plus, Edit, ChevronDown, ChevronRight, Search } from "lucide-react"
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
  ],
}

export default function OrganisationPage() {
  const [selectedNode, setSelectedNode] = useState<OrganisationNode | null>(null)
  const [openNodes, setOpenNodes] = useState<string[]>(["congo", "brazzaville"])
  const [searchTerm, setSearchTerm] = useState("")

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

          {hasChildren && (
            <CollapsibleContent className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
              {node.children.map((child) => renderNode(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Structure Organisationnelle</h1>
          <p className="text-gray-600 mt-1">Hiérarchie de la Croix Rouge - République du Congo</p>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Départements</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{organisationData.children?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrondissements</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {organisationData.children?.reduce((total, dept) => total + (dept.children?.length || 0), 0) || 0}
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
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Hiérarchie Organisationnelle</CardTitle>
          <CardDescription>Structure complète de l'organisation (cliquez pour développer/réduire)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">{renderNode(organisationData)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
