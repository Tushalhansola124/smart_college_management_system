// "use client";

// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   classSectionSchema,
//   type ClassSectionFormValues,
// } from "@/app/schemas/class-section.schema";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { CustomDropdown, type DropdownOption } from "@/components/class-section/CustomDropdown";
// import { Loader2 } from "lucide-react";

// interface ClassSectionFormProps {
//   mode: "create" | "edit";
//   defaultValues?: Partial<ClassSectionFormValues>;
//   isSubmitting: boolean;
//   departmentOptions: DropdownOption[];
//   departmentsLoading?: boolean;
//   courseOptions: DropdownOption[];
//   coursesLoading?: boolean;
//   academicYearOptions: DropdownOption[];
//   academicYearsLoading?: boolean;
//   semesterOptions: DropdownOption[];
//   semestersLoading?: boolean;
//   onSubmit: (values: ClassSectionFormValues) => void;
//   onCancel: () => void;
// }

// export function ClassSectionForm({
//   mode,
//   defaultValues,
//   isSubmitting,
//   departmentOptions,
//   departmentsLoading = false,
//   courseOptions,
//   coursesLoading = false,
//   academicYearOptions,
//   academicYearsLoading = false,
//   semesterOptions,
//   semestersLoading = false,
//   onSubmit,
//   onCancel,
// }: ClassSectionFormProps) {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<ClassSectionFormValues>({
//     resolver: zodResolver(classSectionSchema),
//     defaultValues: {
//       name: defaultValues?.name ?? "",
//       departmentId: defaultValues?.departmentId ?? "",
//       courseId: defaultValues?.courseId ?? "",
//       academicYearId: defaultValues?.academicYearId ?? "",
//       semesterId: defaultValues?.semesterId ?? "",
//     },
//   });

//   return (
//     <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
//       <CardContent className="space-y-7 p-8">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//             <div className="space-y-2.5 sm:col-span-2">
//               <Label htmlFor="name" className="text-sm font-medium text-slate-700">
//                 Class / Section Name <span className="text-rose-500">*</span>
//               </Label>
//               <Input
//                 id="name"
//                 placeholder="e.g. CSE - Section A"
//                 className="h-12 rounded-lg text-base"
//                 {...register("name")}
//               />
//               {errors.name && (
//                 <p className="text-sm text-rose-500">{errors.name.message}</p>
//               )}
//             </div>

//             <div className="space-y-2.5">
//               <Label className="text-sm font-medium text-slate-700">
//                 Department <span className="text-rose-500">*</span>
//               </Label>
//               <Controller
//                 control={control}
//                 name="departmentId"
//                 render={({ field }) => (
//                   <CustomDropdown
//                     options={departmentOptions}
//                     value={field.value}
//                     onChange={field.onChange}
//                     placeholder="Select a department"
//                     loading={departmentsLoading}
//                     error={!!errors.departmentId}
//                   />
//                 )}
//               />
//               {errors.departmentId && (
//                 <p className="text-sm text-rose-500">{errors.departmentId.message}</p>
//               )}
//             </div>

//             <div className="space-y-2.5">
//               <Label className="text-sm font-medium text-slate-700">
//                 Course <span className="text-rose-500">*</span>
//               </Label>
//               <Controller
//                 control={control}
//                 name="courseId"
//                 render={({ field }) => (
//                   <CustomDropdown
//                     options={courseOptions}
//                     value={field.value}
//                     onChange={field.onChange}
//                     placeholder="Select a course"
//                     loading={coursesLoading}
//                     error={!!errors.courseId}
//                   />
//                 )}
//               />
//               {errors.courseId && (
//                 <p className="text-sm text-rose-500">{errors.courseId.message}</p>
//               )}
//             </div>

//             <div className="space-y-2.5">
//               <Label className="text-sm font-medium text-slate-700">
//                 Academic Year <span className="text-rose-500">*</span>
//               </Label>
//               <Controller
//                 control={control}
//                 name="academicYearId"
//                 render={({ field }) => (
//                   <CustomDropdown
//                     options={academicYearOptions}
//                     value={field.value}
//                     onChange={field.onChange}
//                     placeholder="Select academic year"
//                     loading={academicYearsLoading}
//                     error={!!errors.academicYearId}
//                   />
//                 )}
//               />
//               {errors.academicYearId && (
//                 <p className="text-sm text-rose-500">{errors.academicYearId.message}</p>
//               )}
//             </div>

