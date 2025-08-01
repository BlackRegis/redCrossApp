"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function NouvelleActivitePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: null as Date | null,
    end_date: null as Date | null,
    location: "",
    status: "Planned",
  })

  const createActivityMutation = useMutation({
    mutationFn: async (newActivityData: any) => {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActivityData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create activity")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      toast.success("Activité créée avec succès!")
      router.push("/activites")
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création de l'activité: ${error.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [id]: date || null }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createActivityMutation.mutate({
      ...formData,
      start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
      end_date: formData.end_date ? format(formData.end_date, "yyyy-MM-dd") : null,
    })
  }

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Activité</CardTitle>
          <CardDescription>Remplissez les informations pour ajouter une nouvelle activité.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'activité</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de Début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date || undefined}
                    onSelect={(date) => handleDateChange("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date || undefined}
                    onSelect={(date) => handleDateChange("end_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planifiée</SelectItem>
                  <SelectItem value="In Progress">En Cours</SelectItem>
                  <SelectItem value="Completed">Terminée</SelectItem>
                  <SelectItem value="Cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-full flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={createActivityMutation.isPending}>
                {createActivityMutation.isPending ? "Création..." : "Créer Activité"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
