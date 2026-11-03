"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid } from "lucide-react";

import { ClassSectionForm } from "@/components/class-section/ClassSectionForm";
import { CreateClassSection } from "@/components/class-section/class-section.controller";
import { GetDepartments, type IDepartment } from "@/components/department/department.controller";
import { GetCourses, type ICourse } from "@/components/course/controller";
import { GetSemesters, type ISemester } from "@/components/semester/semester.controller";
import { GetAcademicYears, type IAcademicYear } from "@/components/academic-year/academic-years.controller";
import type { ClassSectionFormValues } from "@/app/schemas/class-section.schema";
import type { DropdownOption } from "@/components/class-section/CustomDropdown";

interface ClassSectionResponse {
  success: boolean;
  message: string;
}

export default function CreateClassSectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [semesters, setSemesters] = useState<ISemester[]>([]);
  const [semestersLoading, setSemestersLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [academicYearsLoading, setAcademicYearsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await GetDepartments(0, 100);
        if (!ignore) setDepartments(res.data.content);
      } catch {
        // stays empty
      } finally {
        if (!ignore) setDepartmentsLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await GetCourses(0, 100);
        if (!ignore) setCourses(res.data.content);
      } catch {
        // stays empty
      } finally {
        if (!ignore) setCoursesLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await GetSemesters(0, 100);
        if (!ignore) setSemesters(res.data.content);
      } catch {
        // stays empty
      } finally {
        if (!ignore) setSemestersLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await GetAcademicYears(0, 100);
        if (!ignore) setAcademicYears(res.data.content);
      } catch {
        // stays empty
      } finally {
        if (!ignore) setAcademicYearsLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const departmentOptions: DropdownOption[] = departments.map((d) => ({
    value: d.id,
    label: d.name,
   
  }));
  const courseOptions: DropdownOption[] = courses.map((c) => ({
    value: c.id,
    label: c.name,
   
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
      const res = (await CreateClassSection({
        name: values.name,
        courseId: values.courseId,
        semesterId: values.semesterId,
        academicYearId: values.academicYearId,
        departmentId: values.departmentId,
      })) as unknown as ClassSectionResponse;

      if (res.success) {
        toast.success(res.message);
        router.push("/class-section");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Class</h1>
            <p className="text-sm text-slate-500">Add a new class section to the system.</p>
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

      <ClassSectionForm
        mode="create"
        isSubmitting={isSubmitting}
        departmentOptions={departmentOptions}
        departmentsLoading={departmentsLoading}
        courseOptions={courseOptions}
        coursesLoading={coursesLoading}
        academicYearOptions={academicYearOptions}
        academicYearsLoading={academicYearsLoading}
        semesterOptions={semesterOptions}
        semestersLoading={semestersLoading}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/class-section")}
      />
    </div>
  );
}