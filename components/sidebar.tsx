"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  CreditCard,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample user data (centralized as requested)
const currentUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

// Sample menu items (centralized as requested)
const navItems = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    title: "Membres",
    href: "/membres",
    icon: Users,
  },
  {
    title: "Cartes",
    href: "/cartes",
    icon: CreditCard,
  },
  {
    title: "Activités",
    href: "/activites",
    icon: Calendar,
  },
  {
    title: "Bureau Exécutif",
    href: "/bureau-executif",
    icon: Building2,
  },
  {
    title: "Organisation",
    href: "/organisation",
    icon: FileText,
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: Inbox, // Using Inbox for reports as a placeholder icon
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },
]

export default function AppSidebar() {
  const { toggleSidebar, state } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/placeholder.svg?height=24&width=24" alt="Logo" className="h-6 w-6" />
            <span className={cn("transition-opacity duration-200", state === "collapsed" && "opacity-0")}>
              Croix Rouge
            </span>
          </Link>
          <SidebarTrigger className={cn("hidden md:block", state === "collapsed" && "opacity-0")} />
        </div>
        <div className={cn("p-2", state === "collapsed" && "hidden")}>
          <Label htmlFor="search" className="sr-only">
            Rechercher
          </Label>
          <SidebarInput id="search" placeholder="Rechercher..." className="pl-8" />
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Example of a collapsible group */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger
                className={cn("flex w-full items-center justify-between", state === "collapsed" && "hidden")}
              >
                <span>Aide & Support</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <span>Documentation</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <span>FAQ</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className={cn("transition-opacity duration-200", state === "collapsed" && "opacity-0")}>
                    {currentUser.name}
                  </span>
                  <ChevronUp
                    className={cn("ml-auto transition-opacity duration-200", state === "collapsed" && "opacity-0")}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Mon Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
