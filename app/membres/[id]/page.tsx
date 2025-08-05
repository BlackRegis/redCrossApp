"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

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
  notes?: string
  imageUrl?: string
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

// Sample member data
const members = [
  {
    id: "1",
    nom: "Kouadio",
    prenom: "Marc",
    dateNaissance: "1990-05-15",
    sexe: "Homme",
    adresse: "123 Rue de la Paix, Brazzaville",
    telephone: "+242 06 111 2233",
    email: "marc.kouadio@example.com",
    profession: "Ingénieur",
    departement: "Brazzaville",
    arrondissement: "Makélékélé",
    dateAdhesion: "2020-01-10",
    statut: "Actif",
    notes: "Membre très engagé dans les activités de sensibilisation.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=MK",
  },
  {
    id: "2",
    nom: "Diallo",
    prenom: "Fatoumata",
    dateNaissance: "1988-11-22",
    sexe: "Femme",
    adresse: "456 Avenue de l'Espoir, Pointe-Noire",
    telephone: "+242 05 444 5566",
    email: "fatoumata.diallo@example.com",
    profession: "Infirmière",
    departement: "Pointe-Noire",
    arrondissement: "Lumumba",
    dateAdhesion: "2019-03-20",
    statut: "Actif",
    notes: "Spécialisée en premiers secours, formatrice bénévole.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=FD",
  },
  {
    id: "3",
    nom: "Nzouzi",
    prenom: "Christian",
    dateNaissance: "1995-02-28",
    sexe: "Homme",
    adresse: "789 Boulevard de la Liberté, Dolisie",
    telephone: "+242 04 777 8899",
    email: "christian.nzouzi@example.com",
    profession: "Étudiant",
    departement: "Niari",
    arrondissement: "Dolisie Centre",
    dateAdhesion: "2022-09-01",
    statut: "Inactif",
    notes: "En pause pour études, souhaite reprendre les activités l'année prochaine.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=CN",
  },
]

export default function MembreDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const member = members.find((m) => m.id === id)

  if (!member) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Membre non trouvé</h1>
        <p>Le membre avec l'ID {id} n'existe pas.</p>
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
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-center text-center pb-4">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={member.imageUrl || "/placeholder.svg"} alt={`${member.prenom} ${member.nom}`} />
            <AvatarFallback>
              {member.prenom.charAt(0)}
              {member.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">
            {member.prenom} {member.nom}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Membre de la Croix Rouge Congolaise
          </CardDescription>
          <Badge variant={member.statut === "Actif" ? "default" : "outline"} className="mt-2">
            {member.statut}
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-md">Informations Personnelles</h3>
            <Separator />
            <p>
              <strong>Date de Naissance:</strong> {member.dateNaissance} ({calculateAge(member.dateNaissance)} ans)
            </p>
            <p>
              <strong>Sexe:</strong> {member.sexe}
            </p>
            <p>
              <strong>Profession:</strong> {member.profession}
            </p>
            <p>
              <strong>Adresse:</strong> {member.adresse}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-md">Coordonnées</h3>
            <Separator />
            <p>
              <strong>Téléphone:</strong> {member.telephone}
            </p>
            <p>
              <strong>Email:</strong> {member.email}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-md">Informations d'Adhésion</h3>
            <Separator />
            <p>
              <strong>Date d'Adhésion:</strong> {member.dateAdhesion}
            </p>
            <p>
              <strong>Département:</strong> {member.departement}
            </p>
            <p>
              <strong>Arrondissement:</strong> {member.arrondissement}
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <h3 className="font-semibold text-md">Notes</h3>
            <Separator />
            <p className="text-muted-foreground">{member.notes || "Aucune note."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
