import type React from "react"
import { DashboardHeader } from "~/components/blocks/dashboard-header"
import { DashboardSidebar } from "~/components/blocks/dashboard-sidebar"

interface DashboardShellProps {
  children: React.ReactNode
  role: "Super Admin" | "Admin" | "Principal" | "Teacher" | "Clerk"
  userName: string
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardSidebar role={role} />
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

