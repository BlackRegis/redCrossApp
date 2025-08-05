"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NouvelleActivitePage() {
  const [formData, setFormData] = useState({
    nom: "",
    date: null,
    lieu: "",
    description: "",
    participantsAttendus: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, date: date }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data Submitted:", formData)
    // Here you would typically send the data to your API
    alert("Nouvelle activité ajoutée (simulé)!")
    // Reset form or navigate
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/activites">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle Activité</h1>
          <p className="text-gray-600 mt-1">Créer une nouvelle activité pour la Croix Rouge</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une Nouvelle Activité</CardTitle>
          <CardDescription>Remplissez les informations ci-dessous pour planifier une activité.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nom">Nom de l'Activité</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date de l'Activité</Label>
              <DatePicker date={formData.date} setDate={handleDateChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input id="lieu" value={formData.lieu} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participantsAttendus">Participants Attendus</Label>
              <Input
                id="participantsAttendus"
                type="number"
                value={formData.participantsAttendus}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Ajouter Activité</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
