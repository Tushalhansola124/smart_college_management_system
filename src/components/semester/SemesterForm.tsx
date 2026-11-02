"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  semesterSchema,
  type SemesterFormInput,
  type SemesterFormValues,
} from "@/app/schemas/semester.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CustomDropdown } from "@/components/semester/CustomDropdown";
import { Loader2 } from "lucide-react";
import type { ICourse } from "@/components/course/controller";
import type { IAcademicYear } from "@/components/academic-year/academic-years.controller";

interface SemesterFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<SemesterFormInput>;
  isSubmitting: boolean;
  courses: ICourse[];
  academicYears: IAcademicYear[];
  onSubmit: (values: SemesterFormValues) => void;
  onCancel: () => void;
}

export function SemesterForm({
  mode,
  defaultValues,
  isSubmitting,
  courses,
  academicYears,
  onSubmit,
  onCancel,
}: SemesterFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SemesterFormInput, unknown, SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      semesterNumber: defaultValues?.semesterNumber ?? 1,
      courseId: defaultValues?.courseId ?? "",
      academicYearId: defaultValues?.academicYearId ?? "",
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
      status: defaultValues?.status ?? "ACTIVE",
    },
  });

  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: c.name,
    sublabel: `(${c.code})`,
  }));

  const academicYearOptions = academicYears.map((y) => ({
    value: y.id,
    label: y.name,
  }));

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="space-y-7 p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-7"
          noValidate
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2.5 sm:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Semester Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Semester 1"
                className="h-12 rounded-lg text-base"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-rose-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="semesterNumber"
                className="text-sm font-medium text-slate-700"
              >
                Semester Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="semesterNumber"
                type="number"
                min={1}
                placeholder="e.g. 1"
                className="h-12 rounded-lg text-base"
                {...register("semesterNumber")}
              />
              {errors.semesterNumber && (
                <p className="text-sm text-rose-500">
                  {errors.semesterNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-slate-700">
                Course <span className="text-rose-500">*</span>
              </Label>
              <Controller
                control={control}
                name="courseId"
                render={({ field }) => (
                  <CustomDropdown
                    options={courseOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a course"
                    error={!!errors.courseId}
                  />
                )}
              />
              {errors.courseId && (
                <p className="text-sm text-rose-500">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-slate-700">
                Academic Year <span className="text-rose-500">*</span>
              </Label>
              <Controller
                control={control}
                name="academicYearId"
                render={({ field }) => (
                  <CustomDropdown
                    options={academicYearOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select academic year"
                    error={!!errors.academicYearId}
                  />
                )}
              />
              {errors.academicYearId && (
                <p className="text-sm text-rose-500">
                  {errors.academicYearId.message}
                </p>
              )}
            </div>

            {mode === "edit" && (
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-slate-700">
                  Status
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <CustomDropdown
                      options={statusOptions}
                      value={field.value ?? "ACTIVE"}
                      onChange={field.onChange}
                      placeholder="Select status"
                      searchable={false}
                    />
                  )}
                />
              </div>
            )}

            <div className="space-y-2.5">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-slate-700"
              >
                Start Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                className="h-12 w-full rounded-lg text-base"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-rose-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-slate-700"
              >
                End Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                className="h-12 w-full rounded-lg text-base"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-rose-500">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full border-slate-200 px-6 text-sm font-medium"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 gap-2 rounded-full bg-[#0D9488] px-6 text-sm font-medium shadow-sm hover:bg-[#0F766E]"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Semester" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}