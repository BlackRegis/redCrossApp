"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Users, Activity, DollarSign, BarChart, Plus } from "lucide-react"
import { toast } from "sonner"

export default function RapportsPage() {
  const handleDownloadReport = (reportName: string) => {
    toast.info(`Génération et téléchargement du rapport: ${reportName}...`)
    // Placeholder for actual report generation and download logic
    console.log(`Downloading report: ${reportName}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Génération de Rapports</h1>
      <p className="text-muted-foreground mb-8">
        Accédez à des rapports détaillés pour une meilleure vue d'ensemble de l'activité de la Croix-Rouge.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Rapport des Membres</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Générez un rapport complet sur les membres, incluant les informations de contact, le statut et le type de
              membre.
            </CardDescription>
            <Button onClick={() => handleDownloadReport("Rapport des Membres")}>
              <Download className="h-4 w-4 mr-2" /> Télécharger
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Rapport des Activités</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Obtenez un aperçu des activités passées et futures, avec les dates, lieux et statuts.
            </CardDescription>
            <Button onClick={() => handleDownloadReport("Rapport des Activités")}>
              <Download className="h-4 w-4 mr-2" /> Télécharger
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Rapport du Bureau Exécutif</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Visualisez la composition des bureaux exécutifs, les rôles et les mandats.
            </CardDescription>
            <Button onClick={() => handleDownloadReport("Rapport du Bureau Exécutif")}>
              <Download className="h-4 w-4 mr-2" /> Télécharger
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Rapport Financier (Provisoire)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Un rapport sommaire des contributions et dépenses (fonctionnalité à développer).
            </CardDescription>
            <Button onClick={() => handleDownloadReport("Rapport Financier")} disabled>
              <Download className="h-4 w-4 mr-2" /> Télécharger (Bientôt)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Rapport Personnalisé</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Créez un rapport sur mesure en sélectionnant les données et les filtres nécessaires.
            </CardDescription>
            <Button onClick={() => toast.info("Fonctionnalité de rapport personnalisé à implémenter.")}>
              <Plus className="h-4 w-4 mr-2" /> Créer Personnalisé
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
