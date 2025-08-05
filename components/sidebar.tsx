"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, User, Activity, CreditCard, Building2, LogOut } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"

interface NavItem {
  title: string
  href: string
  icon: any
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Organisation",
    href: "/organisation",
    icon: Building2,
  },
  {
    title: "Membres",
    href: "/membres",
    icon: User,
  },
  {
    title: "Activités",
    href: "/activites",
    icon: Activity,
  },
  {
    title: "Cartes",
    href: "/cartes",
    icon: CreditCard,
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },
]

interface UserProfile {
  name: string
  email: string
  imageUrl: string
}

const userProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  imageUrl: "/placeholder.svg?height=40&width=40",
}

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed } = useSidebar()
  const isMobile = useMobile()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex flex-col h-screen bg-secondary border-r border-r-secondary/10 w-[280px] md:w-[280px] transition-transform -translate-x-full md:translate-x-0",
        collapsed ? "-translate-x-full" : "",
        isMobile ? "fixed" : "sticky",
      )}
    >
      <div className="flex-1 px-3 py-2">
        <Link href="/" className="grid h-14 place-items-center">
          <h1 className="font-semibold text-lg">Croix-Rouge</h1>
        </Link>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent py-2 px-3 text-sm font-medium transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                pathname === item.href ? "bg-secondary/50 text-primary" : "text-secondary-foreground",
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="border rounded-lg p-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.imageUrl || "/placeholder.svg"} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{userProfile.name}</p>
              <p className="text-sm text-muted-foreground">{userProfile.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-3 justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  )
}
