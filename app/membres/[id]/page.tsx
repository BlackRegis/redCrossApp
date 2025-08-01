"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

interface Membre {
  id: number
  nom: string
  prenom: string
  date_naissance: string | null
  lieu_naissance: string | null
  sexe: string | null
  nationalite: string | null
  adresse: string | null
  telephone: string | null
  email: string | null
  profession: string | null
  date_adhesion: string
  statut: string
  departement_id: number | null
  arrondissement_id: number | null
  photo_url: string | null
  numero_carte: string | null
  date_delivrance_carte: string | null
  date_expiration_carte: string | null
}

interface Departement {
  id: number
  nom: string
}

interface Arrondissement {
  id: number
  nom: string
  departement_id: number
}

export default function MembreDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const membreId = Number.parseInt(params.id)

  const {
    data: membre,
    isLoading,
    error,
  } = useQuery<Membre>({
    queryKey: ["membre", membreId],
    queryFn: async () => {
      const res = await fetch(`/api/membres/${membreId}`)
      if (!res.ok) {
        throw new Error("Failed to fetch membre")
      }
      return res.json()
    },
    enabled: !!membreId,
  })

  const [formData, setFormData] = useState<Omit<Membre, "id" | "departement_nom" | "arrondissement_nom">>({
    nom: "",
    prenom: "",
    date_naissance: null,
    lieu_naissance: "",
    sexe: "",
    nationalite: "",
    adresse: "",
    telephone: "",
    email: "",
    profession: "",
    date_adhesion: "",
    statut: "",
    departement_id: null,
    arrondissement_id: null,
    photo_url: "",
    numero_carte: "",
    date_delivrance_carte: null,
    date_expiration_carte: null,
  })

  useEffect(() => {
    if (membre) {
      setFormData({
        nom: membre.nom,
        prenom: membre.prenom,
        date_naissance: membre.date_naissance,
        lieu_naissance: membre.lieu_naissance,
        sexe: membre.sexe,
        nationalite: membre.nationalite,
        adresse: membre.adresse,
        telephone: membre.telephone,
        email: membre.email,
        profession: membre.profession,
        date_adhesion: membre.date_adhesion,
        statut: membre.statut,
        departement_id: membre.departement_id,
        arrondissement_id: membre.arrondissement_id,
        photo_url: membre.photo_url,
        numero_carte: membre.numero_carte,
        date_delivrance_carte: membre.date_delivrance_carte,
        date_expiration_carte: membre.date_expiration_carte,
      })
    }
  }, [membre])

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

  const updateMembreMutation = useMutation({
    mutationFn: async (updatedMembreData: any) => {
      const res = await fetch(`/api/membres/${membreId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMembreData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update membre")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membre", membreId] })
      queryClient.invalidateQueries({ queryKey: ["membres"] }) // Invalidate list as well
      toast.success("Membre mis à jour avec succès!")
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour du membre: ${error.message}`)
    },
  })

  const deleteMembreMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/membres/${membreId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete membre")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membres"] })
      toast.success("Membre supprimé avec succès!")
      router.push("/membres") // Redirect to members list
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression du membre: ${error.message}`)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "departement_id") {
      setFormData((prev) => ({ ...prev, arrondissement_id: null })) // Reset arrondissement when departement changes
    }
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [id]: date ? format(date, "yyyy-MM-dd") : null }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMembreMutation.mutate({
      ...formData,
      departement_id: formData.departement_id ? Number.parseInt(String(formData.departement_id)) : null,
      arrondissement_id: formData.arrondissement_id ? Number.parseInt(String(formData.arrondissement_id)) : null,
    })
  }

  if (isLoading) return <p className="p-4 md:p-6">Chargement du membre...</p>
  if (error) return <p className="p-4 md:p-6">Erreur: {error.message}</p>
  if (!membre) return <p className="p-4 md:p-6">Membre non trouvé.</p>

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Détails du Membre: {membre.prenom} {membre.nom}
          </CardTitle>
          <CardDescription>Mettez à jour les informations de ce membre.</CardDescription>
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
                    {formData.date_naissance ? (
                      format(new Date(formData.date_naissance), "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_naissance ? new Date(formData.date_naissance) : undefined}
                    onSelect={(date) => handleDateChange("date_naissance", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de Naissance</Label>
              <Input id="lieu_naissance" value={formData.lieu_naissance || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexe">Sexe</Label>
              <Select value={formData.sexe || ""} onValueChange={(value) => handleSelectChange("sexe", value)}>
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
              <Input id="nationalite" value={formData.nationalite || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" value={formData.adresse || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" value={formData.telephone || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" value={formData.profession || ""} onChange={handleChange} />
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
                    {formData.date_adhesion ? (
                      format(new Date(formData.date_adhesion), "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.date_adhesion)}
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
                value={String(formData.departement_id || "")}
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
                value={String(formData.arrondissement_id || "")}
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
              <Input id="photo_url" value={formData.photo_url || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_carte">Numéro de Carte</Label>
              <Input id="numero_carte" value={formData.numero_carte || ""} onChange={handleChange} />
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
                      format(new Date(formData.date_delivrance_carte), "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_delivrance_carte ? new Date(formData.date_delivrance_carte) : undefined}
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
                      format(new Date(formData.date_expiration_carte), "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_expiration_carte ? new Date(formData.date_expiration_carte) : undefined}
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
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteMembreMutation.mutate()}
                disabled={deleteMembreMutation.isPending}
              >
                {deleteMembreMutation.isPending ? "Suppression..." : "Supprimer Membre"}
              </Button>
              <Button type="submit" disabled={updateMembreMutation.isPending}>
                {updateMembreMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
