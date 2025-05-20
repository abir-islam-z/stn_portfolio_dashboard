import { baseApi } from "./api";

export interface Subject {
  name: string;
  icon: string;
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
}

export interface Course {
  name: string;
  provider: string;
  year: string;
  icon: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  cgpa: string;
  achievements: Achievement[];
  subjects: Subject[];
  courses: Course[];
}

export type EducationUpdate = Partial<Education>;

export const educationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducation: builder.query<Education, void>({
      query: () => "education",
      providesTags: ["Education"],
    }),
    updateEducation: builder.mutation<Education, EducationUpdate>({
      query: (education) => ({
        url: "education",
        method: "PATCH",
        body: education,
      }),
      invalidatesTags: ["Education"],
    }),
  }),
});

export const { useGetEducationQuery, useUpdateEducationMutation } =
  educationApi;
