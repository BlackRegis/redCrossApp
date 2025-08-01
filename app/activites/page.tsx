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
import { Badge } from "@/components/ui/badge"
import { PlusCircle, SearchIcon } from "lucide-react"

interface Activity {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  location: string
  status: string
}

export default function ActivitiesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const currentPage = Number.parseInt(searchParams.get("page") || "1")

  const { data, isLoading, error } = useQuery<{ data: Activity[]; totalPages: number; currentPage: number }>({
    queryKey: ["activities", searchQuery, currentPage],
    queryFn: async () => {
      const res = await fetch(`/api/activities?query=${searchQuery}&page=${currentPage}`)
      if (!res.ok) {
        throw new Error("Failed to fetch activities")
      }
      return res.json()
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/activites?query=${searchQuery}&page=1`)
  }

  const handlePageChange = (page: number) => {
    router.push(`/activites?query=${searchQuery}&page=${page}`)
  }

  if (isLoading) return <p className="p-4 md:p-6">Chargement des activités...</p>
  if (error) return <p className="p-4 md:p-6">Erreur: {error.message}</p>

  const activities = data?.data || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activités</h1>
        <Button onClick={() => router.push("/activites/nouvelle")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle Activité
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Activités</CardTitle>
          <CardDescription>Gérez les activités de la Croix-Rouge.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Rechercher par nom ou description..."
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
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date Début</TableHead>
                <TableHead>Date Fin</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{activity.description}</TableCell>
                    <TableCell>{format(new Date(activity.start_date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(new Date(activity.end_date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.status === "Completed"
                            ? "default"
                            : activity.status === "Planned"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Aucune activité trouvée.
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
