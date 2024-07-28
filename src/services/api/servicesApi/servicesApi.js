import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
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
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    getServiceCategories: builder.query({
      query: () => `customer/categories`,
    }),

    getServiceSubCategories: builder.query({
      query: (id) => `customer/category/${id}`,
    }),

    getServiceTags: builder.query({
      query: () => `customer/tags`,
    }),

    getEmployees: builder.query({
      query: () => `business/employees`,
    }),

    getServices: builder.query({
      query: () => `business/services`,
      providesTags: ["Services"],
    }),

    getEditService: builder.query({
      query: (serviceId) => `business/services/${serviceId}/edit`,
      providesTags: ["Services"],
    }),

    updateService: builder.mutation({
      query: ({ data, serviceId }) => ({
        url: `business/services/${serviceId}?_method=PUT`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),

    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `business/services/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),

    addService: builder.mutation({
      query: (data) => ({
        url: "business/services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetServiceCategoriesQuery,
  useGetServiceTagsQuery,
  useGetEmployeesQuery,
  useGetServiceSubCategoriesQuery,
  useAddServiceMutation,
  useGetServicesQuery,
  useGetEditServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation
} = servicesApi;
