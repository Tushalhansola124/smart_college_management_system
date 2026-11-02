"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";

import {
  GetSemesters,
  type ISemester,
} from "@/components/semester/semester.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import {
  GetAcademicYears,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";

import { SemesterStats } from "@/components/semester/SemesterStats";
import { SemesterFilters } from "@/components/semester/SemesterFilters";
import { SemesterTable } from "@/components/semester/SemesterTable";
import { DeleteSemesterDialog } from "@/components/semester/DeleteSemesterDialog";
import {
  SemesterStatsSkeleton,
  SemesterTableSkeleton,
} from "@/components/semester/SemesterSkeleton";

const PAGE_SIZE = 10;

export default function SemesterPage() {
  const [semesters, setSemesters] = useState<ISemester[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<ISemester | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchSemesters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetSemesters(page, PAGE_SIZE);
      setSemesters(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load semesters."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const fetchLookups = useCallback(async () => {
    try {
      const [courseRes, yearRes] = await Promise.all([
        GetCourses(0, 100),
        GetAcademicYears(0, 100),
      ]);
      setCourses(courseRes.data.content);
      setAcademicYears(yearRes.data.content);
    } catch {
      // Lookups failing doesn't block the main semester list.
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchSemesters();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchSemesters]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchLookups();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchLookups]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const filteredSemesters = useMemo(() => {
    if (!search.trim()) return semesters;
    const q = search.trim().toLowerCase();
    return semesters.filter((s) => s.name.toLowerCase().includes(q));
  }, [semesters, search]);

  const courseMap = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c.name])),
    [courses]
  );
  const academicYearMap = useMemo(
    () => Object.fromEntries(academicYears.map((y) => [y.id, y.name])),
    [academicYears]
  );

  const activeCount = semesters.filter((s) => s.status === "ACTIVE").length;
  const inactiveCount = semesters.length - activeCount;

  const handleDeleteClick = (sem: ISemester) => {
    setDeleteTarget(sem);
    setIsDeleteOpen(true);
  };

  return (
   <div className="mx-auto w-full max-w-[1800px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
     

      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <Layers className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Semesters
          </h1>
          <p className="text-sm text-slate-500">
            Manage semesters across courses and academic years.
          </p>
        </div>
      </div>

      {isLoading ? (
        <SemesterStatsSkeleton />
      ) : (
        <SemesterStats
          total={totalElements}
          active={activeCount}
          inactive={inactiveCount}
        />
      )}

      <SemesterFilters search={search} onSearchChange={handleSearchChange} />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button
            variant="outline"
            className="mt-3 rounded-full"
            onClick={fetchSemesters}
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <SemesterTableSkeleton />
      ) : (
        <SemesterTable
          semesters={filteredSemesters}
          startIndex={page * PAGE_SIZE}
          courseMap={courseMap}
          academicYearMap={academicYearMap}
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

      <DeleteSemesterDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        semesterId={deleteTarget?.id ?? null}
        semesterName={deleteTarget?.name}
        onDeleted={fetchSemesters}
      />
    </div>
  );
}