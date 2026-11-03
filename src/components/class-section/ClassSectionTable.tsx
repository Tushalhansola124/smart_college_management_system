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
import { Eye, MoreHorizontal, Pencil, RefreshCw, Trash2, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IClassSection } from "@/components/class-section/class-section.controller";

interface ClassSectionTableProps {
  classSections: IClassSection[];
  startIndex?: number;
  onStatusClick: (cs: IClassSection) => void;
  onDeleteClick: (cs: IClassSection) => void;
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

export function ClassSectionTable({
  classSections,
  startIndex = 0,
  onStatusClick,
  onDeleteClick,
}: ClassSectionTableProps) {
  const router = useRouter();

  if (classSections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <LayoutGrid className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <p className="text-sm font-semibold text-slate-900">No class sections found</p>
        <p className="text-sm text-slate-500">
          Try adjusting your filters, or create a new class section.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="h-11 w-14 text-xs font-semibold uppercase tracking-wider text-slate-500">#</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Class / Section</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Department</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Semester</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Academic Year</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Created Date</TableHead>
            <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {classSections.map((cs, index) => (
            <TableRow
              key={cs.id}
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60"
            >
              <TableCell className="py-3.5 text-slate-400">{startIndex + index + 1}</TableCell>
              <TableCell className="py-3.5 font-medium text-slate-900">{cs.name}</TableCell>
              <TableCell className="py-3.5 text-slate-600">{cs.course?.name ?? "-"}</TableCell>
              <TableCell className="py-3.5 text-slate-600">{cs.department?.name ?? "-"}</TableCell>
              <TableCell className="py-3.5 text-slate-600">{cs.semester?.name ?? "-"}</TableCell>
              <TableCell className="py-3.5 text-slate-600">{cs.academicYear?.name ?? "-"}</TableCell>
              <TableCell className="py-3.5">
                <Badge
                  variant="outline"
                  className={
                    cs.status === "ACTIVE"
                      ? "gap-1.5 rounded-full border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                      : "gap-1.5 rounded-full border-slate-200 bg-slate-100 font-medium text-slate-500"
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      cs.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {cs.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="py-3.5 text-slate-500">{formatDate(cs.createdAt)}</TableCell>
              <TableCell className="py-3.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label={`Actions for ${cs.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => router.push(`/class-section/${cs.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => router.push(`/class-section/${cs.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => onStatusClick(cs)}>
                      <RefreshCw className="h-4 w-4" />
                      Change Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                      onClick={() => onDeleteClick(cs)}
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