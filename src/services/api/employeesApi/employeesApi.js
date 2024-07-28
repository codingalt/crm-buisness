import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeesApi = createApi({
  reducerPath: "employeesApi",
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
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => `business/employees`,
      providesTags: ["Employees"],
    }),

    getEmployeeRoles: builder.query({
      query: () => `business/roles`,
    }),

    validateInvitation: builder.mutation({
      query: (data) => ({
        url: "business/validateInvitation",
        method: "POST",
        body: data,
      }),
    }),

    acceptInvitation: builder.mutation({
      query: (data) => ({
        url: "business/acceptInvitation",
        method: "POST",
        body: data,
      }),
    }),

    deleteEmployee: builder.mutation({
      query: (employeeId) => ({
        url: `business/employees/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),

    addEmployee: builder.mutation({
      query: (data) => ({
        url: "business/employees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useGetEmployeeRolesQuery,
  useValidateInvitationMutation,
  useAcceptInvitationMutation,
  useDeleteEmployeeMutation
} = employeesApi;
