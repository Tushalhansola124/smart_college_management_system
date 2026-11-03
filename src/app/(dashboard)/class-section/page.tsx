"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";

import { GetClassSections, type IClassSection } from "@/components/class-section/class-section.controller";
import { GetDepartments, type IDepartment } from "@/components/department/department.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import { GetSemesters, type ISemester } from "@/components/semester/semester.controller";
import { GetAcademicYears, type IAcademicYear } from "@/components/academic-year/academic-years.controller";

import { ClassSectionStats } from "@/components/class-section/ClassSectionStats";
import { ClassSectionFilters } from "@/components/class-section/ClassSectionFilters";
import { ClassSectionTable } from "@/components/class-section/ClassSectionTable";
import { ClassSectionStatusDialog } from "@/components/class-section/ClassSectionStatusDialog";
import { DeleteClassSectionDialog } from "@/components/class-section/DeleteClassSectionDialog";
import {
  ClassSectionStatsSkeleton,
  ClassSectionTableSkeleton,
} from "@/components/class-section/ClassSectionSkeleton";
import type { DropdownOption } from "@/components/class-section/CustomDropdown";

const PAGE_SIZE = 10;

export default function ClassSectionPage() {
  const [classSections, setClassSections] = useState<IClassSection[]>([]);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [semesters, setSemesters] = useState<ISemester[]>([]);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);

  const [statusTarget, setStatusTarget] = useState<IClassSection | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<IClassSection | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchClassSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetClassSections(page, PAGE_SIZE);
      setClassSections(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load class sections.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const fetchLookups = useCallback(async () => {
    try {
      const [deptRes, courseRes, semRes, yearRes] = await Promise.all([
        GetDepartments(0, 100).catch(() => null),
        GetCourses(0, 100).catch(() => null),
        GetSemesters(0, 100).catch(() => null),
        GetAcademicYears(0, 100).catch(() => null),
      ]);
      if (deptRes) setDepartments(deptRes.data.content);
      if (courseRes) setCourses(courseRes.data.content);
      if (semRes) setSemesters(semRes.data.content);
      if (yearRes) setAcademicYears(yearRes.data.content);
    } catch {
      // Filters stay empty if lookups fail.
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchClassSections();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchClassSections]);

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

  const handleClearFilters = () => {
    setSearch("");
    setDepartmentId("");
    setCourseId("");
    setSemesterId("");
    setAcademicYearId("");
    setStatus("");
  };

  const departmentOptions: DropdownOption[] = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.name, sublabel: d.code })),
    [departments]
  );
  const courseOptions: DropdownOption[] = useMemo(
    () => courses.map((c) => ({ value: c.id, label: c.name, sublabel: c.code })),
    [courses]
  );
  const semesterOptions: DropdownOption[] = useMemo(
    () => semesters.map((s) => ({ value: s.id, label: s.name })),
    [semesters]
  );
  const academicYearOptions: DropdownOption[] = useMemo(
    () => academicYears.map((y) => ({ value: y.id, label: y.name })),
    [academicYears]
  );

  const filteredClassSections = useMemo(() => {
    return classSections.filter((cs) => {
      const matchesSearch = search.trim()
        ? cs.name.toLowerCase().includes(search.trim().toLowerCase())
        : true;
      const matchesDept = departmentId ? cs.department?.id === departmentId : true;
      const matchesCourse = courseId ? cs.course?.id === courseId : true;
      const matchesSem = semesterId ? cs.semester?.id === semesterId : true;
      const matchesYear = academicYearId ? cs.academicYear?.id === academicYearId : true;
      const matchesStatus = status ? cs.status === status : true;
      return matchesSearch && matchesDept && matchesCourse && matchesSem && matchesYear && matchesStatus;
    });
  }, [classSections, search, departmentId, courseId, semesterId, academicYearId, status]);

  const activeCount = classSections.filter((cs) => cs.status === "ACTIVE").length;
  const inactiveCount = classSections.length - activeCount;

  const handleStatusClick = (cs: IClassSection) => {
    setStatusTarget(cs);
    setIsStatusOpen(true);
  };

  const handleDeleteClick = (cs: IClassSection) => {
    setDeleteTarget(cs);
    setIsDeleteOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-9xl space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      

      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <LayoutGrid className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Class & Section Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage academic classes, sections, courses and semester allocations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <ClassSectionStatsSkeleton />
      ) : (
        <ClassSectionStats total={totalElements} active={activeCount} inactive={inactiveCount} />
      )}

      <ClassSectionFilters
        search={search}
        onSearchChange={handleSearchChange}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        departmentOptions={departmentOptions}
        courseId={courseId}
        onCourseChange={setCourseId}
        courseOptions={courseOptions}
        semesterId={semesterId}
        onSemesterChange={setSemesterId}
        semesterOptions={semesterOptions}
        academicYearId={academicYearId}
        onAcademicYearChange={setAcademicYearId}
        academicYearOptions={academicYearOptions}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button variant="outline" className="mt-3 rounded-full" onClick={fetchClassSections}>
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <ClassSectionTableSkeleton />
      ) : (
        <ClassSectionTable
          classSections={filteredClassSections}
          startIndex={page * PAGE_SIZE}
          onStatusClick={handleStatusClick}
          onDeleteClick={handleDeleteClick}
        />
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-slate-500">
            Page <span className="font-medium text-slate-900">{page + 1}</span> of{" "}
            <span className="font-medium text-slate-900">{totalPages}</span>
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

      <ClassSectionStatusDialog
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        classSectionId={statusTarget?.id ?? null}
        classSectionName={statusTarget?.name}
        currentStatus={statusTarget?.status}
        onUpdated={fetchClassSections}
      />

      <DeleteClassSectionDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        classSectionId={deleteTarget?.id ?? null}
        classSectionName={deleteTarget?.name}
        onDeleted={fetchClassSections}
      />
    </div>
  );
}