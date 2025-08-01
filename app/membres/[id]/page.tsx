"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Membre {
  id: number
  nom: string
  prenom: string
  date_naissance: string
  lieu_naissance: string
  sexe: string
  nationalite: string
  adresse: string
  telephone: string
  email: string
  profession: string
  date_adhesion: string
  type_membre: string
  statut: string
  notes: string
}

export default function MembreDetailPage() {
  const params = useParams()
  const memberId = params.id as string
  const [membre, setMembre] = useState<Membre | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (memberId) {
      fetchMembre()
    }
  }, [memberId])

  const fetchMembre = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/membres/${memberId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch member")
      }
      const data = await response.json()
      setMembre(data)
    } catch (err: any) {
      setError(err.message)
      toast.error("Erreur lors du chargement du membre.")
      console.error("Error fetching member:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setMembre((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSelectChange = (id: string, value: string) => {
    setMembre((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!membre) return

    try {
      const response = await fetch(`/api/membres/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membre),
      })

      if (!response.ok) {
        throw new Error("Failed to update member")
      }

      const result = await response.json()
      toast.success("Membre mis à jour avec succès!")
      console.log("Membre mis à jour:", result)
    } catch (err: any) {
      toast.error("Erreur lors de la mise à jour du membre.")
      console.error("Error updating member:", err)
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Chargement du membre...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Erreur: {error}</div>
  }

  if (!membre) {
    return <div className="container mx-auto p-4 text-center">Membre non trouvé.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            Détails du Membre: {membre.nom} {membre.prenom}
          </CardTitle>
          <CardDescription>Visualisez et modifiez les informations du membre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={membre.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={membre.prenom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de Naissance</Label>
              <Input id="date_naissance" type="date" value={membre.date_naissance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de Naissance</Label>
              <Input id="lieu_naissance" value={membre.lieu_naissance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexe">Sexe</Label>
              <Select onValueChange={(value) => handleSelectChange("sexe", value)} value={membre.sexe}>
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
              <Input id="nationalite" value={membre.nationalite} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" value={membre.adresse} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" type="tel" value={membre.telephone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={membre.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" value={membre.profession} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_adhesion">Date d'Adhésion</Label>
              <Input id="date_adhesion" type="date" value={membre.date_adhesion} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type_membre">Type de Membre</Label>
              <Select onValueChange={(value) => handleSelectChange("type_membre", value)} value={membre.type_membre}>
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
              <Select onValueChange={(value) => handleSelectChange("statut", value)} value={membre.statut}>
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
              <Textarea id="notes" value={membre.notes} onChange={handleChange} rows={4} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Mettre à jour le Membre</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
