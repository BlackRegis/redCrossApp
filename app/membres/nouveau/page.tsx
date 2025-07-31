"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, User } from "lucide-react"
import Link from "next/link"

export default function NouveauMembrePage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    dateNaissance: "",
    lieuNaissance: "",
    profession: "",
    departement: "",
    arrondissement: "",
    typeAdhesion: "",
    notes: "",
  })

  const departements = [
    { value: "kinshasa", label: "Kinshasa" },
    { value: "kasai", label: "Kasaï" },
    { value: "katanga", label: "Katanga" },
    { value: "equateur", label: "Équateur" },
    { value: "orientale", label: "Province Orientale" },
  ]

  const arrondissements = {
    kinshasa: ["Gombe", "Kalamu", "Lingwala", "Kasa-Vubu", "Barumbu"],
    kasai: ["Kananga", "Mbuji-Mayi", "Tshikapa", "Luebo"],
    katanga: ["Lubumbashi", "Kolwezi", "Likasi", "Kamina"],
    equateur: ["Mbandaka", "Gemena", "Lisala", "Boende"],
    orientale: ["Kisangani", "Bunia", "Beni", "Goma"],
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique de sauvegarde
    console.log("Nouveau membre:", formData)
    alert("Membre ajouté avec succès!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/membres">
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nouveau Membre</h1>
            <p className="text-red-100 mt-2">Ajouter un nouveau membre à la Croix Rouge</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations Personnelles
                  </CardTitle>
                  <CardDescription>Renseignez les informations de base du membre</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        placeholder="+243 123 456 789"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Textarea
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateNaissance">Date de Naissance</Label>
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lieuNaissance">Lieu de Naissance</Label>
                      <Input
                        id="lieuNaissance"
                        value={formData.lieuNaissance}
                        onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Localisation et Adhésion</CardTitle>
                  <CardDescription>Informations sur la localisation et le type d'adhésion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="typeAdhesion">Type d'Adhésion *</Label>
                    <Select
                      value={formData.typeAdhesion}
                      onValueChange={(value) => setFormData({ ...formData, typeAdhesion: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type d'adhésion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volontaire">Volontaire</SelectItem>
                        <SelectItem value="membre-actif">Membre Actif</SelectItem>
                        <SelectItem value="membre-bienfaiteur">Membre Bienfaiteur</SelectItem>
                        <SelectItem value="membre-honneur">Membre d'Honneur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      placeholder="Informations complémentaires..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer le Membre
                  </Button>
                  <Link href="/membres">
                    <Button variant="outline" className="w-full bg-transparent">
                      Annuler
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Les champs marqués d'un * sont obligatoires</p>
                  <p>• Un numéro de carte sera automatiquement généré</p>
                  <p>• Le membre recevra un email de confirmation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
