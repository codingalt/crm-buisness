import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
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
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: ({ start_date, end_date }) =>
        `business/bookings?start_date=${start_date}&end_date=${end_date}`,
      providesTags: ["Bookings"],
    }),

    getPaymentMethods: builder.query({
      query: () => `paymentMethods`,
    }),

    addManualAppointment: builder.mutation({
      query: ({serviceId,data}) => ({
        url: `business/manualAppointment/${serviceId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings"],
    }),

    activateBooking: builder.mutation({
      query: (bookingId) => ({
        url: `business/startTheService/${bookingId}`,
        method: "POST",
        body: bookingId,
      }),
      invalidatesTags: ["Bookings"],
    }),

    markAsCompleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `business/finishTheService/${bookingId}`,
        method: "POST",
        body: bookingId,
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useActivateBookingMutation,
  useMarkAsCompleteBookingMutation,
  useGetPaymentMethodsQuery,
  useAddManualAppointmentMutation
} = bookingsApi;
