import { createSlice } from "@reduxjs/toolkit";

const DEMO_USERS = [
  {
    uid: "demo-001",
    email: "demo@pixelplay.com",
    password: "demo123",
    displayName: "Demo User",
    photoURL: null,
  },
];

const initialState = {
  user:       null,
  isLoggedIn: false,
  loading:    false,
  error:      null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginDemo: (state, action) => {
      const { email, password } = action.payload;

      const found = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        const { password: _, ...safeUser } = found;
        state.user       = safeUser;
        state.isLoggedIn = true;
        state.error      = null;
        localStorage.setItem("pixelplay_user", JSON.stringify(safeUser));
        return;
      }

      try {
        const accounts = JSON.parse(
          localStorage.getItem("pixelplay_accounts") || "[]"
        );
        const localUser = accounts.find(
          (u) => u.email === email && u.password === password
        );
        if (localUser) {
          const { password: _, ...safeUser } = localUser;
          state.user       = safeUser;
          state.isLoggedIn = true;
          state.error      = null;
          localStorage.setItem("pixelplay_user", JSON.stringify(safeUser));
          return;
        }
      } catch {}

      state.error = "Invalid credentials";
    },

    loginGuest: (state) => {
      const guest = {
        uid:         "guest-001",
        email:       "guest@pixelplay.com",
        displayName: "Guest",
        photoURL:    null,
      };
      state.user       = guest;
      state.isLoggedIn = true;
      state.error      = null;
      localStorage.setItem("pixelplay_user", JSON.stringify(guest));
    },

    restoreSession: (state) => {
      try {
        const saved = localStorage.getItem("pixelplay_user");
        if (saved) {
          state.user       = JSON.parse(saved);
          state.isLoggedIn = true;
        }
      } catch {
        state.user       = null;
        state.isLoggedIn = false;
      }
    },

    logout: (state) => {
      state.user       = null;
      state.isLoggedIn = false;
      state.error      = null;
      localStorage.removeItem("pixelplay_user");
    },

    setError:   (state, action) => { state.error = action.payload; },
    clearError: (state)         => { state.error = null; },
  },
});

export const {
  loginDemo, loginGuest, restoreSession,
  logout, setError, clearError,
} = authSlice.actions;

export default authSlice.reducer;