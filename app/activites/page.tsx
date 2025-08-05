"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PlusCircle, Search, CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Sample activities data (centralized as requested)
const activitiesData = [
  {
    id: "1",
    name: "Campagne de vaccination contre la rougeole",
    date: "2024-03-15",
    location: "Brazzaville",
    status: "Terminée",
    type: "Santé",
  },
  {
    id: "2",
    name: "Formation aux premiers secours",
    date: "2024-04-01",
    location: "Pointe-Noire",
    status: "En cours",
    type: "Formation",
  },
  {
    id: "3",
    name: "Distribution de kits d'hygiène",
    date: "2024-04-20",
    location: "Dolisie",
    status: "Planifiée",
    type: "Humanitaire",
  },
  {
    id: "4",
    name: "Sensibilisation au paludisme",
    date: "2024-05-10",
    location: "Ouesso",
    status: "Planifiée",
    type: "Santé",
  },
  {
    id: "5",
    name: "Collecte de sang",
    date: "2024-05-25",
    location: "Kinkala",
    status: "Planifiée",
    type: "Santé",
  },
]

export default function ActivitesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  const filteredActivities = activitiesData.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = date ? format(new Date(activity.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") : true
    return matchesSearch && matchesDate
  })

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Activités</h1>
        <Link href="/activites/nouvelle">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Activité
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une activité..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[450px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setDate(undefined)
              }}
            >
              Réinitialiser
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>{format(new Date(activity.date), "PPP", { locale: fr })}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.status === "Terminée"
                            ? "secondary"
                            : activity.status === "En cours"
                              ? "default"
                              : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucune activité trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
