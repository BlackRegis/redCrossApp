"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Edit, 
  Trash2, 
  PlusCircle, 
  Save, 
  X, 
  Settings, 
  Building2, 
  MapPin,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"

interface AppSettings {
  nom_organisation: string
  sigle: string
  adresse_siege: string
  telephone: string
  email: string
  site_web: string
  description: string
  couleur_primaire: string
  couleur_secondaire: string
}

interface Department {
  id: string
  nom: string
  code: string
  chef_lieu: string
  population: number
  superficie: number
}

interface Arrondissement {
  id: string
  nom: string
  code: string
  departement_id: string
  population: number
  superficie: number
}

export default function ParametresPage() {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    nom_organisation: "",
    sigle: "",
    adresse_siege: "",
    telephone: "",
    email: "",
    site_web: "",
    description: "",
    couleur_primaire: "#DC2626",
    couleur_secondaire: "#1F2937"
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [arrondissements, setArrondissements] = useState<Arrondissement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // États pour les modales
  const [showDepartmentModal, setShowDepartmentModal] = useState(false)
  const [showArrondissementModal, setShowArrondissementModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [editingArrondissement, setEditingArrondissement] = useState<Arrondissement | null>(null)

  // États pour les formulaires
  const [departmentForm, setDepartmentForm] = useState({
    nom: "",
    code: "",
    chef_lieu: "",
    population: 0,
    superficie: 0
  })

  const [arrondissementForm, setArrondissementForm] = useState({
    nom: "",
    code: "",
    departement_id: "",
    population: 0,
    superficie: 0
  })

  // États pour les filtres et pagination - Départements
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("")
  const [departmentCurrentPage, setDepartmentCurrentPage] = useState(1)
  const [departmentItemsPerPage, setDepartmentItemsPerPage] = useState(10)

  // États pour les filtres et pagination - Arrondissements
  const [arrondissementSearchTerm, setArrondissementSearchTerm] = useState("")
  const [arrondissementSelectedDepartment, setArrondissementSelectedDepartment] = useState("all")
  const [arrondissementCurrentPage, setArrondissementCurrentPage] = useState(1)
  const [arrondissementItemsPerPage, setArrondissementItemsPerPage] = useState(10)

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Charger les paramètres de l'application
        const settingsRes = await fetch("/api/settings/app")
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setAppSettings(settingsData)
        }

        // Charger les départements
        const deptRes = await fetch("/api/departements")
        if (deptRes.ok) {
          const deptData = await deptRes.json()
          setDepartments(deptData)
        }

        // Charger les arrondissements
        const arrRes = await fetch("/api/arrondissements")
        if (arrRes.ok) {
          const arrData = await arrRes.json()
          setArrondissements(arrData)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrage et pagination des départements
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => 
      dept.nom.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
      dept.chef_lieu.toLowerCase().includes(departmentSearchTerm.toLowerCase())
    )
  }, [departments, departmentSearchTerm])

  const paginatedDepartments = useMemo(() => {
    const startIndex = (departmentCurrentPage - 1) * departmentItemsPerPage
    const endIndex = startIndex + departmentItemsPerPage
    return filteredDepartments.slice(startIndex, endIndex)
  }, [filteredDepartments, departmentCurrentPage, departmentItemsPerPage])

  const totalDepartmentPages = Math.ceil(filteredDepartments.length / departmentItemsPerPage)

  // Filtrage et pagination des arrondissements
  const filteredArrondissements = useMemo(() => {
    return arrondissements.filter(arr => {
      const matchesSearch = 
        arr.nom.toLowerCase().includes(arrondissementSearchTerm.toLowerCase()) ||
        arr.code.toLowerCase().includes(arrondissementSearchTerm.toLowerCase())
      
      const matchesDepartment = arrondissementSelectedDepartment === "all" || 
        arr.departement_id === arrondissementSelectedDepartment
      
      return matchesSearch && matchesDepartment
    })
  }, [arrondissements, arrondissementSearchTerm, arrondissementSelectedDepartment])

  const paginatedArrondissements = useMemo(() => {
    const startIndex = (arrondissementCurrentPage - 1) * arrondissementItemsPerPage
    const endIndex = startIndex + arrondissementItemsPerPage
    return filteredArrondissements.slice(startIndex, endIndex)
  }, [filteredArrondissements, arrondissementCurrentPage, arrondissementItemsPerPage])

  const totalArrondissementPages = Math.ceil(filteredArrondissements.length / arrondissementItemsPerPage)

  // Gestion des paramètres de l'application
  const handleAppSettingsChange = (field: keyof AppSettings, value: string) => {
    setAppSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveAppSettings = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/settings/app", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appSettings),
      })
      
      if (res.ok) {
        const result = await res.json()
        console.log("Paramètres sauvegardés:", result)
        // Recharger les données pour s'assurer qu'elles sont à jour
        const fetchRes = await fetch("/api/settings/app")
        if (fetchRes.ok) {
          const updatedSettings = await fetchRes.json()
          setAppSettings(updatedSettings)
        }
        alert("Paramètres de l'application mis à jour avec succès!")
      } else {
        const errorData = await res.json()
        console.error("Erreur API:", errorData)
        alert("Échec de la mise à jour des paramètres de l'application.")
      }
    } catch (error) {
      console.error("Error saving app settings:", error)
      alert("Erreur lors de la sauvegarde des paramètres de l'application.")
    } finally {
      setSaving(false)
    }
  }

  // Gestion des départements
  const handleAddDepartment = () => {
    setEditingDepartment(null)
    setDepartmentForm({
      nom: "",
      code: "",
      chef_lieu: "",
      population: 0,
      superficie: 0
    })
    setShowDepartmentModal(true)
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setDepartmentForm({
      nom: department.nom,
      code: department.code,
      chef_lieu: department.chef_lieu,
      population: department.population,
      superficie: department.superficie
    })
    setShowDepartmentModal(true)
  }

  const handleSaveDepartment = async () => {
    try {
      setSaving(true)
      const url = editingDepartment 
        ? `/api/departements/${editingDepartment.id}`
        : "/api/departements"
      
      const method = editingDepartment ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentForm),
      })
      
      if (res.ok) {
        // Recharger les départements
        const deptRes = await fetch("/api/departements")
        if (deptRes.ok) {
          const deptData = await deptRes.json()
          setDepartments(deptData)
        }
        
        setShowDepartmentModal(false)
        alert(editingDepartment ? "Département modifié avec succès!" : "Département créé avec succès!")
      } else {
        alert("Erreur lors de la sauvegarde du département.")
      }
    } catch (error) {
      console.error("Error saving department:", error)
      alert("Erreur lors de la sauvegarde du département.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) return
    
    try {
      const res = await fetch(`/api/departements/${id}`, {
        method: "DELETE",
      })
      
      if (res.ok) {
        setDepartments(prev => prev.filter(dept => dept.id !== id))
        alert("Département supprimé avec succès!")
      } else {
        alert("Erreur lors de la suppression du département.")
      }
    } catch (error) {
      console.error("Error deleting department:", error)
      alert("Erreur lors de la suppression du département.")
    }
  }

  // Gestion des arrondissements
  const handleAddArrondissement = () => {
    setEditingArrondissement(null)
    setArrondissementForm({
      nom: "",
      code: "",
      departement_id: "",
      population: 0,
      superficie: 0
    })
    setShowArrondissementModal(true)
  }

  const handleEditArrondissement = (arrondissement: Arrondissement) => {
    setEditingArrondissement(arrondissement)
    setArrondissementForm({
      nom: arrondissement.nom,
      code: arrondissement.code,
      departement_id: arrondissement.departement_id,
      population: arrondissement.population,
      superficie: arrondissement.superficie
    })
    setShowArrondissementModal(true)
  }

  const handleSaveArrondissement = async () => {
    try {
      setSaving(true)
      const url = editingArrondissement 
        ? `/api/arrondissements/${editingArrondissement.id}`
        : "/api/arrondissements"
      
      const method = editingArrondissement ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arrondissementForm),
      })
      
      if (res.ok) {
        // Recharger les arrondissements
        const arrRes = await fetch("/api/arrondissements")
        if (arrRes.ok) {
          const arrData = await arrRes.json()
          setArrondissements(arrData)
        }
        
        setShowArrondissementModal(false)
        alert(editingArrondissement ? "Arrondissement modifié avec succès!" : "Arrondissement créé avec succès!")
      } else {
        alert("Erreur lors de la sauvegarde de l'arrondissement.")
      }
    } catch (error) {
      console.error("Error saving arrondissement:", error)
      alert("Erreur lors de la sauvegarde de l'arrondissement.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteArrondissement = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet arrondissement ?")) return
    
    try {
      const res = await fetch(`/api/arrondissements/${id}`, {
        method: "DELETE",
      })
      
      if (res.ok) {
        setArrondissements(prev => prev.filter(arr => arr.id !== id))
        alert("Arrondissement supprimé avec succès!")
      } else {
        alert("Erreur lors de la suppression de l'arrondissement.")
      }
    } catch (error) {
      console.error("Error deleting arrondissement:", error)
      alert("Erreur lors de la suppression de l'arrondissement.")
    }
  }

  // Composant de pagination
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    itemsPerPage, 
    onItemsPerPageChange,
    totalItems 
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    itemsPerPage: number
    onItemsPerPageChange: (items: number) => void
    totalItems: number
  }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Affichage de {startItem} à {endItem} sur {totalItems} résultats
          </p>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-8 w-8 text-red-600" />
        <h1 className="text-3xl font-bold">Paramètres du Système</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="departements" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Départements</span>
          </TabsTrigger>
          <TabsTrigger value="arrondissements" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Arrondissements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'Application</CardTitle>
              <CardDescription>Configurez les informations de base de votre organisation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom_organisation">Nom de l'Organisation</Label>
                  <Input 
                    id="nom_organisation" 
                    value={appSettings.nom_organisation} 
                    onChange={(e) => handleAppSettingsChange('nom_organisation', e.target.value)}
                    placeholder="Croix Rouge Congo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sigle">Sigle</Label>
                  <Input 
                    id="sigle" 
                    value={appSettings.sigle} 
                    onChange={(e) => handleAppSettingsChange('sigle', e.target.value)}
                    placeholder="CRC"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse_siege">Adresse du Siège</Label>
                <Textarea 
                  id="adresse_siege" 
                  value={appSettings.adresse_siege} 
                  onChange={(e) => handleAppSettingsChange('adresse_siege', e.target.value)}
                  placeholder="Adresse complète du siège"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input 
                    id="telephone" 
                    value={appSettings.telephone} 
                    onChange={(e) => handleAppSettingsChange('telephone', e.target.value)}
                    placeholder="+242 06 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={appSettings.email} 
                    onChange={(e) => handleAppSettingsChange('email', e.target.value)}
                    placeholder="contact@croixrouge.cg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_web">Site Web</Label>
                <Input 
                  id="site_web" 
                  value={appSettings.site_web} 
                  onChange={(e) => handleAppSettingsChange('site_web', e.target.value)}
                  placeholder="https://www.croixrouge.cg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={appSettings.description} 
                  onChange={(e) => handleAppSettingsChange('description', e.target.value)}
                  placeholder="Description de l'organisation"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="couleur_primaire">Couleur Primaire</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="couleur_primaire" 
                      type="color"
                      value={appSettings.couleur_primaire} 
                      onChange={(e) => handleAppSettingsChange('couleur_primaire', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input 
                      value={appSettings.couleur_primaire} 
                      onChange={(e) => handleAppSettingsChange('couleur_primaire', e.target.value)}
                      placeholder="#DC2626"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="couleur_secondaire">Couleur Secondaire</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="couleur_secondaire" 
                      type="color"
                      value={appSettings.couleur_secondaire} 
                      onChange={(e) => handleAppSettingsChange('couleur_secondaire', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input 
                      value={appSettings.couleur_secondaire} 
                      onChange={(e) => handleAppSettingsChange('couleur_secondaire', e.target.value)}
                      placeholder="#1F2937"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveAppSettings} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departements" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Gestion des Départements</CardTitle>
                <CardDescription>Créez et gérez les départements de votre organisation.</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddDepartment}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Département
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filtres pour les départements */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, code ou chef-lieu..."
                    value={departmentSearchTerm}
                    onChange={(e) => {
                      setDepartmentSearchTerm(e.target.value)
                      setDepartmentCurrentPage(1) // Reset à la première page
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Chef-lieu</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Superficie (km²)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>
                          {departmentSearchTerm 
                            ? 'Aucun département trouvé pour cette recherche' 
                            : 'Aucun département configuré'
                          }
                        </p>
                        {!departmentSearchTerm && (
                          <Button onClick={handleAddDepartment} variant="outline" className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ajouter le premier département
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDepartments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.nom}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dept.code}</Badge>
                        </TableCell>
                        <TableCell>{dept.chef_lieu}</TableCell>
                        <TableCell>{dept.population.toLocaleString()}</TableCell>
                        <TableCell>{dept.superficie.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditDepartment(dept)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination pour les départements */}
              {filteredDepartments.length > 0 && (
                <Pagination
                  currentPage={departmentCurrentPage}
                  totalPages={totalDepartmentPages}
                  onPageChange={setDepartmentCurrentPage}
                  itemsPerPage={departmentItemsPerPage}
                  onItemsPerPageChange={(items) => {
                    setDepartmentItemsPerPage(items)
                    setDepartmentCurrentPage(1)
                  }}
                  totalItems={filteredDepartments.length}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arrondissements" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Gestion des Arrondissements</CardTitle>
                <CardDescription>Créez et gérez les arrondissements de votre organisation.</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddArrondissement}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Arrondissement
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filtres pour les arrondissements */}
              <div className="mb-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom ou code..."
                      value={arrondissementSearchTerm}
                      onChange={(e) => {
                        setArrondissementSearchTerm(e.target.value)
                        setArrondissementCurrentPage(1) // Reset à la première page
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Select 
                    value={arrondissementSelectedDepartment} 
                    onValueChange={(value) => {
                      setArrondissementSelectedDepartment(value)
                      setArrondissementCurrentPage(1) // Reset à la première page
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les départements</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Superficie (km²)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedArrondissements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>
                          {(arrondissementSearchTerm || arrondissementSelectedDepartment !== "all")
                            ? 'Aucun arrondissement trouvé pour ces critères' 
                            : 'Aucun arrondissement configuré'
                          }
                        </p>
                        {!arrondissementSearchTerm && arrondissementSelectedDepartment === "all" && (
                          <Button onClick={handleAddArrondissement} variant="outline" className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ajouter le premier arrondissement
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedArrondissements.map((arr) => {
                      const departmentName = departments.find((d) => d.id === arr.departement_id)?.nom || "Inconnu"
                      return (
                        <TableRow key={arr.id}>
                          <TableCell className="font-medium">{arr.nom}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{arr.code}</Badge>
                          </TableCell>
                          <TableCell>{departmentName}</TableCell>
                          <TableCell>{arr.population.toLocaleString()}</TableCell>
                          <TableCell>{arr.superficie.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditArrondissement(arr)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteArrondissement(arr.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination pour les arrondissements */}
              {filteredArrondissements.length > 0 && (
                <Pagination
                  currentPage={arrondissementCurrentPage}
                  totalPages={totalArrondissementPages}
                  onPageChange={setArrondissementCurrentPage}
                  itemsPerPage={arrondissementItemsPerPage}
                  onItemsPerPageChange={(items) => {
                    setArrondissementItemsPerPage(items)
                    setArrondissementCurrentPage(1)
                  }}
                  totalItems={filteredArrondissements.length}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal pour les départements */}
      <Dialog open={showDepartmentModal} onOpenChange={setShowDepartmentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Modifier le Département" : "Ajouter un Département"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment ? "Modifiez les informations du département." : "Créez un nouveau département."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dept-nom">Nom</Label>
                <Input 
                  id="dept-nom"
                  value={departmentForm.nom}
                  onChange={(e) => setDepartmentForm(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom du département"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept-code">Code</Label>
                <Input 
                  id="dept-code"
                  value={departmentForm.code}
                  onChange={(e) => setDepartmentForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Code (ex: BRA)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-chef-lieu">Chef-lieu</Label>
              <Input 
                id="dept-chef-lieu"
                value={departmentForm.chef_lieu}
                onChange={(e) => setDepartmentForm(prev => ({ ...prev, chef_lieu: e.target.value }))}
                placeholder="Chef-lieu du département"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dept-population">Population</Label>
                <Input 
                  id="dept-population"
                  type="number"
                  value={departmentForm.population}
                  onChange={(e) => setDepartmentForm(prev => ({ ...prev, population: parseInt(e.target.value) || 0 }))}
                  placeholder="Population"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept-superficie">Superficie (km²)</Label>
                <Input 
                  id="dept-superficie"
                  type="number"
                  value={departmentForm.superficie}
                  onChange={(e) => setDepartmentForm(prev => ({ ...prev, superficie: parseInt(e.target.value) || 0 }))}
                  placeholder="Superficie"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDepartmentModal(false)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSaveDepartment} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingDepartment ? "Modifier" : "Créer"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour les arrondissements */}
      <Dialog open={showArrondissementModal} onOpenChange={setShowArrondissementModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingArrondissement ? "Modifier l'Arrondissement" : "Ajouter un Arrondissement"}
            </DialogTitle>
            <DialogDescription>
              {editingArrondissement ? "Modifiez les informations de l'arrondissement." : "Créez un nouvel arrondissement."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arr-nom">Nom</Label>
                <Input 
                  id="arr-nom"
                  value={arrondissementForm.nom}
                  onChange={(e) => setArrondissementForm(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom de l'arrondissement"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arr-code">Code</Label>
                <Input 
                  id="arr-code"
                  value={arrondissementForm.code}
                  onChange={(e) => setArrondissementForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Code (ex: MAK)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="arr-departement">Département</Label>
              <Select 
                value={arrondissementForm.departement_id}
                onValueChange={(value) => setArrondissementForm(prev => ({ ...prev, departement_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arr-population">Population</Label>
                <Input 
                  id="arr-population"
                  type="number"
                  value={arrondissementForm.population}
                  onChange={(e) => setArrondissementForm(prev => ({ ...prev, population: parseInt(e.target.value) || 0 }))}
                  placeholder="Population"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arr-superficie">Superficie (km²)</Label>
                <Input 
                  id="arr-superficie"
                  type="number"
                  value={arrondissementForm.superficie}
                  onChange={(e) => setArrondissementForm(prev => ({ ...prev, superficie: parseInt(e.target.value) || 0 }))}
                  placeholder="Superficie"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArrondissementModal(false)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSaveArrondissement} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingArrondissement ? "Modifier" : "Créer"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
