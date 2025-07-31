"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  CreditCard,
  Activity,
  Crown,
  Award,
  Clock,
  Users,
  FileText,
} from "lucide-react"
import Link from "next/link"
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

export default function MembreDetailPage() {
  const params = useParams()
  const [membre, setMembre] = useState<MembreDetail | null>(null)
  const [activeTab, setActiveTab] = useState("profil")

  useEffect(() => {
    // Simulation de récupération des données
    const membreData: MembreDetail = {
      id: params.id as string,
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
    }

    setMembre(membreData)
  }, [params.id])

  if (!membre) {
    return <div>Chargement...</div>
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/membres">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={membre.photo || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {membre.prenom.charAt(0)}
                {membre.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {membre.prenom} {membre.nom}
                {membre.estMembreBureau && <Crown className="h-6 w-6 text-yellow-600" />}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatutColor(membre.statut)}>{membre.statut}</Badge>
                <Badge variant="outline">{membre.typeAdhesion}</Badge>
                <Badge variant="outline">{membre.numeroCarte}</Badge>
              </div>
              <p className="text-gray-600 mt-1">{membre.profession}</p>
            </div>
          </div>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ancienneté</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(
                (new Date().getTime() - new Date(membre.dateAdhesion).getTime()) / (1000 * 60 * 60 * 24 * 365),
              )}{" "}
              ans
            </div>
            <p className="text-xs text-muted-foreground">
              Depuis {new Date(membre.dateAdhesion).toLocaleDateString("fr-FR")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formations</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{membre.formations.length}</div>
            <p className="text-xs text-muted-foreground">Certifications obtenues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{membre.activites.length}</div>
            <p className="text-xs text-muted-foreground">Participations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distinctions</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{membre.distinctions.length}</div>
            <p className="text-xs text-muted-foreground">Récompenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Détaillé</CardTitle>
          <CardDescription>Informations complètes du membre/volontaire</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profil">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="formations">
                <Award className="h-4 w-4 mr-2" />
                Formations
              </TabsTrigger>
              <TabsTrigger value="activites">
                <Activity className="h-4 w-4 mr-2" />
                Activités
              </TabsTrigger>
              <TabsTrigger value="bureau">
                <Crown className="h-4 w-4 mr-2" />
                Bureau
              </TabsTrigger>
              <TabsTrigger value="distinctions">
                <Award className="h-4 w-4 mr-2" />
                Distinctions
              </TabsTrigger>
              <TabsTrigger value="historique">
                <FileText className="h-4 w-4 mr-2" />
                Historique
              </TabsTrigger>
            </TabsList>

            {/* Onglet Profil */}
            <TabsContent value="profil" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informations Personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                        <p className="font-medium">
                          {membre.prenom} {membre.nom}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Sexe</label>
                        <p className="font-medium">{membre.sexe === "M" ? "Masculin" : "Féminin"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date de naissance</label>
                        <p className="font-medium">
                          {new Date(membre.dateNaissance).toLocaleDateString("fr-FR")} (
                          {calculateAge(membre.dateNaissance)} ans)
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Lieu de naissance</label>
                        <p className="font-medium">{membre.lieuNaissance}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Situation matrimoniale</label>
                        <p className="font-medium">{membre.situationMatrimoniale}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nombre d'enfants</label>
                        <p className="font-medium">{membre.nombreEnfants}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Niveau d'étude</label>
                      <p className="font-medium">{membre.niveauEtude}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Profession</label>
                      <p className="font-medium">{membre.profession}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Contact & Localisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{membre.email}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{membre.telephone}</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p>{membre.adresse}</p>
                        <p className="text-sm text-muted-foreground">
                          {membre.arrondissement}, {membre.departement}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Carte de membre</span>
                      </div>
                      <p className="font-mono text-sm">{membre.numeroCarte}</p>
                      <p className="text-sm text-muted-foreground">
                        Adhésion: {new Date(membre.dateAdhesion).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Compétences & Langues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Compétences</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {membre.competences.map((competence, index) => (
                          <Badge key={index} variant="outline">
                            {competence}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Langues parlées</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {membre.langues.map((langue, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {langue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Formations */}
            <TabsContent value="formations">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formation</TableHead>
                      <TableHead>Organisme</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Domaine</TableHead>
                      <TableHead>Certificat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membre.formations.map((formation) => (
                      <TableRow key={formation.id}>
                        <TableCell className="font-medium">{formation.titre}</TableCell>
                        <TableCell>{formation.organisme}</TableCell>
                        <TableCell>
                          {new Date(formation.dateDebut).toLocaleDateString("fr-FR")} -{" "}
                          {new Date(formation.dateFin).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{formation.domaine}</Badge>
                        </TableCell>
                        <TableCell>
                          {formation.certificat ? (
                            <Badge className="bg-green-100 text-green-800">Obtenu</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Non</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Onglet Activités */}
            <TabsContent value="activites">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activité</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membre.activites.map((activite) => (
                      <TableRow key={activite.id}>
                        <TableCell className="font-medium">{activite.titre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{activite.type}</Badge>
                        </TableCell>
                        <TableCell>{new Date(activite.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{activite.role}</TableCell>
                        <TableCell>
                          <Badge className={getActiviteStatutColor(activite.statut)}>{activite.statut}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Onglet Bureau */}
            <TabsContent value="bureau">
              {membre.estMembreBureau ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Fonction au Bureau Exécutif
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Poste</label>
                        <p className="font-medium text-lg">{membre.posteBureau}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Niveau</label>
                        <p className="font-medium">{membre.niveauBureau}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date de nomination</label>
                        <p className="font-medium">
                          {membre.dateNominationBureau &&
                            new Date(membre.dateNominationBureau).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Fin de mandat</label>
                        <p className="font-medium">
                          {membre.mandatFinBureau && new Date(membre.mandatFinBureau).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Ce membre ne fait pas partie du bureau exécutif</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Distinctions */}
            <TabsContent value="distinctions">
              {membre.distinctions.length > 0 ? (
                <div className="space-y-4">
                  {membre.distinctions.map((distinction) => (
                    <Card key={distinction.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Award className="h-8 w-8 text-yellow-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{distinction.titre}</h3>
                            <p className="text-muted-foreground mt-1">{distinction.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge className="bg-yellow-100 text-yellow-800">{distinction.niveau}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(distinction.dateObtention).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune distinction pour le moment</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Historique */}
            <TabsContent value="historique">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Changement</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Auteur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membre.historique.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.dateChangement).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{entry.ancienStatut}</Badge>
                            <span>→</span>
                            <Badge className="bg-green-100 text-green-800">{entry.nouveauStatut}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{entry.motif}</TableCell>
                        <TableCell>{entry.auteur}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
