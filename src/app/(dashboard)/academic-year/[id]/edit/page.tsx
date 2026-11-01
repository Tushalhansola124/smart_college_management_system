"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarCog, CheckCircle2, Loader2 } from "lucide-react";

import {
  GetAcademicYearById,
  UpdateAcademicYear,
  type IAcademicYear,
} from "@/components/academic-year/academic-years.controller";
import { AcademicYearForm } from "@/components/academic-year/AcademicYearForm";
import { AcademicYearFormSkeleton } from "@/components/academic-year/AcademicYearSkeleton";
import type { AcademicYearFormValues } from "@/app/schemas/academic-year.schema";

export default function EditAcademicYearPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [year, setYear] = useState<IAcademicYear | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMarkingCurrent, setIsMarkingCurrent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pulled out so the "Set as Current Year" button can re-trigger it too.
  const fetchYear = useCallback(async (yearId: string) => {
    // Yield one microtask before touching state so this never runs
    // synchronously inside an Effect body (avoids the
    // "setState in effect" React warning).
    await Promise.resolve();

    setIsLoading(true);
    setError(null);
    try {
      const res = await GetAcademicYearById(yearId);
      setYear(res.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load academic year."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    (async () => {
      await fetchYear(id);
    })();

    return () => {
      ignore = true;
    };
  }, [id, fetchYear]);

  const handleSubmit = async (values: AcademicYearFormValues) => {
    setIsSubmitting(true);
    try {
      await UpdateAcademicYear(id, {
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
      });
      toast.success("Academic year updated successfully.");
      router.push("/dashboard/academic-year");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update academic year."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkCurrent = async () => {
    setIsMarkingCurrent(true);
    try {
    const res=  await UpdateAcademicYear(id, { current: true });
       if(res.success){
        toast.success(res.message)
        router.push("/academic-year");
      }else{
        toast.error(res.message)
      }
     
      await fetchYear(id);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update current academic year."
      );
    } finally {
      setIsMarkingCurrent(false);
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
              Edit Academic Year
            </h1>
            <p className="text-sm text-slate-500">
              Update academic year information.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {year &&
            (year.current ? (
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Current Year
              </Badge>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 gap-2 rounded-full border-slate-200 px-4 text-sm font-medium"
                disabled={isMarkingCurrent}
                onClick={handleMarkCurrent}
              >
                {isMarkingCurrent && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Set as Current Year
              </Button>
            ))}

         <Button
  variant="outline"
  className="h-10 gap-2 rounded-full border-[#0D9488] bg-white px-5 text-sm font-medium text-[#0D9488] shadow-sm transition-colors hover:bg-[#0D9488] hover:text-white"
  onClick={() => router.push("/academic-year")}
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>
        </div>
      </div>

      {isLoading ? (
        <AcademicYearFormSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : year ? (
        <AcademicYearForm
          mode="edit"
          defaultValues={{
            name: year.name,
            startDate: year.startDate,
            endDate: year.endDate,
          }}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/academic-year")}
        />
      ) : null}
    </div>
  );
}