//             <div className="space-y-2.5">
//               <Label className="text-sm font-medium text-slate-700">
//                 Semester <span className="text-rose-500">*</span>
//               </Label>
//               <Controller
//                 control={control}
//                 name="semesterId"
//                 render={({ field }) => (
//                   <CustomDropdown
//                     options={semesterOptions}
//                     value={field.value}
//                     onChange={field.onChange}
//                     placeholder="Select a semester"
//                     loading={semestersLoading}
//                     error={!!errors.semesterId}
//                   />
//                 )}
//               />
//               {errors.semesterId && (
//                 <p className="text-sm text-rose-500">{errors.semesterId.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               className="h-11 rounded-full border-slate-200 px-6 text-sm font-medium"
//               onClick={onCancel}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="h-11 gap-2 rounded-full bg-[#0D9488] px-6 text-sm font-medium shadow-sm hover:bg-[#0F766E]"
//             >
//               {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
//               {mode === "create" ? "Create Class Section" : "Save Changes"}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  classSectionSchema,
  type ClassSectionFormValues,
} from "@/app/schemas/class-section.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CustomDropdown, type DropdownOption } from "@/components/class-section/CustomDropdown";
import { Loader2 } from "lucide-react";

interface ClassSectionFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ClassSectionFormValues>;
  isSubmitting: boolean;
  departmentOptions: DropdownOption[];
  departmentsLoading?: boolean;
  courseOptions: DropdownOption[];
  coursesLoading?: boolean;
  academicYearOptions: DropdownOption[];
  academicYearsLoading?: boolean;
  semesterOptions: DropdownOption[];
  semestersLoading?: boolean;
  onSubmit: (values: ClassSectionFormValues) => void;
  onCancel: () => void;
}

export function ClassSectionForm({
  mode,
  defaultValues,
  isSubmitting,
  departmentOptions,
  departmentsLoading = false,
  courseOptions,
  coursesLoading = false,
  academicYearOptions,
  academicYearsLoading = false,
  semesterOptions,
  semestersLoading = false,
  onSubmit,
  onCancel,
}: ClassSectionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClassSectionFormValues>({
    resolver: zodResolver(classSectionSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      departmentId: defaultValues?.departmentId ?? "",
      courseId: defaultValues?.courseId ?? "",
      academicYearId: defaultValues?.academicYearId ?? "",
      semesterId: defaultValues?.semesterId ?? "",
    },
  });

  return (
    // ફેરફાર: અહીં overflow-visible ઉમેર્યું છે
    <Card className="overflow-visible rounded-2xl border border-slate-200/80 shadow-sm">
      {/* ફેરફાર: અહીં પણ overflow-visible ઉમેર્યું છે */}
      <CardContent className="overflow-visible space-y-7 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2.5 sm:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Class / Section Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. CSE - Section A"
                className="h-12 rounded-lg text-base"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-rose-500">{errors.name.message}</p>
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
                    loading={coursesLoading}
                    error={!!errors.courseId}
                  />
                )}
              />
              {errors.courseId && (
                <p className="text-sm text-rose-500">{errors.courseId.message}</p>
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
                    loading={academicYearsLoading}
                    error={!!errors.academicYearId}
                  />
                )}
              />
              {errors.academicYearId && (
                <p className="text-sm text-rose-500">{errors.academicYearId.message}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-slate-700">
                Semester <span className="text-rose-500">*</span>
              </Label>
              <Controller
                control={control}
                name="semesterId"
                render={({ field }) => (
                  <CustomDropdown
                    options={semesterOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a semester"
                    loading={semestersLoading}
                    error={!!errors.semesterId}
                  />
                )}
              />
              {errors.semesterId && (
                <p className="text-sm text-rose-500">{errors.semesterId.message}</p>
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
              {mode === "create" ? "Create Class Section" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}