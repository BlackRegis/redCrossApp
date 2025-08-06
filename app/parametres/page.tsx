"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

interface AppSettings {
  app_name: string
  app_description: string
  contact_email: string
  contact_phone: string
  address: string
  logo_url: string
}

export default function ParametresPage() {
  const { toast } = useToast()
  const [appSettings, setAppSettings] = useState<AppSettings>({
    app_name: "",
    app_description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    logo_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        const response = await fetch("/api/settings/app")
        if (!response.ok) {
          throw new Error("Failed to fetch app settings")
        }
        const data = await response.json()
        setAppSettings(data)
      } catch (error) {
        console.error("Error fetching app settings:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de l'application.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchAppSettings()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setAppSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveAppSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch("/api/settings/app", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save app settings")
      }

      toast({
        title: "Succès",
        description: "Les paramètres de l'application ont été mis à jour.",
      })
    } catch (error) {
      console.error("Error saving app settings:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres de l'application.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">Gérez les paramètres de votre application.</p>
          </div>
        </div>
        <p>Chargement des paramètres...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Gérez les paramètres de votre application.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux de l'Application</CardTitle>
              <CardDescription>Configurez les informations de base de votre application.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveAppSettings} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="app_name" className="text-sm font-medium">
                    Nom de l'Application
                  </label>
                  <Input id="app_name" value={appSettings.app_name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="app_description" className="text-sm font-medium">
                    Description de l'Application
                  </label>
                  <Textarea id="app_description" value={appSettings.app_description} onChange={handleInputChange} rows={3} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact_email" className="text-sm font-medium">
                    Email de Contact
                  </label>
                  <Input id="contact_email" type="email" value={appSettings.contact_email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="text-sm font-medium">
                    Téléphone de Contact
                  </label>
                  <Input id="contact_phone" value={appSettings.contact_phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Adresse
                  </label>
                  <Textarea id="address" value={appSettings.address} onChange={handleInputChange} rows={3} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="logo_url" className="text-sm font-medium">
                    URL du Logo
                  </label>
                  <Input id="logo_url" value={appSettings.logo_url} onChange={handleInputChange} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenu des paramètres de notifications...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
              <CardDescription>Gérez les paramètres de sécurité de votre compte.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenu des paramètres de sécurité...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
