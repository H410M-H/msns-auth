"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  School,
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
import { useEffect } from "react"

interface AppSidebarProps {
  role: string;
  className?: string;
}

export function AppSidebar({ role, className }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { isMobile, state, toggleSidebar } = useSidebar()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = async () => {
    await signOut(() => router.push("/sign-in"))
  }

  const firstName = user?.firstName ?? ""
  const lastName = user?.lastName ?? ""
  const userName = `${firstName} ${lastName}`

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) toggleSidebar()
  }, [isMobile, pathname, toggleSidebar])

  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "icon"} 
      variant="inset"
      className={cn(
        "h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      <SidebarHeader className="sticky top-10 z-10 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-4">
          <School className="h-7 w-7 text-primary" />
          <div 
            className={cn(
              "text-xl font-semibold transition-opacity",
              state === "collapsed" && "opacity-0 pointer-events-none"
            )}
          >
            MSNS-LMS
          </div>
        </div>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive(`/${role.toLowerCase()}`)}
              tooltip="Dashboard"
            >
              <Link href={`/${role.toLowerCase()}`}>
                <LayoutDashboard className="min-w-5" />
                <span className="truncate">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Conditional menu items based on role */}
          {role === "admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(`/${role.toLowerCase()}/users`)}
                tooltip="User Management"
              >
                <Link href={`/${role.toLowerCase()}/admin`}>
                  <UserCog className="min-w-5" />
                  <span className="truncate">User Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(role === "admin" || role === "clerk") && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(`/${role.toLowerCase()}/sessions`)}
                  tooltip="Sessions"
                >
                  <Link href={`/${role.toLowerCase()}/sessions`}>
                    <Calendar className="min-w-5" />
                    <span className="truncate">Sessions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(`/${role.toLowerCase()}/classes`)}
                  tooltip="Classes"
                >
                  <Link href={`/${role.toLowerCase()}/classes`}>
                    <BookOpen className="min-w-5" />
                    <span className="truncate">Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Add other menu items following the same pattern */}

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
  <SidebarSeparator />
  <div className="p-2">
    <div className="flex items-center gap-3">
      {/* Avatar with integrated logout button */}
      <div className="relative group">
        <Avatar className="border-2 border-primary/20 size-10">
          <AvatarImage src={user?.imageUrl} alt={userName} />
          <AvatarFallback className="bg-primary/10">
            {userName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Collapsed state logout button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-2 -top-2 size-7 rounded-full bg-background/90 p-1.5 shadow-sm transition-all",
            "opacity-0 group-hover:opacity-100",
            state !== "collapsed" && "hidden"
          )}
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="size-3.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Expanded state user info */}
      <div className={cn(
        "flex flex-1 flex-col overflow-hidden transition-all",
        state === "collapsed" ? "w-0 opacity-0" : "w-full opacity-100"
      )}>
        <span className="truncate text-sm font-medium">{userName}</span>
        <span className="truncate text-xs text-muted-foreground">{role}</span>
      </div>

      {/* Expanded state logout button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "ml-auto hover:bg-primary/10",
          state === "collapsed" && "hidden"
        )}
        onClick={handleLogout}
        aria-label="Logout"
      >
        <LogOut className="size-4 text-muted-foreground" />
      </Button>
    </div>
  </div>
</SidebarFooter>

      <SidebarRail className="hover:after:bg-primary/30" />
      {/* <SidebarTrigger className="relative right-4 top-4 md:right-2 md:top-2" /> */}
    </Sidebar>
  )
}