import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "../services/slices/auth/authSlice";
import { authApi } from "../services/api/authApi/authApi";
import { servicesApi } from "../services/api/servicesApi/servicesApi";
import { employeesApi } from "../services/api/employeesApi/employeesApi";
import { profileApi } from "../services/api/profileApi/profileApi";
import { chatApi } from "@/services/api/chat/chatApi";
import { bookingsApi } from "@/services/api/bookingsApi/bookingsApi";

export const store = configureStore({
  reducer: {
    // Auth Api
    [authApi.reducerPath]: authApi.reducer,

    // Chat Api
    [chatApi.reducerPath]: chatApi.reducer,

    // Services Api
    [servicesApi.reducerPath]: servicesApi.reducer,

    // Employees Api
    [employeesApi.reducerPath]: employeesApi.reducer,

    // Business Profile Api
    [profileApi.reducerPath]: profileApi.reducer,

    // Bookings Api
    [bookingsApi.reducerPath]: bookingsApi.reducer,

    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      servicesApi.middleware,
      employeesApi.middleware,
      profileApi.middleware,
      chatApi.middleware,
      bookingsApi.middleware,
    ]),
});

setupListeners(store.dispatch);
