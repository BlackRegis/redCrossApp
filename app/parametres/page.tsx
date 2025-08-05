"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, PlusCircle } from "lucide-react"

interface AppSettings {
  app_name: string
  contact_email: string
  phone_number: string
}

interface Department {
  id: string
  name: string
  head_of_department: string
  contact_email: string
}

interface Arrondissement {
  id: string
  name: string
  department_id: string
  population: number
}

export default function ParametresPage() {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    app_name: "",
    contact_email: "",
    phone_number: "",
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [arrondissements, setArrondissements] = useState<Arrondissement[]>([])

  // Fetch app settings
  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        const res = await fetch("/api/settings/app")
        if (res.ok) {
          const data = await res.json()
          setAppSettings(data)
        } else {
          console.error("Failed to fetch app settings")
        }
      } catch (error) {
        console.error("Error fetching app settings:", error)
      }
    }
    fetchAppSettings()
  }, [])

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departements")
        if (res.ok) {
          const data = await res.json()
          setDepartments(data)
        } else {
          console.error("Failed to fetch departments")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }
    fetchDepartments()
  }, [])

  // Fetch arrondissements (assuming an API route for them)
  useEffect(() => {
    const fetchArrondissements = async () => {
      try {
        const res = await fetch("/api/arrondissements") // You'd need to create this API route
        if (res.ok) {
          const data = await res.json()
          setArrondissements(data)
        } else {
          console.error("Failed to fetch arrondissements")
        }
      } catch (error) {
        console.error("Error fetching arrondissements:", error)
      }
    }
    fetchArrondissements()
  }, [])

  const handleAppSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setAppSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveAppSettings = async () => {
    try {
      const res = await fetch("/api/settings/app", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appSettings),
      })
      if (res.ok) {
        alert("Paramètres de l'application mis à jour avec succès!")
      } else {
        alert("Échec de la mise à jour des paramètres de l'application.")
      }
    } catch (error) {
      console.error("Error saving app settings:", error)
      alert("Erreur lors de la sauvegarde des paramètres de l'application.")
    }
  }

  // Dummy functions for department/arrondissement management (to be implemented with actual API calls)
  const handleAddDepartment = () => alert("Ajouter un département (fonctionnalité à implémenter)")
  const handleEditDepartment = (id: string) => alert(`Modifier le département ${id} (fonctionnalité à implémenter)`)
  const handleDeleteDepartment = (id: string) => alert(`Supprimer le département ${id} (fonctionnalité à implémenter)`)

  const handleAddArrondissement = () => alert("Ajouter un arrondissement (fonctionnalité à implémenter)")
  const handleEditArrondissement = (id: string) =>
    alert(`Modifier l'arrondissement ${id} (fonctionnalité à implémenter)`)
  const handleDeleteArrondissement = (id: string) =>
    alert(`Supprimer l'arrondissement ${id} (fonctionnalité à implémenter)`)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Paramètres du Système</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="departements">Départements</TabsTrigger>
          <TabsTrigger value="arrondissements">Arrondissements</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux de l'Application</CardTitle>
              <CardDescription>Configurez les informations de base de votre application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app_name">Nom de l'Application</Label>
                <Input id="app_name" value={appSettings.app_name} onChange={handleAppSettingsChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de Contact</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={appSettings.contact_email}
                  onChange={handleAppSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Numéro de Téléphone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={appSettings.phone_number}
                  onChange={handleAppSettingsChange}
                />
              </div>
              <Button onClick={handleSaveAppSettings}>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Gestion des Départements</CardTitle>
              <Button size="sm" onClick={handleAddDepartment}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Département
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Email de Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.head_of_department}</TableCell>
                      <TableCell>{dept.contact_email}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditDepartment(dept.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arrondissements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Gestion des Arrondissements</CardTitle>
              <Button size="sm" onClick={handleAddArrondissement}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Arrondissement
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arrondissements.map((arr) => {
                    const departmentName = departments.find((d) => d.id === arr.department_id)?.name || "Inconnu"
                    return (
                      <TableRow key={arr.id}>
                        <TableCell className="font-medium">{arr.name}</TableCell>
                        <TableCell>{departmentName}</TableCell>
                        <TableCell>{arr.population.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditArrondissement(arr.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteArrondissement(arr.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
