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

export default function NouveauMembrePage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    lieu_naissance: "",
    sexe: "",
    nationalite: "",
    adresse: "",
    telephone: "",
    email: "",
    profession: "",
    date_adhesion: "",
    type_membre: "",
    statut: "",
    notes: "",
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
      const response = await fetch("/api/membres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create member")
      }

      const result = await response.json()
      toast.success("Membre créé avec succès!")
      console.log("Membre créé:", result)
      // Optionally reset form
      setFormData({
        nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        sexe: "",
        nationalite: "",
        adresse: "",
        telephone: "",
        email: "",
        profession: "",
        date_adhesion: "",
        type_membre: "",
        statut: "",
        notes: "",
      })
    } catch (error) {
      toast.error("Erreur lors de la création du membre.")
      console.error("Error creating member:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Nouveau Membre</CardTitle>
          <CardDescription>Remplissez les informations pour ajouter un nouveau membre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de Naissance</Label>
              <Input id="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de Naissance</Label>
              <Input id="lieu_naissance" value={formData.lieu_naissance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexe">Sexe</Label>
              <Select onValueChange={(value) => handleSelectChange("sexe", value)} value={formData.sexe}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalite">Nationalité</Label>
              <Input id="nationalite" value={formData.nationalite} onChange={handleChange} />
            </div>
            <div className="space-y-2">
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
              <Label htmlFor="date_adhesion">Date d'Adhésion</Label>
              <Input id="date_adhesion" type="date" value={formData.date_adhesion} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type_membre">Type de Membre</Label>
              <Select onValueChange={(value) => handleSelectChange("type_membre", value)} value={formData.type_membre}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Passif">Passif</SelectItem>
                  <SelectItem value="Honneur">Honneur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select onValueChange={(value) => handleSelectChange("statut", value)} value={formData.statut}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
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
