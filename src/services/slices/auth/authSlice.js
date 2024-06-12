import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoaded: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
    },

    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setAuth, logout, setIsLoaded } = authSlice.actions;
export default authSlice.reducer;
