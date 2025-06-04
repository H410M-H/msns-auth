"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  School,
  Settings,
  Users,
  DollarSign,
  FileText,
  LogOut,
  Shield,
  UserCog,
} from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

interface DashboardSidebarProps {
  role: string
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    await signOut(() => router.push("/sign-in"))
  }

  // Get user name from Clerk
  const firstName = user?.firstName ?? ""
  const lastName = user?.lastName ?? ""
  const userName = `${firstName} ${lastName}`

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <School className="h-6 w-6 text-primary" />
          <div className="font-bold text-xl">MSNS-LMS</div>
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}`)}>
              <Link href={`/dashboard/${role.toLowerCase()}`}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {role === "super-admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/users`)}>
                  <Link href={`/dashboard/${role.toLowerCase()}/users`}>
                    <UserCog />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/roles`)}>
                  <Link href={`/dashboard/${role.toLowerCase()}/roles`}>
                    <Shield />
                    <span>Role Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {(role === "super-admin" || role === "admin" || role === "principal") && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/sessions`)}>
                  <Link href={`/dashboard/${role.toLowerCase()}/sessions`}>
                    <Calendar />
                    <span>Sessions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/classes`)}>
                  <Link href={`/dashboard/${role.toLowerCase()}/classes`}>
                    <BookOpen />
                    <span>Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          {(role === "super-admin" || role === "admin" || role === "principal") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/employees`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/employees`}>
                  <Users />
                  <span>Employees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/subjects`)}>
              <Link href={`/dashboard/${role.toLowerCase()}/subjects`}>
                <FileText />
                <span>Subjects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {(role === "super-admin" || role === "admin" || role === "principal" || role === "clerk") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/fees`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/fees`}>
                  <DollarSign />
                  <span>Fees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(role === "super-admin" || role === "admin" || role === "principal") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/salary`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/salary`}>
                  <DollarSign />
                  <span>Salary</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(role === "super-admin" || role === "admin") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/settings`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/settings`}>
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2">
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage src={user?.imageUrl ?? "/user.jpg"} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">{role}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
    </Sidebar>
  )
}

