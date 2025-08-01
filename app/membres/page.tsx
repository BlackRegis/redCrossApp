"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PlusCircle, SearchIcon } from "lucide-react"

interface Membre {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  date_adhesion: string
  statut: string
  departement_nom: string
  arrondissement_nom: string
}

export default function MembresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const currentPage = Number.parseInt(searchParams.get("page") || "1")

  const { data, isLoading, error } = useQuery<{ data: Membre[]; totalPages: number; currentPage: number }>({
    queryKey: ["membres", searchQuery, currentPage],
    queryFn: async () => {
      const res = await fetch(`/api/membres?query=${searchQuery}&page=${currentPage}`)
      if (!res.ok) {
        throw new Error("Failed to fetch membres")
      }
      return res.json()
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/membres?query=${searchQuery}&page=1`)
  }

  const handlePageChange = (page: number) => {
    router.push(`/membres?query=${searchQuery}&page=${page}`)
  }

  if (isLoading) return <p className="p-4 md:p-6">Chargement des membres...</p>
  if (error) return <p className="p-4 md:p-6">Erreur: {error.message}</p>

  const membres = data?.data || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Membres</h1>
        <Button onClick={() => router.push("/membres/nouveau")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Membre
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Membres</CardTitle>
          <CardDescription>Gérez les membres de la Croix-Rouge.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom Complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date Adhésion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Arrondissement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membres.length > 0 ? (
                membres.map((membre) => (
                  <TableRow key={membre.id}>
                    <TableCell className="font-medium">
                      {membre.prenom} {membre.nom}
                    </TableCell>
                    <TableCell>{membre.email}</TableCell>
                    <TableCell>{membre.telephone}</TableCell>
                    <TableCell>{format(new Date(membre.date_adhesion), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{membre.statut}</TableCell>
                    <TableCell>{membre.departement_nom}</TableCell>
                    <TableCell>{membre.arrondissement_nom}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/membres/${membre.id}`)}>
                        Voir/Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Aucun membre trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
