
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { IDepartment } from "@/components/department/department.controller";

interface DepartmentTableProps {
  departments: IDepartment[];
  onDeleteClick: (department: IDepartment) => void;
}

function formatDate(dateString: string) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DepartmentTable({
  departments,
  onDeleteClick,
}: DepartmentTableProps) {
  const router = useRouter();

  if (departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <Building2 className="h-5 w-5" strokeWidth={2.25} />
        </div>

        <p className="text-sm font-semibold text-slate-900">
          No departments found
        </p>

        <p className="text-sm text-slate-500">
          Try adjusting your search or add a new department.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="h-11 w-14 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              #
            </TableHead>

            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Department
            </TableHead>

            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Code
            </TableHead>

            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </TableHead>

            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              HOD
            </TableHead>

            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status
            </TableHead>

            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Created Date
            </TableHead>

            <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {departments.map((dept, index) => (
            <TableRow
              key={dept.id}
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60"
            >
              {/* Index */}
              <TableCell className="py-3.5 text-center text-sm font-medium text-slate-400">
                {index + 1}
              </TableCell>

              <TableCell className="py-3.5 font-medium text-slate-900">
                {dept.name}
              </TableCell>

              <TableCell className="py-3.5">
                <Badge
                  variant="outline"
                  className="rounded-md border-slate-200 bg-slate-50 font-mono text-xs font-medium text-slate-600"
                >
                  {dept.code}
                </Badge>
              </TableCell>

              <TableCell className="max-w-[260px] truncate py-3.5 text-slate-500">
                {dept.description || "-"}
              </TableCell>

              <TableCell className="py-3.5 text-slate-700">
                {dept.hodName ?? (
                  <span className="text-slate-400">Not Assigned</span>
                )}
              </TableCell>

              <TableCell className="py-3.5">
                <Badge
                  variant="outline"
                  className={
                    dept.status === "ACTIVE"
                      ? "gap-1.5 rounded-full border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                      : "gap-1.5 rounded-full border-slate-200 bg-slate-100 font-medium text-slate-500"
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      dept.status === "ACTIVE"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {dept.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="py-3.5 text-slate-500">
                {formatDate(dept.createdAt)}
              </TableCell>

              <TableCell className="py-3.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label={`Actions for ${dept.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() =>
                        router.push(`/department/${dept.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() =>
                        router.push(
                          `/department/${dept.id}/edit`
                        )
                      }
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                      onClick={() => onDeleteClick(dept)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
