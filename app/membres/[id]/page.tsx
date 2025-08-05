"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Mail, Phone, MapPin, Calendar, Briefcase, HeartPulse } from "lucide-react"

// Sample member data (centralized as requested)
const membersData = [
  {
    id: "1",
    nom: "Doe",
    prenom: "John",
    dateNaissance: "1990-05-15",
    lieuNaissance: "Brazzaville",
    nationalite: "Congolaise",
    adresse: "123 Rue de la Paix, Moungali",
    telephone: "+242 06 123 4567",
    email: "john.doe@example.com",
    profession: "Ingénieur",
    groupeSanguin: "A+",
    allergies: "Aucune",
    antecedentsMedicaux: "Aucun",
    personneContactUrgenceNom: "Jane Doe",
    personneContactUrgenceTelephone: "+242 05 765 4321",
    dateAdhesion: "2020-01-10",
    typeMembre: "Actif",
    departement: "Brazzaville",
    arrondissement: "Moungali",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=100&width=100&text=JD",
  },
  {
    id: "2",
    nom: "Smith",
    prenom: "Alice",
    dateNaissance: "1988-11-22",
    lieuNaissance: "Pointe-Noire",
    nationalite: "Congolaise",
    adresse: "456 Avenue des Martyrs, Lumumba",
    telephone: "+242 05 987 6543",
    email: "alice.smith@example.com",
    profession: "Médecin",
    groupeSanguin: "O-",
    allergies: "Pénicilline",
    antecedentsMedicaux: "Asthme",
    personneContactUrgenceNom: "Bob Smith",
    personneContactUrgenceTelephone: "+242 06 111 2233",
    dateAdhesion: "2019-03-01",
    typeMembre: "Bénévole",
    departement: "Pointe-Noire",
    arrondissement: "Lumumba",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=100&width=100&text=AS",
  },
  {
    id: "3",
    nom: "Brown",
    prenom: "Robert",
    dateNaissance: "1995-07-01",
    lieuNaissance: "Dolisie",
    nationalite: "Congolaise",
    adresse: "789 Rue du Marché, Tié-Tié",
    telephone: "+242 06 222 3344",
    email: "robert.brown@example.com",
    profession: "Étudiant",
    groupeSanguin: "B+",
    allergies: "Aucune",
    antecedentsMedicaux: "Aucun",
    personneContactUrgenceNom: "Sarah Brown",
    personneContactUrgenceTelephone: "+242 05 444 5566",
    dateAdhesion: "2021-09-15",
    typeMembre: "Donateur",
    departement: "Pointe-Noire",
    arrondissement: "Tié-Tié",
    statut: "Actif",
    imageUrl: "/placeholder.svg?height=100&width=100&text=RB",
  },
]

export default function MembreDetailPage() {
  const params = useParams()
  const { id } = params

  const member = membersData.find((m) => m.id === id)

  if (!member) {
    return <div className="container mx-auto p-4 text-center text-red-500">Membre non trouvé.</div>
  }

  const handleEdit = () => {
    console.log("Modifier le membre:", member.id)
    // Implement navigation to edit page or open a modal
  }

  const handleDelete = () => {
    console.log("Supprimer le membre:", member.id)
    // Implement deletion logic, e.g., API call
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      // Logic to remove from state or refetch data
      alert(`Membre ${member.id} supprimé (simulation)`)
      // Redirect to members list after deletion
      // router.push('/membres');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails du Membre</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={member.imageUrl || "/placeholder.svg"} alt={member.nom} />
            <AvatarFallback>{member.prenom.charAt(0) + member.nom.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {member.prenom} {member.nom}
            </h2>
            <p className="text-muted-foreground">
              {member.typeMembre} - {member.statut}
            </p>
            <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {member.adresse}, {member.arrondissement}, {member.departement}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{member.telephone}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Né(e) le {member.dateNaissance} à {member.lieuNaissance}
              </span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Profession: {member.profession}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations d'Adhésion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Date d'Adhésion:</strong> {member.dateAdhesion}
            </p>
            <p>
              <strong>Type de Membre:</strong> {member.typeMembre}
            </p>
            <p>
              <strong>Département:</strong> {member.departement}
            </p>
            <p>
              <strong>Arrondissement:</strong> {member.arrondissement}
            </p>
            <p>
              <strong>Statut:</strong> {member.statut}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations Médicales & Urgence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <HeartPulse className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Groupe Sanguin: {member.groupeSanguin}</span>
            </div>
            <p>
              <strong>Allergies:</strong> {member.allergies || "Aucune"}
            </p>
            <p>
              <strong>Antécédents Médicaux:</strong> {member.antecedentsMedicaux || "Aucun"}
            </p>
            <p>
              <strong>Contact Urgence:</strong> {member.personneContactUrgenceNom} (
              {member.personneContactUrgenceTelephone})
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
