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
import { ArrowLeft, CalendarCog } from "lucide-react";

import {
  GetSemesterById,
  UpdateSemester,
  type ISemester,
} from "@/components/semester/semester.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import {
  GetAcademicYears,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";
import { SemesterForm } from "@/components/semester/SemesterForm";
import { SemesterFormSkeleton } from "@/components/semester/SemesterSkeleton";
import type { SemesterFormValues } from "@/app/schemas/semester.schema";

interface SemesterResponse {
  success: boolean;
  message: string;
}

export default function EditSemesterPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [semester, setSemester] = useState<ISemester | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (values: SemesterFormValues) => {
    setIsSubmitting(true);
    try {
      const res = (await UpdateSemester(id, {
        name: values.name,
        semesterNumber: values.semesterNumber,
        courseId: values.courseId,
        academicYearId: values.academicYearId,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      })) as unknown as SemesterResponse;

      if (res.success) {
        toast.success(res.message);
        router.push(`/dashboard/semester/${id}`);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
     

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
            <CalendarCog className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Semester
            </h1>
            <p className="text-sm text-slate-500">
              Update semester information.
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

      {isLoading ? (
        <SemesterFormSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : semester ? (
        <SemesterForm
          mode="edit"
          defaultValues={{
            name: semester.name,
            semesterNumber: semester.semesterNumber,
            courseId: semester.courseId,
            academicYearId: semester.academicYearId,
            startDate: semester.startDate?.slice(0, 10) ?? "",
            endDate: semester.endDate?.slice(0, 10) ?? "",
            status: semester.status,
          }}
          isSubmitting={isSubmitting}
          courses={courses}
          academicYears={academicYears}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/semester/${id}`)}
        />
      ) : null}
    </div>
  );
}