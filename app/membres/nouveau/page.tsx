"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"

export default function NouveauMembrePage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: null,
    lieuNaissance: "",
    nationalite: "",
    adresse: "",
    telephone: "",
    email: "",
    profession: "",
    groupeSanguin: "",
    allergies: "",
    antecedentsMedicaux: "",
    personneContactUrgenceNom: "",
    personneContactUrgenceTelephone: "",
    dateAdhesion: null,
    typeMembre: "",
    departement: "",
    arrondissement: "",
    statut: "",
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
    // Here you would typically send data to your API
    alert("Membre ajouté avec succès (simulation)!")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ajouter un Nouveau Membre</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom(s)</Label>
              <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dateNaissance">Date de Naissance</Label>
              <DatePicker
                selected={formData.dateNaissance}
                onSelect={(date) => handleDateChange("dateNaissance", date)}
              />
            </div>
            <div>
              <Label htmlFor="lieuNaissance">Lieu de Naissance</Label>
              <Input id="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="nationalite">Nationalité</Label>
              <Input id="nationalite" value={formData.nationalite} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" value={formData.adresse} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" type="tel" value={formData.telephone} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" value={formData.profession} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations Médicales (Optionnel)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groupeSanguin">Groupe Sanguin</Label>
              <Select onValueChange={(value) => handleSelectChange("groupeSanguin", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea id="allergies" value={formData.allergies} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="antecedentsMedicaux">Antécédents Médicaux</Label>
              <Textarea id="antecedentsMedicaux" value={formData.antecedentsMedicaux} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="personneContactUrgenceNom">Nom Personne Contact Urgence</Label>
              <Input
                id="personneContactUrgenceNom"
                value={formData.personneContactUrgenceNom}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="personneContactUrgenceTelephone">Téléphone Personne Contact Urgence</Label>
              <Input
                id="personneContactUrgenceTelephone"
                type="tel"
                value={formData.personneContactUrgenceTelephone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations d'Adhésion</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateAdhesion">Date d'Adhésion</Label>
              <DatePicker
                selected={formData.dateAdhesion}
                onSelect={(date) => handleDateChange("dateAdhesion", date)}
              />
            </div>
            <div>
              <Label htmlFor="typeMembre">Type de Membre</Label>
              <Select onValueChange={(value) => handleSelectChange("typeMembre", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="benevole">Bénévole</SelectItem>
                  <SelectItem value="donateur">Donateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="departement">Département</Label>
              <Select onValueChange={(value) => handleSelectChange("departement", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brazzaville">Brazzaville</SelectItem>
                  <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="arrondissement">Arrondissement</Label>
              <Select onValueChange={(value) => handleSelectChange("arrondissement", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moungali">Moungali</SelectItem>
                  <SelectItem value="makalele">Makélékélé</SelectItem>
                  <SelectItem value="otala">Otalá</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select onValueChange={(value) => handleSelectChange("statut", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Ajouter Membre
        </Button>
      </form>
    </div>
  )
}
