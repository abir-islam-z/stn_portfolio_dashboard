import { baseApi } from "./api";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedDate: string;
  tags: string[];
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPosts: builder.query<BlogPost[], void>({
      query: () => "blog",
      providesTags: ["BlogPosts"],
    }),
    getBlogPost: builder.query<BlogPost, number>({
      query: (id) => `blog/${id}`,
      providesTags: (_result, _error, id) => [{ type: "BlogPosts", id }],
    }),
    addBlogPost: builder.mutation<BlogPost, Omit<BlogPost, "id">>({
      query: (post) => ({
        url: "blog",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["BlogPosts"],
    }),
    updateBlogPost: builder.mutation<
      BlogPost,
      Partial<BlogPost> & { id: number }
    >({
      query: ({ id, ...post }) => ({
        url: `blog/${id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "BlogPosts", id }],
    }),
    deleteBlogPost: builder.mutation<void, number>({
      query: (id) => ({
        url: `blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogPosts"],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useAddBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
