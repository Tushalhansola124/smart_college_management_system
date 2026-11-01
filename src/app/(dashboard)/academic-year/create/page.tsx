"use client";

import { useState } from "react";
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

import { AcademicYearForm } from "@/components/academic-year/AcademicYearForm";
import { CreateAcademicYear } from "@/components/academic-year/academic-years.controller";
import type { AcademicYearFormValues } from "@/app/schemas/academic-year.schema";

export default function CreateAcademicYearPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AcademicYearFormValues) => {
    setIsSubmitting(true);
    try {
     const res= await CreateAcademicYear({
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
      });
      if(res.success){
        toast.success(res.message)
        router.push("/academic-year");
      }else{
        toast.error(res.message)
      }
      
     
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create academic year."
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
              Add Academic Year
            </h1>
            <p className="text-sm text-slate-500">
              Create a new academic year session.
            </p>
          </div>
        </div>

       <Button
  variant="outline"
  className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
  onClick={() => router.push("/academic-year")}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>
      </div>

      <AcademicYearForm
        mode="create"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/academic-year")}
      />
    </div>
  );
}