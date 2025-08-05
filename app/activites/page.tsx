"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Sample activity data (centralized as requested)
const activitiesData = [
  {
    id: "act-1",
    name: "Campagne de Don de Sang",
    date: "2024-03-15",
    location: "Hôpital Central",
    status: "Terminée",
    participants: 120,
  },
  {
    id: "act-2",
    name: "Formation Premiers Secours",
    date: "2024-04-20",
    location: "Centre Communautaire",
    status: "À venir",
    participants: 30,
  },
  {
    id: "act-3",
    name: "Distribution de Kits d'Hygiène",
    date: "2024-05-10",
    location: "Quartier Ndjili",
    status: "À venir",
    participants: 80,
  },
  {
    id: "act-4",
    name: "Sensibilisation au Paludisme",
    date: "2024-02-01",
    location: "Marché Total",
    status: "Terminée",
    participants: 200,
  },
  {
    id: "act-5",
    name: "Collecte de Fonds Annuelle",
    date: "2024-06-05",
    location: "Hôtel de Ville",
    status: "À venir",
    participants: 50,
  },
]

export default function ActivitesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = activitiesData.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (id: string) => {
    console.log("Modifier l'activité:", id)
    // Implement navigation to edit page or open a modal
  }

  const handleDelete = (id: string) => {
    console.log("Supprimer l'activité:", id)
    // Implement deletion logic, e.g., API call
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      // Logic to remove from state or refetch data
      alert(`Activité ${id} supprimée (simulation)`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Activités</h1>
        <Link href="/activites/nouvelle">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Activité
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rechercher des Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom, lieu ou statut..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de l'Activité</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.location}</TableCell>
                      <TableCell>{activity.status}</TableCell>
                      <TableCell>{activity.participants}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(activity.id)} className="mr-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(activity.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Aucune activité trouvée.
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
