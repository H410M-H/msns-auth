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
      <UserProvider>
        <SidebarProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            
            <div className="flex flex-1">
              <AppSidebar role="admin" /> {/* Replace with dynamic role from your auth system */}
              
              <main className="flex-1 overflow-x-hidden pt-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>

            <Footer className="mt-auto border-t" />
          </div>
          
          <Toaster position="top-right" richColors />
        </SidebarProvider>
      </UserProvider>
    </TRPCReactProvider>
  )
}