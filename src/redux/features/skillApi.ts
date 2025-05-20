import { baseApi } from "./api";

export interface Skill {
  id: number;
  name: string;
  icon: string;
  category: string;
}
export interface SkillCategory {
  id: number;
  name: string;
  icon: string;
}

export const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkillsTechnologies: builder.query<Skill[], void>({
      query: () => "skills_technologies",
      providesTags: ["Skills"],
    }),
    addSkillTechnology: builder.mutation<Skill, Omit<Skill, "id">>({
      query: (skill) => ({
        url: "skills_technologies",
        method: "POST",
        body: skill,
      }),
      invalidatesTags: ["Skills"],
    }),
    updateSkillTechnology: builder.mutation<
      Skill,
      Partial<Skill> & { id: number }
    >({
      query: ({ id, ...skill }) => ({
        url: `skills_technologies/${id}`,
        method: "PATCH",
        body: skill,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Skills", id }],
    }),
    deleteSkillTechnology: builder.mutation<void, number>({
      query: (id) => ({
        url: `skills_technologies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Skills"],
    }),
    getSkillTechnologyById: builder.query<Skill, number>({
      query: (id) => `skills_technologies/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Skills", id }],
    }),
    getSkillsCategories: builder.query<SkillCategory[], void>({
      query: () => "skills_categories",
      providesTags: ["SkillCategories"],
    }),
    addSkillCategory: builder.mutation<
      SkillCategory,
      Omit<SkillCategory, "id">
    >({
      query: (category) => ({
        url: "skills_categories",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["SkillCategories", "Skills"],
    }),
    updateSkillCategory: builder.mutation<
      SkillCategory,
      Partial<SkillCategory> & { id: number }
    >({
      query: ({ id, ...category }) => ({
        url: `skills_categories/${id}`,
        method: "PATCH",
        body: category,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SkillCategories", id },
        "Skills",
      ],
    }),
    deleteSkillCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `skills_categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SkillCategories", "Skills"],
    }),
    getSkillCategoryById: builder.query<SkillCategory, number>({
      query: (id) => `skills_categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "SkillCategories", id }],
    }),
  }),
});

export const {
  useGetSkillsTechnologiesQuery,
  useAddSkillTechnologyMutation,
  useUpdateSkillTechnologyMutation,
  useDeleteSkillTechnologyMutation,
  useGetSkillTechnologyByIdQuery,
  useGetSkillsCategoriesQuery,
  useAddSkillCategoryMutation,
  useUpdateSkillCategoryMutation,
  useDeleteSkillCategoryMutation,
  useGetSkillCategoryByIdQuery,
} = skillApi;
