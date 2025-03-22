import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define roles and their allowed paths
// const roleRoutes: Record<string, string[]> = {
//   admin: ["/dashboard/admin"],
//   principal: ["/dashboard/principal"],
//   teacher: ["/dashboard/teacher"],
//   student: ["/dashboard/student"],
//   clerk: ["/dashboard/clerk"],
// };

// Define public routes
// const publicRoutes = [ "/sign-in(.*)", "/", "/api/webhook"];
// const isPublic = createRouteMatcher(publicRoutes);
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isClerkRoute = createRouteMatcher(['/clerk(.*)'])

// Default redirect paths for each role
// const roleDefaultPaths: Record<string, string> = {
//   admin: "/dashboard/admin",
//   principal: "/dashboard/principal",
//   clerk: "/dashboard/clerk",
//   student: "/dashboard/student"
// };

export default clerkMiddleware(async (auth, req) => {
  // const { userId, sessionClaims } = await auth();
  // const path = req.nextUrl.pathname;


  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
  if (isClerkRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'clerk') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
})

//   // Redirect unauthenticated users
//   if (!userId) return NextResponse.redirect(new URL("/dashboard", req.url));

//   // Determine user role with default
//   const role = (sessionClaims?.publicMetadata as { role?: string })?.role?.toString() ?? "admin";

//   // Check if user has access to current path
//   const hasAccess = roleRoutes[role]?.some(route => 
//     path === route || path.startsWith(`${route}/`)
//   );

//   // Redirect unauthorized users to their dashboard
//   if (!hasAccess) {
//     const redirectPath = roleDefaultPaths[role] ?? "/dashboard";
//     return NextResponse.redirect(new URL(redirectPath, req.url));
//   }

//   return NextResponse.next();
// });

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};