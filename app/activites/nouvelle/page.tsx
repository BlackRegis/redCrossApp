"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NouvelleActivitePage() {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    dateDebut: null,
    dateFin: null,
    lieu: "",
    organisateur: "",
    budget: "",
    statut: "Planifiée", // Default status
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [id]: date }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data Submitted:", formData)
    // Here you would typically send data to your API
    alert("Activité ajoutée avec succès (simulation)!")
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/activites">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ajouter une Nouvelle Activité</h1>
            <p className="text-gray-600 mt-1">Créer une nouvelle activité pour la Croix Rouge</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'Activité</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'Activité</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>
            <div>
              <Label htmlFor="dateDebut">Date de Début</Label>
              <DatePicker
                selected={formData.dateDebut}
                onSelect={(date) => handleDateChange("dateDebut", date)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateFin">Date de Fin</Label>
              <DatePicker selected={formData.dateFin} onSelect={(date) => handleDateChange("dateFin", date)} />
            </div>
            <div>
              <Label htmlFor="lieu">Lieu</Label>
              <Input id="lieu" value={formData.lieu} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="organisateur">Organisateur</Label>
              <Input id="organisateur" value={formData.organisateur} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="budget">Budget Estimé</Label>
              <Input id="budget" type="number" value={formData.budget} onChange={handleChange} />
            </div>
            {/* Statut can be managed internally or via a select if needed */}
            {/* <div>
              <Label htmlFor="statut">Statut</Label>
              <Input id="statut" value={formData.statut} onChange={handleChange} disabled />
            </div> */}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Ajouter Activité
        </Button>
      </form>
    </div>
  )
}
