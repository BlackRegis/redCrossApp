"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NouvelleActivitePage() {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    type: "",
    dateDebut: "",
    heureDebut: "",
    dateFin: "",
    heureFin: "",
    lieu: "",
    departement: "",
    arrondissement: "",
    responsable: "",
    participantsMax: "",
    budget: "",
    materielNecessaire: "",
    objectifs: "",
  })

  const typesActivite = [
    { value: "formation", label: "Formation" },
    { value: "don-sang", label: "Don de sang" },
    { value: "secours", label: "Secours" },
    { value: "sensibilisation", label: "Sensibilisation" },
    { value: "collecte", label: "Collecte" },
  ]

  const departements = [
    { value: "brazzaville", label: "Brazzaville" },
    { value: "kouilou", label: "Kouilou" },
    { value: "niari", label: "Niari" },
    { value: "bouenza", label: "Bouenza" },
    { value: "pool", label: "Pool" },
    { value: "plateaux", label: "Plateaux" },
  ]

  const arrondissements = {
    brazzaville: ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï"],
    kouilou: ["Pointe-Noire"],
    niari: ["Dolisie"],
    bouenza: ["Nkayi"],
    pool: ["Kinkala"],
    plateaux: ["Djambala"],
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nouvelle activité:", formData)
    alert("Activité créée avec succès!")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Informations Générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations Générales
                </CardTitle>
                <CardDescription>Détails de base de l'activité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre de l'activité *</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    placeholder="Ex: Formation Premiers Secours"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Décrivez l'activité en détail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'activité *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        {typesActivite.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participantsMax">Nombre max de participants</Label>
                    <Input
                      id="participantsMax"
                      type="number"
                      value={formData.participantsMax}
                      onChange={(e) => setFormData({ ...formData, participantsMax: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectifs">Objectifs</Label>
                  <Textarea
                    id="objectifs"
                    value={formData.objectifs}
                    onChange={(e) => setFormData({ ...formData, objectifs: e.target.value })}
                    rows={2}
                    placeholder="Quels sont les objectifs de cette activité ?"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date et Lieu */}
            <Card>
              <CardHeader>
                <CardTitle>Date et Lieu</CardTitle>
                <CardDescription>Planification temporelle et géographique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début *</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={formData.dateDebut}
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureDebut">Heure de début</Label>
                    <Input
                      id="heureDebut"
                      type="time"
                      value={formData.heureDebut}
                      onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Date de fin</Label>
                    <Input
                      id="dateFin"
                      type="date"
                      value={formData.dateFin}
                      onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureFin">Heure de fin</Label>
                    <Input
                      id="heureFin"
                      type="time"
                      value={formData.heureFin}
                      onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lieu">Lieu *</Label>
                  <Input
                    id="lieu"
                    value={formData.lieu}
                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                    placeholder="Ex: Centre Communautaire Bacongo"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departement">Département *</Label>
                    <Select
                      value={formData.departement}
                      onValueChange={(value) => setFormData({ ...formData, departement: value, arrondissement: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                      <SelectContent>
                        {departements.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrondissement">Arrondissement *</Label>
                    <Select
                      value={formData.arrondissement}
                      onValueChange={(value) => setFormData({ ...formData, arrondissement: value })}
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
                </div>
              </CardContent>
            </Card>

            {/* Organisation */}
            <Card>
              <CardHeader>
                <CardTitle>Organisation</CardTitle>
                <CardDescription>Responsabilités et ressources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable *</Label>
                  <Input
                    id="responsable"
                    value={formData.responsable}
                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                    placeholder="Nom du responsable de l'activité"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget estimé (FCFA)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="100000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materielNecessaire">Matériel nécessaire</Label>
                  <Textarea
                    id="materielNecessaire"
                    value={formData.materielNecessaire}
                    onChange={(e) => setFormData({ ...formData, materielNecessaire: e.target.value })}
                    rows={3}
                    placeholder="Liste du matériel et des ressources nécessaires..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  <Save className="h-4 w-4 mr-2" />
                  Créer l'Activité
                </Button>
                <Link href="/activites">
                  <Button variant="outline" className="w-full bg-transparent">
                    Annuler
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conseils</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Planifiez votre activité au moins 2 semaines à l'avance</p>
                <p>• Assurez-vous d'avoir les autorisations nécessaires</p>
                <p>• Préparez une liste de matériel détaillée</p>
                <p>• Communiquez clairement les objectifs aux participants</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
