import { z } from "zod";

export const classSectionSchema = z.object({
  name: z
    .string()
    .min(1, "Section name is required")
    .min(2, "Section name must be at least 2 characters")
    .max(100, "Section name must be less than 100 characters")
    .trim(),

  courseId: z
    .string()
    .min(1, "Please select a Course")
    .uuid("Invalid Course"),

  departmentId: z
    .string()
    .min(1, "Please select a Department")
    .uuid("Invalid Department"),

  semesterId: z
    .string()
    .min(1, "Please select a Semester")
    .uuid("Invalid Semester"),

  academicYearId: z
    .string()
    .min(1, "Please select an Academic Year")
    .uuid("Invalid Academic Year"),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type ClassSectionFormValues = z.infer<typeof classSectionSchema>;