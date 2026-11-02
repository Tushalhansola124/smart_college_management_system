"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, CalendarPlus } from "lucide-react";

import { SemesterForm } from "@/components/semester/SemesterForm";
import { CreateSemester } from "@/components/semester/semester.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import {
  GetAcademicYears,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";
import type { SemesterFormValues } from "@/app/schemas/semester.schema";

interface SemesterResponse {
  success: boolean;
  message: string;
}

export default function CreateSemesterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const [courseRes, yearRes] = await Promise.all([
          GetCourses(0, 100),
          GetAcademicYears(0, 100),
        ]);
        if (ignore) return;
        setCourses(courseRes.data.content);
        setAcademicYears(yearRes.data.content);
      } catch {
        // Dropdowns stay empty; form still usable for other fields.
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (values: SemesterFormValues) => {
    setIsSubmitting(true);
    try {
      const res = (await CreateSemester({
        name: values.name,
        semesterNumber: values.semesterNumber,
        courseId: values.courseId,
        academicYearId: values.academicYearId,
        startDate: values.startDate,
        endDate: values.endDate,
      })) as unknown as SemesterResponse;

      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard/semester");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
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
            <CalendarPlus className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add Semester
            </h1>
            <p className="text-sm text-slate-500">
              Create a new semester for a course.
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

      <SemesterForm
        mode="create"
        isSubmitting={isSubmitting}
        courses={courses}
        academicYears={academicYears}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/semester")}
      />
    </div>
  );
}