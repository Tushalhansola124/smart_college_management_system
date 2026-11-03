"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

import { GetFaculties, type IFaculty } from "@/components/faculty/faculty.controller";
import { GetDepartments, type IDepartment } from "@/components/department/department.controller";

import { FacultyStats } from "@/components/faculty/FacultyStats";
import { FacultyFilters } from "@/components/faculty/FacultyFilters";
import { FacultyTable } from "@/components/faculty/FacultyTable";
import { DeleteFacultyDialog } from "@/components/faculty/DeleteFacultyDialog";
import { FacultyStatsSkeleton, FacultyTableSkeleton } from "@/components/faculty/FacultySkeleton";
import type { DropdownOption } from "@/components/faculty/CustomDropdown";

const PAGE_SIZE = 10;

export default function FacultyPage() {
  const [faculties, setFaculties] = useState<IFaculty[]>([]);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [departments, setDepartments] = useState<IDepartment[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<IFaculty | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchFaculties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetFaculties(page, PAGE_SIZE, search);
      setFaculties(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load faculty.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await GetDepartments(0, 100);
      setDepartments(res.data.content);
    } catch {
      // Department filter stays empty if this fails.
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchFaculties();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchFaculties]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchDepartments();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchDepartments]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(0);
  }, []);

  const departmentOptions: DropdownOption[] = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.name, sublabel: d.code })),
    [departments]
  );

  const filteredFaculties = useMemo(() => {
    return faculties.filter((f) => {
      const matchesDept = departmentId ? f.departmentId === departmentId : true;
      const matchesStatus = status ? f.employmentStatus === status : true;
      return matchesDept && matchesStatus;
    });
  }, [faculties, departmentId, status]);

  const activeCount = faculties.filter((f) => f.employmentStatus === "ACTIVE").length;
  const inactiveCount = faculties.length - activeCount;

  const handleClearFilters = () => {
    setSearch("");
    setDepartmentId("");
    setStatus("");
    setPage(0);
  };

  const handleDeleteClick = (fac: IFaculty) => {
    setDeleteTarget(fac);
    setIsDeleteOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-9xl space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      

      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <Users className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Management</h1>
          <p className="text-sm text-slate-500">Manage faculty members and their information.</p>
        </div>
      </div>

      {isLoading ? (
        <FacultyStatsSkeleton />
      ) : (
        <FacultyStats total={totalElements} active={activeCount} inactive={inactiveCount} />
      )}

      <FacultyFilters
        search={search}
        onSearchChange={handleSearchChange}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        departmentOptions={departmentOptions}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button variant="outline" className="mt-3 rounded-full" onClick={fetchFaculties}>
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <FacultyTableSkeleton />
      ) : (
        <FacultyTable
          faculties={filteredFaculties}
          startIndex={page * PAGE_SIZE}
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

      <DeleteFacultyDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        facultyId={deleteTarget?.id ?? null}
        facultyName={deleteTarget?.fullName}
        onDeleted={fetchFaculties}
      />
    </div>
  );
}