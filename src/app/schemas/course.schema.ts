import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, "Course name is required")
    .min(3, "Name must be at least 3 characters"),

  code: z
    .string()
    .min(1, "Course code is required")
    .min(2, "Code must be at least 2 characters"),

  departmentId: z.string().min(1, "Department is required"),

//   durationYears: z
//     .number({ invalid_type_error: "Duration is required" })
//     .min(1, "Duration must be at least 1 year")
//     .max(10, "Duration cannot exceed 10 years"),

  totalSemesters: z
    .number( "Total semesters is required" )
    .min(1, "Must have at least 1 semester")
    .max(20, "Cannot exceed 20 semesters"),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;