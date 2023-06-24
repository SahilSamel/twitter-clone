import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timer: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimer(state, action) {
      state.timer = action.payload;
    },
    resetTimer(state) {
      state.timer = 0;
    },
  },
});

export const { setTimer, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;


