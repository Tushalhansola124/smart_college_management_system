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
import { MoreHorizontal, Pencil, Trash2, CalendarRange } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IAcademicYear } from "@/components/academic-year/academic-years.controller";

interface AcademicYearTableProps {
  academicYears: IAcademicYear[];
  /** Row number of the first item on the current page (0 for page 1, 10 for page 2 at size 10, etc.) */
  startIndex?: number;
  onDeleteClick: (academicYear: IAcademicYear) => void;
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

type YearStatus = "current" | "upcoming" | "completed";

function getYearStatus(year: IAcademicYear): YearStatus {
  if (year.current) return "current";
  const now = new Date();
  if (new Date(year.startDate) > now) return "upcoming";
  return "completed";
}

const statusConfig: Record<
  YearStatus,
  { label: string; className: string; dotClassName: string }
> = {
  current: {
    label: "Current",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClassName: "bg-emerald-500",
  },
  upcoming: {
    label: "Upcoming",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    dotClassName: "bg-slate-400",
  },
};

export function AcademicYearTable({
  academicYears,
  startIndex = 0,
  onDeleteClick,
}: AcademicYearTableProps) {
  const router = useRouter();

  if (academicYears.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <CalendarRange className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <p className="text-sm font-semibold text-slate-900">
          No academic years found
        </p>
        <p className="text-sm text-slate-500">
          Try adjusting your search or add a new academic year.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="h-11 w-14 text-xs font-semibold uppercase tracking-wider text-slate-500">
              #
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Academic Year
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Start Date
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              End Date
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
          {academicYears.map((year, index) => {
            const status = getYearStatus(year);
            const config = statusConfig[status];

            return (
              <TableRow
                key={year.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/60"
              >
                <TableCell className="py-3.5 text-slate-400">
                  {startIndex + index + 1}
                </TableCell>

                <TableCell className="py-3.5 font-medium text-slate-900">
                  {year.name}
                </TableCell>

                <TableCell className="py-3.5 text-slate-500">
                  {formatDate(year.startDate)}
                </TableCell>

                <TableCell className="py-3.5 text-slate-500">
                  {formatDate(year.endDate)}
                </TableCell>

                <TableCell className="py-3.5">
                  <Badge
                    variant="outline"
                    className={`gap-1.5 rounded-full font-medium ${config.className}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`}
                    />
                    {config.label}
                  </Badge>
                </TableCell>

                <TableCell className="py-3.5 text-slate-500">
                  {formatDate(year.createdAt)}
                </TableCell>

                <TableCell className="py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`Actions for ${year.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() =>
                          router.push(
                            `/academic-year/${year.id}/edit`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                        onClick={() => onDeleteClick(year)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}