import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userId: null,
  userHandle: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
    setUserHandle(state, action) {
      state.userHandle = action.payload;
    },
    clearUserHandle(state) {
      state.userHandle = null;
    },
  },
});

export const {
  setToken,
  setUserId,
  clearToken,
  clearUserId,
  setUserHandle,
  clearUserHandle,
} = authSlice.actions;
export default authSlice.reducer;
