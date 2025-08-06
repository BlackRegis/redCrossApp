"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, Briefcase, Heart, BadgeIcon as IdCard, User, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from "next/link"

interface Membre {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  departement: string
  arrondissement: string
  statut: "Actif" | "Inactif" | "Suspendu"
  dateAdhesion: string
  dateNaissance: string
  age: number
  profession: string
  typeAdhesion: string
  numeroCarte: string
  sexe: "M" | "F"
  adresse: string
  imageUrl?: string
}

const membresData: Membre[] = [
  {
    id: "1",
    nom: "Mukendi",
    prenom: "Jean",
    email: "jean.mukendi@email.com",
    telephone: "+242 123 456 789",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    statut: "Actif",
    dateAdhesion: "2023-01-15",
    dateNaissance: "1985-03-20",
    age: 39,
    profession: "Médecin",
    typeAdhesion: "Membre Actif",
    numeroCarte: "CRC-BZV-001",
    sexe: "M",
    adresse: "Avenue Félix Éboué, Bacongo",
    imageUrl: "/placeholder.svg?height=100&width=100&text=JM",
  },
  {
    id: "2",
    nom: "Kabila",
    prenom: "Marie",
    email: "marie.kabila@email.com",
    telephone: "+242 987 654 321",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    statut: "Actif",
    dateAdhesion: "2023-03-20",
    dateNaissance: "1990-07-15",
    age: 34,
    profession: "Infirmière",
    typeAdhesion: "Volontaire",
    numeroCarte: "CRC-BZV-002",
    sexe: "F",
    adresse: "Rue Monseigneur Augouard, Poto-Poto",
    imageUrl: "/placeholder.svg?height=100&width=100&text=MK",
  },
  {
    id: "3",
    nom: "Kouadio",
    prenom: "Marc",
    email: "marc.kouadio@example.com",
    telephone: "+242 06 111 2233",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    statut: "Actif",
    dateAdhesion: "2023-02-01",
    dateNaissance: "1992-11-10",
    age: 32,
    profession: "Enseignant",
    typeAdhesion: "Membre Actif",
    numeroCarte: "CRC-BZV-003",
    sexe: "M",
    adresse: "Rue de la Paix, Moungali",
    imageUrl: "/placeholder.svg?height=100&width=100&text=MK",
  },
  {
    id: "4",
    nom: "Diallo",
    prenom: "Fatoumata",
    email: "fatoumata.diallo@example.com",
    telephone: "+242 05 444 5566",
    departement: "Pointe-Noire",
    arrondissement: "Lumumba",
    statut: "Actif",
    dateAdhesion: "2023-04-25",
    dateNaissance: "1988-09-05",
    age: 36,
    profession: "Ingénieur",
    typeAdhesion: "Volontaire",
    numeroCarte: "CRC-PNR-001",
    sexe: "F",
    adresse: "Avenue Marien Ngouabi, Lumumba",
    imageUrl: "/placeholder.svg?height=100&width=100&text=FD",
  },
  {
    id: "5",
    nom: "Nzouzi",
    prenom: "Christian",
    email: "christian.nzouzi@example.com",
    telephone: "+242 04 777 8899",
    departement: "Niari",
    arrondissement: "Dolisie",
    statut: "Inactif",
    dateAdhesion: "2022-10-01",
    dateNaissance: "1975-01-30",
    age: 49,
    profession: "Comptable",
    typeAdhesion: "Membre Bienfaiteur",
    numeroCarte: "CRC-NIA-001",
    sexe: "M",
    adresse: "Rue de l'Hôpital, Dolisie",
    imageUrl: "/placeholder.svg?height=100&width=100&text=CN",
  },
]

export default function MembreDetailPage() {
  const params = useParams()
  const { id } = params
  const [membre, setMembre] = useState<Membre | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // Simulate fetching data
      const foundMembre = membresData.find((m) => m.id === id)
      setMembre(foundMembre || null)
      setLoading(false)
    }
  }, [id])

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
    return <div className="p-6 text-center">Chargement des détails du membre...</div>
  }

  if (!membre) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Membre non trouvé</h1>
        <Link href="/membres">
          <Button variant="outline">Retour à la liste des membres</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/membres">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={membre.imageUrl || "/placeholder.svg"} alt={`${membre.prenom} ${membre.nom}`} />
            <AvatarFallback>{membre.prenom.charAt(0) + membre.nom.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">
              {membre.prenom} {membre.nom}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {membre.profession}
            </CardDescription>
            <Badge className={getStatutColor(membre.statut)}>{membre.statut}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-red-600">Coordonnées</h3>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{membre.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{membre.telephone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <span>{membre.adresse}, {membre.arrondissement}, {membre.departement}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-red-600">Informations Personnelles</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Né(e) le {new Date(membre.dateNaissance).toLocaleDateString("fr-FR")} ({membre.age} ans)</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>Sexe: {membre.sexe === "M" ? "Masculin" : "Féminin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span>Profession: {membre.profession}</span>
            </div>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h3 className="text-xl font-semibold text-red-600">Détails d'Adhésion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <span>Type d'Adhésion: {membre.typeAdhesion}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Date d'Adhésion: {new Date(membre.dateAdhesion).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex items-center gap-2">
                <IdCard className="h-5 w-5 text-muted-foreground" />
                <span>Numéro de Carte: {membre.numeroCarte}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional sections like activities, donations, etc. can be added here */}
      <Card>
        <CardHeader>
          <CardTitle>Activités du Membre</CardTitle>
          <CardDescription>Liste des activités auxquelles ce membre a participé.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune activité enregistrée pour ce membre pour le moment.</p>
          {/* Table or list of activities */}
        </CardContent>
      </Card>
    </div>
  )
}
