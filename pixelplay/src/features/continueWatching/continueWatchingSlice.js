import { createSlice } from "@reduxjs/toolkit";

const loadCW = () => {
  try { return JSON.parse(localStorage.getItem("pixelplay_cw")) || []; }
  catch { return []; }
};

const continueWatchingSlice = createSlice({
  name: "continueWatching",
  initialState: { items: loadCW() },
  reducers: {
    updateProgress: (state, action) => {
      const { id, progress, duration, ...rest } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        existing.progress = progress;
        existing.duration = duration;
        existing.updatedAt = Date.now();
      } else {
        state.items.unshift({ id, progress, duration, ...rest, updatedAt: Date.now() });
        if (state.items.length > 20) state.items.pop(); // keep max 20
      }
      localStorage.setItem("pixelplay_cw", JSON.stringify(state.items));
    },
    removeFromCW: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("pixelplay_cw", JSON.stringify(state.items));
    },
    clearCW: (state) => {
      state.items = [];
      localStorage.removeItem("pixelplay_cw");
    },
  },
});

export const { updateProgress, removeFromCW, clearCW } = continueWatchingSlice.actions;
export default continueWatchingSlice.reducer;