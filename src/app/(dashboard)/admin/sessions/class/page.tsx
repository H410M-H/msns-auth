import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { PageHeader } from "~/components/blocks/nav/PageHeader";
import { ClassAllotmentTable } from "~/components/tables/ClassAlotment";

type PageProps = {
  searchParams: Promise<{ classId: string; sessionId: string; }>;
};

export default async function ClassDetailsPage({ searchParams }: PageProps) {
  const searchProps = await searchParams;
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/academics", label: "Academics" },
    { href: "/admin/sessions", label: "Session Details", current: true },
  ];
  return (
    <div className="w-full">
      <PageHeader breadcrumbs={breadcrumbs}/>
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
            <ClassAllotmentTable classId={searchProps.classId} sessionId={searchProps.sessionId} />
        </CardContent>
      </Card>
    </div>
  )
}

