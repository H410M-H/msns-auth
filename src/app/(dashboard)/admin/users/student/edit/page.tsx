import StudentCredDetails from "~/components/blocks/cards/StudentCredCard";
import { PageHeader } from "~/components/blocks/nav/PageHeader";
import { Separator } from "~/components/ui/separator";

export default function StudentCards() {
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard", },
        { href: "/academics", label: "Academics", },
        { href: "/userReg/student/edit", label: "Registered Students", current: true },
      ]
      
      return (
        <section className="w-full">
            <PageHeader breadcrumbs={breadcrumbs}/>
            <div className="pt-16">
            <div className="flex-1 p-4">
            <h1 className="text-center text-5xl p-4 font-serif font-semibold text-green-800">Students Credentials Detail</h1>
            <Separator className="bg-green-900" />
                <StudentCredDetails />
                <Separator className="bg-green-900" />
            </div>
            </div>
        </section>
    )
}