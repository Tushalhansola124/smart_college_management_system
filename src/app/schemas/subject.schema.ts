import { z } from "zod";

export const subjectSchema = z.object({
  subjectCode: z
    .string()
    .min(1, "Subject Code is required")
    .max(50, "Subject Code is too long"),

  subjectName: z
    .string()
    .min(1, "Subject Name is required")
    .max(150, "Subject Name is too long"),

  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),

  departmentId: z.string().min(1, "Department is required"),

  semesterId: z.string().min(1, "Semester is required"),

  subjectType: z.string("Subject Type is required"),

  credits: z.number()
    .min(1, "Credits must be at least 1")
    .max(10, "Credits cannot be more than 10"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;