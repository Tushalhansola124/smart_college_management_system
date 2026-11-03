"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import {
  GetSemesterById,
  type ISemester,
} from "@/components/semester/semester.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import {
  GetAcademicYears,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";
import { SemesterView } from "@/components/semester/SemesterView";
import { SemesterViewSkeleton } from "@/components/semester/SemesterSkeleton";
import { DeleteSemesterDialog } from "@/components/semester/DeleteSemesterDialog";

export default function SemesterDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [semester, setSemester] = useState<ISemester | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [semRes, courseRes, yearRes] = await Promise.all([
          GetSemesterById(id),
          GetCourses(0, 100).catch(() => null),
          GetAcademicYears(0, 100).catch(() => null),
        ]);
        if (ignore) return;
        setSemester(semRes.data);
        if (courseRes) setCourses(courseRes.data.content);
        if (yearRes) setAcademicYears(yearRes.data.content);
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to load semester."
          );
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  const courseName =
    courses.find((c) => c.id === semester?.courseId)?.name ?? "-";
  const academicYearName =
    academicYears.find((y) => y.id === semester?.academicYearId)?.name ?? "-";

  return (
    <div className="mx-auto w-full max-w-8xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
     

      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Semester Details
          </h1>
          <p className="text-sm text-slate-500">
            View complete semester information.
          </p>
        </div>
        <div className="flex gap-2.5">
             <Button
  variant="outline"
  className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
  onClick={() => router.push("/semester")}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>
          {semester && (
            <>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() =>
                  router.push(`/semester/${id}/edit`)
                }
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-full border-rose-200 px-5 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50 hover:text-rose-700"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <SemesterViewSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : semester ? (
        <SemesterView
          semester={semester}
          courseName={courseName}
          academicYearName={academicYearName}
        />
      ) : null}

      <DeleteSemesterDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        semesterId={semester?.id ?? null}
        semesterName={semester?.name}
        onDeleted={() => {
          toast.success("Semester deleted.");
          router.push("/semester");
        }}
      />
    </div>
  );
}