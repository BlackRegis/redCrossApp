"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppSettings {
  app_name: string
  contact_email: string
  phone_number: string
  address: string
}

interface Department {
  id: number
  name: string
  head_name: string | null
  contact_email: string | null
  phone_number: string | null
}

interface Arrondissement {
  id: number
  department_id: number
  name: string
  population: number | null
}

export default function ParametresPage() {
  const { toast } = useToast()
  const [appSettings, setAppSettings] = useState<AppSettings>({
    app_name: "",
    contact_email: "",
    phone_number: "",
    address: "",
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [arrondissements, setArrondissements] = useState<Arrondissement[]>([])
  const [newDepartmentName, setNewDepartmentName] = useState("")
  const [newArrondissementName, setNewArrondissementName] = useState("")
  const [newArrondissementPopulation, setNewArrondissementPopulation] = useState<number | string>("")
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)

  useEffect(() => {
    fetchAppSettings()
    fetchDepartments()
    fetchArrondissements()
  }, [])

  const fetchAppSettings = async () => {
    try {
      const res = await fetch("/api/settings/app")
      if (!res.ok) throw new Error("Failed to fetch app settings")
      const data = await res.json()
      setAppSettings(data)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec du chargement des paramètres de l'application.",
        variant: "destructive",
      })
    }
  }

  const updateAppSetting = async (key: keyof AppSettings, value: string) => {
    try {
      const res = await fetch("/api/settings/app", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting_key: key, setting_value: value }),
      })
      if (!res.ok) throw new Error("Failed to update setting")
      toast({
        title: "Succès",
        description: "Paramètre mis à jour.",
      })
      fetchAppSettings() // Re-fetch to ensure consistency
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la mise à jour du paramètre.",
        variant: "destructive",
      })
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departements")
      if (!res.ok) throw new Error("Failed to fetch departments")
      const data = await res.json()
      setDepartments(data)
      if (data.length > 0 && selectedDepartmentId === null) {
        setSelectedDepartmentId(data[0].id)
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec du chargement des départements.",
        variant: "destructive",
      })
    }
  }

  const addDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du département ne peut pas être vide.",
        variant: "destructive",
      })
      return
    }
    try {
      const res = await fetch("/api/departements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDepartmentName }),
      })
      if (!res.ok) throw new Error("Failed to add department")
      toast({
        title: "Succès",
        description: "Département ajouté.",
      })
      setNewDepartmentName("")
      fetchDepartments()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'ajout du département.",
        variant: "destructive",
      })
    }
  }

  const deleteDepartment = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce département et tous ses arrondissements ?")) return
    try {
      const res = await fetch(`/api/departements/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete department")
      toast({
        title: "Succès",
        description: "Département supprimé.",
      })
      fetchDepartments()
      fetchArrondissements() // Also refresh arrondissements as they might be affected
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la suppression du département.",
        variant: "destructive",
      })
    }
  }

  const fetchArrondissements = async () => {
    try {
      const res = await fetch("/api/arrondissements")
      if (!res.ok) throw new Error("Failed to fetch arrondissements")
      const data = await res.json()
      setArrondissements(data)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec du chargement des arrondissements.",
        variant: "destructive",
      })
    }
  }

  const addArrondissement = async () => {
    if (!newArrondissementName.trim() || selectedDepartmentId === null) {
      toast({
        title: "Erreur",
        description: "Nom de l'arrondissement et département sont requis.",
        variant: "destructive",
      })
      return
    }
    try {
      const res = await fetch("/api/arrondissements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department_id: selectedDepartmentId,
          name: newArrondissementName,
          population: newArrondissementPopulation ? Number(newArrondissementPopulation) : null,
        }),
      })
      if (!res.ok) throw new Error("Failed to add arrondissement")
      toast({
        title: "Succès",
        description: "Arrondissement ajouté.",
      })
      setNewArrondissementName("")
      setNewArrondissementPopulation("")
      fetchArrondissements()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'ajout de l'arrondissement.",
        variant: "destructive",
      })
    }
  }

  const deleteArrondissement = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet arrondissement ?")) return
    try {
      const res = await fetch(`/api/arrondissements/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete arrondissement")
      toast({
        title: "Succès",
        description: "Arrondissement supprimé.",
      })
      fetchArrondissements()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Échec de la suppression de l'arrondissement.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Paramètres de l'Application</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="arrondissements">Arrondissements</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="app_name">Nom de l'Application</Label>
                <Input
                  id="app_name"
                  value={appSettings.app_name}
                  onChange={(e) => setAppSettings({ ...appSettings, app_name: e.target.value })}
                  onBlur={(e) => updateAppSetting("app_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Email de Contact</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={appSettings.contact_email}
                  onChange={(e) => setAppSettings({ ...appSettings, contact_email: e.target.value })}
                  onBlur={(e) => updateAppSetting("contact_email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Numéro de Téléphone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={appSettings.phone_number}
                  onChange={(e) => setAppSettings({ ...appSettings, phone_number: e.target.value })}
                  onBlur={(e) => updateAppSetting("phone_number", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={appSettings.address}
                  onChange={(e) => setAppSettings({ ...appSettings, address: e.target.value })}
                  onBlur={(e) => updateAppSetting("address", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Départements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nouveau département"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                />
                <Button onClick={addDepartment}>Ajouter</Button>
              </div>
              <ul className="space-y-2">
                {departments.map((dept) => (
                  <li key={dept.id} className="flex justify-between items-center p-2 border rounded-md">
                    <span>{dept.name}</span>
                    <Button variant="destructive" size="sm" onClick={() => deleteDepartment(dept.id)}>
                      Supprimer
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arrondissements">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Arrondissements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="select-department">Sélectionner un Département</Label>
                <select
                  id="select-department"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedDepartmentId || ""}
                  onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
                >
                  <option value="">Sélectionner...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDepartmentId && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nom de l'arrondissement"
                      value={newArrondissementName}
                      onChange={(e) => setNewArrondissementName(e.target.value)}
                    />
                    <Input
                      placeholder="Population (optionnel)"
                      type="number"
                      value={newArrondissementPopulation}
                      onChange={(e) => setNewArrondissementPopulation(e.target.value)}
                    />
                    <Button onClick={addArrondissement}>Ajouter</Button>
                  </div>
                  <ul className="space-y-2">
                    {arrondissements
                      .filter((arr) => arr.department_id === selectedDepartmentId)
                      .map((arr) => (
                        <li key={arr.id} className="flex justify-between items-center p-2 border rounded-md">
                          <span>
                            {arr.name} {arr.population ? `(Pop: ${arr.population})` : ""}
                          </span>
                          <Button variant="destructive" size="sm" onClick={() => deleteArrondissement(arr.id)}>
                            Supprimer
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
