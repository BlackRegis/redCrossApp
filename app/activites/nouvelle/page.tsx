"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NouvelleActivitePage() {
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    departement: "",
    dateDebut: undefined as Date | undefined,
    dateFin: undefined as Date | undefined,
    responsable: "",
    description: "",
  })

  const typesActivite = ["Santé", "Humanitaire", "Formation", "Logistique", "Autre"]
  const departements = ["Brazzaville", "Pointe-Noire", "Dolisie", "Kouilou", "Niari", "Pool", "Plateaux"]
  const responsables = ["Dr. Jean-Luc MABIALA", "Mme. Sylvie NDZAMBA", "M. Alain NGOMA", "Mme. Chantal MBOUMBA"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [id]: date }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nouvelle activité soumise:", formData)
    // Here you would typically send data to an API
    alert("Nouvelle activité ajoutée (simulation)!")
    // Reset form or redirect
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter une Nouvelle Activité</h1>
          <p className="text-gray-600 mt-1">Remplissez les informations pour planifier une nouvelle activité.</p>
        </div>
        <Link href="/activites">
          <Button variant="outline">Retour à la liste des activités</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'Activité</CardTitle>
            <CardDescription>Informations générales sur l'activité.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium">
                Nom de l'Activité
              </label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type d'Activité
              </label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {typesActivite.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="departement" className="text-sm font-medium">
                Département
              </label>
              <Select value={formData.departement} onValueChange={(value) => handleSelectChange("departement", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departements.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="responsable" className="text-sm font-medium">
                Responsable
              </label>
              <Select value={formData.responsable} onValueChange={(value) => handleSelectChange("responsable", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {responsables.map((resp) => (
                    <SelectItem key={resp} value={resp}>
                      {resp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="dateDebut" className="text-sm font-medium">
                Date de Début
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateDebut && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateDebut ? format(formData.dateDebut, "PPP") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateDebut}
                    onSelect={(date) => handleDateChange("dateDebut", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="dateFin" className="text-sm font-medium">
                Date de Fin
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateFin && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateFin ? format(formData.dateFin, "PPP") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateFin}
                    onSelect={(date) => handleDateChange("dateFin", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea id="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Planifier Activité
          </Button>
        </div>
      </form>
    </div>
  )
}
