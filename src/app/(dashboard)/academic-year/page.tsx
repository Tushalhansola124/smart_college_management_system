"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  GetAcademicYears,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";
import { AcademicYearStats } from "@/components/academic-year/AcademicYearStats";
import { AcademicYearFilters } from "@/components/academic-year/AcademicYearFilters";
import { AcademicYearTable } from "@/components/academic-year/AcademicYearTable";
import { DeleteAcademicYearDialog } from "@/components/academic-year/DeleteAcademicYearDialog";
import {
  AcademicYearStatsSkeleton,
  AcademicYearTableSkeleton,
} from "@/components/academic-year/AcademicYearSkeleton";

const PAGE_SIZE = 10;

export default function AcademicYearPage() {
  const [years, setYears] = useState<IAcademicYear[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IAcademicYear | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchYears = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetAcademicYears(page, PAGE_SIZE, search);
      setYears(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load academic years."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchYears, 300);
    return () => clearTimeout(timeout);
  }, [fetchYears]);

  // Reset to first page whenever the user types a new search — done inside the
  // event handler itself (not a separate effect) to avoid the cascading
  // setState-in-effect warning.
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(0);
  }, []);

  const currentCount = years.filter((y) => y.current).length;
  const upcomingCount = years.filter(
    (y) => !y.current && new Date(y.startDate) > new Date()
  ).length;

  const handleDeleteClick = (year: IAcademicYear) => {
    setDeleteTarget(year);
    setIsDeleteOpen(true);
  };

   const handleDeleted = () => {
    fetchYears();
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
     

      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <CalendarRange className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Academic Years
          </h1>
          <p className="text-sm text-slate-500">
            Manage academic year sessions across the institution.
          </p>
        </div>
      </div>

      {isLoading ? (
        <AcademicYearStatsSkeleton />
      ) : (
        <AcademicYearStats
          total={totalElements}
          currentCount={currentCount}
          upcomingCount={upcomingCount}
        />
      )}

      <AcademicYearFilters search={search} onSearchChange={handleSearchChange} />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button
            variant="outline"
            className="mt-3 rounded-lg"
            onClick={fetchYears}
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <AcademicYearTableSkeleton />
      ) : (
        <AcademicYearTable
          academicYears={years}
          startIndex={page * PAGE_SIZE}
          onDeleteClick={handleDeleteClick}
        />
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-slate-500">
            Page <span className="font-medium text-slate-900">{page + 1}</span>{" "}
            of <span className="font-medium text-slate-900">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 rounded-lg border-slate-200"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 rounded-lg border-slate-200"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <DeleteAcademicYearDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        academicYearId={deleteTarget?.id ?? null}
        academicYearName={deleteTarget?.name}
        onDeleted={handleDeleted}
      />
    </div>
  );
}