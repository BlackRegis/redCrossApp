"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, MapPin, Users, Plus, Edit, Crown, User, Briefcase, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface BureauMembre {
  id: string
  nom: string
  prenom: string
  poste: "Président" | "Vice-Président" | "Secrétaire Général" | "Secrétaire Adjoint" | "Trésorier" | "Trésorier Adjoint" | "Commissaire aux Comptes" | "Membre"
  email: string
  telephone: string
  dateNomination: string
  mandatFin: string
  photo?: string
}

interface BureauExecutif {
  id: string
  nom: string
  type: "nation" | "departement" | "arrondissement"
  niveau: string
  membres: BureauMembre[]
}

// Sample data for executive members
const executiveMembers = [
  {
    id: "exec1",
    name: "Dr. Émile Ngoma",
    title: "Président National",
    email: "emile.ngoma@example.com",
    phone: "+242 06 123 4567",
    imageUrl: "/placeholder.svg?height=100&width=100&text=EN",
  },
  {
    id: "exec2",
    name: "Mme. Chantal Mboumba",
    title: "Secrétaire Générale",
    email: "chantal.mboumba@example.com",
    phone: "+242 06 765 4321",
    imageUrl: "/placeholder.svg?height=100&width=100&text=CM",
  },
  {
    id: "exec3",
    name: "M. David Nkounkou",
    title: "Trésorier",
    email: "david.nkounkou@example.com",
    phone: "+242 05 987 6543",
    imageUrl: "/placeholder.svg?height=100&width=100&text=DN",
  },
  {
    id: "exec4",
    name: "Dr. Sylvie Kaba",
    title: "Directrice des Programmes",
    email: "sylvie.kaba@example.com",
    phone: "+242 05 111 2233",
    imageUrl: "/placeholder.svg?height=100&width=100&text=SK",
  },
]

export default function BureauExecutifPage() {
  const [selectedBureau, setSelectedBureau] = useState<BureauExecutif | null>(null)
  const [activeTab, setActiveTab] = useState("national")
  const [bureaux, setBureaux] = useState<BureauExecutif[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchBureaux = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/bureaux')
        const data = await response.json()
        
        // Transformer les données de l'API vers le format attendu
        const transformedBureaux = data.map((bureau: any) => ({
          id: bureau.id,
          nom: bureau.nom,
          type: bureau.type,
          niveau: bureau.niveau,
          membres: bureau.membres.map((membre: any) => ({
            id: membre.id,
            nom: membre.membre_nom,
            prenom: membre.membre_prenom,
            poste: membre.poste,
            email: membre.membre_email,
            telephone: membre.membre_telephone,
            dateNomination: membre.date_nomination,
            mandatFin: membre.date_fin_mandat
          }))
        }))
        
        setBureaux(transformedBureaux)
      } catch (error) {
        console.error('Erreur lors du chargement des bureaux:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBureaux()
  }, [])

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

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`
  }

  const filteredBureaux = (type: string) => {
    return bureaux.filter((bureau) => bureau.type === type)
  }

  const renderBureauCard = (bureau: BureauExecutif) => (
    <Card key={bureau.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {bureau.type === "nation" && <Building2 className="h-5 w-5 text-blue-600" />}
              {bureau.type === "departement" && <MapPin className="h-5 w-5 text-green-600" />}
              {bureau.type === "arrondissement" && <Users className="h-5 w-5 text-orange-600" />}
              {bureau.nom}
            </CardTitle>
            <CardDescription>{bureau.niveau}</CardDescription>
          </div>
          <Link href={`/bureau-executif/${bureau.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bureau.membres.map((membre) => (
            <div key={membre.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={membre.photo || "/placeholder.svg"} />
                <AvatarFallback>{getInitials(membre.prenom, membre.nom)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {membre.prenom} {membre.nom}
                  </span>
                  <Badge className={getPosteColor(membre.poste)} variant="secondary">
                    {getPosteIcon(membre.poste)}
                    <span className="ml-1">{membre.poste}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{membre.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{membre.telephone}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Mandat: {new Date(membre.dateNomination).toLocaleDateString("fr-FR")} -{" "}
                  {new Date(membre.mandatFin).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          ))}
          {bureau.membres.length < 3 && (
            <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
              <Button variant="ghost" className="text-muted-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un membre
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des bureaux...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bureau Exécutif</h1>
          <p className="text-gray-600 mt-1">Gestion des bureaux exécutifs à tous les niveaux</p>
        </div>
        <Link href="/bureau-executif/nouveau">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Bureau
          </Button>
        </Link>
      </div>

      {/* Executive Members */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureaux Nationaux</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredBureaux("nation").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureaux Départementaux</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filteredBureaux("departement").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bureaux d'Arrondissement</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{filteredBureaux("arrondissement").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dirigeants</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {bureaux.reduce((total, bureau) => total + bureau.membres.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Bureaux Exécutifs</CardTitle>
          <CardDescription>Organisation hiérarchique des bureaux exécutifs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="national">National</TabsTrigger>
              <TabsTrigger value="departemental">Départemental</TabsTrigger>
              <TabsTrigger value="arrondissement">Arrondissement</TabsTrigger>
            </TabsList>

            <TabsContent value="national" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredBureaux("nation").map((bureau) => renderBureauCard(bureau))}
              </div>
            </TabsContent>

            <TabsContent value="departemental" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBureaux("departement").map((bureau) => renderBureauCard(bureau))}
              </div>
            </TabsContent>

            <TabsContent value="arrondissement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBureaux("arrondissement").map((bureau) => renderBureauCard(bureau))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
