"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Building,
  FileText
} from "lucide-react"
import Link from "next/link"

interface Membre {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  profession: string
  dateNaissance: string
  sexe: string
  dateAdhesion: string
  statut: string
  numeroCarte: string
  notes: string
  departement: string
  departementId: number
  arrondissement: string
  arrondissementId: number
  age: number
}

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

export default function MembreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [membre, setMembre] = useState<Membre | null>(null)
  const [departements, setDepartements] = useState<Departement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [membreId, setMembreId] = useState<string>("")

  // Récupérer l'ID depuis les params (Next.js 15)
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setMembreId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Charger les données du membre et des départements
  useEffect(() => {
    if (!membreId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Charger le membre
        const membreResponse = await fetch(`/api/membres/${membreId}`)
        if (!membreResponse.ok) {
          throw new Error('Membre non trouvé')
        }
        const membreData = await membreResponse.json()
        setMembre(membreData)
        
        // Charger les départements
        const departementsResponse = await fetch('/api/departements')
        const departementsData = await departementsResponse.json()
        setDepartements(departementsData)
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        alert('Erreur lors du chargement du membre')
        router.push('/membres')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [membreId, router])

  const handleSave = async () => {
    if (!membre) return

    setSaving(true)
    try {
      const response = await fetch(`/api/membres/${membreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: membre.nom,
          prenom: membre.prenom,
          date_naissance: membre.dateNaissance,
          sexe: membre.sexe === 'M' ? 'homme' : 'femme',
          adresse: membre.adresse,
          telephone: membre.telephone,
          email: membre.email,
          profession: membre.profession,
          departement_id: membre.departementId,
          arrondissement_id: membre.arrondissementId,
          date_adhesion: membre.dateAdhesion,
          statut: membre.statut,
          numero_carte: membre.numeroCarte,
          notes: membre.notes
        })
      })

      if (response.ok) {
        alert('Membre mis à jour avec succès !')
        setEditing(false)
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour du membre')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/membres/${membreId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Membre supprimé avec succès !')
        router.push('/membres')
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du membre')
    } finally {
      setDeleting(false)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Actif":
        return "bg-green-100 text-green-800"
      case "Inactif":
        return "bg-gray-100 text-gray-800"
      case "Suspendu":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du membre...</p>
        </div>
      </div>
    )
  }

  if (!membre) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Membre non trouvé</h1>
          <Link href="/membres">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">
              {editing ? 'Modifier le membre' : `${membre.prenom} ${membre.nom}`}
            </h1>
            <p className="text-gray-600 mt-1">
              {editing ? 'Modifiez les informations du membre' : 'Détails du membre'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                {editing ? (
                  <Input
                    id="nom"
                    value={membre.nom}
                    onChange={(e) => setMembre({ ...membre, nom: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{membre.nom}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                {editing ? (
                  <Input
                    id="prenom"
                    value={membre.prenom}
                    onChange={(e) => setMembre({ ...membre, prenom: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{membre.prenom}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                {editing ? (
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={membre.dateNaissance}
                    onChange={(e) => setMembre({ ...membre, dateNaissance: e.target.value })}
                  />
                ) : (
                  <p className="text-sm">
                    {new Date(membre.dateNaissance).toLocaleDateString('fr-FR')}
                    {membre.age && ` (${membre.age} ans)`}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexe">Sexe</Label>
                {editing ? (
                  <Select 
                    value={membre.sexe} 
                    onValueChange={(value) => setMembre({ ...membre, sexe: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Homme</SelectItem>
                      <SelectItem value="F">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">{membre.sexe === 'M' ? 'Homme' : 'Femme'}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              {editing ? (
                <Input
                  id="profession"
                  value={membre.profession || ''}
                  onChange={(e) => setMembre({ ...membre, profession: e.target.value })}
                />
              ) : (
                <p className="text-sm">{membre.profession || 'Non renseigné'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              {editing ? (
                <Input
                  id="telephone"
                  value={membre.telephone}
                  onChange={(e) => setMembre({ ...membre, telephone: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium">{membre.telephone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {editing ? (
                <Input
                  id="email"
                  type="email"
                  value={membre.email || ''}
                  onChange={(e) => setMembre({ ...membre, email: e.target.value })}
                />
              ) : (
                <p className="text-sm">{membre.email || 'Non renseigné'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              {editing ? (
                <Textarea
                  id="adresse"
                  value={membre.adresse || ''}
                  onChange={(e) => setMembre({ ...membre, adresse: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm">{membre.adresse || 'Non renseigné'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Adhésion et statut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Adhésion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroCarte">Numéro de carte</Label>
              {editing ? (
                <Input
                  id="numeroCarte"
                  value={membre.numeroCarte}
                  onChange={(e) => setMembre({ ...membre, numeroCarte: e.target.value })}
                />
              ) : (
                <p className="text-sm font-mono">{membre.numeroCarte}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateAdhesion">Date d'adhésion</Label>
              {editing ? (
                <Input
                  id="dateAdhesion"
                  type="date"
                  value={membre.dateAdhesion}
                  onChange={(e) => setMembre({ ...membre, dateAdhesion: e.target.value })}
                />
              ) : (
                <p className="text-sm">
                  {new Date(membre.dateAdhesion).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              {editing ? (
                <Select 
                  value={membre.statut} 
                  onValueChange={(value) => setMembre({ ...membre, statut: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatutColor(membre.statut)}>
                  {membre.statut}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Localisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              {editing ? (
                <Select 
                  value={membre.departementId?.toString() || ''} 
                  onValueChange={(value) => {
                    const dept = departements.find(d => d.id.toString() === value)
                    setMembre({ 
                      ...membre, 
                      departementId: parseInt(value),
                      departement: dept?.nom || '',
                      arrondissementId: null,
                      arrondissement: ''
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departements.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium">{membre.departement || 'Non renseigné'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrondissement">Arrondissement</Label>
              {editing ? (
                <Select 
                  value={membre.arrondissementId?.toString() || ''} 
                  onValueChange={(value) => {
                    const dept = departements.find(d => d.id === membre.departementId)
                    const arr = dept?.arrondissements.find(a => a.id.toString() === value)
                    setMembre({ 
                      ...membre, 
                      arrondissementId: parseInt(value),
                      arrondissement: arr?.nom || ''
                    })
                  }}
                  disabled={!membre.departementId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un arrondissement" />
                  </SelectTrigger>
                  <SelectContent>
                    {membre.departementId && departements
                      .find(d => d.id === membre.departementId)
                      ?.arrondissements.map((arr) => (
                        <SelectItem key={arr.id} value={arr.id.toString()}>
                          {arr.nom}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{membre.arrondissement || 'Non renseigné'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <Textarea
              value={membre.notes || ''}
              onChange={(e) => setMembre({ ...membre, notes: e.target.value })}
              placeholder="Notes sur le membre..."
              rows={4}
            />
          ) : (
            <p className="text-sm">{membre.notes || 'Aucune note'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
