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
    }),

    oneOoneCommunication: builder.query({
      query: ({ user_type, receiver_id }) =>
        `oneOoneCommunication?user_type=${user_type}&receiver_id=${receiver_id}`,
      providesTags: ["chatApi"],
    }),

    sendMessage: builder.mutation({
      query: ({ chatId, user_type, body }) => ({
        // url: `sendMessage/${chatId}`,
        url: "privateChannel",
        method: "POST",
        body: { user_type, body },
      }),
      // invalidatesTags: ["chatApi"],
    }),

    assignChatToEmployee: builder.mutation({
      query: ({ communicationId, employeeId }) => ({
        url: `business/assignCommunicationToEmployee/${communicationId}/${employeeId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useOneOoneCommunicationQuery,
  useSendMessageMutation,
  useAssignChatToEmployeeMutation
} = chatApi;
