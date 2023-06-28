import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userId:null,
};

const authSlice = createSlice({
  name: 'auth',
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
  },
});

export const { setToken, setUserId, clearToken, clearUserId } = authSlice.actions;
export default authSlice.reducer;


