"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArchiveX, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  GetDeletedSemesters,
  RestoreSemester,
  type ISemester,
} from "@/components/semester/semester.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import {
  GetAcademicYears,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";
import { SemesterTableSkeleton } from "@/components/semester/SemesterSkeleton";

interface SemesterResponse {
  success: boolean;
  message: string;
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

export default function RestoreSemestersPage() {
  const router = useRouter();
  const [deleted, setDeleted] = useState<ISemester[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [restoreTarget, setRestoreTarget] = useState<ISemester | null>(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchDeleted = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [res, courseRes, yearRes] = await Promise.all([
        GetDeletedSemesters(0, 20),
        GetCourses(0, 100).catch(() => null),
        GetAcademicYears(0, 100).catch(() => null),
      ]);
      setDeleted(res.data.content);
      if (courseRes) setCourses(courseRes.data.content);
      if (yearRes) setAcademicYears(yearRes.data.content);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load deleted semesters."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await fetchDeleted();
    })();
    return () => {
      ignore = true;
    };
  }, [fetchDeleted]);

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.name]));
  const academicYearMap = Object.fromEntries(
    academicYears.map((y) => [y.id, y.name])
  );

  const handleRestoreClick = (sem: ISemester) => {
    setRestoreTarget(sem);
    setIsRestoreOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!restoreTarget) return;

    setIsRestoring(true);
    try {
      const res = (await RestoreSemester(
        restoreTarget.id
      )) as unknown as SemesterResponse;

      if (res.success) {
        toast.success(res.message);
        setIsRestoreOpen(false);
        fetchDeleted();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to restore semester."
      );
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
     

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
            <ArchiveX className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Deleted Semesters
            </h1>
            <p className="text-sm text-slate-500">
              Semesters that have been soft-deleted.
            </p>
          </div>
        </div>

            <Button
  variant="outline"
  className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
  onClick={() => router.push("/semester")}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button
            variant="outline"
            className="mt-3 rounded-full"
            onClick={fetchDeleted}
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <SemesterTableSkeleton rows={4} />
      ) : deleted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
            <ArchiveX className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            No deleted semesters
          </p>
          <p className="text-sm text-slate-500">
            Deleted semesters will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="h-11 w-14 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  #
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Semester
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Course
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Academic Year
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Deleted On
                </TableHead>
                <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deleted.map((sem, index) => (
                <TableRow
                  key={sem.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <TableCell className="py-3.5 text-slate-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3.5 font-medium text-slate-900">
                    {sem.name}
                    <span className="ml-1 text-xs text-slate-500">
                      (Sem {sem.semesterNumber})
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-slate-500">
                    {courseMap[sem.courseId] ?? "-"}
                  </TableCell>
                  <TableCell className="py-3.5 text-slate-500">
                    {academicYearMap[sem.academicYearId] ?? "-"}
                  </TableCell>
                  <TableCell className="py-3.5 text-slate-500">
                    {formatDate(sem.updatedAt)}
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 rounded-full border-[#0D9488] px-4 text-[#0D9488] hover:bg-[#0D9488] hover:text-white"
                      onClick={() => handleRestoreClick(sem)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Semester</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-medium text-slate-900">
                {restoreTarget?.name ?? "this semester"}
              </span>
              ? It will reappear in the active semesters list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              className="bg-[#0D9488] hover:bg-[#0F766E]"
            >
              {isRestoring ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}