"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, CreditCard, Activity, Briefcase, Settings, ChevronRight, ChevronLeft, BarChart2, User } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { href: "/", icon: Home, label: "Accueil" },
    { href: "/membres", icon: Users, label: "Membres" },
    { href: "/cartes", icon: CreditCard, label: "Cartes" },
    { href: "/activites", icon: Activity, label: "Activités" },
    { href: "/bureau-executif", icon: Briefcase, label: "Bureau Exécutif" },
    { href: "/organisation", icon: Briefcase, label: "Organisation" },
    { href: "/rapports", icon: BarChart2, label: "Rapports" },
    { href: "/parametres", icon: Settings, label: "Paramètres" },
  ]

  const user = {
    name: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32&text=JD", // Placeholder image
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed && <h1 className="text-2xl font-bold text-red-600">Croix Rouge</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-gray-900 transition-all hover:bg-gray-100",
              pathname === item.href && "bg-gray-100 text-red-600",
              isCollapsed && "justify-center",
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-start gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && <span className="font-medium">{user.name}</span>}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1">
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-gray-900 transition-all hover:bg-gray-100",
                isCollapsed && "justify-center",
              )}
            >
              <User className="h-5 w-5" />
              {!isCollapsed && <span>Mon Profil</span>}
            </Link>
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 py-2 text-gray-900 transition-all hover:bg-gray-100",
                isCollapsed && "justify-center",
              )}
            >
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span>Déconnexion</span>}
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  )
}
