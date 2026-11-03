import { z } from "zod";

export const classSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Class/Section name must be at least 2 characters." })
    .max(100, { message: "Class/Section name must not exceed 100 characters." }),

  departmentId: z.string().min(1, { message: "Department is required." }),
  courseId: z.string().min(1, { message: "Course is required." }),
  academicYearId: z.string().min(1, { message: "Academic year is required." }),
  semesterId: z.string().min(1, { message: "Semester is required." }),
});

export type ClassSectionFormValues = z.infer<typeof classSectionSchema>;