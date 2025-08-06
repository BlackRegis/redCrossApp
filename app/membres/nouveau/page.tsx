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

export default function NouveauMembrePage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: undefined as Date | undefined,
    sexe: "",
    profession: "",
    adresse: "",
    departement: "",
    arrondissement: "",
    typeAdhesion: "",
    dateAdhesion: undefined as Date | undefined,
    numeroCarte: "",
  })

  const departements = ["Brazzaville", "Kouilou", "Niari", "Bouenza", "Pool", "Plateaux"]
  const arrondissements = {
    Brazzaville: ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï"],
    Kouilou: ["Pointe-Noire"],
    Niari: ["Dolisie"],
    Bouenza: ["Nkayi"],
    Pool: ["Kinkala"],
    Plateaux: ["Djambala"],
  }

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
    console.log("Nouveau membre soumis:", formData)
    // Here you would typically send data to an API
    alert("Nouveau membre ajouté (simulation)!")
    // Reset form or redirect
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter un Nouveau Membre</h1>
          <p className="text-gray-600 mt-1">Remplissez les informations pour enregistrer un nouveau membre.</p>
        </div>
        <Link href="/membres">
          <Button variant="outline">Retour à la liste des membres</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Détails de base sur le membre.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium">
                Nom
              </label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="prenom" className="text-sm font-medium">
                Prénom
              </label>
              <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="telephone" className="text-sm font-medium">
                Téléphone
              </label>
              <Input id="telephone" value={formData.telephone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="dateNaissance" className="text-sm font-medium">
                Date de Naissance
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateNaissance && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateNaissance ? (
                      format(formData.dateNaissance, "PPP")
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateNaissance}
                    onSelect={(date) => handleDateChange("dateNaissance", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="sexe" className="text-sm font-medium">
                Sexe
              </label>
              <Select value={formData.sexe} onValueChange={(value) => handleSelectChange("sexe", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="profession" className="text-sm font-medium">
                Profession
              </label>
              <Input id="profession" value={formData.profession} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="adresse" className="text-sm font-medium">
                Adresse
              </label>
              <Textarea id="adresse" value={formData.adresse} onChange={handleChange} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations d'Adhésion</CardTitle>
            <CardDescription>Détails relatifs à l'adhésion du membre à la Croix Rouge.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label htmlFor="arrondissement" className="text-sm font-medium">
                Arrondissement
              </label>
              <Select
                value={formData.arrondissement}
                onValueChange={(value) => handleSelectChange("arrondissement", value)}
                disabled={!formData.departement}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un arrondissement" />
                </SelectTrigger>
                <SelectContent>
                  {formData.departement &&
                    arrondissements[formData.departement as keyof typeof arrondissements]?.map((arr) => (
                      <SelectItem key={arr} value={arr}>
                        {arr}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="typeAdhesion" className="text-sm font-medium">
                Type d'Adhésion
              </label>
              <Select value={formData.typeAdhesion} onValueChange={(value) => handleSelectChange("typeAdhesion", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type d'adhésion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Membre Actif">Membre Actif</SelectItem>
                  <SelectItem value="Volontaire">Volontaire</SelectItem>
                  <SelectItem value="Membre Bienfaiteur">Membre Bienfaiteur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="dateAdhesion" className="text-sm font-medium">
                Date d'Adhésion
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateAdhesion && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateAdhesion ? (
                      format(formData.dateAdhesion, "PPP")
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateAdhesion}
                    onSelect={(date) => handleDateChange("dateAdhesion", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="numeroCarte" className="text-sm font-medium">
                Numéro de Carte (si applicable)
              </label>
              <Input id="numeroCarte" value={formData.numeroCarte} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter Membre
          </Button>
        </div>
      </form>
    </div>
  )
}
