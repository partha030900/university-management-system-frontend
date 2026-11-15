import { z } from "zod";

export const studentProfileSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  programId: z.coerce
    .number()
    .int()
    .positive("Please select a program"),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
});

export type StudentProfileFormValues = z.infer<
  typeof studentProfileSchema
>;