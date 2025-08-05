"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Sample members data (centralized as requested)
const membersData = [
  {
    id: "1",
    name: "Alice Dupont",
    email: "alice.dupont@example.com",
    phone: "+242 06 123 4567",
    department: "Brazzaville",
    status: "Actif",
  },
  {
    id: "2",
    name: "Bob Martin",
    email: "bob.martin@example.com",
    phone: "+242 05 987 6543",
    department: "Pointe-Noire",
    status: "Actif",
  },
  {
    id: "3",
    name: "Claire Dubois",
    email: "claire.dubois@example.com",
    phone: "+242 04 111 2233",
    department: "Niari",
    status: "Inactif",
  },
  {
    id: "4",
    name: "David Nkounkou",
    email: "david.nkounkou@example.com",
    phone: "+242 06 222 3344",
    department: "Pool",
    status: "Actif",
  },
  {
    id: "5",
    name: "Émilie Ngoma",
    email: "emilie.ngoma@example.com",
    phone: "+242 05 333 4455",
    department: "Kouilou",
    status: "Actif",
  },
  {
    id: "6",
    name: "François M'Boulou",
    email: "francois.mboulou@example.com",
    phone: "+242 04 555 6677",
    department: "Bouenza",
    status: "Inactif",
  },
  {
    id: "7",
    name: "Grace Malonga",
    email: "grace.malonga@example.com",
    phone: "+242 06 777 8899",
    department: "Lékoumou",
    status: "Actif",
  },
  {
    id: "8",
    name: "Henriette Ondongo",
    email: "henriette.ondongo@example.com",
    phone: "+242 05 999 0011",
    department: "Cuvette",
    status: "Actif",
  },
  {
    id: "9",
    name: "Isabelle Kaba",
    email: "isabelle.kaba@example.com",
    phone: "+242 04 123 0987",
    department: "Plateaux",
    status: "Actif",
  },
  {
    id: "10",
    name: "Julien Massamba",
    email: "julien.massamba@example.com",
    phone: "+242 06 456 7890",
    department: "Sangha",
    status: "Inactif",
  },
]

const ITEMS_PER_PAGE = 5

export default function MembresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredMembers = membersData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Membres</h1>
        <Link href="/membres/nouveau">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau Membre
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un membre..."
              className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[450px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === "Actif" ? "default" : "secondary"}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/membres/${member.id}`}>
                        <Button variant="outline" size="sm">
                          Voir Détails
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Aucun membre trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePreviousPage} disabled={currentPage === 1} />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <Button variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={handleNextPage} disabled={currentPage === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  )
}
