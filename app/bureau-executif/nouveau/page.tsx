"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X, Save, ArrowLeft, Crown, User, Briefcase } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

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
  membre_id: string
  poste: string
  date_nomination: string
  date_fin_mandat: string
  notes?: string
}

interface Departement {
  id: string
  nom: string
  arrondissements: Array<{
    id: string
    nom: string
  }>
}

const postes = [
  "Président",
  "Vice-Président", 
  "Secrétaire Général",
  "Secrétaire Adjoint",
  "Trésorier",
  "Trésorier Adjoint",
  "Commissaire aux Comptes",
  "Membre"
]

export default function NouveauBureauPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [membres, setMembres] = useState<Membre[]>([])
  const [departements, setDepartements] = useState<Departement[]>([])
  const [selectedMembres, setSelectedMembres] = useState<BureauMembre[]>([])
  const [showMembreForm, setShowMembreForm] = useState(false)
  const [newMembre, setNewMembre] = useState<BureauMembre>({
    membre_id: "",
    poste: "",
    date_nomination: "",
    date_fin_mandat: "",
    notes: ""
  })

  // Form data
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    niveau: "",
    departement_id: "",
    arrondissement_id: "",
    description: ""
  })

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les membres
        const membresResponse = await fetch('/api/membres')
        const membresData = await membresResponse.json()
        setMembres(membresData)

        // Charger les départements
        const departementsResponse = await fetch('/api/departements')
        const departementsData = await departementsResponse.json()
        setDepartements(departementsData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        toast.error('Erreur lors du chargement des données')
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      niveau: type === 'nation' ? 'National' : type === 'departement' ? 'Départemental' : 'Arrondissement',
      departement_id: type === 'nation' ? '' : prev.departement_id,
      arrondissement_id: type === 'nation' || type === 'departement' ? '' : prev.arrondissement_id
    }))
  }

  const addMembre = () => {
    if (!newMembre.membre_id || !newMembre.poste || !newMembre.date_nomination || !newMembre.date_fin_mandat) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Vérifier si le poste est déjà occupé
    const posteOccupe = selectedMembres.find(m => m.poste === newMembre.poste)
    if (posteOccupe) {
      toast.error(`Le poste de ${newMembre.poste} est déjà occupé`)
      return
    }

    setSelectedMembres(prev => [...prev, newMembre])
    setNewMembre({
      membre_id: "",
      poste: "",
      date_nomination: "",
      date_fin_mandat: "",
      notes: ""
    })
    setShowMembreForm(false)
    toast.success('Membre ajouté au bureau')
  }

  const removeMembre = (index: number) => {
    setSelectedMembres(prev => prev.filter((_, i) => i !== index))
    toast.success('Membre retiré du bureau')
  }

  const getMembreInfo = (membreId: string) => {
    return membres.find(m => m.id === membreId)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nom || !formData.type || !formData.niveau) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (selectedMembres.length === 0) {
      toast.error('Veuillez ajouter au moins un membre au bureau')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bureaux', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          membres: selectedMembres
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Bureau exécutif créé avec succès')
        router.push('/bureau-executif')
      } else {
        toast.error(data.error || 'Erreur lors de la création du bureau')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la création du bureau')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Nouveau Bureau Exécutif</h1>
            <p className="text-gray-600 mt-1">Créer un nouveau bureau exécutif</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations du bureau */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du Bureau</CardTitle>
            <CardDescription>Définissez les informations générales du bureau exécutif</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du Bureau *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Ex: Bureau National"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de Bureau *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nation">National</SelectItem>
                    <SelectItem value="departement">Départemental</SelectItem>
                    <SelectItem value="arrondissement">Arrondissement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau *</Label>
                <Input
                  id="niveau"
                  value={formData.niveau}
                  onChange={(e) => handleInputChange('niveau', e.target.value)}
                  placeholder="Ex: National"
                  required
                />
              </div>

              {formData.type === 'departement' && (
                <div className="space-y-2">
                  <Label htmlFor="departement">Département *</Label>
                  <Select 
                    value={formData.departement_id} 
                    onValueChange={(value) => handleInputChange('departement_id', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le département" />
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
              )}

              {formData.type === 'arrondissement' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="departement">Département *</Label>
                    <Select 
                      value={formData.departement_id} 
                      onValueChange={(value) => {
                        handleInputChange('departement_id', value)
                        handleInputChange('arrondissement_id', '')
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le département" />
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
                    <Label htmlFor="arrondissement">Arrondissement *</Label>
                    <Select 
                      value={formData.arrondissement_id} 
                      onValueChange={(value) => handleInputChange('arrondissement_id', value)}
                      required
                      disabled={!formData.departement_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'arrondissement" />
                      </SelectTrigger>
                      <SelectContent>
                        {departements
                          .find(d => d.id === formData.departement_id)
                          ?.arrondissements.map((arr) => (
                            <SelectItem key={arr.id} value={arr.id}>
                              {arr.nom}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description du bureau exécutif..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Membres du bureau */}
        <Card>
          <CardHeader>
            <CardTitle>Membres du Bureau</CardTitle>
            <CardDescription>Ajoutez les membres qui composent ce bureau exécutif</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Liste des membres sélectionnés */}
            {selectedMembres.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Membres sélectionnés ({selectedMembres.length})</h4>
                {selectedMembres.map((membre, index) => {
                  const membreInfo = getMembreInfo(membre.membre_id)
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {membreInfo ? `${membreInfo.prenom.charAt(0)}${membreInfo.nom.charAt(0)}` : '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {membreInfo ? `${membreInfo.prenom} ${membreInfo.nom}` : 'Membre inconnu'}
                            </span>
                            <Badge className={getPosteColor(membre.poste)} variant="secondary">
                              {getPosteIcon(membre.poste)}
                              <span className="ml-1">{membre.poste}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {membreInfo?.email} • {membreInfo?.telephone}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mandat: {new Date(membre.date_nomination).toLocaleDateString('fr-FR')} - {new Date(membre.date_fin_mandat).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMembre(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Formulaire d'ajout de membre */}
            {showMembreForm ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="membre">Membre *</Label>
                      <Select 
                        value={newMembre.membre_id} 
                        onValueChange={(value) => setNewMembre(prev => ({ ...prev, membre_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un membre" />
                        </SelectTrigger>
                        <SelectContent>
                          {membres
                            .filter(m => !selectedMembres.find(sm => sm.membre_id === m.id))
                            .map((membre) => (
                              <SelectItem key={membre.id} value={membre.id}>
                                {membre.prenom} {membre.nom} - {membre.email}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poste">Poste *</Label>
                      <Select 
                        value={newMembre.poste} 
                        onValueChange={(value) => setNewMembre(prev => ({ ...prev, poste: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un poste" />
                        </SelectTrigger>
                        <SelectContent>
                          {postes
                            .filter(p => !selectedMembres.find(sm => sm.poste === p))
                            .map((poste) => (
                              <SelectItem key={poste} value={poste}>
                                {poste}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_nomination">Date de nomination *</Label>
                      <Input
                        type="date"
                        value={newMembre.date_nomination}
                        onChange={(e) => setNewMembre(prev => ({ ...prev, date_nomination: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_fin_mandat">Fin de mandat *</Label>
                      <Input
                        type="date"
                        value={newMembre.date_fin_mandat}
                        onChange={(e) => setNewMembre(prev => ({ ...prev, date_fin_mandat: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        value={newMembre.notes}
                        onChange={(e) => setNewMembre(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Notes sur ce membre..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button type="button" onClick={addMembre}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter le membre
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowMembreForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowMembreForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un membre
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/bureau-executif">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Création...' : 'Créer le Bureau'}
          </Button>
        </div>
      </form>
    </div>
  )
} 