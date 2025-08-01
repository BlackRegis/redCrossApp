"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, User, Crown } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BureauExecutif {
  id: number
  nom_bureau: string
  date_creation: string
  date_fin_mandat: string
  statut: string
  membres?: BureauMembre[]
}

interface BureauMembre {
  id: number
  bureau_executif_id: number
  membre_id: number
  role: string
  date_debut_role: string
  date_fin_role: string
  nom_membre: string // Added for display purposes
  prenom_membre: string // Added for display purposes
}

interface Membre {
  id: number
  nom: string
  prenom: string
}

export default function BureauExecutifPage() {
  const [bureaux, setBureaux] = useState<BureauExecutif[]>([])
  const [membres, setMembres] = useState<Membre[]>([])
  const [newBureau, setNewBureau] = useState({
    nom_bureau: "",
    date_creation: "",
    date_fin_mandat: "",
    statut: "Actif",
  })
  const [newBureauMembre, setNewBureauMembre] = useState({
    bureau_executif_id: "",
    membre_id: "",
    role: "",
    date_debut_role: "",
    date_fin_role: "",
  })

  useEffect(() => {
    fetchBureaux()
    fetchMembres()
  }, [])

  const fetchBureaux = async () => {
    try {
      const bureauxRes = await fetch("/api/bureaux-executifs")
      const bureauxData: BureauExecutif[] = await bureauxRes.json()

      const membresBureauRes = await fetch("/api/bureau-membres")
      const membresBureauData: BureauMembre[] = await membresBureauRes.json()

      const membresRes = await fetch("/api/membres")
      const membresList: Membre[] = await membresRes.json()

      const mergedBureaux = bureauxData.map((bureau) => ({
        ...bureau,
        membres: membresBureauData
          .filter((bm) => bm.bureau_executif_id === bureau.id)
          .map((bm) => {
            const membre = membresList.find((m) => m.id === bm.membre_id)
            return {
              ...bm,
              nom_membre: membre ? membre.nom : "Inconnu",
              prenom_membre: membre ? membre.prenom : "Inconnu",
            }
          }),
      }))
      setBureaux(mergedBureaux)
    } catch (error) {
      toast.error("Erreur lors du chargement des bureaux exécutifs.")
      console.error("Error fetching bureaux:", error)
    }
  }

  const fetchMembres = async () => {
    try {
      const response = await fetch("/api/membres")
      if (!response.ok) throw new Error("Failed to fetch members")
      const data = await response.json()
      setMembres(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des membres.")
      console.error("Error fetching members:", error)
    }
  }

  const handleNewBureauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewBureau((prev) => ({ ...prev, [id]: value }))
  }

  const handleNewBureauSelectChange = (id: string, value: string) => {
    setNewBureau((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddBureau = async () => {
    if (!newBureau.nom_bureau || !newBureau.date_creation || !newBureau.date_fin_mandat) {
      toast.error("Veuillez remplir tous les champs du bureau.")
      return
    }
    try {
      const response = await fetch("/api/bureaux-executifs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBureau),
      })
      if (!response.ok) throw new Error("Failed to add bureau")
      toast.success("Bureau exécutif ajouté avec succès.")
      setNewBureau({ nom_bureau: "", date_creation: "", date_fin_mandat: "", statut: "Actif" })
      fetchBureaux()
    } catch (error) {
      toast.error("Erreur lors de l'ajout du bureau exécutif.")
      console.error("Error adding bureau:", error)
    }
  }

  const handleDeleteBureau = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bureau exécutif et ses membres ?")) return
    try {
      const response = await fetch(`/api/bureaux-executifs/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete bureau")
      toast.success("Bureau exécutif supprimé avec succès.")
      fetchBureaux()
    } catch (error) {
      toast.error("Erreur lors de la suppression du bureau exécutif.")
      console.error("Error deleting bureau:", error)
    }
  }

  const handleNewBureauMembreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewBureauMembre((prev) => ({ ...prev, [id]: value }))
  }

  const handleNewBureauMembreSelectChange = (id: string, value: string) => {
    setNewBureauMembre((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddBureauMembre = async () => {
    if (
      !newBureauMembre.bureau_executif_id ||
      !newBureauMembre.membre_id ||
      !newBureauMembre.role ||
      !newBureauMembre.date_debut_role
    ) {
      toast.error("Veuillez remplir tous les champs du membre du bureau.")
      return
    }
    try {
      const response = await fetch("/api/bureau-membres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBureauMembre),
      })
      if (!response.ok) throw new Error("Failed to add bureau member")
      toast.success("Membre du bureau ajouté avec succès.")
      setNewBureauMembre({
        bureau_executif_id: "",
        membre_id: "",
        role: "",
        date_debut_role: "",
        date_fin_role: "",
      })
      fetchBureaux()
    } catch (error) {
      toast.error("Erreur lors de l'ajout du membre du bureau.")
      console.error("Error adding bureau member:", error)
    }
  }

  const handleDeleteBureauMembre = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre du bureau ?")) return
    try {
      const response = await fetch(`/api/bureau-membres/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete bureau member")
      toast.success("Membre du bureau supprimé avec succès.")
      fetchBureaux()
    } catch (error) {
      toast.error("Erreur lors de la suppression du membre du bureau.")
      console.error("Error deleting bureau member:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion du Bureau Exécutif</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un Nouveau Bureau Exécutif</CardTitle>
            <CardDescription>Créez un nouveau mandat pour le bureau exécutif.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom_bureau">Nom du Bureau</Label>
              <Input id="nom_bureau" value={newBureau.nom_bureau} onChange={handleNewBureauChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_creation">Date de Création</Label>
              <Input id="date_creation" type="date" value={newBureau.date_creation} onChange={handleNewBureauChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_fin_mandat">Date de Fin de Mandat</Label>
              <Input
                id="date_fin_mandat"
                type="date"
                value={newBureau.date_fin_mandat}
                onChange={handleNewBureauChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select onValueChange={(value) => handleNewBureauSelectChange("statut", value)} value={newBureau.statut}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-full flex justify-end">
              <Button onClick={handleAddBureau}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter Bureau
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter un Membre au Bureau</CardTitle>
            <CardDescription>Assignez un membre à un bureau exécutif existant.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bureau_executif_id">Bureau Exécutif</Label>
              <Select
                onValueChange={(value) => handleNewBureauMembreSelectChange("bureau_executif_id", value)}
                value={newBureauMembre.bureau_executif_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bureau" />
                </SelectTrigger>
                <SelectContent>
                  {bureaux.map((bureau) => (
                    <SelectItem key={bureau.id} value={String(bureau.id)}>
                      {bureau.nom_bureau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="membre_id">Membre</Label>
              <Select
                onValueChange={(value) => handleNewBureauMembreSelectChange("membre_id", value)}
                value={newBureauMembre.membre_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {membres.map((membre) => (
                    <SelectItem key={membre.id} value={String(membre.id)}>
                      {membre.nom} {membre.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" value={newBureauMembre.role} onChange={handleNewBureauMembreChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_debut_role">Date Début Rôle</Label>
              <Input
                id="date_debut_role"
                type="date"
                value={newBureauMembre.date_debut_role}
                onChange={handleNewBureauMembreChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_fin_role">Date Fin Rôle (Optionnel)</Label>
              <Input
                id="date_fin_role"
                type="date"
                value={newBureauMembre.date_fin_role}
                onChange={handleNewBureauMembreChange}
              />
            </div>
            <div className="col-span-full flex justify-end">
              <Button onClick={handleAddBureauMembre}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter Membre au Bureau
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bureaux Exécutifs Actuels</CardTitle>
          <CardDescription>Liste des bureaux exécutifs et de leurs membres.</CardDescription>
        </CardHeader>
        <CardContent>
          {bureaux.length === 0 ? (
            <p className="text-center text-muted-foreground">Aucun bureau exécutif trouvé.</p>
          ) : (
            <div className="space-y-6">
              {bureaux.map((bureau) => (
                <Card key={bureau.id} className="border-l-4 border-red-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Crown className="h-5 w-5 text-red-500" />
                      {bureau.nom_bureau}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier Bureau</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteBureau(bureau.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer Bureau</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Créé le: {new Date(bureau.date_creation).toLocaleDateString()} | Fin de mandat:{" "}
                      {new Date(bureau.date_fin_mandat).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium mt-1">Statut: {bureau.statut}</p>

                    <h3 className="text-md font-semibold mt-4 mb-2">Membres du Bureau:</h3>
                    {bureau.membres && bureau.membres.length > 0 ? (
                      <ul className="space-y-2">
                        {bureau.membres.map((membre) => (
                          <li key={membre.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {membre.nom_membre} {membre.prenom_membre} - {membre.role}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-transparent">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier Membre</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleDeleteBureauMembre(membre.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Supprimer Membre</span>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun membre assigné à ce bureau.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
