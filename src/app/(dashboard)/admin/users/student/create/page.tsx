import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PageHeader } from "~/components/blocks/nav/PageHeader";
import StudentCreationDialog from "~/components/forms/student/StudentCreation";

export default function StudentRegistration(){
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard", },
        { href: "/academics", label: "Academics", },
        { href: "/userReg/student", label: "Student Registration", current: true },
      ]
      
      return (
        <ScrollArea className="items-center ">
          <PageHeader breadcrumbs={breadcrumbs} />
          <div className="pt-14">
            <div className="flex-1">
              <StudentCreationDialog />
            </div>
          </div>
        </ScrollArea>
        )
}
    
