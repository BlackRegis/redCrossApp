"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Crown, 
  User, 
  Briefcase, 
  Phone, 
  Mail,
  Building2,
  MapPin,
  Users,
  Loader2,
  Search,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Membre {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  departement?: string
  arrondissement?: string
}

interface BureauMembre {
  id: string
  membre_id: string
  membre: Membre
  poste: "Président" | "Vice-Président" | "Secrétaire Général" | "Secrétaire Adjoint" | "Trésorier" | "Trésorier Adjoint" | "Commissaire aux Comptes" | "Membre"
  dateNomination: string
  mandatFin: string
}

interface BureauExecutif {
  id: string
  nom: string
  type: "nation" | "departement" | "arrondissement"
  niveau: string
  description?: string
  membres: BureauMembre[]
}

const POSTES_OPTIONS = [
  "Président",
  "Vice-Président", 
  "Secrétaire Général",
  "Secrétaire Adjoint",
  "Trésorier",
  "Trésorier Adjoint",
  "Commissaire aux Comptes",
  "Membre"
]

export default function ModifierBureauPage() {
  const router = useRouter()
  const params = useParams()
  const bureauId = params.id as string

  const [bureau, setBureau] = useState<BureauExecutif | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [membres, setMembres] = useState<BureauMembre[]>([])
  const [tousMembres, setTousMembres] = useState<Membre[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showMembreSelector, setShowMembreSelector] = useState(false)
  const [selectedPoste, setSelectedPoste] = useState<string>("")

  // Charger les données du bureau et tous les membres
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Charger le bureau
        const bureauResponse = await fetch(`/api/bureaux/${bureauId}`)
        if (bureauResponse.ok) {
          const bureauData = await bureauResponse.json()
          setBureau(bureauData)
          setMembres(bureauData.membres || [])
        } else {
          console.error('Bureau non trouvé')
          router.push('/bureau-executif')
          return
        }

        // Charger tous les membres disponibles
        const membresResponse = await fetch('/api/membres')
        if (membresResponse.ok) {
          const membresData = await membresResponse.json()
          setTousMembres(membresData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        router.push('/bureau-executif')
      } finally {
        setLoading(false)
      }
    }

    if (bureauId) {
      fetchData()
    }
  }, [bureauId, router])

  const handleSave = async () => {
    if (!bureau) return

    try {
      setSaving(true)
      const response = await fetch(`/api/bureaux/${bureauId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bureau,
          membres
        })
      })

      if (response.ok) {
        router.push('/bureau-executif')
      } else {
        console.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setSaving(false)
    }
  }

  const addMembre = (membre: Membre) => {
    const nouveauMembre: BureauMembre = {
      id: `temp-${Date.now()}`,
      membre_id: membre.id,
      membre: membre,
      poste: selectedPoste as any,
      dateNomination: new Date().toISOString().split('T')[0],
      mandatFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    setMembres([...membres, nouveauMembre])
    setShowMembreSelector(false)
    setSearchTerm("")
    setSelectedPoste("")
  }

  const removeMembre = (index: number) => {
    setMembres(membres.filter((_, i) => i !== index))
  }

  const updateMembre = (index: number, field: keyof BureauMembre, value: string) => {
    const updatedMembres = [...membres]
    updatedMembres[index] = { ...updatedMembres[index], [field]: value }
    setMembres(updatedMembres)
  }

  const getPosteIcon = (poste: string) => {
    switch (poste) {
      case "Président":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "Secrétaire Général":
        return <User className="h-4 w-4 text-blue-600" />
      case "Trésorier":
        return <Briefcase className="h-4 w-4 text-green-600" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getPosteColor = (poste: string) => {
    switch (poste) {
      case "Président":
        return "bg-yellow-100 text-yellow-800"
      case "Vice-Président":
        return "bg-orange-100 text-orange-800"
      case "Secrétaire Général":
        return "bg-blue-100 text-blue-800"
      case "Secrétaire Adjoint":
        return "bg-indigo-100 text-indigo-800"
      case "Trésorier":
        return "bg-green-100 text-green-800"
      case "Trésorier Adjoint":
        return "bg-emerald-100 text-emerald-800"
      case "Commissaire aux Comptes":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtenir les postes occupés
  const postesOccupes = membres.map(m => m.poste)

  // Obtenir les postes disponibles
  const postesDisponibles = POSTES_OPTIONS.filter(poste => !postesOccupes.includes(poste as any))

  // Filtrer les membres disponibles (pas encore assignés)
  const membresDisponibles = tousMembres.filter(membre => 
    !membres.some(bm => bm.membre_id === membre.id) &&
    (membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
     membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
     membre.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddMembre = () => {
    if (postesDisponibles.length === 0) {
      return
    }
    setSelectedPoste(postesDisponibles[0])
    setShowMembreSelector(true)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement du bureau...</p>
        </div>
      </div>
    )
  }

  if (!bureau) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Bureau non trouvé</p>
          <Link href="/bureau-executif">
            <Button className="mt-4">Retour aux bureaux</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/bureau-executif">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier le Bureau</h1>
            <p className="text-gray-600 mt-1">
              {bureau.type === "nation" && <Building2 className="inline h-4 w-4 text-blue-600 mr-2" />}
              {bureau.type === "departement" && <MapPin className="inline h-4 w-4 text-green-600 mr-2" />}
              {bureau.type === "arrondissement" && <Users className="inline h-4 w-4 text-orange-600 mr-2" />}
              {bureau.nom} - {bureau.niveau}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations du bureau */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du Bureau</CardTitle>
            <CardDescription>Modifiez les informations générales du bureau</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du Bureau</Label>
              <Input
                id="nom"
                value={bureau.nom}
                onChange={(e) => setBureau({ ...bureau, nom: e.target.value })}
                placeholder="Nom du bureau"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niveau">Niveau</Label>
              <Input
                id="niveau"
                value={bureau.niveau}
                onChange={(e) => setBureau({ ...bureau, niveau: e.target.value })}
                placeholder="Niveau du bureau"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bureau.description || ''}
                onChange={(e) => setBureau({ ...bureau, description: e.target.value })}
                placeholder="Description du bureau"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Membres du bureau */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Membres du Bureau</CardTitle>
                <CardDescription>
                  {postesDisponibles.length > 0 
                    ? `${postesDisponibles.length} poste(s) disponible(s)` 
                    : "Tous les postes sont occupés"
                  }
                </CardDescription>
              </div>
              {postesDisponibles.length > 0 && (
                <Button 
                  onClick={handleAddMembre}
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un membre
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sélecteur de membres */}
            {showMembreSelector && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <Label>Poste à assigner</Label>
                  <Select
                    value={selectedPoste}
                    onValueChange={setSelectedPoste}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      {postesDisponibles.map((poste) => (
                        <SelectItem key={poste} value={poste}>
                          <div className="flex items-center space-x-2">
                            {getPosteIcon(poste)}
                            <span>{poste}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPoste && (
                  <>
                    <div className="space-y-2">
                      <Label>Rechercher un membre</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Rechercher par nom, prénom ou email..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {membresDisponibles.length > 0 ? (
                        membresDisponibles.map((membre) => (
                          <div
                            key={membre.id}
                            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                            onClick={() => addMembre(membre)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {membre.prenom.charAt(0)}{membre.nom.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {membre.prenom} {membre.nom}
                                </div>
                                <div className="text-sm text-gray-500">{membre.email}</div>
                              </div>
                            </div>
                            <Badge className={getPosteColor(selectedPoste)} variant="secondary">
                              {getPosteIcon(selectedPoste)}
                              <span className="ml-1">{selectedPoste}</span>
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          {searchTerm ? 'Aucun membre trouvé' : 'Aucun membre disponible'}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Membres assignés */}
            {membres.map((membre, index) => (
              <div key={membre.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {membre.membre.prenom.charAt(0)}{membre.membre.nom.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {membre.membre.prenom} {membre.membre.nom}
                      </div>
                      <div className="text-sm text-gray-500">{membre.membre.email}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeMembre(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Poste</Label>
                    <Select
                      value={membre.poste}
                      onValueChange={(value) => updateMembre(index, 'poste', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POSTES_OPTIONS.map((poste) => (
                          <SelectItem key={poste} value={poste}>
                            <div className="flex items-center space-x-2">
                              {getPosteIcon(poste)}
                              <span>{poste}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Date de nomination</Label>
                      <Input
                        value={membre.dateNomination}
                        onChange={(e) => updateMembre(index, 'dateNomination', e.target.value)}
                        type="date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fin de mandat</Label>
                      <Input
                        value={membre.mandatFin}
                        onChange={(e) => updateMembre(index, 'mandatFin', e.target.value)}
                        type="date"
                      />
                    </div>
                  </div>

                  <Badge className={getPosteColor(membre.poste)} variant="secondary">
                    {getPosteIcon(membre.poste)}
                    <span className="ml-1">{membre.poste}</span>
                  </Badge>
                </div>
              </div>
            ))}

            {membres.length === 0 && !showMembreSelector && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun membre assigné</p>
                {postesDisponibles.length > 0 && (
                  <Button 
                    onClick={handleAddMembre}
                    variant="outline" 
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier membre
                  </Button>
                )}
              </div>
            )}

            {postesDisponibles.length === 0 && membres.length > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Tous les postes sont occupés
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 