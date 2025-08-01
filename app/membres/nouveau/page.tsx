"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

interface Departement {
  id: number
  nom: string
}

interface Arrondissement {
  id: number
  nom: string
  departement_id: number
}

export default function NouveauMembrePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    date_naissance: null as Date | null,
    lieu_naissance: "",
    sexe: "",
    nationalite: "",
    adresse: "",
    telephone: "",
    email: "",
    profession: "",
    date_adhesion: new Date(),
    statut: "Actif",
    departement_id: "",
    arrondissement_id: "",
    photo_url: "",
    numero_carte: "",
    date_delivrance_carte: null as Date | null,
    date_expiration_carte: null as Date | null,
  })

  const { data: departements, isLoading: isLoadingDepartements } = useQuery<Departement[]>({
    queryKey: ["departements"],
    queryFn: async () => {
      const res = await fetch("/api/departements")
      if (!res.ok) {
        throw new Error("Failed to fetch departements")
      }
      return res.json()
    },
  })

  const { data: arrondissements, isLoading: isLoadingArrondissements } = useQuery<Arrondissement[]>({
    queryKey: ["arrondissements", formData.departement_id],
    queryFn: async () => {
      if (!formData.departement_id) return []
      const res = await fetch(`/api/arrondissements/${formData.departement_id}`)
      if (!res.ok) {
        throw new Error("Failed to fetch arrondissements")
      }
      return res.json()
    },
    enabled: !!formData.departement_id,
  })

  const createMembreMutation = useMutation({
    mutationFn: async (newMembreData: any) => {
      const res = await fetch("/api/membres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMembreData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create membre")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membres"] })
      toast.success("Membre créé avec succès!")
      router.push("/membres")
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création du membre: ${error.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "departement_id") {
      setFormData((prev) => ({ ...prev, arrondissement_id: "" })) // Reset arrondissement when departement changes
    }
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [id]: date || null }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMembreMutation.mutate({
      ...formData,
      date_naissance: formData.date_naissance ? format(formData.date_naissance, "yyyy-MM-dd") : null,
      date_adhesion: format(formData.date_adhesion, "yyyy-MM-dd"),
      date_delivrance_carte: formData.date_delivrance_carte
        ? format(formData.date_delivrance_carte, "yyyy-MM-dd")
        : null,
      date_expiration_carte: formData.date_expiration_carte
        ? format(formData.date_expiration_carte, "yyyy-MM-dd")
        : null,
      departement_id: formData.departement_id ? Number.parseInt(formData.departement_id) : null,
      arrondissement_id: formData.arrondissement_id ? Number.parseInt(formData.arrondissement_id) : null,
    })
  }

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau Membre</CardTitle>
          <CardDescription>Remplissez les informations pour ajouter un nouveau membre.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_naissance && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_naissance ? format(formData.date_naissance, "PPP") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_naissance || undefined}
                    onSelect={(date) => handleDateChange("date_naissance", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de Naissance</Label>
              <Input id="lieu_naissance" value={formData.lieu_naissance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexe">Sexe</Label>
              <Select value={formData.sexe} onValueChange={(value) => handleSelectChange("sexe", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
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
              <Input id="telephone" value={formData.telephone} onChange={handleChange} />
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_adhesion && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_adhesion ? format(formData.date_adhesion, "PPP") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_adhesion || undefined}
                    onSelect={(date) => handleDateChange("date_adhesion", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => handleSelectChange("statut", value)}>
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
            <div className="space-y-2">
              <Label htmlFor="departement_id">Département</Label>
              <Select
                value={formData.departement_id}
                onValueChange={(value) => handleSelectChange("departement_id", value)}
                disabled={isLoadingDepartements}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departements?.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrondissement_id">Arrondissement</Label>
              <Select
                value={formData.arrondissement_id}
                onValueChange={(value) => handleSelectChange("arrondissement_id", value)}
                disabled={!formData.departement_id || isLoadingArrondissements}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un arrondissement" />
                </SelectTrigger>
                <SelectContent>
                  {arrondissements?.map((arr) => (
                    <SelectItem key={arr.id} value={String(arr.id)}>
                      {arr.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo_url">URL Photo</Label>
              <Input id="photo_url" value={formData.photo_url} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_carte">Numéro de Carte</Label>
              <Input id="numero_carte" value={formData.numero_carte} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_delivrance_carte">Date de Délivrance Carte</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_delivrance_carte && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_delivrance_carte ? (
                      format(formData.date_delivrance_carte, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_delivrance_carte || undefined}
                    onSelect={(date) => handleDateChange("date_delivrance_carte", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_expiration_carte">Date d'Expiration Carte</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_expiration_carte && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_expiration_carte ? (
                      format(formData.date_expiration_carte, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_expiration_carte || undefined}
                    onSelect={(date) => handleDateChange("date_expiration_carte", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-full flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMembreMutation.isPending}>
                {createMembreMutation.isPending ? "Création..." : "Créer Membre"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
