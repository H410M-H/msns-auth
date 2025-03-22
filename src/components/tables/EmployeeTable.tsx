"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import {
  type ColumnDef,
  type SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Checkbox } from "~/components/ui/checkbox"
import { EmployeeDeletionDialog } from "../forms/employee/EmployeeDeletion"
import { CSVUploadDialog } from "../forms/student/FileInput"
import { DotSquareIcon, RefreshCcw } from "lucide-react"

type EmployeeProps = {
  employeeId: string
  registrationNumber: string
  admissionNumber: string;
  employeeName: string
  fatherName: string
  gender: "MALE" | "FEMALE" | "CUSTOM"
  dob: string
  designation: "Principal" | "Admin" | "Head" | "Clerk" | "Teacher" | "Worker"
  mobileNo: string
  education: string
}

const columns: ColumnDef<EmployeeProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "registrationNumber",
    header: "Reg #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("registrationNumber")}</div>,
  },
  {
    accessorKey: "employeeName",
    header: "Name",
    cell: ({ row }) => <div className="font-bold">{row.getValue("employeeName")}</div>,
  },
  {
    accessorKey: "fatherName",
    header: "Father Name",
    cell: ({ row }) => <span>{row.getValue("fatherName")}</span>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <span>{row.getValue("gender")}</span>,
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dob"))
      return <span>{date.toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => <span>{row.getValue("designation")}</span>,
  },
  {
    accessorKey: "mobileNo",
    header: "Mobile",
    cell: ({ row }) => <span>{row.getValue("mobileNo")}</span>,
  },
  {
    accessorKey: "doj",
    header: "Date of Joining",
    cell: ({ row }) => {
      const date = new Date(row.getValue("doj"))
      return <span>{date.toLocaleDateString()}</span>
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <DotSquareIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/student/edit/${row.original.employeeId}`}>
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function EmployeeTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { data: employees, refetch } = api.employee.getEmployees.useQuery();

  const table = useReactTable({
    data: employees ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Search name"
          value={(table.getColumn("employeeName")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("employeeName")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="shrink-0"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <EmployeeDeletionDialog
            employeeIds={table
              .getSelectedRowModel()
              .rows.map((row) => row.original.employeeId)
              .filter(Boolean)}
          />
          <CSVUploadDialog />
          <Button asChild>
            <Link href="/userReg/faculty/create">Create</Link>
          </Button>
          <Button asChild>
            <Link href="/userReg/faculty/edit">View Cards</Link>
          </Button>
        </div>
      </div>
      <div className="p-4 border rounded-md">        
      <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <span className="text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

