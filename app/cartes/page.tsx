"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Search } from "lucide-react"
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
import Image from "next/image"

// Sample card data (centralized as requested)
const cardsData = [
  {
    id: "C001",
    memberId: "1",
    memberName: "Alice Dupont",
    type: "Bénévole",
    issueDate: "2023-01-01",
    expiryDate: "2025-01-01",
    status: "Active",
    imageUrl: "/public/images/sim-chip.png", // Using the provided image
  },
  {
    id: "C002",
    memberId: "2",
    memberName: "Bob Martin",
    type: "Coordinateur",
    issueDate: "2022-06-15",
    expiryDate: "2024-06-15",
    status: "Active",
    imageUrl: "/public/images/sim-chip.png",
  },
  {
    id: "C003",
    memberId: "3",
    memberName: "Claire Dubois",
    type: "Bénévole",
    issueDate: "2023-03-20",
    expiryDate: "2025-03-20",
    status: "Expirée",
    imageUrl: "/public/images/sim-chip.png",
  },
  {
    id: "C004",
    memberId: "4",
    memberName: "David Nkounkou",
    type: "Bénévole",
    issueDate: "2023-04-01",
    expiryDate: "2025-04-01",
    status: "Active",
    imageUrl: "/public/images/sim-chip.png",
  },
  {
    id: "C005",
    memberId: "5",
    memberName: "Émilie Ngoma",
    type: "Coordinateur",
    issueDate: "2022-09-10",
    expiryDate: "2024-09-10",
    status: "Active",
    imageUrl: "/public/images/sim-chip.png",
  },
]

const ITEMS_PER_PAGE = 5

export default function CartesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCards = cardsData.filter(
    (card) =>
      card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentCards = filteredCards.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des Cartes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Cartes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une carte..."
              className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[450px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Carte</TableHead>
                <TableHead>Membre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date d'émission</TableHead>
                <TableHead>Date d'expiration</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCards.length > 0 ? (
                currentCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.id}</TableCell>
                    <TableCell>{card.memberName}</TableCell>
                    <TableCell>{card.type}</TableCell>
                    <TableCell>{card.issueDate}</TableCell>
                    <TableCell>{card.expiryDate}</TableCell>
                    <TableCell>
                      <Badge variant={card.status === "Active" ? "default" : "secondary"}>{card.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Image
                        src={card.imageUrl || "/placeholder.svg"}
                        alt={`Carte ${card.id}`}
                        width={50}
                        height={30}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Aucune carte trouvée.
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
