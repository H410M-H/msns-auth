import { redirect } from "next/navigation"
import { checkRole } from "~/lib/roles"

// This is the default dashboard route that redirects to the appropriate role-based dashboard
export default async function Dashboard() {
  const role = 'admin' || 'clerk' || 'principal' || 'teacher' || 'student';

  if (!(await checkRole('admin' || 'clerk' || 'principal' || 'teacher' || 'student'))) {
    redirect('/')
  }  else {
    redirect(`/${role.toLowerCase()}`);
  }
}

