import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchMulti } from "../../api/movieService";

export const performSearch = createAsyncThunk(
  "search/performSearch",
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const data = await searchMulti(query, page);
      return { ...data, query, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "", results: [], page: 1, totalPages: 0,
    loading: false, error: null,
    filters: { type: "all", genre: null, year: null, sortBy: "popularity.desc" },
  },
  reducers: {
    setQuery:   (state, action) => { state.query = action.payload; },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearSearch:(state)         => { state.query = ""; state.results = []; state.page = 1; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending,   (s)    => { s.loading = true; s.error = null; })
      .addCase(performSearch.fulfilled, (s, a) => {
        s.loading = false;
        s.results  = a.payload.page === 1 ? a.payload.results : [...s.results, ...a.payload.results];
        s.page        = a.payload.page;
        s.totalPages  = a.payload.total_pages;
      })
      .addCase(performSearch.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setQuery, setFilters, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;