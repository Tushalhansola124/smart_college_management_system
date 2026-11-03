import { z } from "zod";

export const facultySchema = z.object({
  userId: z.string().min(1, { message: "User is required." }),

  employeeCode: z
    .string()
    .trim()
    .min(2, { message: "Employee code must be at least 2 characters." })
    .max(30, { message: "Employee code must not exceed 30 characters." }),

  departmentId: z.string().min(1, { message: "Department is required." }),

  designation: z
    .string()
    .trim()
    .min(2, { message: "Designation is required." })
    .max(100, { message: "Designation must not exceed 100 characters." }),

  phone: z
    .string()
    .trim()
    .min(7, { message: "Enter a valid phone number." })
    .max(20, { message: "Phone number is too long." })
    .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid phone number." }),

  qualification: z
    .string()
    .trim()
    .min(2, { message: "Qualification is required." })
    .max(150, { message: "Qualification must not exceed 150 characters." }),

  joiningDate: z.string().min(1, { message: "Joining date is required." }),

  employmentStatus: z.string().optional(),
});

export type FacultyFormValues = z.infer<typeof facultySchema>;