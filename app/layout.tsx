import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CustomSidebar } from "@/components/sidebar"
import { QueryClientProviderWrapper } from "@/components/query-client-provider-wrapper"
import { fetchRedCrossColors } from "@/lib/database"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Croix-Rouge Congolaise",
  description: "Application de gestion des membres et activités de la Croix-Rouge Congolaise",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  // Fetch Red Cross colors on the server
  const redCrossColors = await fetchRedCrossColors()
  const redColor = redCrossColors.find((color: any) => color.name === "Red")?.hex_code || "#FF0000" // Default to red if not found

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryClientProviderWrapper>
            <SidebarProvider defaultOpen={defaultOpen}>
              <CustomSidebar redCrossColor={redColor} />
              <SidebarInset>
                <main className="flex flex-1 flex-col">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </QueryClientProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
