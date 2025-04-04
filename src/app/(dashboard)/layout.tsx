import type React from "react"
import { SidebarProvider } from "~/components/ui/sidebar"
import { TRPCReactProvider } from "~/trpc/react"
import Header from "~/components/blocks/nav/Header"
import { Toaster } from "~/components/ui/sonner"
import { Footer } from "~/components/blocks/footer/footer"
import { AppSidebar } from "~/components/blocks/sidebar/app-sidebar"
import { UserProvider } from "~/lib/context/user-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <TRPCReactProvider>
          <div className="flex min-h-screen pt-16">
          <SidebarProvider>
        <UserProvider>
          <AppSidebar role={""} />
          <main className="flex-1">
          <Header />
            {children}
          </main>
          </UserProvider>
          </SidebarProvider>
          </div>
          <Footer />
          <Toaster />
    </TRPCReactProvider>
  )
}

