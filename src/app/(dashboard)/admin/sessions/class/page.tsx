import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Suspense } from "react"
import { PageHeader } from "~/components/blocks/nav/PageHeader";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { ClassAllotmentTable } from "~/components/tables/ClassAlotment";

type PageProps = {
  searchParams: Promise<{ classId: string; sessionId: string; }>;
};

export default async function ClassDetailsPage({ searchParams }: PageProps) {
  const searchProps = await searchParams;
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/sessionalDetails", label: "Session Details", current: true },
  ];
  return (
    <div className="w-full">
      <PageHeader breadcrumbs={breadcrumbs}/>
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
            <ClassAllotmentTable classId={searchProps.classId} sessionId={searchProps.sessionId} />
              </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

