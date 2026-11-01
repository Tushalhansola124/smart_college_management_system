import { z } from "zod";

// ======================================================
// ACADEMIC YEAR SCHEMA (Zod 4)
// ======================================================

export const academicYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Academic year name must be at least 2 characters." })
      .max(50, { message: "Academic year name must not exceed 50 characters." }),

    startDate: z
      .string()
      .min(1, { message: "Start date is required." }),

    endDate: z
      .string()
      .min(1, { message: "End date is required." }),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    }
  );

export type AcademicYearFormValues = z.infer<typeof academicYearSchema>;