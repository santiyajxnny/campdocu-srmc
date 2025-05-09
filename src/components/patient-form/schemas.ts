
import { z } from "zod";

// Define individual schemas for validation
export const patientDemographicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  sex: z.string().min(1, "Sex selection is required")
});

export const historySchema = z.object({
  history: z.string().optional()
});

// Update the vision schema to include both distant and near vision
export const visionSchema = z.object({
  distantVisionRight: z.string().optional(),
  distantVisionLeft: z.string().optional(),
  nearVisionRight: z.string().optional(),
  nearVisionLeft: z.string().optional()
});

export const refractionSchema = z.object({
  rightEyeSph: z.string().optional(),
  rightEyeCyl: z.string().optional(),
  rightEyeAxis: z.string().optional(),
  leftEyeSph: z.string().optional(),
  leftEyeCyl: z.string().optional(),
  leftEyeAxis: z.string().optional(),
  acceptanceRightSph: z.string().optional(),
  acceptanceRightCyl: z.string().optional(),
  acceptanceRightAxis: z.string().optional(),
  acceptanceLeftSph: z.string().optional(),
  acceptanceLeftCyl: z.string().optional(),
  acceptanceLeftAxis: z.string().optional()
});

export const diagnosisSchema = z.object({
  ocularDiagnosis: z.string().optional()
});

export const outcomeSchema = z.object({
  outcome: z.string().min(1, "Outcome selection is required")
});

// Combined schema for the entire form
export const patientFormSchema = patientDemographicsSchema
  .merge(historySchema)
  .merge(visionSchema)
  .merge(refractionSchema)
  .merge(diagnosisSchema)
  .merge(outcomeSchema);

// Type for form values derived from the schema
export type PatientFormValues = z.infer<typeof patientFormSchema>;
