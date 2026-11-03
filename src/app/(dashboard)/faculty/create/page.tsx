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
import { ArrowLeft, UserPlus } from "lucide-react";

import { FacultyForm } from "@/components/faculty/FacultyForm";
import { CreateFaculty } from "@/components/faculty/faculty.controller";
import { GetDepartments, type IDepartment } from "@/components/department/department.controller";
import { GetUsers, type IUser } from "@/components/user/contoller";
import type { FacultyFormValues } from "@/app/schemas/faculty.schema";
import type { DropdownOption } from "@/components/faculty/CustomDropdown";

interface FacultyResponse {
  success: boolean;
  message: string;
}

export default function CreateFacultyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const [users, setUsers] = useState<IUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await GetDepartments(0, 100);
        if (!ignore) setDepartments(res.data.content);
      } catch {
        // Dropdown stays empty.
      } finally {
        if (!ignore) setDepartmentsLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await GetUsers(0, 100);
        if (!ignore) setUsers(res.data.content);
      } catch {
        // Dropdown stays empty.
      } finally {
        if (!ignore) setUsersLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const departmentOptions: DropdownOption[] = departments.map((d) => ({
    value: d.id,
    label: d.name,
    sublabel: d.code,
  }));

 const userOptions: DropdownOption[] = users.map((u) => ({
  value: u.id,
  label: u.fullName,
//   sublabel: u.email,
}));

  const handleSubmit = async (values: FacultyFormValues) => {
    setIsSubmitting(true);
    try {
      const res = (await CreateFaculty({
        userId: values.userId,
        employeeCode: values.employeeCode,
        departmentId: values.departmentId,
        designation: values.designation,
        phone: values.phone,
        qualification: values.qualification,
        joiningDate: values.joiningDate,
      })) as unknown as FacultyResponse;

      if (res.success) {
        toast.success(res.message);
        router.push("/faculty");
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
            <UserPlus className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Faculty</h1>
            <p className="text-sm text-slate-500">Create a new faculty member record.</p>
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

      <FacultyForm
        mode="create"
        isSubmitting={isSubmitting}
        userOptions={userOptions}
        usersLoading={usersLoading}
        departmentOptions={departmentOptions}
        departmentsLoading={departmentsLoading}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/faculty")}
      />
    </div>
  );
}