// app/dashboard/department/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GetDepartmentById,
  UpdateDepartment,
  type IDepartment,
} from "@/components/department/department.controller";
import { DepartmentForm } from "@/components/department/DepartmentForm";
import { DepartmentViewSkeleton } from "@/components/department/DepartmentSkeleton";
import type { DepartmentFormValues } from "@/app/schemas/department.schema";

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [department, setDepartment] = useState<IDepartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await GetDepartmentById(id);
        setDepartment(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load department."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDepartment();
  }, [id]);

  const handleSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await UpdateDepartment(id, {
        name: values.name,
        code: values.code,
        description: values.description,
        hodId: values.hodId ?? null,
      });
      if (res.success) {
        toast.success(res.message);
        router.push(`/dashboard/department`);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update department."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* 
      1. Removed absolute vertical centering (items-center) so the form sits naturally at the top.
      2. Added sensible top padding (py-10) for a standard dashboard layout.
    */
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        
        {/* Professional Header Block: Left aligned with inline circular back button */}
        <div className="mb-8 flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mt-1 h-9 w-9 shrink-0 rounded-full border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Edit Department
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Update the academic department's core information and settings.
            </p>
          </div>
        </div>

        {/* Content Section (Form / Loading / Error) */}
        <div className="w-full">
          {isLoading ? (
            <DepartmentViewSkeleton />
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700 shadow-sm">
              {error}
            </div>
          ) : department ? (
            <DepartmentForm
              mode="edit"
              defaultValues={{
                name: department.name,
                code: department.code,
                description: department.description,
                hodId: department.hodId,
              }}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
            />
          ) : null}
        </div>

      </div>
    </div>
  );
}