import { createSlice } from "@reduxjs/toolkit";

export const DEMO_PROFILES = [
  {
    id: 1,
    name:     "Alex",
    avatar:   "🎬",
    color:    "#E50914",
    email:    "alex@pixelplay.com",
    password: "alex123",
    bio:      "Movie buff & binge watcher",
    joined:   "Jan 2024",
    watchCount: 142,
  },
  {
    id: 2,
    name:     "Sam",
    avatar:   "🎭",
    color:    "#00D4FF",
    email:    "sam@pixelplay.com",
    password: "sam123",
    bio:      "Drama & thriller enthusiast",
    joined:   "Mar 2024",
    watchCount: 89,
  },
  {
    id: 3,
    name:     "Kids",
    avatar:   "🧸",
    color:    "#F5C518",
    email:    "kids@pixelplay.com",
    password: "kids123",
    bio:      "Family friendly content",
    joined:   "Jun 2024",
    watchCount: 56,
  },
  {
    id: 4,
    name:     "Guest",
    avatar:   "👤",
    color:    "#8B5CF6",
    email:    "guest@pixelplay.com",
    password: "guest123",
    bio:      "Just browsing",
    joined:   "Today",
    watchCount: 0,
  },
];

const saved = (() => {
  try { return JSON.parse(localStorage.getItem("pp_active_profile")) || null; }
  catch { return null; }
})();

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profiles:      DEMO_PROFILES,
    activeProfile: saved,
    switching:     false,
  },
  reducers: {
    selectProfile: (state, action) => {
      state.activeProfile = action.payload;
      state.switching     = false;
      localStorage.setItem("pp_active_profile", JSON.stringify(action.payload));
    },
    startSwitching: (state) => { state.switching = true; },
    cancelSwitching:(state) => { state.switching = false; },
    clearProfile:   (state) => {
      state.activeProfile = null;
      state.switching     = false;
      localStorage.removeItem("pp_active_profile");
    },
  },
});

export const { selectProfile, startSwitching, cancelSwitching, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;