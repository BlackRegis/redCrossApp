"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Membre {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  type_membre: string
  statut: string
}

export default function MembresPage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 10

  useEffect(() => {
    fetchMembres()
  }, [])

  const fetchMembres = async () => {
    try {
      const response = await fetch("/api/membres")
      if (!response.ok) {
        throw new Error("Failed to fetch members")
      }
      const data = await response.json()
      setMembres(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des membres.")
      console.error("Error fetching members:", error)
    }
  }

  const handleDeleteMembre = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      return
    }
    try {
      const response = await fetch(`/api/membres/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete member")
      }
      toast.success("Membre supprimé avec succès.")
      fetchMembres() // Refresh the list
    } catch (error) {
      toast.error("Erreur lors de la suppression du membre.")
      console.error("Error deleting member:", error)
    }
  }

  const filteredMembres = membres.filter(
    (membre) =>
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.telephone.includes(searchTerm),
  )

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage
  const indexOfFirstMember = indexOfLastMember - membersPerPage
  const currentMembers = filteredMembres.slice(indexOfFirstMember, indexOfLastMember)
  const totalPages = Math.ceil(filteredMembres.length / membersPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Membres</h1>
        <Link href="/membres/nouveau">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Nouveau Membre
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Input
          placeholder="Rechercher un membre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMembers.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">Aucun membre trouvé.</p>
        ) : (
          currentMembers.map((membre) => (
            <Card key={membre.id}>
              <CardHeader>
                <CardTitle>
                  {membre.nom} {membre.prenom}
                </CardTitle>
                <CardDescription>
                  {membre.type_membre} - {membre.statut}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Téléphone: {membre.telephone}</p>
                <p className="text-sm text-muted-foreground">Email: {membre.email}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Link href={`/membres/${membre.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMembre(membre.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationPrevious href="#" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext href="#" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
