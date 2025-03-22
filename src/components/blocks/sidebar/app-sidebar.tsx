"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  School,
  Settings,
  Users,
  DollarSign,
  FileText,
  LogOut,
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
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { cn } from "~/lib/utils"

interface DashboardSidebarProps {
  role: string;
  className?: string;
}

export function AppSidebar({ role, className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { isMobile } = useSidebar()

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
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "icon"} 
      variant="inset"
      className={cn("flex h-auto top-16 z-40 shadow-lg", className)}
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <School className="h-6 w-6 text-primary" />
          <div className="font-bold text-xl">MSNS-LMS</div>
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}`)}>
              <Link href={`/${role.toLowerCase()}`}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {role === "admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/users`)}>
                  <Link href={`/${role.toLowerCase()}/users`}>
                    <UserCog />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {(role === "admin" || role === "clerk") && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/sessions`)}>
                  <Link href={`/${role.toLowerCase()}/sessions`}>
                    <Calendar />
                    <span>Sessions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/classes`)}>
                  <Link href={`/${role.toLowerCase()}/classes`}>
                    <BookOpen />
                    <span>Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/students`)}>
              <Link href={`/${role.toLowerCase()}/students`}>
                <GraduationCap />
                <span>Students</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {(role === "admin" || role === "principal") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/employees`)}>
                <Link href={`/${role.toLowerCase()}/employees`}>
                  <Users />
                  <span>Employees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/subjects`)}>
              <Link href={`/${role.toLowerCase()}/subjects`}>
                <FileText />
                <span>Subjects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {(role === "super-admin" || role === "admin" || role === "principal" || role === "clerk") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/fees`)}>
                <Link href={`/${role.toLowerCase()}/fees`}>
                  <DollarSign />
                  <span>Fees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(role === "super-admin" || role === "admin" || role === "principal") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/salary`)}>
                <Link href={`/${role.toLowerCase()}/salary`}>
                  <DollarSign />
                  <span>Salary</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(role === "super-admin" || role === "admin") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/${role.toLowerCase()}/settings`)}>
                <Link href={`/${role.toLowerCase()}/settings`}>
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t bg-sidebar-accent/10">
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
      <SidebarRail className="hover:after:bg-primary/50" />
      {isMobile && <SidebarTrigger className="absolute right-4 top-4 md:hidden" />}
    </Sidebar>
  )
}