import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    validateToken: builder.query({
      query: () => `validateToken?type=business`,
      providesTags: ["Users"],
    }),

    getCustomerDataByEmail: builder.mutation({
      query: (data) => ({
        url: "customerData",
        method: "POST",
        body: data,
      }),
    }),

    registerUser: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    validateCode: builder.mutation({
      query: (data) => ({
        url: "validateCode",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    reSendVerificationCode: builder.mutation({
      query: (data) => ({
        url: "reSendVerificationCode",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    storeBusinessInformation: builder.mutation({
      query: (data) => ({
        url: "business/businessInfo",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useValidateTokenQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useValidateCodeMutation,
  useReSendVerificationCodeMutation,
  useStoreBusinessInformationMutation,
  useGetCustomerDataByEmailMutation
} = authApi;
