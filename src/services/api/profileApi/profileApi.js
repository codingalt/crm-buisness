import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URI,
    prepareHeaders: async (headers, query) => {
      const authToken = localStorage.getItem("crmBusinessToken");
      headers.set("authorization", `Bearer ${authToken}`);
      headers.set("x-app-type", "Web");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getBusinessProfile: builder.query({
      query: () => `business/businessProfile`,
      providesTags: ["Profile"],
    }),

    getBusinessStatistics: builder.query({
      query: () => `business/stats`,
    }),

    updateBusinessInfo: builder.mutation({
      query: (data) => ({
        url: "business/updateBusinessInfo",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateOpeningHours: builder.mutation({
      query: (data) => ({
        url: "business/businessOpeningHoursPost",
        method: "POST",
        body: { data: data },
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetBusinessProfileQuery,
  useUpdateOpeningHoursMutation,
  useUpdateBusinessInfoMutation,
  useGetBusinessStatisticsQuery
} = profileApi;
