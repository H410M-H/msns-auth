"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { cn } from "~/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

interface AppSidebarProps {
  className?: string
  role: string
}

export const AppSidebar = ({ className, role }: AppSidebarProps) => {
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

  // User details
  const firstName = user?.firstName ?? ""
  const lastName = user?.lastName ?? ""
  const userName = `${firstName} ${lastName}`

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      variant="inset"
      className={cn("flex h-auto top-16 z-40 shadow-lg", className)}
    >

      <SidebarContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        <SidebarMenu>
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/admin/${role.toLowerCase()}`)}>
              <Link href={`/${role.toLowerCase()}`}>
                <LayoutDashboard className="min-w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Role-based Navigation */}
          {role === "admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/admin/${role.toLowerCase()}/users`)}>
                  <Link href={`/${role.toLowerCase()}/users`}>
                    <UserCog className="min-w-4" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/admin/${role.toLowerCase()}/users`)}>
                  <Link href={`/${role.toLowerCase()}/users/faculty/view`}>
                    <Shield className="min-w-4" />
                    <span>Role Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {( role === "admin" || role === "principal") && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/admin/${role.toLowerCase()}/sessions`)}>
                  <Link href={`/${role.toLowerCase()}/sessions`}>
                    <Calendar className="min-w-4" />
                    <span>Sessions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/admin/${role.toLowerCase()}/sessions`)}>
                  <Link href={`/${role.toLowerCase()}/sessions/class`}>
                    <BookOpen className="min-w-4" />
                    <span>Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Common Items */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/admin/${role.toLowerCase()}/students`)}>
              <Link href={`/dashboard/${role.toLowerCase()}/students`}>
                <GraduationCap className="min-w-4" />
                <span>Students</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {(role === "super-admin" || role === "admin" || role === "principal") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/employees`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/employees`}>
                  <Users className="min-w-4" />
                  <span>Employees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/subjects`)}>
              <Link href={`/dashboard/${role.toLowerCase()}/subjects`}>
                <FileText className="min-w-4" />
                <span>Subjects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Financial Sections */}
          {(role === "super-admin" || role === "admin" || role === "principal" || role === "clerk") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/fees`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/fees`}>
                  <DollarSign className="min-w-4" />
                  <span>Fees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(role === "super-admin" || role === "admin" || role === "principal") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/salary`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/salary`}>
                  <DollarSign className="min-w-4" />
                  <span>Salary</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Settings */}
          {(role === "super-admin" || role === "admin") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`/dashboard/${role.toLowerCase()}/settings`)}>
                <Link href={`/dashboard/${role.toLowerCase()}/settings`}>
                  <Settings className="min-w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t bg-sidebar-accent/10">
        <SidebarSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full p-0 hover:bg-accent/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Avatar className="h-9 w-9 cursor-pointer border">
                <AvatarImage src={user?.imageUrl} alt={userName} />
                <AvatarFallback className="text-sm font-medium">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-lg border bg-background p-2 shadow-sm"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem asChild className="cursor-pointer rounded-md px-2 py-1.5">
              <Link href={`/dashboard/${role.toLowerCase()}/profile`}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-md px-2 py-1.5">
              <Link href={`/dashboard/${role.toLowerCase()}/preferences`}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem
              className="cursor-pointer rounded-md px-2 py-1.5 text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate">{userName}</span>
          <span className="text-xs text-muted-foreground capitalize">{role}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-primary/50" />
      <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
    </Sidebar>
  )
}