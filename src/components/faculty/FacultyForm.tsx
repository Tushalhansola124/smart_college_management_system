"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facultySchema, type FacultyFormValues } from "@/app/schemas/faculty.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CustomDropdown, type DropdownOption } from "@/components/faculty/CustomDropdown";
import { Loader2 } from "lucide-react";

interface FacultyFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<FacultyFormValues>;
  isSubmitting: boolean;
  userOptions: DropdownOption[];
  usersLoading?: boolean;
  departmentOptions: DropdownOption[];
  departmentsLoading?: boolean;
  onSubmit: (values: FacultyFormValues) => void;
  onCancel: () => void;
}

const statusOptions: DropdownOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export function FacultyForm({
  mode,
  defaultValues,
  isSubmitting,
  userOptions,
  usersLoading = false,
  departmentOptions,
  departmentsLoading = false,
  onSubmit,
  onCancel,
}: FacultyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      userId: defaultValues?.userId ?? "",
      employeeCode: defaultValues?.employeeCode ?? "",
      departmentId: defaultValues?.departmentId ?? "",
      designation: defaultValues?.designation ?? "",
      phone: defaultValues?.phone ?? "",
      qualification: defaultValues?.qualification ?? "",
      joiningDate: defaultValues?.joiningDate ?? "",
      employmentStatus: defaultValues?.employmentStatus ?? "ACTIVE",
    },
  });

  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="space-y-7 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2.5 sm:col-span-2">
              <Label className="text-sm font-medium text-slate-700">
                User <span className="text-rose-500">*</span>
              </Label>
              <Controller
                control={control}
                name="userId"
                render={({ field }) => (
                  <CustomDropdown
                    options={userOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search and select a user"
                    loading={usersLoading}
                    error={!!errors.userId}
                    disabled={mode === "edit"}
                  />
                )}
              />
              {mode === "edit" && (
                <p className="text-xs text-slate-400">
                  The linked user account cannot be changed after creation.
                </p>
              )}
              {errors.userId && (
                <p className="text-sm text-rose-500">{errors.userId.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="employeeCode" className="text-sm font-medium text-slate-700">
                Employee Code <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="employeeCode"
                placeholder="e.g. FAC-1024"
                className="h-12 rounded-lg text-base"
                {...register("employeeCode")}
              />
              {errors.employeeCode && (
                <p className="text-sm text-rose-500">{errors.employeeCode.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-slate-700">
                Department <span className="text-rose-500">*</span>
              </Label>
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <CustomDropdown
                    options={departmentOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a department"
                    loading={departmentsLoading}
                    error={!!errors.departmentId}
                  />
                )}
              />
              {errors.departmentId && (
                <p className="text-sm text-rose-500">{errors.departmentId.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="designation" className="text-sm font-medium text-slate-700">
                Designation <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="designation"
                placeholder="e.g. Assistant Professor"
                className="h-12 rounded-lg text-base"
                {...register("designation")}
              />
              {errors.designation && (
                <p className="text-sm text-rose-500">{errors.designation.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                className="h-12 rounded-lg text-base"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-rose-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="qualification" className="text-sm font-medium text-slate-700">
                Qualification <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="qualification"
                placeholder="e.g. Ph.D. in Computer Science"
                className="h-12 rounded-lg text-base"
                {...register("qualification")}
              />
              {errors.qualification && (
                <p className="text-sm text-rose-500">{errors.qualification.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="joiningDate" className="text-sm font-medium text-slate-700">
                Joining Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="joiningDate"
                type="date"
                className="h-12 w-full rounded-lg text-base"
                {...register("joiningDate")}
              />
              {errors.joiningDate && (
                <p className="text-sm text-rose-500">{errors.joiningDate.message}</p>
              )}
            </div>

            {mode === "edit" && (
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-slate-700">Employment Status</Label>
                <Controller
                  control={control}
                  name="employmentStatus"
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
              {mode === "create" ? "Create Faculty" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}