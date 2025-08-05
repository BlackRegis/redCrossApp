"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building2, MapPin, Users, Plus, Edit, ChevronDown, ChevronRight, Search } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tree, TreeItem } from "@/components/ui/tree"

interface OrganisationNode {
  id: string
  name: string
  children?: OrganisationNode[]
}

const organizationData: OrganisationNode[] = [
  {
    id: "1",
    name: "Siège National",
    children: [
      {
        id: "1.1",
        name: "Département des Opérations",
        children: [
          { id: "1.1.1", name: "Division Secours d'Urgence" },
          { id: "1.1.2", name: "Division Santé et Premiers Secours" },
        ],
      },
      {
        id: "1.2",
        name: "Département des Finances",
        children: [
          { id: "1.2.1", name: "Service Comptabilité" },
          { id: "1.2.2", name: "Service Trésorerie" },
        ],
      },
      {
        id: "1.3",
        name: "Département des Ressources Humaines",
        children: [
          { id: "1.3.1", name: "Service Recrutement" },
          { id: "1.3.2", name: "Service Formation" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Comité Provincial de Brazzaville",
    children: [
      { id: "2.1", name: "Antenne de Makélékélé" },
      { id: "2.2", name: "Antenne de Bacongo" },
    ],
  },
  {
    id: "3",
    name: "Comité Provincial de Pointe-Noire",
    children: [
      { id: "3.1", name: "Antenne de Tié-Tié" },
      { id: "3.2", name: "Antenne de Lumumba" },
    ],
  },
]

export default function OrganisationPage() {
  const [selectedNode, setSelectedNode] = useState<OrganisationNode | null>(null)
  const [openNodes, setOpenNodes] = useState<string[]>(["1", "1.1"])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleNode = (nodeId: string) => {
    setOpenNodes((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]))
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
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{node.name}</h3>
                    {node.children && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-blue-100 text-blue-800">{node.children.length} enfants</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
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

  const renderTree = (nodes: typeof organizationData) =>
    nodes.map((node) => (
      <TreeItem key={node.id} item={node}>
        {node.children && renderTree(node.children)}
      </TreeItem>
    ))

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
            <div className="text-2xl font-bold text-green-600">
              {organizationData.reduce((total, dept) => total + (dept.children?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrondissements</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {organizationData.reduce(
                (total, dept) =>
                  total + (dept.children?.reduce((deptTotal, arr) => deptTotal + (arr.children?.length || 0), 0) || 0),
                0,
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1109</div>
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
      <div className="flex space-x-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Hiérarchie Organisationnelle</CardTitle>
            <CardDescription>Structure complète de l'organisation (cliquez pour développer/réduire)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">{renderNode(organizationData[0])}</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Organisation en Arbre</CardTitle>
          </CardHeader>
          <CardContent>
            <Tree className="w-full max-w-md">{renderTree(organizationData)}</Tree>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
