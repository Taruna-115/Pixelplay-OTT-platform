import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("pp_theme") || "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: saved },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("pp_theme", state.mode);
      // Apply to DOM
      if (state.mode === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;