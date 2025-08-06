"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tree, TreeItem, TreeBranch } from "@/components/ui/tree"
import { Search, Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react'

interface OrganigrammeNode {
  id: string
  name: string
  title: string
  children?: OrganigrammeNode[]
}

const initialOrganigramme: OrganigrammeNode[] = [
  {
    id: "1",
    name: "Président National",
    title: "Dr. Jean-Luc MABIALA",
    children: [
      {
        id: "1.1",
        name: "Secrétaire Général",
        title: "Mme. Sylvie NDZAMBA",
        children: [
          {
            id: "1.1.1",
            name: "Département des Opérations",
            title: "Chef de Département",
            children: [
              { id: "1.1.1.1", name: "Chef de Service Urgences", title: "M. Alain NGOMA" },
              { id: "1.1.1.2", name: "Chef de Service Santé", title: "Mme. Chantal MBOUMBA" },
            ],
          },
          {
            id: "1.1.2",
            name: "Département des Ressources Humaines",
            title: "Chef de Département",
            children: [{ id: "1.1.2.1", name: "Responsable Recrutement", title: "M. Patrick ONDONGO" }],
          },
          {
            id: "1.1.3",
            name: "Département des Finances",
            title: "Chef de Département",
            children: [{ id: "1.1.3.1", name: "Comptable Principal", title: "Mme. Gisèle KOUMBA" }],
          },
        ],
      },
      {
        id: "1.2",
        name: "Trésorier National",
        title: "M. Bernard LOUBASSOU",
      },
      {
        id: "1.3",
        name: "Conseiller Juridique",
        title: "Me. Sophie MABIALA",
      },
    ],
  },
  {
    id: "2",
    name: "Comités Départementaux",
    title: "Représentants",
    children: [
      { id: "2.1", name: "Brazzaville", title: "Président du Comité" },
      { id: "2.2", name: "Pointe-Noire", title: "Président du Comité" },
      { id: "2.3", name: "Dolisie", title: "Président du Comité" },
    ],
  },
]

const renderOrganigramme = (nodes: OrganigrammeNode[], level = 0, expandedNodes: Set<string>) => {
  return nodes.map((node, index) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const isLastItem = index === nodes.length - 1

    return (
      <TreeBranch key={node.id} level={level} isExpanded={isExpanded}>
        <TreeItem
          level={level}
          isBranch={hasChildren}
          isExpanded={isExpanded}
          isLastItem={isLastItem}
          onSelect={() => {
            if (hasChildren) {
              if (isExpanded) {
                expandedNodes.delete(node.id)
              } else {
                expandedNodes.add(node.id)
              }
              // Force re-render
              setExpandedNodes(new Set(expandedNodes))
            }
          }}
        >
          <div className="flex items-center gap-2 py-2">
            {hasChildren && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {}}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            <div className="flex flex-col">
              <span className="font-medium">{node.name}</span>
              <span className="text-sm text-muted-foreground">{node.title}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        </TreeItem>
        {isExpanded && hasChildren && renderOrganigramme(node.children!, level + 1, expandedNodes)}
      </TreeBranch>
    )
  })
}

export default function OrganisationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const filteredOrganigramme = initialOrganigramme.filter((node) =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.children?.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()) || child.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organigramme</h1>
          <p className="text-gray-600 mt-1">Visualisez la structure organisationnelle de la Croix Rouge.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un poste
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher dans l'Organigramme</CardTitle>
          <CardDescription>Recherchez un poste ou un responsable spécifique.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un poste ou un nom..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Structure de l'Organisation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tree className="border rounded-md p-4">
            {renderOrganigramme(filteredOrganigramme, 0, expandedNodes)}
          </Tree>
        </CardContent>
      </Card>
    </div>
  )
}
