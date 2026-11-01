// app/dashboard/department/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react"; // <-- Import icon

import { Button } from "@/components/ui/button"; // <-- Import button
import { DepartmentForm } from "@/components/department/DepartmentForm";
import { CreateDepartment } from "@/components/department/department.controller";
import type { DepartmentFormValues } from "@/app/schemas/department.schema";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await CreateDepartment({
        name: values.name,
        code: values.code,
        description: values.description,
        hodId: values.hodId ?? null,
      });
      
      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard/department"); // Fixed to match standard dashboard route
      } else {
        toast.error(res.message);
      }
      
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create department."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              Add Department
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Create a new academic department.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full">
          <DepartmentForm
            mode="create"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => router.back()} // Uses router.back() to match the top back button
          />
        </div>
        
      </div>
    </div>
  );
}