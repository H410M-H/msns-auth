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
          <div className="sticky w-full z-20 min-h-screen flex-col">
            <Header />
            
            <div className="flex">
              <AppSidebar role={"admin"}  />
              <SidebarInset className="flex w-screen">
                <main className=" pt-6 transition-[margin] duration-300">
                    <main className="flex-1 p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50">
                      {children}
                    </main>
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