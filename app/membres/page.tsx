"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample member data (centralized as requested)
const membersData = [
  {
    id: "1",
    nom: "Doe",
    prenom: "John",
    telephone: "+242 06 123 4567",
    email: "john.doe@example.com",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=40&width=40&text=JD",
  },
  {
    id: "2",
    nom: "Smith",
    prenom: "Alice",
    telephone: "+242 05 987 6543",
    email: "alice.smith@example.com",
    departement: "Pointe-Noire",
    arrondissement: "Lumumba",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=40&width=40&text=AS",
  },
  {
    id: "3",
    nom: "Brown",
    prenom: "Robert",
    telephone: "+242 06 222 3344",
    email: "robert.brown@example.com",
    departement: "Pointe-Noire",
    arrondissement: "Tié-Tié",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=40&width=40&text=RB",
  },
  {
    id: "4",
    nom: "Ngoma",
    prenom: "Chantal",
    telephone: "+242 05 111 2233",
    email: "chantal.ngoma@example.com",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    statut: "Inactif",
    imageUrl: "/placeholder.svg?height=40&width=40&text=CN",
  },
  {
    id: "5",
    nom: "Mbemba",
    prenom: "David",
    telephone: "+242 06 555 6677",
    email: "david.mbemba@example.com",
    departement: "Pool",
    arrondissement: "Kinkala",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=40&width=40&text=DM",
  },
]

export default function MembresPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = membersData.filter(
    (member) =>
      member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.arrondissement.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (id: string) => {
    console.log("Modifier le membre:", id)
    // Implement navigation to edit page or open a modal
  }

  const handleDelete = (id: string) => {
    console.log("Supprimer le membre:", id)
    // Implement deletion logic, e.g., API call
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      // Logic to remove from state or refetch data
      alert(`Membre ${id} supprimé (simulation)`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Membres</h1>
        <Link href="/membres/nouveau">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau Membre
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rechercher des Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom, prénom, département ou arrondissement..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Arrondissement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="flex items-center">
                        <Avatar className="h-9 w-9 mr-2">
                          <AvatarImage
                            src={member.imageUrl || "/placeholder.svg"}
                            alt={`${member.prenom} ${member.nom}`}
                          />
                          <AvatarFallback>{member.prenom.charAt(0) + member.nom.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {member.prenom} {member.nom}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.telephone}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.departement}</TableCell>
                      <TableCell>{member.arrondissement}</TableCell>
                      <TableCell>{member.statut}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/membres/${member.id}`}>
                          <Button variant="ghost" size="sm" className="mr-2">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Voir</span>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member.id)} className="mr-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Aucun membre trouvé.
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
