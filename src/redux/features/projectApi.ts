import { IProjectCreate, IProjectEdit } from "@/pages/projects/schema";
import { baseApi } from "./api";

export interface IProject extends IProjectCreate {
  id: string;
}
export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<IProject[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    getProject: builder.query<IProject, string>({
      query: (id) => `projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Projects", id }],
    }),
    addProject: builder.mutation<IProject, Omit<IProject, "id">>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<
      IProject,
      Partial<IProjectEdit> & { id: string }
    >({
      query: ({ id, ...project }) => ({
        url: `projects/${id}`,
        method: "PATCH",
        body: project,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Projects", id }],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
