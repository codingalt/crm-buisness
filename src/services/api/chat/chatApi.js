import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  tagTypes: ["chatApi"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: ({ user_type }) => `fetchCommunications?user_type=${user_type}`,
      providesTags: ["chatApi"],
    }),

    oneOoneCommunication: builder.query({
      query: ({ user_type, receiver_id }) =>
        `oneOoneCommunication?user_type=${user_type}&receiver_id=${receiver_id}`,
      providesTags: ["chatApi"],
    }),

    sendMessage: builder.mutation({
      query: ({ chatId, user_type, body }) => ({
        url: `sendMessage/${chatId}`,
        method: "POST",
        body: { user_type, body },
      }),
      // invalidatesTags: ["chatApi"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useOneOoneCommunicationQuery,
  useSendMessageMutation,
} = chatApi;
