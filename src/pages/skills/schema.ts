import { z } from "zod";

export const skillsCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
});

export const skillsTechnologySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  category: z.string().min(1, "Category is required"),
});

export type ISkillCategory = z.infer<typeof skillsCategorySchema>;
export type ISkillTechnology = z.infer<typeof skillsTechnologySchema>;
