

import { PageHeader } from "~/components/blocks/nav/PageHeader";
import AcademicCards from "~/components/cards/AcademicCard";
import { ScrollArea } from "~/components/ui/scroll-area"

export default function AcademicsPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard"},
    { href: "/admin/academics", label: "Academics", current: true },
  ];

  return (
    <ScrollArea className="flex flex-1 flex-col gap-4">
    <PageHeader breadcrumbs={breadcrumbs} />
      <AcademicCards />
    </ScrollArea>

  )
}