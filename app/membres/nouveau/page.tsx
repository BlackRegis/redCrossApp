"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, UserPlus } from "lucide-react"
import Link from "next/link"

interface Departement {
  id: number
  nom: string
  code: string
  arrondissements: Array<{
    id: number
    nom: string
    code: string
  }>
}

export default function NouveauMembrePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [departements, setDepartements] = useState<Departement[]>([])
  const [selectedDepartement, setSelectedDepartement] = useState<string>("")
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    sexe: "",
    adresse: "",
    telephone: "",
    email: "",
    telephone: "",
    dateNaissance: undefined as Date | undefined,
    sexe: "",
    profession: "",
    date_adhesion: new Date().toISOString().split('T')[0],
    statut: "Actif",
    numero_carte: "",
    notes: ""
  })

  // Charger les départements
  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await fetch('/api/departements')
        const data = await response.json()
        setDepartements(data)
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error)
      }
    }

    fetchDepartements()
  }, [])

  // Générer un numéro de carte automatiquement
  useEffect(() => {
    if (!formData.numero_carte) {
      const timestamp = Date.now().toString().slice(-6)
      setFormData(prev => ({
        ...prev,
        numero_carte: `CRC-${timestamp}-${new Date().getFullYear()}`
      }))
    }
  }, [formData.numero_carte])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Trouver l'ID du département sélectionné
      const departement = departements.find(d => d.nom === selectedDepartement)
      const departement_id = departement?.id || null

      const response = await fetch('/api/membres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          departement_id,
          arrondissement_id: null // Pour l'instant, on ne gère pas les arrondissements
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert('Membre créé avec succès !')
        router.push('/membres')
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      alert('Erreur lors de la création du membre')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/membres">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau Membre</h1>
            <p className="text-gray-600 mt-1">Ajouter un nouveau membre à la Croix Rouge</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Informations du Membre
          </CardTitle>
          <CardDescription>
            Remplissez les informations du nouveau membre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_naissance">Date de naissance *</Label>
                <Input
                  id="date_naissance"
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) => handleInputChange('date_naissance', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexe">Sexe *</Label>
                <Select value={formData.sexe} onValueChange={(value) => handleInputChange('sexe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+242 06 123 4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                placeholder="Adresse complète"
                rows={3}
              />
            </div>

            {/* Profession et département */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  placeholder="Médecin, Infirmier, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departement">Département</Label>
                <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departements.map((dept) => (
                      <SelectItem key={dept.id} value={dept.nom}>
                        {dept.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Adhésion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_adhesion">Date d'adhésion</Label>
                <Input
                  id="date_adhesion"
                  type="date"
                  value={formData.date_adhesion}
                  onChange={(e) => handleInputChange('date_adhesion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select value={formData.statut} onValueChange={(value) => handleInputChange('statut', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_carte">Numéro de carte</Label>
                <Input
                  id="numero_carte"
                  value={formData.numero_carte}
                  onChange={(e) => handleInputChange('numero_carte', e.target.value)}
                  placeholder="Généré automatiquement"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Informations supplémentaires..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/membres">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le membre
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
