import type React from "react"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { TRPCReactProvider } from "~/trpc/react"
import Header from "~/components/blocks/nav/Header"
import { Toaster } from "~/components/ui/sonner"
import { Footer } from "~/components/blocks/footer/footer"
import { AppSidebar } from "~/components/blocks/sidebar/app-sidebar"
import { UserProvider } from "~/lib/context/user-context"

// root layout adjustments
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TRPCReactProvider>
      <UserProvider>
        <SidebarProvider>
          <div className="sticky flex w-full z-20 min-h-screen flex-col">
            <Header />
            
            <div className="flex ">
              <AppSidebar role="admin" />
              
              <SidebarInset className="flex">
                <main className="overflow-x-hidden pt-4 transition-[margin] duration-300">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </main>
              </SidebarInset>
            </div>

            <Footer className="mt-auto border-t" />
          </div>
          
          <Toaster position="top-right" richColors />
        </SidebarProvider>
      </UserProvider>
    </TRPCReactProvider>
  )
}