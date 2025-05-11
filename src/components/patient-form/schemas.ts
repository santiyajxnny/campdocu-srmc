
import * as z from "zod"

// Define the schema for patient form
export const patientFormSchema = z.object({
  // Demographics fields
  name: z.string().min(1, { message: "Name is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  sex: z.string().min(1, { message: "Sex is required" }),
  
  // History fields
  history: z.string().optional(),
  
  // Vision fields
  distantVisionRight: z.string().optional(),
  distantVisionLeft: z.string().optional(),
  nearVisionRight: z.string().optional(),
  nearVisionLeft: z.string().optional(),
  
  // Refraction fields
  rightEyeSph: z.string().optional(),
  rightEyeCyl: z.string().optional(),
  rightEyeAxis: z.string().optional(),
  leftEyeSph: z.string().optional(),
  leftEyeCyl: z.string().optional(),
  leftEyeAxis: z.string().optional(),
  rightEyeRefractionNote: z.string().optional(),
  leftEyeRefractionNote: z.string().optional(),
  
  // Acceptance fields
  acceptanceRightSph: z.string().optional(),
  acceptanceRightCyl: z.string().optional(),
  acceptanceRightAxis: z.string().optional(),
  acceptanceLeftSph: z.string().optional(),
  acceptanceLeftCyl: z.string().optional(),
  acceptanceLeftAxis: z.string().optional(),
  acceptanceRightRefractionNote: z.string().optional(),
  acceptanceLeftRefractionNote: z.string().optional(),

  // Add Given fields
  addGivenRightSph: z.string().optional(),
  addGivenRightCyl: z.string().optional(),
  addGivenRightAxis: z.string().optional(),
  addGivenLeftSph: z.string().optional(),
  addGivenLeftCyl: z.string().optional(),
  addGivenLeftAxis: z.string().optional(),
  addGivenRightRefractionNote: z.string().optional(),
  addGivenLeftRefractionNote: z.string().optional(),

  // Diagnosis fields
  ocularDiagnosis: z.string().optional(),
  
  // Outcome fields
  outcome: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
