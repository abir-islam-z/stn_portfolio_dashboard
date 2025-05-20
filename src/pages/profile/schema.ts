import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  experience: z.string().min(1, "Experience information is required"),
  thumbnail: z.array(z.instanceof(File)).optional(),
  resumeFile: z.string().url("Please enter a valid resume URL"),
  github: z.string().url("Please enter a valid GitHub URL"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL"),
  twitter: z.string().url("Please enter a valid Twitter URL"),
});

export type IProfileForm = z.infer<typeof profileSchema>;
