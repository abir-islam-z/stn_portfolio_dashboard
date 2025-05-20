import { z } from "zod";

export const careerSummarySchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z
    .array(z.string())
    .min(1, "At least one responsibility is required"),
});

export type IExperience = z.infer<typeof experienceSchema>;
export type IExperienceUpdate = z.infer<typeof experienceSchema> & {
  id: string;
};
export type ICareerSummary = z.infer<typeof careerSummarySchema>;
