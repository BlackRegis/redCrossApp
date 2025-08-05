"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NouveauMembrePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    sexe: "",
    nationalite: "",
    adresse: "",
    telephone: "",
    email: "",
    profession: "",
    typeAdhesion: "",
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
    // Ici, vous pouvez envoyer les données à votre API
    console.log("Form Data:", formData)
    toast.success("Membre ajouté avec succès!")
    router.push("/membres") // Rediriger vers la liste des membres
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un Nouveau Membre</CardTitle>
          <CardDescription>Remplissez le formulaire ci-dessous pour ajouter un nouveau membre.</CardDescription>
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
              <Label htmlFor="dateNaissance">Date de Naissance</Label>
              <Input id="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieuNaissance">Lieu de Naissance</Label>
              <Input id="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} />
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
              <Label htmlFor="typeAdhesion">Type d'Adhésion</Label>
              <Select
                onValueChange={(value) => handleSelectChange("typeAdhesion", value)}
                value={formData.typeAdhesion}
              >
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
              <Button type="submit">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter le Membre
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
