<<<<<<< HEAD
import React from 'react'

const Department = () => {
  return (
    <div>Department</div>
  )
}

export default Department
=======
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
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  GetDepartments,
  type IDepartment,
} from "@/components/department/department.controller";
import { DepartmentStats } from "@/components/department/DepartmentStats";
import { DepartmentFilters } from "@/components/department/DepartmentFilters";
import { DepartmentTable } from "@/components/department/DepartmentTable";
import { DeleteDepartmentDialog } from "@/components/department/DeleteDepartmentDialog";
import {
  DepartmentStatsSkeleton,
  DepartmentTableSkeleton,
} from "@/components/department/DepartmentSkeleton";

const PAGE_SIZE = 10;

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IDepartment | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetDepartments(page, PAGE_SIZE, search);
      setDepartments(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load departments."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchDepartments, 300);
    return () => clearTimeout(timeout);
  }, [fetchDepartments]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const activeCount = departments.filter((d) => d.status === "ACTIVE").length;
  const inactiveCount = departments.length - activeCount;

  const handleDeleteClick = (department: IDepartment) => {
    setDeleteTarget(department);
    setIsDeleteOpen(true);
  };

  const handleDeleted = () => {
    toast.success("List refreshed.");
    fetchDepartments();
  };

  return (
   <div className="w-full max-w-none space-y-6 px-4 py-6 sm:px-6 lg:px-8">
     

      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
          <Building2 className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Departments
          </h1>
          <p className="text-sm text-slate-500">
            Manage academic departments across the institution.
          </p>
        </div>
      </div>

      {isLoading ? (
        <DepartmentStatsSkeleton />
      ) : (
        <DepartmentStats
          total={totalElements}
          active={activeCount}
          inactive={inactiveCount}
        />
      )}

      <DepartmentFilters search={search} onSearchChange={setSearch} />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button
            variant="outline"
            className="mt-3 rounded-lg"
            onClick={fetchDepartments}
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <DepartmentTableSkeleton />
      ) : (
        <DepartmentTable
          departments={departments}
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

      <DeleteDepartmentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        departmentId={deleteTarget?.id ?? null}
        departmentName={deleteTarget?.name}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
>>>>>>> 9c2fdab2d7cf0292b157c760ddd4b010d05efaf2
