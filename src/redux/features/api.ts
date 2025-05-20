import { getErrorMessage } from "@/lib/getErrorMessage";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { RootState } from "../store";
import { logout, setCredentials, User } from "./auth/authSlice";

// const baseApiUrl = import.meta.env.VITE_API_URL as string;
const baseApiUrl = "/api";

const baseQuery = fetchBaseQuery({
  baseUrl: baseApiUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 404) {
    toast.error(getErrorMessage(result.error));
  }
  if (result?.error?.status === 403) {
    toast.error(getErrorMessage(result.error));
  }
  if (result?.error?.status === 401) {
    //* Send Refresh
    console.log("Sending refresh token");

    const res = await fetch(baseApiUrl + "/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data?.data?.token) {
      const user = (api.getState() as RootState).auth.user as User;

      api.dispatch(
        setCredentials({
          user,
          token: data.data.token,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "Profile",
    "Projects",
    "Skills",
    "Experiences",
    "CareerSummary",
    "SkillCategories",
    "Education",
    "BlogPosts",
    "AboutMe",
  ],
  endpoints: () => ({}),
});
