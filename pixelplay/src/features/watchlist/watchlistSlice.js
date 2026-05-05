import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = () => {
  try { return JSON.parse(localStorage.getItem("pixelplay_watchlist")) || []; }
  catch { return []; }
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: { items: loadFromStorage() },
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.items.find((i) => i.id === action.payload.id)) {
        state.items.push(action.payload);
        localStorage.setItem("pixelplay_watchlist", JSON.stringify(state.items));
      }
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("pixelplay_watchlist", JSON.stringify(state.items));
    },
    clearWatchlist: (state) => {
      state.items = [];
      localStorage.removeItem("pixelplay_watchlist");
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;