"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid } from "lucide-react";

import {
  GetClassSectionById,
  UpdateClassSection,
  type IClassSection,
} from "@/components/class-section/class-section.controller";
import { GetDepartments, type IDepartment } from "@/components/department/department.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import { GetSemesters, type ISemester } from "@/components/semester/semester.controller";
import { GetAcademicYears, type IAcademicYear } from "@/components/academic-year/academic-years.controller";
import { ClassSectionForm } from "@/components/class-section/ClassSectionForm";
import { ClassSectionFormSkeleton } from "@/components/class-section/ClassSectionSkeleton";
import type { ClassSectionFormValues } from "@/app/schemas/class-section.schema";
import type { DropdownOption } from "@/components/class-section/CustomDropdown";

interface ClassSectionResponse {
  success: boolean;
  message: string;
}

export default function EditClassSectionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [classSection, setClassSection] = useState<IClassSection | null>(null);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [semesters, setSemesters] = useState<ISemester[]>([]);
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
        const [csRes, deptRes, courseRes, semRes, yearRes] = await Promise.all([
          GetClassSectionById(id),
          GetDepartments(0, 100).catch(() => null),
          GetCourses(0, 100).catch(() => null),
          GetSemesters(0, 100).catch(() => null),
          GetAcademicYears(0, 100).catch(() => null),
        ]);
        if (ignore) return;
        setClassSection(csRes.data);
        if (deptRes) setDepartments(deptRes.data.content);
        if (courseRes) setCourses(courseRes.data.content);
        if (semRes) setSemesters(semRes.data.content);
        if (yearRes) setAcademicYears(yearRes.data.content);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load class section.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  const departmentOptions: DropdownOption[] = departments.map((d) => ({
    value: d.id,
    label: d.name,
    sublabel: d.code,
  }));
  const courseOptions: DropdownOption[] = courses.map((c) => ({
    value: c.id,
    label: c.name,
    sublabel: c.code,
  }));
  const semesterOptions: DropdownOption[] = semesters.map((s) => ({
    value: s.id,
    label: s.name,
  }));
  const academicYearOptions: DropdownOption[] = academicYears.map((y) => ({
    value: y.id,
    label: y.name,
  }));

  const handleSubmit = async (values: ClassSectionFormValues) => {
    setIsSubmitting(true);
    try {
      const res = (await UpdateClassSection(id, {
        name: values.name,
        courseId: values.courseId,
        semesterId: values.semesterId,
        academicYearId: values.academicYearId,
        departmentId: values.departmentId,
      })) as unknown as ClassSectionResponse;

      if (res.success) {
        toast.success(res.message);
        router.push(`/class-section/${id}`);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
    

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] ring-1 ring-inset ring-teal-100">
            <LayoutGrid className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Class Section</h1>
            <p className="text-sm text-slate-500">Update class section information.</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => router.push("/class-section")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <ClassSectionFormSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : classSection ? (
        <ClassSectionForm
          mode="edit"
          defaultValues={{
            name: classSection.name,
            departmentId: classSection.department?.id ?? "",
            courseId: classSection.course?.id ?? "",
            academicYearId: classSection.academicYear?.id ?? "",
            semesterId: classSection.semester?.id ?? "",
          }}
          isSubmitting={isSubmitting}
          departmentOptions={departmentOptions}
          courseOptions={courseOptions}
          academicYearOptions={academicYearOptions}
          semesterOptions={semesterOptions}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/class-section/${id}`)}
        />
      ) : null}
    </div>
  );
}