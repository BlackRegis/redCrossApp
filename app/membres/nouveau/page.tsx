"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"

export default function NouveauMembrePage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: null,
    sexe: "",
    adresse: "",
    telephone: "",
    email: "",
    profession: "",
    departement: "",
    arrondissement: "",
    dateAdhesion: null,
    notes: "",
  })

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
    console.log("Form Data Submitted:", formData)
    // Here you would typically send the data to your API
    alert("Nouveau membre ajouté (simulé)!")
    // Reset form or navigate
  }

  // Dummy data for selects
  const departements = ["Brazzaville", "Pointe-Noire", "Niari", "Pool"]
  const arrondissements = ["Makélékélé", "Bacongo", "Poto-Poto", "Moungali"] // This would typically depend on the selected department

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un Nouveau Membre</CardTitle>
          <CardDescription>Remplissez les informations ci-dessous pour enregistrer un nouveau membre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom(s)</Label>
              <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateNaissance">Date de Naissance</Label>
              <DatePicker date={formData.dateNaissance} setDate={(date) => handleDateChange("dateNaissance", date)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexe">Sexe</Label>
              <Select value={formData.sexe} onValueChange={(value) => handleSelectChange("sexe", value)}>
                <SelectTrigger id="sexe">
                  <SelectValue placeholder="Sélectionner le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homme">Homme</SelectItem>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" value={formData.adresse} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" type="tel" value={formData.telephone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" value={formData.profession} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Select value={formData.departement} onValueChange={(value) => handleSelectChange("departement", value)}>
                <SelectTrigger id="departement">
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
              <Label htmlFor="arrondissement">Arrondissement</Label>
              <Select
                value={formData.arrondissement}
                onValueChange={(value) => handleSelectChange("arrondissement", value)}
              >
                <SelectTrigger id="arrondissement">
                  <SelectValue placeholder="Sélectionner un arrondissement" />
                </SelectTrigger>
                <SelectContent>
                  {arrondissements.map((arr) => (
                    <SelectItem key={arr} value={arr}>
                      {arr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateAdhesion">Date d'Adhésion</Label>
              <DatePicker date={formData.dateAdhesion} setDate={(date) => handleDateChange("dateAdhesion", date)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes} onChange={handleChange} rows={4} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Ajouter Membre</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
