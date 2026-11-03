import { z } from "zod";

export const semesterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Semester name must be at least 2 characters." })
      .max(100, { message: "Semester name must not exceed 100 characters." }),

    semesterNumber: z.coerce
      .number({ message: "Semester number is required." })
      .int({ message: "Semester number must be a whole number." })
      .positive({ message: "Semester number must be greater than 0." }),

    courseId: z.string().min(1, { message: "Course is required." }),

    academicYearId: z
      .string()
      .min(1, { message: "Academic year is required." }),

    startDate: z.string().min(1, { message: "Start date is required." }),

    endDate: z.string().min(1, { message: "End date is required." }),

    status: z.string().optional(),
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

// Input type: what the form fields actually hold before Zod coerces them
// (semesterNumber can be a string here, since <input type="number"> + RHF
// gives raw string/unknown until Zod coerces it).
export type SemesterFormInput = z.input<typeof semesterSchema>;

// Output type: what you get AFTER successful validation (semesterNumber is
// guaranteed to be a real number here). Use this for onSubmit's parameter
// and for anything sent to the API.
export type SemesterFormValues = z.output<typeof semesterSchema>;