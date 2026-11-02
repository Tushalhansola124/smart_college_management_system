// components/department/DepartmentForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  departmentSchema,
  type DepartmentFormValues,
} from "@/app/schemas/department.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Info } from "lucide-react";

interface DepartmentFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<DepartmentFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: DepartmentFormValues) => void;
  onCancel: () => void;
}

export function DepartmentForm({
  mode,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      code: defaultValues?.code ?? "",
      description: defaultValues?.description ?? "",
      hodId: defaultValues?.hodId ?? null,
    },
  });

  return (
    /* 
      1. mx-auto: Centers the form.
      2. max-w-3xl: Makes the form wider (768px) compared to standard sizes.
      3. rounded-2xl & shadow-lg: Improves the UI with a softer, elevated look.
    */
    <Card className="mx-auto w-full max-w-3xl rounded-2xl border-slate-200 bg-white shadow-lg transition-all duration-200">
      <CardContent className="p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Grid Layout: Name and Code sit side-by-side on larger screens to utilize the wider width */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Department Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Computer Science"
                className="transition-colors focus-visible:ring-[#0D9488]"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm font-medium text-rose-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="code" className="text-slate-700 font-medium">
                Department Code <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g. CSE"
                className="transition-colors focus-visible:ring-[#0D9488]"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-sm font-medium text-rose-500">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              Description <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Provide a brief description of the department's focus and objectives..."
              className="resize-none transition-colors focus-visible:ring-[#0D9488]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm font-medium text-rose-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2.5 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <Label htmlFor="hodId" className="text-slate-700 font-medium">
              Head of Department (HOD)
            </Label>
            <Input
              id="hodId"
              placeholder="HOD assignment unavailable"
              disabled
              className="bg-slate-100/50 text-slate-500 cursor-not-allowed"
              {...register("hodId")}
            />
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Info className="h-3.5 w-3.5" />
              <p>Faculty/HOD selection will be enabled once the faculty API is available.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto gap-2 bg-[#0D9488] hover:bg-[#0F766E] shadow-sm transition-all"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Department" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}