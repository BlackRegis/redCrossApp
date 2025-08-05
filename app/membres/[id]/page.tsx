"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"

interface MembreDetail {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  dateNaissance: string
  lieuNaissance: string
  profession: string
  departement: string
  arrondissement: string
  typeAdhesion: string
  statut: "Actif" | "Inactif" | "Suspendu"
  dateAdhesion: string
  numeroCarte: string
  photo?: string
  sexe: "M" | "F"
  situationMatrimoniale: string
  nombreEnfants: number
  niveauEtude: string
  competences: string[]
  langues: string[]
  estMembreBureau: boolean
  posteBureau?: string
  niveauBureau?: string
  dateNominationBureau?: string
  mandatFinBureau?: string
  formations: Formation[]
  activites: ActiviteParticipation[]
  distinctions: Distinction[]
  historique: HistoriqueStatut[]
}

interface Formation {
  id: string
  titre: string
  organisme: string
  dateDebut: string
  dateFin: string
  certificat: boolean
  domaine: string
}

interface ActiviteParticipation {
  id: string
  titre: string
  type: string
  date: string
  role: string
  statut: "Participé" | "Organisé" | "Animé"
}

interface Distinction {
  id: string
  titre: string
  description: string
  dateObtention: string
  niveau: "Local" | "National" | "International"
}

interface HistoriqueStatut {
  id: string
  ancienStatut: string
  nouveauStatut: string
  dateChangement: string
  motif: string
  auteur: string
}

// Sample members data (centralized as requested)
const membresData = [
  {
    id: "1",
    nom: "Mukendi",
    prenom: "Jean",
    email: "jean.mukendi@email.com",
    telephone: "+242 123 456 789",
    adresse: "Avenue Félix Éboué, Bacongo, Brazzaville",
    dateNaissance: "1985-03-20",
    lieuNaissance: "Brazzaville",
    profession: "Médecin",
    departement: "Brazzaville",
    arrondissement: "Bacongo",
    typeAdhesion: "Membre Actif",
    statut: "Actif",
    dateAdhesion: "2023-01-15",
    numeroCarte: "CRC-BZV-001",
    photo: "/placeholder.svg?height=200&width=200&text=Jean+M",
    sexe: "M",
    situationMatrimoniale: "Marié",
    nombreEnfants: 2,
    niveauEtude: "Doctorat en Médecine",
    competences: ["Premiers secours", "Chirurgie", "Formation", "Gestion d'équipe"],
    langues: ["Français", "Lingala", "Anglais"],
    estMembreBureau: true,
    posteBureau: "Président",
    niveauBureau: "National",
    dateNominationBureau: "2023-01-15",
    mandatFinBureau: "2027-01-15",
    formations: [
      {
        id: "1",
        titre: "Formation Premiers Secours Avancés",
        organisme: "Croix Rouge Internationale",
        dateDebut: "2022-06-01",
        dateFin: "2022-06-15",
        certificat: true,
        domaine: "Secours",
      },
      {
        id: "2",
        titre: "Gestion des Catastrophes",
        organisme: "FICR",
        dateDebut: "2022-09-10",
        dateFin: "2022-09-20",
        certificat: true,
        domaine: "Gestion",
      },
    ],
    activites: [
      {
        id: "1",
        titre: "Formation Premiers Secours",
        type: "Formation",
        date: "2024-01-15",
        role: "Formateur",
        statut: "Animé",
      },
      {
        id: "2",
        titre: "Campagne Don de Sang",
        type: "Don de sang",
        date: "2024-01-10",
        role: "Coordinateur",
        statut: "Organisé",
      },
    ],
    distinctions: [
      {
        id: "1",
        titre: "Médaille du Mérite Humanitaire",
        description: "Pour services exceptionnels rendus à la communauté",
        dateObtention: "2023-12-10",
        niveau: "National",
      },
    ],
    historique: [
      {
        id: "1",
        ancienStatut: "Volontaire",
        nouveauStatut: "Membre Actif",
        dateChangement: "2023-06-15",
        motif: "Promotion suite à engagement exceptionnel",
        auteur: "Marie Kabila",
      },
    ],
  },
  {
    id: "2",
    nom: "Kabila",
    prenom: "Marie",
    email: "marie.kabila@email.com",
    telephone: "+242 987 654 321",
    adresse: "Rue Monseigneur Augouard, Poto-Poto, Brazzaville",
    dateNaissance: "1990-07-15",
    lieuNaissance: "Brazzaville",
    profession: "Infirmière",
    departement: "Brazzaville",
    arrondissement: "Poto-Poto",
    typeAdhesion: "Volontaire",
    statut: "Actif",
    dateAdhesion: "2023-03-20",
    numeroCarte: "CRC-BZV-002",
    photo: "/placeholder.svg?height=200&width=200&text=Marie+K",
    sexe: "F",
    situationMatrimoniale: "Célibataire",
    nombreEnfants: 0,
    niveauEtude: "Diplôme d'État en Soins Infirmiers",
    competences: ["Soins d'urgence", "Gestion de crise", "Sensibilisation", "Coordination"],
    langues: ["Français", "Lingala"],
    estMembreBureau: true,
    posteBureau: "Secrétaire Général",
    niveauBureau: "National",
    dateNominationBureau: "2023-03-20",
    mandatFinBureau: "2027-03-20",
    formations: [
      {
        id: "3",
        titre: "Formation en Soins d'Urgence",
        organisme: "Hôpital Général de Brazzaville",
        dateDebut: "2021-05-01",
        dateFin: "2021-05-15",
        certificat: true,
        domaine: "Soins",
      },
    ],
    activites: [
      {
        id: "3",
        titre: "Distribution de Kits d'Hygiène",
        type: "Secours",
        date: "2023-11-20",
        role: "Coordinatrice",
        statut: "Organisé",
      },
    ],
    distinctions: [],
    historique: [],
  },
  {
    id: "3",
    nom: "Dupont",
    prenom: "Alice",
    email: "alice.dupont@example.com",
    telephone: "+242 06 123 4567",
    adresse: "123 Rue de la Paix, Brazzaville",
    dateNaissance: "",
    lieuNaissance: "",
    profession: "",
    departement: "Brazzaville",
    arrondissement: "Makélékélé",
    typeAdhesion: "",
    statut: "Actif",
    dateAdhesion: "2020-01-15",
    numeroCarte: "",
    photo: "/placeholder.svg?height=100&width=100",
    sexe: "",
    situationMatrimoniale: "",
    nombreEnfants: 0,
    niveauEtude: "",
    competences: [],
    langues: [],
    estMembreBureau: false,
    posteBureau: "",
    niveauBureau: "",
    dateNominationBureau: "",
    mandatFinBureau: "",
    formations: [],
    activites: [],
    distinctions: [],
    historique: [],
  },
  {
    id: "4",
    nom: "Martin",
    prenom: "Bob",
    email: "bob.martin@example.com",
    telephone: "+242 05 987 6543",
    adresse: "456 Avenue de l'Indépendance, Pointe-Noire",
    dateNaissance: "",
    lieuNaissance: "",
    profession: "",
    departement: "Pointe-Noire",
    arrondissement: "Tié-Tié",
    typeAdhesion: "",
    statut: "Actif",
    dateAdhesion: "2018-07-22",
    numeroCarte: "",
    photo: "/placeholder.svg?height=100&width=100",
    sexe: "",
    situationMatrimoniale: "",
    nombreEnfants: 0,
    niveauEtude: "",
    competences: [],
    langues: [],
    estMembreBureau: false,
    posteBureau: "",
    niveauBureau: "",
    dateNominationBureau: "",
    mandatFinBureau: "",
    formations: [],
    activites: [],
    distinctions: [],
    historique: [],
  },
  {
    id: "5",
    nom: "Dubois",
    prenom: "Claire",
    email: "claire.dubois@example.com",
    telephone: "+242 04 111 2233",
    adresse: "789 Boulevard des Martyrs, Dolisie",
    dateNaissance: "",
    lieuNaissance: "",
    profession: "",
    departement: "Niari",
    arrondissement: "Dolisie",
    typeAdhesion: "",
    statut: "Inactif",
    dateAdhesion: "2021-11-01",
    numeroCarte: "",
    photo: "/placeholder.svg?height=100&width=100",
    sexe: "",
    situationMatrimoniale: "",
    nombreEnfants: 0,
    niveauEtude: "",
    competences: [],
    langues: [],
    estMembreBureau: false,
    posteBureau: "",
    niveauBureau: "",
    dateNominationBureau: "",
    mandatFinBureau: "",
    formations: [],
    activites: [],
    distinctions: [],
    historique: [],
  },
]

