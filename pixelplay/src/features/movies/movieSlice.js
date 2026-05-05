import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as movieService from "../../api/movieService";

export const loadHomeData = createAsyncThunk("movies/loadHomeData", async (_, { rejectWithValue }) => {
  try {
    const [trending, popular, topRated, nowPlaying, popularTV, topRatedTV, airingToday] =
      await Promise.all([
        movieService.fetchTrending(),
        movieService.fetchPopularMovies(),
        movieService.fetchTopRatedMovies(),
        movieService.fetchNowPlaying(),
        movieService.fetchPopularTV(),
        movieService.fetchTopRatedTV(),
        movieService.fetchAiringToday(),
      ]);
    return { trending, popular: popular.results, topRated: topRated.results,
             nowPlaying: nowPlaying.results, popularTV: popularTV.results,
             topRatedTV: topRatedTV.results, airingToday: airingToday.results };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loadMediaDetails = createAsyncThunk(
  "movies/loadMediaDetails",
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const [details, credits, video, recommendations] = await Promise.all([
        type === "movie" ? movieService.fetchMovieDetails(id) : movieService.fetchTVDetails(id),
        type === "movie" ? movieService.fetchMovieCredits(id) : movieService.fetchTVCredits(id),
        type === "movie" ? movieService.fetchMovieVideos(id)  : movieService.fetchTVVideos(id),
        type === "movie" ? movieService.fetchMovieRecommendations(id) : movieService.fetchTVRecommendations(id),
      ]);
      return { details, credits, video, recommendations };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    trending: [], popular: [], topRated: [], nowPlaying: [],
    popularTV: [], topRatedTV: [], airingToday: [],
    currentMedia: null, currentCredits: null, currentVideo: null, currentRecommendations: [],
    loading: false, detailLoading: false, error: null,
  },
  reducers: {
    clearCurrentMedia: (state) => {
      state.currentMedia = null; state.currentCredits = null;
      state.currentVideo = null; state.currentRecommendations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHomeData.pending,   (s)    => { s.loading = true; s.error = null; })
      .addCase(loadHomeData.fulfilled, (s, a) => { Object.assign(s, a.payload); s.loading = false; })
      .addCase(loadHomeData.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(loadMediaDetails.pending,   (s)    => { s.detailLoading = true; s.error = null; })
      .addCase(loadMediaDetails.fulfilled, (s, a) => {
        s.currentMedia = a.payload.details;
        s.currentCredits = a.payload.credits;
        s.currentVideo = a.payload.video;
        s.currentRecommendations = a.payload.recommendations;
        s.detailLoading = false;
      })
      .addCase(loadMediaDetails.rejected, (s, a) => { s.detailLoading = false; s.error = a.payload; });
  },
});

export const { clearCurrentMedia } = movieSlice.actions;
export default movieSlice.reducer;