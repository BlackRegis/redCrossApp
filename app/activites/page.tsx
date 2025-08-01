"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Activite {
  id: number
  nom: string
  description: string
  date_debut: string
  date_fin: string
  lieu: string
  statut: string
}

export default function ActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>([])

  useEffect(() => {
    fetchActivites()
  }, [])

  const fetchActivites = async () => {
    try {
      const response = await fetch("/api/activites")
      if (!response.ok) {
        throw new Error("Failed to fetch activities")
      }
      const data = await response.json()
      setActivites(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des activités.")
      console.error("Error fetching activities:", error)
    }
  }

  const handleDeleteActivite = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      return
    }
    try {
      const response = await fetch(`/api/activites/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete activity")
      }
      toast.success("Activité supprimée avec succès.")
      fetchActivites() // Refresh the list
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'activité.")
      console.error("Error deleting activity:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Activités</h1>
        <Link href="/activites/nouvelle">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Nouvelle Activité
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activites.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">Aucune activité trouvée.</p>
        ) : (
          activites.map((activite) => (
            <Card key={activite.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  {activite.nom}
                </CardTitle>
                <CardDescription>{activite.lieu}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{activite.description}</p>
                <p className="text-sm">Du: {new Date(activite.date_debut).toLocaleDateString()}</p>
                <p className="text-sm">Au: {new Date(activite.date_fin).toLocaleDateString()}</p>
                <p className="text-sm font-medium mt-2">Statut: {activite.statut}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteActivite(activite.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
