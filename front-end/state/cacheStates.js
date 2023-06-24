import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timer: 0,
  lastServedTimestamp: null,
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
    setLastServedTimestamp(state, action) {
      state.lastServedTimestamp = action.payload;
    },
  },
});

export const { setTimer, resetTimer, setLastServedTimestamp } = timerSlice.actions;
export default timerSlice.reducer;