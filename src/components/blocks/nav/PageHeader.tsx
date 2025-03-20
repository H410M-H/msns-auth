import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { SidebarTrigger } from "~/components/ui/sidebar";

interface PageHeaderProps {
  breadcrumbs: Array<{
    href: string;
    label: string;
    current?: boolean;
  }>;
}

export function PageHeader({ breadcrumbs }: PageHeaderProps) {
  return (
    <header className="absolute flex left-auto z-10 h-16 w-full items-center bg-gradient-to-r from-emerald-200 via-emerald-400 to-green-700 px-4 shadow-md">
      <SidebarTrigger className="px-4 mr-4" />
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                <BreadcrumbLink href={crumb.href}>
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="mx-2" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
