import { configureStore } from "@reduxjs/toolkit";
import authReducer           from "../features/auth/authSlice";
import movieReducer          from "../features/movies/movieSlice";
import searchReducer         from "../features/search/searchSlice";
import watchlistReducer      from "../features/watchlist/watchlistSlice";
import continueWatchingReducer from "../features/continueWatching/continueWatchingSlice";
import profileReducer        from "../features/profile/profileSlice";
import themeReducer          from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth:            authReducer,
    movies:          movieReducer,
    search:          searchReducer,
    watchlist:       watchlistReducer,
    continueWatching: continueWatchingReducer,
    profile:         profileReducer,
    theme:           themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;