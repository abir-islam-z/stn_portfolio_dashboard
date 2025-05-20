import { z } from "zod";

// Base project schema with common fields
const baseProjectFields = {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  demoUrl: z.string().url("Demo URL must be a valid URL").optional(),
  repoUrl: z.string().url("Repo URL must be a valid URL").optional(),
  features: z.array(
    z.object({
      feature: z.string().min(1, "Feature is required"),
    })
  ),
  isFeatured: z.boolean().optional(),
};

// Schema for creating a new project - image is required
export const projectSchema = z
  .object({
    ...baseProjectFields,
    image: z.array(z.instanceof(File)).nonempty({
      message: "Image is required",
    }),
  })
  .transform((data) => ({
    ...data,
    features: data.features.map((f) => f.feature),
  }));

// Schema for editing a project - image is optional (can reuse existing image)
export const projectEditSchema = z
  .object({
    ...baseProjectFields,
    image: z.array(z.instanceof(File)).default([]),
  })
  .transform((data) => ({
    ...data,
    features: data.features.map((f) => f.feature),
  }));

export type IProjectCreate = z.infer<typeof projectSchema>;
export type IProjectEdit = z.infer<typeof projectEditSchema>;
