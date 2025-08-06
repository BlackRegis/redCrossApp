"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Edit, Trash2 } from 'lucide-react'

interface MembreBureau {
  id: string
  nom: string
  prenom: string
  poste: string
  departement: string
  email: string
  telephone: string
  imageUrl: string
}

const membresBureauData: MembreBureau[] = [
  {
    id: "1",
    nom: "MABIALA",
    prenom: "Jean-Luc",
    poste: "Président National",
    departement: "Direction Générale",
    email: "jl.mabiala@croixrouge.cg",
    telephone: "+242 06 123 4567",
    imageUrl: "/placeholder.svg?height=100&width=100&text=JLM",
  },
  {
    id: "2",
    nom: "NDZAMBA",
    prenom: "Sylvie",
    poste: "Secrétaire Général",
    departement: "Secrétariat Général",
    email: "s.ndzamba@croixrouge.cg",
    telephone: "+242 05 987 6543",
    imageUrl: "/placeholder.svg?height=100&width=100&text=SN",
  },
  {
    id: "3",
    nom: "LOUBASSOU",
    prenom: "Bernard",
    poste: "Trésorier National",
    departement: "Finances",
    email: "b.loubassou@croixrouge.cg",
    telephone: "+242 04 111 2233",
    imageUrl: "/placeholder.svg?height=100&width=100&text=BL",
  },
  {
    id: "4",
    nom: "NGOMA",
    prenom: "Alain",
    poste: "Chef Département Opérations",
    departement: "Opérations",
    email: "a.ngoma@croixrouge.cg",
    telephone: "+242 06 222 3344",
    imageUrl: "/placeholder.svg?height=100&width=100&text=AN",
  },
  {
    id: "5",
    nom: "MBOUMBA",
    prenom: "Chantal",
    poste: "Chef Département Santé",
    departement: "Santé",
    email: "c.mboumba@croixrouge.cg",
    telephone: "+242 05 333 4455",
    imageUrl: "/placeholder.svg?height=100&width=100&text=CM",
  },
  {
    id: "6",
    nom: "ONDONGO",
    prenom: "Patrick",
    poste: "Responsable RH",
    departement: "Ressources Humaines",
    email: "p.ondongo@croixrouge.cg",
    telephone: "+242 04 555 6677",
    imageUrl: "/placeholder.svg?height=100&width=100&text=PO",
  },
]

export default function BureauExecutifPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembres = membresBureauData.filter(
    (membre) =>
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.departement.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (id: string) => {
    console.log("Modifier le membre du bureau:", id)
    // Implement navigation to edit page or open a modal
  }

  const handleDelete = (id: string) => {
    console.log("Supprimer le membre du bureau:", id)
    // Implement deletion logic, e.g., API call
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre du bureau ?")) {
      alert(`Membre ${id} supprimé (simulation)`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bureau Exécutif</h1>
          <p className="text-gray-600 mt-1">Gérez les membres du bureau exécutif de la Croix Rouge.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Membre
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher un Membre</CardTitle>
          <CardDescription>Recherchez un membre du bureau par nom, poste ou département.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un membre..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembres.length > 0 ? (
          filteredMembres.map((membre) => (
            <Card key={membre.id} className="flex flex-col items-center p-6 text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={membre.imageUrl || "/placeholder.svg"} alt={`${membre.prenom} ${membre.nom}`} />
                <AvatarFallback>{membre.prenom.charAt(0) + membre.nom.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">
                {membre.prenom} {membre.nom}
              </h3>
              <p className="text-red-600 font-medium">{membre.poste}</p>
              <p className="text-sm text-muted-foreground">{membre.departement}</p>
              <div className="mt-4 text-sm text-gray-700">
                <p>{membre.email}</p>
                <p>{membre.telephone}</p>
              </div>
              <div className="flex mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(membre.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(membre.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Aucun membre du bureau exécutif trouvé.
          </div>
        )}
      </div>
    </div>
  )
}
