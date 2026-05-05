export const ENDPOINTS = {
  // Trending
  TRENDING_ALL:    (time = "week") => `/trending/all/${time}`,
  TRENDING_MOVIES: (time = "week") => `/trending/movie/${time}`,
  TRENDING_TV:     (time = "week") => `/trending/tv/${time}`,

  // Movies
  POPULAR_MOVIES:    "/movie/popular",
  TOP_RATED_MOVIES:  "/movie/top_rated",
  NOW_PLAYING:       "/movie/now_playing",
  UPCOMING_MOVIES:   "/movie/upcoming",
  MOVIE_DETAILS:     (id) => `/movie/${id}`,
  MOVIE_CREDITS:     (id) => `/movie/${id}/credits`,
  MOVIE_VIDEOS:      (id) => `/movie/${id}/videos`,
  MOVIE_SIMILAR:     (id) => `/movie/${id}/similar`,
  MOVIE_RECOMMENDS:  (id) => `/movie/${id}/recommendations`,

  // TV Shows
  POPULAR_TV:      "/tv/popular",
  TOP_RATED_TV:    "/tv/top_rated",
  AIRING_TODAY:    "/tv/airing_today",
  ON_THE_AIR:      "/tv/on_the_air",
  TV_DETAILS:      (id) => `/tv/${id}`,
  TV_CREDITS:      (id) => `/tv/${id}/credits`,
  TV_VIDEOS:       (id) => `/tv/${id}/videos`,
  TV_SIMILAR:      (id) => `/tv/${id}/similar`,
  TV_RECOMMENDS:   (id) => `/tv/${id}/recommendations`,

  // Search
  SEARCH_MULTI:   "/search/multi",
  SEARCH_MOVIES:  "/search/movie",
  SEARCH_TV:      "/search/tv",
  SEARCH_PERSON:  "/search/person",

  // Genres
  MOVIE_GENRES:   "/genre/movie/list",
  TV_GENRES:      "/genre/tv/list",

  // Discover
  DISCOVER_MOVIES: "/discover/movie",
  DISCOVER_TV:     "/discover/tv",

  // Image helpers
  IMAGE: (path, size = "w500") =>
    path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/${size}${path}` : null,
  BACKDROP: (path) =>
    path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}/original${path}` : null,
};