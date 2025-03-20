

import { redirect } from 'next/navigation'
import { PageHeader } from '~/components/blocks/nav/PageHeader'
import AdminCards from '~/components/cards/AdminCard'
import { StatsCards } from '~/components/cards/StatCard'
import { checkRole } from '~/lib/roles'

export default async function AdminDashboard() {
  if (!(await checkRole('admin'))) {
    redirect('/')
  }
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
  ]


  return (
    <div className="items-center">
    <PageHeader breadcrumbs={breadcrumbs} />
    <div className="pt-8 px-4 sm:px-6 lg:px-8">
      {/* Overview Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
          Institutional Overview
        </h2>
        <div className="grid gap-6">
          <StatsCards />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
          Quick Management
        </h2>
        <AdminCards />
      </section>
    </div>
  </div>
)
}
