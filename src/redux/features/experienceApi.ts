import {
  ICareerSummary,
  IExperience,
  IExperienceUpdate,
} from "@/pages/experience/schema";
import { baseApi } from "./api";

// Define the API
export const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCareerSummary: builder.query<ICareerSummary, void>({
      query: () => "career_summary",
      providesTags: ["CareerSummary"],
    }),
    updateCareerSummary: builder.mutation<ICareerSummary, ICareerSummary>({
      query: (summary) => ({
        url: "career_summary",
        method: "PATCH",
        body: summary,
      }),
      invalidatesTags: ["CareerSummary"],
    }),
    getExperience: builder.query<IExperienceUpdate[], void>({
      query: () => "experience",
      providesTags: ["Experiences"],
    }),
    getExperienceById: builder.query<IExperience, string>({
      query: (id) => `experience/${id}`,
      providesTags: ["Experiences"],
    }),
    updateExperience: builder.mutation<IExperience, Partial<IExperienceUpdate>>(
      {
        query: (experience) => ({
          url: `experience/${experience.id}`,
          method: "PATCH",
          body: experience,
        }),
        invalidatesTags: ["Experiences"],
      }
    ),
    addExperience: builder.mutation<IExperience, IExperience>({
      query: (job) => ({
        url: "experience",
        method: "POST",
        body: job,
      }),
      invalidatesTags: ["Experiences"],
    }),
    deleteExperience: builder.mutation<IExperience, string>({
      query: (index) => ({
        url: `experience/jobs/${index}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Experiences"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetExperienceQuery,
  useGetCareerSummaryQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateCareerSummaryMutation,
  useGetExperienceByIdQuery,
} = experienceApi;
