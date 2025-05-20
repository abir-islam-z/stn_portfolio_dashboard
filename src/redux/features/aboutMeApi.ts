import { baseApi } from "./api";

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface PersonalInfo {
  label: string;
  value: string;
}

export interface IAboutMe {
  description: string;
  personalInfo: PersonalInfo[];
  features: Feature[];
}

export const aboutMeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutMe: builder.query<IAboutMe, void>({
      query: () => "about",
      providesTags: ["AboutMe"],
    }),
    updateAboutMe: builder.mutation<IAboutMe, Partial<IAboutMe>>({
      query: (aboutMe) => ({
        url: "about",
        method: "PATCH",
        body: aboutMe,
      }),
      invalidatesTags: ["AboutMe"],
    }),
  }),
});

export const { useGetAboutMeQuery, useUpdateAboutMeMutation } = aboutMeApi;
