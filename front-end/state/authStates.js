import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userHandle: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
  setUserId,
  clearUserId,
  setUserHandle,
  clearUserHandle,
} = authSlice.actions;

export default authSlice.reducer;
