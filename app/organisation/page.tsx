"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Tree, TreeItem, TreeItemContent, TreeItemToggle } from "@/components/ui/tree"

interface Departement {
  id: number
  nom: string
  description?: string
  arrondissements?: Arrondissement[]
}

interface Arrondissement {
  id: number
  nom: string
  description?: string
  departement_id: number
}

export default function OrganisationPage() {
  const [departements, setDepartements] = useState<Departement[]>([])
  const [newDepartementName, setNewDepartementName] = useState("")
  const [newArrondissementName, setNewArrondissementName] = useState("")
  const [selectedDepartementId, setSelectedDepartementId] = useState<number | null>(null)
  const [expandedDepartements, setExpandedDepartements] = useState<number[]>([])

  useEffect(() => {
    fetchOrganisationData()
  }, [])

  const fetchOrganisationData = async () => {
    try {
      const departementsRes = await fetch("/api/departements")
      const departementsData: Departement[] = await departementsRes.json()

      const arrondissementsRes = await fetch("/api/arrondissements")
      const arrondissementsData: Arrondissement[] = await arrondissementsRes.json()

      const mergedData = departementsData.map((dep) => ({
        ...dep,
        arrondissements: arrondissementsData.filter((arr) => arr.departement_id === dep.id),
      }))
      setDepartements(mergedData)
    } catch (error) {
      toast.error("Erreur lors du chargement des données de l'organisation.")
      console.error("Error fetching organization data:", error)
    }
  }

  const handleAddDepartement = async () => {
    if (!newDepartementName.trim()) {
      toast.error("Le nom du département ne peut pas être vide.")
      return
    }
    try {
      const response = await fetch("/api/departements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: newDepartementName }),
      })
      if (!response.ok) throw new Error("Failed to add departement")
      toast.success("Département ajouté avec succès.")
      setNewDepartementName("")
      fetchOrganisationData()
    } catch (error) {
      toast.error("Erreur lors de l'ajout du département.")
      console.error("Error adding departement:", error)
    }
  }

  const handleDeleteDepartement = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce département et tous ses arrondissements ?")) return
    try {
      const response = await fetch(`/api/departements/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete departement")
      toast.success("Département supprimé avec succès.")
      fetchOrganisationData()
    } catch (error) {
      toast.error("Erreur lors de la suppression du département.")
      console.error("Error deleting departement:", error)
    }
  }

  const handleAddArrondissement = async () => {
    if (!newArrondissementName.trim() || selectedDepartementId === null) {
      toast.error("Veuillez sélectionner un département et entrer un nom pour l'arrondissement.")
      return
    }
    try {
      const response = await fetch("/api/arrondissements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: newArrondissementName, departement_id: selectedDepartementId }),
      })
      if (!response.ok) throw new Error("Failed to add arrondissement")
      toast.success("Arrondissement ajouté avec succès.")
      setNewArrondissementName("")
      setSelectedDepartementId(null)
      fetchOrganisationData()
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'arrondissement.")
      console.error("Error adding arrondissement:", error)
    }
  }

  const handleDeleteArrondissement = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet arrondissement ?")) return
    try {
      const response = await fetch(`/api/arrondissements/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete arrondissement")
      toast.success("Arrondissement supprimé avec succès.")
      fetchOrganisationData()
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'arrondissement.")
      console.error("Error deleting arrondissement:", error)
    }
  }

  const toggleDepartement = (id: number) => {
    setExpandedDepartements((prev) => (prev.includes(id) ? prev.filter((depId) => depId !== id) : [...prev, id]))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion de l'Organisation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un Département</CardTitle>
            <CardDescription>Créez de nouveaux départements pour structurer l'organisation.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Nom du département"
              value={newDepartementName}
              onChange={(e) => setNewDepartementName(e.target.value)}
            />
            <Button onClick={handleAddDepartement}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter un Arrondissement</CardTitle>
            <CardDescription>Ajoutez un arrondissement à un département existant.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              value={selectedDepartementId || ""}
              onChange={(e) => setSelectedDepartementId(Number(e.target.value))}
            >
              <option value="">Sélectionner un département</option>
              {departements.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nom}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Input
                placeholder="Nom de l'arrondissement"
                value={newArrondissementName}
                onChange={(e) => setNewArrondissementName(e.target.value)}
              />
              <Button onClick={handleAddArrondissement} disabled={selectedDepartementId === null}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Structure de l'Organisation</CardTitle>
          <CardDescription>Visualisez et gérez les départements et arrondissements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tree>
            {departements.map((departement) => (
              <Collapsible
                key={departement.id}
                open={expandedDepartements.includes(departement.id)}
                onOpenChange={() => toggleDepartement(departement.id)}
              >
                <TreeItem>
                  <TreeItemToggle>
                    {expandedDepartements.includes(departement.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TreeItemToggle>
                  <TreeItemContent className="font-semibold">{departement.nom}</TreeItemContent>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteDepartement(departement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TreeItem>
                <CollapsibleContent className="ml-6">
                  <Tree>
                    {departement.arrondissements?.map((arrondissement) => (
                      <TreeItem key={arrondissement.id}>
                        <TreeItemContent>{arrondissement.nom}</TreeItemContent>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteArrondissement(arrondissement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </TreeItem>
                    ))}
                  </Tree>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </Tree>
        </CardContent>
      </Card>
    </div>
  )
}
