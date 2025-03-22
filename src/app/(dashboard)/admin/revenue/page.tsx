import { RevenueCards } from "~/components/cards/RevenueCard";
import { PageHeader } from "~/components/blocks/nav/PageHeader";
import { ScrollArea } from "~/components/ui/scroll-area"

export default function RevenuePage() {
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard"},
        { href: "/admin/revenue", label: "Revenue", current: true },
      ];
  return (
      <ScrollArea className="flex flex-col gap-4">
                <PageHeader breadcrumbs={breadcrumbs} />
        <RevenueCards />
      </ScrollArea>
  )
}