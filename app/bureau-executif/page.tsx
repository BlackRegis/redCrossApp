"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Edit, Trash2, Users } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface ExecutiveBureau {
  id: number
  name: string
  start_date: string
  end_date: string | null
  is_active: boolean
}

interface BureauMember {
  id: number
  bureau_id: number
  member_id: number
  nom: string
  prenom: string
  role: string
  start_date: string
  end_date: string | null
}

interface Membre {
  id: number
  nom: string
  prenom: string
}

export default function BureauExecutifPage() {
  const queryClient = useQueryClient()
  const [isBureauDialogOpen, setIsBureauDialogOpen] = useState(false)
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
  const [currentBureau, setCurrentBureau] = useState<ExecutiveBureau | null>(null)
  const [currentBureauMember, setCurrentBureauMember] = useState<BureauMember | null>(null)
  const [bureauFormData, setBureauFormData] = useState({
    name: "",
    start_date: null as Date | null,
    end_date: null as Date | null,
    is_active: false,
  })
  const [memberFormData, setMemberFormData] = useState({
    bureau_id: "",
    member_id: "",
    role: "",
    start_date: null as Date | null,
    end_date: null as Date | null,
  })
  const [selectedBureauId, setSelectedBureauId] = useState<number | null>(null)

  const { data: bureaus, isLoading: isLoadingBureaus } = useQuery<ExecutiveBureau[]>({
    queryKey: ["executiveBureaus"],
    queryFn: async () => {
      const res = await fetch("/api/bureaux-executifs")
      if (!res.ok) throw new Error("Failed to fetch executive bureaus")
      return res.json()
    },
  })

  const { data: bureauMembers, isLoading: isLoadingBureauMembers } = useQuery<BureauMember[]>({
    queryKey: ["bureauMembers", selectedBureauId],
    queryFn: async () => {
      if (!selectedBureauId) return []
      const res = await fetch(`/api/bureau-membres?bureauId=${selectedBureauId}`)
      if (!res.ok) throw new Error("Failed to fetch bureau members")
      return res.json()
    },
    enabled: !!selectedBureauId,
  })

  const { data: membres, isLoading: isLoadingMembres } = useQuery<Membre[]>({
    queryKey: ["membresList"],
    queryFn: async () => {
      const res = await fetch("/api/membres") // Assuming an API endpoint for all members
      if (!res.ok) throw new Error("Failed to fetch members")
      const data = await res.json()
      return data.data // Assuming the API returns { data: [], totalCount: ... }
    },
  })

  const createBureauMutation = useMutation({
    mutationFn: async (newBureauData: any) => {
      const res = await fetch("/api/bureaux-executifs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBureauData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create bureau")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executiveBureaus"] })
      toast.success("Bureau créé avec succès!")
      setIsBureauDialogOpen(false)
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création du bureau: ${error.message}`)
    },
  })

  const updateBureauMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: any }) => {
      const res = await fetch(`/api/bureaux-executifs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update bureau")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executiveBureaus"] })
      toast.success("Bureau mis à jour avec succès!")
      setIsBureauDialogOpen(false)
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour du bureau: ${error.message}`)
    },
  })

  const deleteBureauMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bureaux-executifs/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete bureau")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["executiveBureaus"] })
      toast.success("Bureau supprimé avec succès!")
      setSelectedBureauId(null) // Deselect bureau if deleted
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression du bureau: ${error.message}`)
    },
  })

  const createMemberMutation = useMutation({
    mutationFn: async (newMemberData: any) => {
      const res = await fetch("/api/bureau-membres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemberData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to add bureau member")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bureauMembers", selectedBureauId] })
      toast.success("Membre du bureau ajouté avec succès!")
      setIsMemberDialogOpen(false)
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout du membre du bureau: ${error.message}`)
    },
  })

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: any }) => {
      const res = await fetch(`/api/bureau-membres/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update bureau member")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bureauMembers", selectedBureauId] })
      toast.success("Membre du bureau mis à jour avec succès!")
      setIsMemberDialogOpen(false)
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour du membre du bureau: ${error.message}`)
    },
  })

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bureau-membres/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete bureau member")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bureauMembers", selectedBureauId] })
      toast.success("Membre du bureau supprimé avec succès!")
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression du membre du bureau: ${error.message}`)
    },
  })

  const handleBureauFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setBureauFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleBureauDateChange = (id: string, date: Date | undefined) => {
    setBureauFormData((prev) => ({ ...prev, [id]: date || null }))
  }

  const handleMemberFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setMemberFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleMemberSelectChange = (id: string, value: string) => {
    setMemberFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleMemberDateChange = (id: string, date: Date | undefined) => {
    setMemberFormData((prev) => ({ ...prev, [id]: date || null }))
  }

  const openCreateBureauDialog = () => {
    setCurrentBureau(null)
    setBureauFormData({ name: "", start_date: null, end_date: null, is_active: false })
    setIsBureauDialogOpen(true)
  }

  const openEditBureauDialog = (bureau: ExecutiveBureau) => {
    setCurrentBureau(bureau)
    setBureauFormData({
      name: bureau.name,
      start_date: bureau.start_date ? new Date(bureau.start_date) : null,
      end_date: bureau.end_date ? new Date(bureau.end_date) : null,
      is_active: bureau.is_active,
    })
    setIsBureauDialogOpen(true)
  }

  const handleBureauSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSubmit = {
      ...bureauFormData,
      start_date: bureauFormData.start_date ? format(bureauFormData.start_date, "yyyy-MM-dd") : null,
      end_date: bureauFormData.end_date ? format(bureauFormData.end_date, "yyyy-MM-dd") : null,
    }
    if (currentBureau) {
      updateBureauMutation.mutate({ id: currentBureau.id, updatedData: dataToSubmit })
    } else {
      createBureauMutation.mutate(dataToSubmit)
    }
  }

  const openCreateMemberDialog = () => {
    if (!selectedBureauId) {
      toast.error("Veuillez sélectionner un bureau d'abord.")
      return
    }
    setCurrentBureauMember(null)
    setMemberFormData({
      bureau_id: String(selectedBureauId),
      member_id: "",
      role: "",
      start_date: null,
      end_date: null,
    })
    setIsMemberDialogOpen(true)
  }

  const openEditMemberDialog = (member: BureauMember) => {
    setCurrentBureauMember(member)
    setMemberFormData({
      bureau_id: String(member.bureau_id),
      member_id: String(member.member_id),
      role: member.role,
      start_date: member.start_date ? new Date(member.start_date) : null,
      end_date: member.end_date ? new Date(member.end_date) : null,
    })
    setIsMemberDialogOpen(true)
  }

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSubmit = {
      ...memberFormData,
      bureau_id: Number.parseInt(memberFormData.bureau_id),
      member_id: Number.parseInt(memberFormData.member_id),
      start_date: memberFormData.start_date ? format(memberFormData.start_date, "yyyy-MM-dd") : null,
      end_date: memberFormData.end_date ? format(memberFormData.end_date, "yyyy-MM-dd") : null,
    }
    if (currentBureauMember) {
      updateMemberMutation.mutate({ id: currentBureauMember.id, updatedData: dataToSubmit })
    } else {
      createMemberMutation.mutate(dataToSubmit)
    }
  }

  if (isLoadingBureaus) return <p className="p-4 md:p-6">Chargement des bureaux exécutifs...</p>

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bureau Exécutif</h1>
        <Button onClick={openCreateBureauDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Bureau
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bureaux Exécutifs</CardTitle>
          <CardDescription>Gérez les différents bureaux exécutifs de la Croix-Rouge.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Bureau</TableHead>
                <TableHead>Date Début</TableHead>
                <TableHead>Date Fin</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bureaus?.length > 0 ? (
                bureaus.map((bureau) => (
                  <TableRow
                    key={bureau.id}
                    onClick={() => setSelectedBureauId(bureau.id)}
                    className={cn("cursor-pointer", selectedBureauId === bureau.id && "bg-muted")}
                  >
                    <TableCell className="font-medium">{bureau.name}</TableCell>
                    <TableCell>{format(new Date(bureau.start_date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{bureau.end_date ? format(new Date(bureau.end_date), "dd/MM/yyyy") : "N/A"}</TableCell>
                    <TableCell>{bureau.is_active ? "Oui" : "Non"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditBureauDialog(bureau)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteBureauMutation.mutate(bureau.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucun bureau exécutif trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedBureauId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membres du Bureau Actuel
            </CardTitle>
            <CardDescription>Gérez les membres du bureau sélectionné.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={openCreateMemberDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter Membre au Bureau
              </Button>
            </div>
            {isLoadingBureauMembers ? (
              <p>Chargement des membres du bureau...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date Début</TableHead>
                    <TableHead>Date Fin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bureauMembers?.length > 0 ? (
                    bureauMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.prenom} {member.nom}
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{format(new Date(member.start_date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          {member.end_date ? format(new Date(member.end_date), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditMemberDialog(member)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteMemberMutation.mutate(member.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Aucun membre dans ce bureau.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bureau Dialog */}
      <Dialog open={isBureauDialogOpen} onOpenChange={setIsBureauDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentBureau ? "Modifier Bureau" : "Nouveau Bureau"}</DialogTitle>
            <CardDescription>
              {currentBureau ? "Mettez à jour les informations du bureau." : "Ajoutez un nouveau bureau exécutif."}
            </CardDescription>
          </DialogHeader>
          <form onSubmit={handleBureauSubmit} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du Bureau</Label>
              <Input id="name" value={bureauFormData.name} onChange={handleBureauFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de Début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bureauFormData.start_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bureauFormData.start_date ? (
                      format(bureauFormData.start_date, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bureauFormData.start_date || undefined}
                    onSelect={(date) => handleBureauDateChange("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bureauFormData.end_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bureauFormData.end_date ? format(bureauFormData.end_date, "PPP") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bureauFormData.end_date || undefined}
                    onSelect={(date) => handleBureauDateChange("end_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={bureauFormData.is_active}
                onCheckedChange={(checked) => setBureauFormData((prev) => ({ ...prev, is_active: Boolean(checked) }))}
              />
              <Label htmlFor="is_active">Actif</Label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createBureauMutation.isPending || updateBureauMutation.isPending}>
                {currentBureau
                  ? updateBureauMutation.isPending
                    ? "Mise à jour..."
                    : "Mettre à jour"
                  : createBureauMutation.isPending
                    ? "Création..."
                    : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentBureauMember ? "Modifier Membre du Bureau" : "Ajouter Membre au Bureau"}</DialogTitle>
            <CardDescription>
              {currentBureauMember
                ? "Mettez à jour les informations du membre."
                : "Ajoutez un nouveau membre au bureau sélectionné."}
            </CardDescription>
          </DialogHeader>
          <form onSubmit={handleMemberSubmit} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member_id">Membre</Label>
              <Select
                value={memberFormData.member_id}
                onValueChange={(value) => handleMemberSelectChange("member_id", value)}
                disabled={isLoadingMembres || !!currentBureauMember} // Disable if editing or loading members
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {membres?.map((membre) => (
                    <SelectItem key={membre.id} value={String(membre.id)}>
                      {membre.prenom} {membre.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" value={memberFormData.role} onChange={handleMemberFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de Début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !memberFormData.start_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {memberFormData.start_date ? (
                      format(memberFormData.start_date, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={memberFormData.start_date || undefined}
                    onSelect={(date) => handleMemberDateChange("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !memberFormData.end_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {memberFormData.end_date ? format(memberFormData.end_date, "PPP") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={memberFormData.end_date || undefined}
                    onSelect={(date) => handleMemberDateChange("end_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMemberMutation.isPending || updateMemberMutation.isPending}>
                {currentBureauMember
                  ? updateMemberMutation.isPending
                    ? "Mise à jour..."
                    : "Mettre à jour"
                  : createMemberMutation.isPending
                    ? "Ajout..."
                    : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
