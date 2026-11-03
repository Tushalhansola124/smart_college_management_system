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
import { ArrowLeft, UserCog } from "lucide-react";

import {
  GetFacultyById,
  UpdateFaculty,
  type IFaculty,
} from "@/components/faculty/faculty.controller";
import { GetDepartments, type IDepartment } from "@/components/department/department.controller";
import { GetUsers, type IUser } from "@/components/user/contoller";
import { FacultyForm } from "@/components/faculty/FacultyForm";
import { FacultyFormSkeleton } from "@/components/faculty/FacultySkeleton";
import type { FacultyFormValues } from "@/app/schemas/faculty.schema";
import type { DropdownOption } from "@/components/faculty/CustomDropdown";

interface FacultyResponse {
  success: boolean;
  message: string;
}

export default function EditFacultyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [faculty, setFaculty] = useState<IFaculty | null>(null);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
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
        const [facRes, deptRes, userRes] = await Promise.all([
          GetFacultyById(id),
          GetDepartments(0, 100).catch(() => null),
          GetUsers(0, 100).catch(() => null),
        ]);
        if (ignore) return;
        setFaculty(facRes.data);
        if (deptRes) setDepartments(deptRes.data.content);
        if (userRes) setUsers(userRes.data.content);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load faculty.");
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

 const userOptions: DropdownOption[] = users.map((u) => ({
  value: u.id,
  label: u.fullName,
  sublabel: u.email,
}));

  const handleSubmit = async (values: FacultyFormValues) => {
    setIsSubmitting(true);
    try {
      const res = (await UpdateFaculty(id, {
        employeeCode: values.employeeCode,
        departmentId: values.departmentId,
        designation: values.designation,
        phone: values.phone,
        qualification: values.qualification,
        joiningDate: values.joiningDate,
        employmentStatus: values.employmentStatus,
      })) as unknown as FacultyResponse;

      if (res.success) {
        toast.success(res.message);
        router.push(`/faculty/${id}`);
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
            <UserCog className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Faculty</h1>
            <p className="text-sm text-slate-500">Update faculty member information.</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => router.push("/faculty")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <FacultyFormSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : faculty ? (
        <FacultyForm
          mode="edit"
          defaultValues={{
            userId: faculty.userId,
            employeeCode: faculty.employeeCode,
            departmentId: faculty.departmentId,
            designation: faculty.designation,
            phone: faculty.phone,
            qualification: faculty.qualification,
            joiningDate: faculty.joiningDate?.slice(0, 10) ?? "",
            employmentStatus: faculty.employmentStatus,
          }}
          isSubmitting={isSubmitting}
          userOptions={userOptions}
          departmentOptions={departmentOptions}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/faculty/${id}`)}
        />
      ) : null}
    </div>
  );
}