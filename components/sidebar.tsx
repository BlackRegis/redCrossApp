"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Building2,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Crown,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    title: "Tableau de Bord",
    href: "/",
    icon: Home,
  },
  {
    title: "Membres",
    href: "/membres",
    icon: Users,
    submenu: [
      { title: "Liste des Membres", href: "/membres" },
      { title: "Nouveau Membre", href: "/membres/nouveau" },
    ],
  },
  {
    title: "Organisation",
    href: "/organisation",
    icon: Building2,
  },
  {
    title: "Bureau Exécutif",
    href: "/bureau-executif",
    icon: Crown,
  },
  {
    title: "Cartes de Membre",
    href: "/cartes",
    icon: CreditCard,
  },
  {
    title: "Activités",
    href: "/activites",
    icon: Calendar,
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: BarChart3,
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },
]

// Sample user data
const currentUser = {
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40&text=JD",
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-red-600 text-white">
      {/* Header */}
      <div className="p-6 border-b border-red-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-current">
              <path d="M12 2L12 10L20 10L20 14L12 14L12 22L8 22L8 14L0 14L0 10L8 10L8 2L12 2Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Croix Rouge</h2>
            <p className="text-sm text-red-100">République du Congo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.title}>
            <div className="flex items-center">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1",
                  pathname === item.href ? "bg-red-700 text-white" : "text-red-100 hover:bg-red-700 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
              {item.submenu && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.title)}
                  className="p-1 h-8 w-8 text-red-100 hover:bg-red-700 hover:text-white"
                >
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            {item.submenu && expandedItems.includes(item.title) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === subItem.href
                        ? "bg-red-800 text-white"
                        : "text-red-200 hover:bg-red-700 hover:text-white",
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - User Profile Button */}
      <div className="p-4 border-t border-red-500">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-red-700 hover:text-white">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{currentUser.name}</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-red-600 border-r border-red-500 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
