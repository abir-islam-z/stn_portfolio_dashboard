import { z } from "zod";

export const personalInfoSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const featureSchema = z.object({
  icon: z.string().min(1, "Icon name is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const aboutMeSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  personalInfo: z
    .array(personalInfoSchema)
    .min(1, "At least one personal info item is required"),
  features: z.array(featureSchema).min(1, "At least one feature is required"),
});

export type IAboutMeForm = z.infer<typeof aboutMeSchema>;
export type IPersonalInfo = z.infer<typeof personalInfoSchema>;
export type IFeature = z.infer<typeof featureSchema>;
