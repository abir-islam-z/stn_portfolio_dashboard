import { z } from "zod";

export const achievementSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  icon: z.string().min(1, "Icon is required"),
});

export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  provider: z.string().min(1, "Provider is required"),
  year: z.string().min(1, "Year is required"),
  icon: z.string().min(1, "Icon is required"),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cgpa: z.string().min(1, "CGPA is required"),
  achievements: z
    .array(achievementSchema)
    .min(1, "At least one achievement is required"),
  subjects: z.array(subjectSchema).min(1, "At least one subject is required"),
  courses: z.array(courseSchema).min(1, "At least one course is required"),
});

export type IEducationForm = z.infer<typeof educationSchema>;
export type IAchievement = z.infer<typeof achievementSchema>;
export type ISubject = z.infer<typeof subjectSchema>;
export type ICourse = z.infer<typeof courseSchema>;
