import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(3, { message: "Department name must be at least 3 characters." }),
  code: z.string().min(2, { message: "Department code must be at least 2 characters." }).toUpperCase(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  hodId: z.string().nullable().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;