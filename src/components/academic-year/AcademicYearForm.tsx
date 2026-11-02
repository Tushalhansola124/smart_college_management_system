"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  academicYearSchema,
  type AcademicYearFormValues,
} from "@/app/schemas/academic-year.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AcademicYearFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<AcademicYearFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: AcademicYearFormValues) => void;
  onCancel: () => void;
}

export function AcademicYearForm({
  mode,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: AcademicYearFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
    },
  });

  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Academic Year Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. 2026-2027"
              className="h-10 rounded-lg"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-slate-700"
              >
                Start Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                className="h-10 w-full rounded-lg text-slate-700"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-rose-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-slate-700"
              >
                End Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                className="h-10 w-full rounded-lg text-slate-700"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-rose-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E]"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Academic Year" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}