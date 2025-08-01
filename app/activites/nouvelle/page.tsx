"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function NouvelleActivitePage() {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    date_debut: "",
    date_fin: "",
    lieu: "",
    statut: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/activites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create activity")
      }

      const result = await response.json()
      toast.success("Activité créée avec succès!")
      console.log("Activité créée:", result)
      // Optionally reset form
      setFormData({
        nom: "",
        description: "",
        date_debut: "",
        date_fin: "",
        lieu: "",
        statut: "",
      })
    } catch (error) {
      toast.error("Erreur lors de la création de l'activité.")
      console.error("Error creating activity:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nouvelle Activité</CardTitle>
          <CardDescription>Remplissez les informations pour planifier une nouvelle activité.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'activité</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_debut">Date de Début</Label>
                <Input id="date_debut" type="date" value={formData.date_debut} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_fin">Date de Fin</Label>
                <Input id="date_fin" type="date" value={formData.date_fin} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input id="lieu" value={formData.lieu} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select onValueChange={(value) => handleSelectChange("statut", value)} value={formData.statut}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminée">Terminée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Créer Activité</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
