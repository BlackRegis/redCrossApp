"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import {
  Settings,
  Globe,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  Building2,
  Users,
  Database,
  Bell,
  Shield,
} from "lucide-react"

interface Departement {
  id: string
  nom: string
  code: string
  population?: number
  superficie?: number
  chef_lieu: string
  arrondissements: Arrondissement[]
}

interface Arrondissement {
  id: string
  nom: string
  code: string
  population?: number
  superficie?: number
}

interface AppSetting {
  setting_key: string
  setting_value: string
}

interface RedCrossColor {
  id: number
  name: string
  hex_code: string
}

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("application")
  const [appSettings, setAppSettings] = useState({
    nomOrganisation: "Croix Rouge de la République du Congo",
    sigle: "CRC",
    adresseSiege: "Avenue Félix Éboué, Brazzaville",
    telephone: "+242 123 456 789",
    email: "contact@croixrouge-congo.org",
    siteWeb: "www.croixrouge-congo.org",
    description: "Organisation humanitaire dédiée à l'aide aux populations vulnérables",
    logo: "",
    couleurPrimaire: "#dc2626",
    couleurSecondaire: "#991b1b",
  })

  const [paysSettings, setPaysSettings] = useState({
    nomPays: "République du Congo",
    codePays: "CG",
    capitale: "Brazzaville",
    langue: "Français",
    monnaie: "Franc CFA",
    codeMonnaie: "XAF",
    fuseauHoraire: "UTC+1",
    prefixeTelephone: "+242",
  })

  const [departements, setDepartements] = useState<Departement[]>([
    {
      id: "1",
      nom: "Brazzaville",
      code: "BZV",
      population: 1838000,
      superficie: 100,
      chef_lieu: "Brazzaville",
      arrondissements: [
        { id: "1", nom: "Bacongo", code: "BCG", population: 156000 },
        { id: "2", nom: "Poto-Poto", code: "PTP", population: 134000 },
        { id: "3", nom: "Moungali", code: "MGL", population: 98000 },
        { id: "4", nom: "Ouenzé", code: "OUZ", population: 87000 },
        { id: "5", nom: "Talangaï", code: "TLG", population: 76000 },
      ],
    },
    {
      id: "2",
      nom: "Kouilou",
      code: "KOU",
      population: 91000,
      superficie: 13650,
      chef_lieu: "Pointe-Noire",
      arrondissements: [{ id: "6", nom: "Pointe-Noire", code: "PTN", population: 234000 }],
    },
  ])

  const [newDepartement, setNewDepartement] = useState({
    nom: "",
    code: "",
    chef_lieu: "",
    population: "",
    superficie: "",
  })

  const [newArrondissement, setNewArrondissement] = useState({
    nom: "",
    code: "",
    departementId: "",
    population: "",
    superficie: "",
  })

  const [showAddDept, setShowAddDept] = useState(false)
  const [showAddArr, setShowAddArr] = useState(false)

  const [editingDept, setEditingDept] = useState<Departement | null>(null)
  const [editingArr, setEditingArr] = useState<{ arr: Arrondissement; deptId: string } | null>(null)
  const [editDeptData, setEditDeptData] = useState({
    nom: "",
    code: "",
    chef_lieu: "",
    population: "",
    superficie: "",
  })
  const [editArrData, setEditArrData] = useState({
    nom: "",
    code: "",
    population: "",
    superficie: "",
  })

  const [appName, setAppName] = useState("")
  const [redCrossColors, setRedCrossColors] = useState<RedCrossColor[]>([])
  const [redColorHex, setRedColorHex] = useState("#ED1C24") // Default Red Cross Red

  useEffect(() => {
    fetchSettings()
    fetchRedCrossColors()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/app")
      if (!response.ok) throw new Error("Failed to fetch settings")
      const data: AppSetting[] = await response.json()
      const appNameSetting = data.find((s) => s.setting_key === "appName")
      if (appNameSetting) {
        setAppName(appNameSetting.setting_value)
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des paramètres de l'application.")
      console.error("Error fetching app settings:", error)
    }
  }

  const fetchRedCrossColors = async () => {
    try {
      const response = await fetch("/api/settings/colors")
      if (!response.ok) throw new Error("Failed to fetch Red Cross colors")
      const data: RedCrossColor[] = await response.json()
      setRedCrossColors(data)
      const redColor = data.find((color) => color.name.toLowerCase() === "red")
      if (redColor) {
        setRedColorHex(redColor.hex_code)
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des couleurs de la Croix-Rouge.")
      console.error("Error fetching Red Cross colors:", error)
    }
  }

  const handleSaveAppSettings = async () => {
    try {
      // Ici on sauvegarderait dans Neon
      console.log("Sauvegarde des paramètres d'application:", appSettings)
      alert("Paramètres d'application sauvegardés avec succès!")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde")
    }
  }

  const handleSavePaysSettings = async () => {
    try {
      // Ici on sauvegarderait dans Neon
      console.log("Sauvegarde des paramètres du pays:", paysSettings)
      alert("Paramètres du pays sauvegardés avec succès!")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde")
    }
  }

  const handleAddDepartement = async () => {
    if (!newDepartement.nom || !newDepartement.code || !newDepartement.chef_lieu) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const dept: Departement = {
      id: Date.now().toString(),
      nom: newDepartement.nom,
      code: newDepartement.code.toUpperCase(),
      chef_lieu: newDepartement.chef_lieu,
      population: newDepartement.population ? Number.parseInt(newDepartement.population) : undefined,
      superficie: newDepartement.superficie ? Number.parseInt(newDepartement.superficie) : undefined,
      arrondissements: [],
    }

    try {
      // Ici on sauvegarderait dans Neon
      setDepartements([...departements, dept])
      setNewDepartement({ nom: "", code: "", chef_lieu: "", population: "", superficie: "" })
      setShowAddDept(false)
      alert("Département ajouté avec succès!")
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      alert("Erreur lors de l'ajout du département")
    }
  }

  const handleAddArrondissement = async () => {
    if (!newArrondissement.nom || !newArrondissement.code || !newArrondissement.departementId) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const arr: Arrondissement = {
      id: Date.now().toString(),
      nom: newArrondissement.nom,
      code: newArrondissement.code.toUpperCase(),
      population: newArrondissement.population ? Number.parseInt(newArrondissement.population) : undefined,
      superficie: newArrondissement.superficie ? Number.parseInt(newArrondissement.superficie) : undefined,
    }

    try {
      // Ici on sauvegarderait dans Neon
      setDepartements(
        departements.map((dept) =>
          dept.id === newArrondissement.departementId
            ? { ...dept, arrondissements: [...dept.arrondissements, arr] }
            : dept,
        ),
      )
      setNewArrondissement({ nom: "", code: "", departementId: "", population: "", superficie: "" })
      setShowAddArr(false)
      alert("Arrondissement ajouté avec succès!")
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      alert("Erreur lors de l'ajout de l'arrondissement")
    }
  }

  const handleDeleteDepartement = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      try {
        // Ici on supprimerait de Neon
        setDepartements(departements.filter((dept) => dept.id !== id))
        alert("Département supprimé avec succès!")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleDeleteArrondissement = async (deptId: string, arrId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet arrondissement ?")) {
      try {
        // Ici on supprimerait de Neon
        setDepartements(
          departements.map((dept) =>
            dept.id === deptId
              ? { ...dept, arrondissements: dept.arrondissements.filter((arr) => arr.id !== arrId) }
              : dept,
          ),
        )
        alert("Arrondissement supprimé avec succès!")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleEditDepartement = (dept: Departement) => {
    setEditingDept(dept)
    setEditDeptData({
      nom: dept.nom,
      code: dept.code,
      chef_lieu: dept.chef_lieu,
      population: dept.population?.toString() || "",
      superficie: dept.superficie?.toString() || "",
    })
  }

  const handleUpdateDepartement = async () => {
    if (!editingDept || !editDeptData.nom || !editDeptData.code || !editDeptData.chef_lieu) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const updatedDept: Departement = {
        ...editingDept,
        nom: editDeptData.nom,
        code: editDeptData.code.toUpperCase(),
        chef_lieu: editDeptData.chef_lieu,
        population: editDeptData.population ? Number.parseInt(editDeptData.population) : undefined,
        superficie: editDeptData.superficie ? Number.parseInt(editDeptData.superficie) : undefined,
      }

      setDepartements(departements.map((dept) => (dept.id === editingDept.id ? updatedDept : dept)))
      setEditingDept(null)
      setEditDeptData({ nom: "", code: "", chef_lieu: "", population: "", superficie: "" })
      alert("Département modifié avec succès!")
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Erreur lors de la modification du département")
    }
  }

  const handleEditArrondissement = (arr: Arrondissement, deptId: string) => {
    setEditingArr({ arr, deptId })
    setEditArrData({
      nom: arr.nom,
      code: arr.code,
      population: arr.population?.toString() || "",
      superficie: arr.superficie?.toString() || "",
    })
  }

  const handleUpdateArrondissement = async () => {
    if (!editingArr || !editArrData.nom || !editArrData.code) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const updatedArr: Arrondissement = {
        ...editingArr.arr,
        nom: editArrData.nom,
        code: editArrData.code.toUpperCase(),
        population: editArrData.population ? Number.parseInt(editArrData.population) : undefined,
        superficie: editArrData.superficie ? Number.parseInt(editArrData.superficie) : undefined,
      }

      setDepartements(
        departements.map((dept) =>
          dept.id === editingArr.deptId
            ? {
                ...dept,
                arrondissements: dept.arrondissements.map((arr) => (arr.id === editingArr.arr.id ? updatedArr : arr)),
              }
            : dept,
        ),
      )
      setEditingArr(null)
      setEditArrData({ nom: "", code: "", population: "", superficie: "" })
      alert("Arrondissement modifié avec succès!")
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Erreur lors de la modification de l'arrondissement")
    }
  }

  const handleSaveAppName = async () => {
    try {
      const response = await fetch("/api/settings/app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting_key: "appName", setting_value: appName }),
      })
      if (!response.ok) throw new Error("Failed to save app name")
      toast.success("Nom de l'application mis à jour avec succès.")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du nom de l'application.")
      console.error("Error saving app name:", error)
    }
  }

  const handleSaveRedColor = async () => {
    try {
      const response = await fetch("/api/settings/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Red", hex_code: redColorHex }),
      })
      if (!response.ok) throw new Error("Failed to save Red Cross color")
      toast.success("Couleur de la Croix-Rouge mise à jour avec succès.")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la couleur de la Croix-Rouge.")
      console.error("Error saving Red Cross color:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configuration de l'application et gestion territoriale</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Départements</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{departements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arrondissements</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {departements.reduce((total, dept) => total + dept.arrondissements.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Population Totale</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {departements.reduce((total, dept) => total + (dept.population || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Données</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Neon</div>
            <p className="text-xs text-muted-foreground">Connecté</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Gérez les paramètres de l'application et la structure territoriale</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="application">
                <Settings className="h-4 w-4 mr-2" />
                Application
              </TabsTrigger>
              <TabsTrigger value="pays">
                <Globe className="h-4 w-4 mr-2" />
                Pays Hôte
              </TabsTrigger>
              <TabsTrigger value="departements">
                <Building2 className="h-4 w-4 mr-2" />
                Départements
              </TabsTrigger>
              <TabsTrigger value="arrondissements">
                <MapPin className="h-4 w-4 mr-2" />
                Arrondissements
              </TabsTrigger>
            </TabsList>

            {/* Paramètres Application */}
            <TabsContent value="application" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Informations Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomOrganisation">Nom de l'Organisation</Label>
                      <Input
                        id="nomOrganisation"
                        value={appSettings.nomOrganisation}
                        onChange={(e) => setAppSettings({ ...appSettings, nomOrganisation: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sigle">Sigle</Label>
                      <Input
                        id="sigle"
                        value={appSettings.sigle}
                        onChange={(e) => setAppSettings({ ...appSettings, sigle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adresseSiege">Adresse du Siège</Label>
                      <Textarea
                        id="adresseSiege"
                        value={appSettings.adresseSiege}
                        onChange={(e) => setAppSettings({ ...appSettings, adresseSiege: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={appSettings.description}
                        onChange={(e) => setAppSettings({ ...appSettings, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Contact & Apparence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        value={appSettings.telephone}
                        onChange={(e) => setAppSettings({ ...appSettings, telephone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={appSettings.email}
                        onChange={(e) => setAppSettings({ ...appSettings, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteWeb">Site Web</Label>
                      <Input
                        id="siteWeb"
                        value={appSettings.siteWeb}
                        onChange={(e) => setAppSettings({ ...appSettings, siteWeb: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="couleurPrimaire">Couleur Primaire</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="couleurPrimaire"
                            type="color"
                            value={appSettings.couleurPrimaire}
                            onChange={(e) => setAppSettings({ ...appSettings, couleurPrimaire: e.target.value })}
                            className="w-16 h-10"
                          />
                          <Input
                            value={appSettings.couleurPrimaire}
                            onChange={(e) => setAppSettings({ ...appSettings, couleurPrimaire: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="couleurSecondaire">Couleur Secondaire</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="couleurSecondaire"
                            type="color"
                            value={appSettings.couleurSecondaire}
                            onChange={(e) => setAppSettings({ ...appSettings, couleurSecondaire: e.target.value })}
                            className="w-16 h-10"
                          />
                          <Input
                            value={appSettings.couleurSecondaire}
                            onChange={(e) => setAppSettings({ ...appSettings, couleurSecondaire: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveAppSettings} className="bg-red-600 hover:bg-red-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les Paramètres
                </Button>
              </div>
            </TabsContent>

            {/* Paramètres Pays */}
            <TabsContent value="pays" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Informations du Pays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomPays">Nom du Pays</Label>
                      <Input
                        id="nomPays"
                        value={paysSettings.nomPays}
                        onChange={(e) => setPaysSettings({ ...paysSettings, nomPays: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codePays">Code Pays (ISO)</Label>
                      <Input
                        id="codePays"
                        value={paysSettings.codePays}
                        onChange={(e) => setPaysSettings({ ...paysSettings, codePays: e.target.value.toUpperCase() })}
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capitale">Capitale</Label>
                      <Input
                        id="capitale"
                        value={paysSettings.capitale}
                        onChange={(e) => setPaysSettings({ ...paysSettings, capitale: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="langue">Langue Officielle</Label>
                      <Input
                        id="langue"
                        value={paysSettings.langue}
                        onChange={(e) => setPaysSettings({ ...paysSettings, langue: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Paramètres Régionaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monnaie">Monnaie</Label>
                      <Input
                        id="monnaie"
                        value={paysSettings.monnaie}
                        onChange={(e) => setPaysSettings({ ...paysSettings, monnaie: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codeMonnaie">Code Monnaie</Label>
                      <Input
                        id="codeMonnaie"
                        value={paysSettings.codeMonnaie}
                        onChange={(e) =>
                          setPaysSettings({ ...paysSettings, codeMonnaie: e.target.value.toUpperCase() })
                        }
                        maxLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuseauHoraire">Fuseau Horaire</Label>
                      <Select
                        value={paysSettings.fuseauHoraire}
                        onValueChange={(value) => setPaysSettings({ ...paysSettings, fuseauHoraire: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-1">UTC-1</SelectItem>
                          <SelectItem value="UTC+0">UTC+0</SelectItem>
                          <SelectItem value="UTC+1">UTC+1</SelectItem>
                          <SelectItem value="UTC+2">UTC+2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prefixeTelephone">Préfixe Téléphone</Label>
                      <Input
                        id="prefixeTelephone"
                        value={paysSettings.prefixeTelephone}
                        onChange={(e) => setPaysSettings({ ...paysSettings, prefixeTelephone: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePaysSettings} className="bg-red-600 hover:bg-red-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les Paramètres
                </Button>
              </div>
            </TabsContent>

            {/* Gestion Départements */}
            <TabsContent value="departements" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Départements ({departements.length})</h3>
                  <p className="text-sm text-muted-foreground">Gérez les départements du pays</p>
                </div>
                <Button onClick={() => setShowAddDept(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Département
                </Button>
              </div>

              {showAddDept && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nouveau Département</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newDeptNom">Nom *</Label>
                        <Input
                          id="newDeptNom"
                          value={newDepartement.nom}
                          onChange={(e) => setNewDepartement({ ...newDepartement, nom: e.target.value })}
                          placeholder="Ex: Brazzaville"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newDeptCode">Code *</Label>
                        <Input
                          id="newDeptCode"
                          value={newDepartement.code}
                          onChange={(e) => setNewDepartement({ ...newDepartement, code: e.target.value.toUpperCase() })}
                          placeholder="Ex: BZV"
                          maxLength={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newDeptChefLieu">Chef-lieu *</Label>
                        <Input
                          id="newDeptChefLieu"
                          value={newDepartement.chef_lieu}
                          onChange={(e) => setNewDepartement({ ...newDepartement, chef_lieu: e.target.value })}
                          placeholder="Ex: Brazzaville"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newDeptPopulation">Population</Label>
                        <Input
                          id="newDeptPopulation"
                          type="number"
                          value={newDepartement.population}
                          onChange={(e) => setNewDepartement({ ...newDepartement, population: e.target.value })}
                          placeholder="Ex: 1838000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newDeptSuperficie">Superficie (km²)</Label>
                        <Input
                          id="newDeptSuperficie"
                          type="number"
                          value={newDepartement.superficie}
                          onChange={(e) => setNewDepartement({ ...newDepartement, superficie: e.target.value })}
                          placeholder="Ex: 100"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddDept(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddDepartement} className="bg-red-600 hover:bg-red-700">
                        <Save className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {editingDept && (
                <Card>
                  <CardHeader>
                    <CardTitle>Modifier le Département</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editDeptNom">Nom *</Label>
                        <Input
                          id="editDeptNom"
                          value={editDeptData.nom}
                          onChange={(e) => setEditDeptData({ ...editDeptData, nom: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editDeptCode">Code *</Label>
                        <Input
                          id="editDeptCode"
                          value={editDeptData.code}
                          onChange={(e) => setEditDeptData({ ...editDeptData, code: e.target.value.toUpperCase() })}
                          maxLength={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editDeptChefLieu">Chef-lieu *</Label>
                        <Input
                          id="editDeptChefLieu"
                          value={editDeptData.chef_lieu}
                          onChange={(e) => setEditDeptData({ ...editDeptData, chef_lieu: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editDeptPopulation">Population</Label>
                        <Input
                          id="editDeptPopulation"
                          type="number"
                          value={editDeptData.population}
                          onChange={(e) => setEditDeptData({ ...editDeptData, population: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editDeptSuperficie">Superficie (km²)</Label>
                        <Input
                          id="editDeptSuperficie"
                          type="number"
                          value={editDeptData.superficie}
                          onChange={(e) => setEditDeptData({ ...editDeptData, superficie: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setEditingDept(null)}>
                        Annuler
                      </Button>
                      <Button onClick={handleUpdateDepartement} className="bg-red-600 hover:bg-red-700">
                        <Save className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Chef-lieu</TableHead>
                      <TableHead>Population</TableHead>
                      <TableHead>Superficie</TableHead>
                      <TableHead>Arrondissements</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departements.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.nom}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{dept.code}</Badge>
                        </TableCell>
                        <TableCell>{dept.chef_lieu}</TableCell>
                        <TableCell>{dept.population?.toLocaleString() || "N/A"}</TableCell>
                        <TableCell>{dept.superficie ? `${dept.superficie.toLocaleString()} km²` : "N/A"}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">{dept.arrondissements.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditDepartement(dept)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteDepartement(dept.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Gestion Arrondissements */}
            <TabsContent value="arrondissements" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    Arrondissements ({departements.reduce((total, dept) => total + dept.arrondissements.length, 0)})
                  </h3>
                  <p className="text-sm text-muted-foreground">Gérez les arrondissements par département</p>
                </div>
                <Button onClick={() => setShowAddArr(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Arrondissement
                </Button>
              </div>

              {showAddArr && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nouvel Arrondissement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newArrDept">Département *</Label>
                        <Select
                          value={newArrondissement.departementId}
                          onValueChange={(value) =>
                            setNewArrondissement({ ...newArrondissement, departementId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                          <SelectContent>
                            {departements.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newArrNom">Nom *</Label>
                        <Input
                          id="newArrNom"
                          value={newArrondissement.nom}
                          onChange={(e) => setNewArrondissement({ ...newArrondissement, nom: e.target.value })}
                          placeholder="Ex: Bacongo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newArrCode">Code *</Label>
                        <Input
                          id="newArrCode"
                          value={newArrondissement.code}
                          onChange={(e) =>
                            setNewArrondissement({ ...newArrondissement, code: e.target.value.toUpperCase() })
                          }
                          placeholder="Ex: BCG"
                          maxLength={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newArrPopulation">Population</Label>
                        <Input
                          id="newArrPopulation"
                          type="number"
                          value={newArrondissement.population}
                          onChange={(e) => setNewArrondissement({ ...newArrondissement, population: e.target.value })}
                          placeholder="Ex: 156000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newArrSuperficie">Superficie (km²)</Label>
                        <Input
                          id="newArrSuperficie"
                          type="number"
                          value={newArrondissement.superficie}
                          onChange={(e) => setNewArrondissement({ ...newArrondissement, superficie: e.target.value })}
                          placeholder="Ex: 25"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddArr(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddArrondissement} className="bg-red-600 hover:bg-red-700">
                        <Save className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {editingArr && (
                <Card>
                  <CardHeader>
                    <CardTitle>Modifier l'Arrondissement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editArrNom">Nom *</Label>
                        <Input
                          id="editArrNom"
                          value={editArrData.nom}
                          onChange={(e) => setEditArrData({ ...editArrData, nom: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editArrCode">Code *</Label>
                        <Input
                          id="editArrCode"
                          value={editArrData.code}
                          onChange={(e) => setEditArrData({ ...editArrData, code: e.target.value.toUpperCase() })}
                          maxLength={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editArrPopulation">Population</Label>
                        <Input
                          id="editArrPopulation"
                          type="number"
                          value={editArrData.population}
                          onChange={(e) => setEditArrData({ ...editArrData, population: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editArrSuperficie">Superficie (km²)</Label>
                        <Input
                          id="editArrSuperficie"
                          type="number"
                          value={editArrData.superficie}
                          onChange={(e) => setEditArrData({ ...editArrData, superficie: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setEditingArr(null)}>
                        Annuler
                      </Button>
                      <Button onClick={handleUpdateArrondissement} className="bg-red-600 hover:bg-red-700">
                        <Save className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-6">
                {departements.map((dept) => (
                  <Card key={dept.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {dept.nom}
                        <Badge variant="outline">{dept.code}</Badge>
                        <Badge className="bg-blue-100 text-blue-800 ml-auto">
                          {dept.arrondissements.length} arrondissement(s)
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dept.arrondissements.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Population</TableHead>
                                <TableHead>Superficie</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dept.arrondissements.map((arr) => (
                                <TableRow key={arr.id}>
                                  <TableCell className="font-medium">{arr.nom}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{arr.code}</Badge>
                                  </TableCell>
                                  <TableCell>{arr.population?.toLocaleString() || "N/A"}</TableCell>
                                  <TableCell>
                                    {arr.superficie ? `${arr.superficie.toLocaleString()} km²` : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditArrondissement(arr, dept.id)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => handleDeleteArrondissement(dept.id, arr.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Aucun arrondissement dans ce département</p>
                          <Button
                            variant="outline"
                            className="mt-2 bg-transparent"
                            onClick={() => {
                              setNewArrondissement({ ...newArrondissement, departementId: dept.id })
                              setShowAddArr(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter le premier arrondissement
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Application Name and Red Cross Color Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
            <CardDescription>Configurez le nom de l'application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Nom de l'Application</Label>
              <Input id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} />
            </div>
            <Button onClick={handleSaveAppName}>Enregistrer le Nom</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Couleurs de la Croix-Rouge</CardTitle>
            <CardDescription>Définissez la couleur principale de la Croix-Rouge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="redCrossColor">Couleur Rouge (Hex)</Label>
              <Input
                id="redCrossColor"
                type="color"
                value={redColorHex}
                onChange={(e) => setRedColorHex(e.target.value)}
                className="h-10 w-full"
              />
              <Input
                type="text"
                value={redColorHex}
                onChange={(e) => setRedColorHex(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSaveRedColor}>Enregistrer la Couleur</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
