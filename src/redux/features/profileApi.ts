import { baseApi } from "./api";

export interface Profile {
  name: string;
  title: string;
  experience: string;
  thumbnail: string;
  resumeFile: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export type ProfileUpdate = {
  name?: string;
  title?: string;
  experience?: string;
  thumbnail?: File | string;
  resumeFile?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => "profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<Profile, Partial<ProfileUpdate>>({
      query: (profile) => {
        // Create FormData if there's a file to upload
        if (profile.thumbnail instanceof File) {
          const formData = new FormData();

          // Append other data
          Object.keys(profile).forEach((key) => {
            const value = profile[key as keyof typeof profile];
            if (key === "thumbnail" && value instanceof File) {
              formData.append(key, value);
            } else if (value !== undefined) {
              formData.append(key, value as string);
            }
          });

          console.log(formData.entries);

          return {
            url: "profile",
            method: "PATCH",
            body: formData,
          };
        }

        // Regular JSON if no file
        return {
          url: "profile",
          method: "PATCH",
          body: profile,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
