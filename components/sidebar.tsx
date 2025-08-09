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
  ChevronUp,
  Crown,
  User,
  LogOut,
  Shield,
  Lightbulb,
  Plus,
  Search,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

// Sample user data for the profile
const currentUser = {
  name: "John Doe",
  email: "john.doe@croixrouge.cg",
  avatar: "/placeholder.svg?height=40&width=40&text=JD",
  role: "Administrateur",
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
      {/* Header with Organization Dropdown */}
      <div className="p-4 border-b border-red-500">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-3 h-auto text-white hover:bg-red-700">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-current">
                    <path d="M12 2L12 10L20 10L20 14L12 14L12 22L8 22L8 14L0 14L0 10L8 10L8 2L12 2Z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">Croix Rouge</div>
                  <div className="text-sm text-red-100">République du Congo</div>
                </div>
                <ChevronDown className="h-4 w-4 text-red-100" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            <DropdownMenuItem asChild>
              <Link href="/parametres" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/organisation" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Gérer l'Organisation</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouvelle organisation...</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

             {/* Search Section */}
       <div className="p-4 border-b border-red-500">
         <div className="relative">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-100" />
           <input
             type="text"
             placeholder="Rechercher..."
             className="w-full pl-10 pr-4 py-2 border border-red-400 rounded-lg bg-red-700 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
           />
         </div>
       </div>

             {/* Navigation */}
       <nav className="flex-1 p-4 space-y-1">
         {menuItems.map((item) => (
           <div key={item.title}>
             <div className="flex items-center">
               <Link
                 href={item.href}
                 className={cn(
                   "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1",
                   pathname === item.href 
                     ? "bg-red-700 text-white border border-red-500" 
                     : "text-red-100 hover:bg-red-700 hover:text-white",
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
                   className="p-1 h-8 w-8 text-red-100 hover:text-white hover:bg-red-700"
                 >
                   {expandedItems.includes(item.title) ? (
                     <ChevronDown className="h-4 w-4" />
                   ) : (
                     <ChevronUp className="h-4 w-4" />
                   )}
                 </Button>
               )}
             </div>

             {item.submenu && expandedItems.includes(item.title) && (
               <div className="ml-8 mt-1 space-y-1">
                 {item.submenu.map((subItem) => (
                   <Link
                     key={subItem.href}
                     href={subItem.href}
                     className={cn(
                       "block px-3 py-2 rounded-lg text-sm transition-colors",
                       pathname === subItem.href
                         ? "bg-red-700 text-white border border-red-500"
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

             {/* Footer - User Profile */}
       <div className="p-4 border-t border-red-500">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="w-full justify-start p-3 h-auto text-white hover:bg-red-700">
               <div className="flex items-center space-x-3 w-full">
                 <Avatar className="h-10 w-10 flex-shrink-0">
                   <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                   <AvatarFallback className="bg-white text-red-600 font-semibold">
                     {currentUser.name.charAt(0)}
                   </AvatarFallback>
                 </Avatar>
                 <div className="flex-1 text-left min-w-0">
                   <div className="font-medium text-white truncate">{currentUser.name}</div>
                   <div className="text-sm text-red-100 truncate">{currentUser.email}</div>
                 </div>
                 <ChevronUp className="h-4 w-4 text-red-100 flex-shrink-0" />
               </div>
             </Button>
           </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Mon profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/parametres" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Politique de confidentialité</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/feedback" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Partager un avis</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          "fixed inset-y-0 left-0 z-50 w-70 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