export default function MembreDetailPage() {
  const params = useParams()
  const memberId = params.id as string
  const [membre, setMembre] = useState<MembreDetail | null>(null)
  const [activeTab, setActiveTab] = useState("profil")

  useEffect(() => {
    // Simulation de récupération des données
    const membreData = membresData.find((m) => m.id === memberId) || null
    setMembre(membreData)
  }, [memberId])

  if (!membre) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Membre non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Le membre avec l'ID {memberId} n'existe pas.</p>
          </CardContent>
        </Card>
      </div>
    )
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

  const getActiviteStatutColor = (statut: string) => {
    switch (statut) {
      case "Participé":
        return "bg-blue-100 text-blue-800"
      case "Organisé":
        return "bg-green-100 text-green-800"
      case "Animé":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAge = (dateNaissance: string) => {
    const today = new Date()
    const birthDate = new Date(dateNaissance)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={membre.photo || "/placeholder.svg"} alt={membre.prenom + " " + membre.nom} />
            <AvatarFallback>{membre.prenom.charAt(0) + membre.nom.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">
            {membre.prenom} {membre.nom}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{membre.typeAdhesion}</p>
          <Badge variant={membre.statut === "Actif" ? "default" : "secondary"} className="mt-2">
            {membre.statut}
          </Badge>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-muted-foreground">{membre.email}</p>
            </div>
            <div>
              <p className="font-medium">Téléphone:</p>
              <p className="text-muted-foreground">{membre.telephone}</p>
            </div>
            <div>
              <p className="font-medium">Adresse:</p>
              <p className="text-muted-foreground">{membre.adresse}</p>
            </div>
            <div>
              <p className="font-medium">Département:</p>
              <p className="text-muted-foreground">{membre.departement}</p>
            </div>
            <div>
              <p className="font-medium">Arrondissement:</p>
              <p className="text-muted-foreground">{membre.arrondissement}</p>
            </div>
            <div>
              <p className="font-medium">Date d'adhésion:</p>
              <p className="text-muted-foreground">{membre.dateAdhesion}</p>
            </div>
            <div>
              <p className="font-medium">Dernière activité:</p>
              <p className="text-muted-foreground">{membre.lastActivity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
