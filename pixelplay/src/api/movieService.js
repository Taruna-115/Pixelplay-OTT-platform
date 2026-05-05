import tmdbAxios from "./axios";
import { ENDPOINTS } from "./endpoints";

// ─── Smart In-Memory Cache (Promise-based) ────────────────────────────────
const cache = new Map();

const cachedGet = (key, fetcher, ttl = 5 * 60 * 1000) => {
  if (cache.has(key)) return cache.get(key);

  const promise = fetcher()
    .then((res) => {
      setTimeout(() => cache.delete(key), ttl);
      return res;
    })
    .catch((err) => {
      cache.delete(key); // don't cache failures
      throw err;
    });

  cache.set(key, promise);
  return promise;
};

// ─── Helper (normalize response) ──────────────────────────────────────────
const getData = (res) => res.data;
const getResults = (res) => res.data.results || [];

// ─── Trending ─────────────────────────────────────────────────────────────
export const fetchTrending = (type = "all", time = "week") =>
  cachedGet(`trending-${type}-${time}`, () =>
    tmdbAxios
      .get(ENDPOINTS.TRENDING_ALL(time), { params: { page: 1 } })
      .then(getResults)
  );

// ─── Movies ───────────────────────────────────────────────────────────────
export const fetchPopularMovies = (page = 1) =>
  cachedGet(`popular-movies-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.POPULAR_MOVIES, { params: { page } })
      .then(getData)
  );

export const fetchTopRatedMovies = (page = 1) =>
  cachedGet(`toprated-movies-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.TOP_RATED_MOVIES, { params: { page } })
      .then(getData)
  );

export const fetchNowPlaying = (page = 1) =>
  cachedGet(`now-playing-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.NOW_PLAYING, { params: { page } })
      .then(getData)
  );

export const fetchUpcoming = (page = 1) =>
  cachedGet(`upcoming-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.UPCOMING_MOVIES, { params: { page } })
      .then(getData)
  );

// ─── TV Shows ─────────────────────────────────────────────────────────────
export const fetchPopularTV = (page = 1) =>
  cachedGet(`popular-tv-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.POPULAR_TV, { params: { page } })
      .then(getData)
  );

export const fetchTopRatedTV = (page = 1) =>
  cachedGet(`toprated-tv-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.TOP_RATED_TV, { params: { page } })
      .then(getData)
  );

export const fetchAiringToday = (page = 1) =>
  cachedGet(`airing-today-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.AIRING_TODAY, { params: { page } })
      .then(getData)
  );

// ─── Details ──────────────────────────────────────────────────────────────
export const fetchMovieDetails = (id) =>
  cachedGet(`movie-details-${id}`, () =>
    tmdbAxios.get(ENDPOINTS.MOVIE_DETAILS(id)).then(getData)
  );

export const fetchTVDetails = (id) =>
  cachedGet(`tv-details-${id}`, () =>
    tmdbAxios.get(ENDPOINTS.TV_DETAILS(id)).then(getData)
  );

// ─── Credits ──────────────────────────────────────────────────────────────
export const fetchMovieCredits = (id) =>
  cachedGet(`movie-credits-${id}`, () =>
    tmdbAxios.get(ENDPOINTS.MOVIE_CREDITS(id)).then(getData)
  );

export const fetchTVCredits = (id) =>
  cachedGet(`tv-credits-${id}`, () =>
    tmdbAxios.get(ENDPOINTS.TV_CREDITS(id)).then(getData)
  );

// ─── Videos / Trailers ────────────────────────────────────────────────────
const pickBestVideo = (videos = []) =>
  videos.find((v) => v.type === "Trailer" && v.official) ||
  videos.find((v) => v.type === "Trailer") ||
  videos.find((v) => v.type === "Teaser") ||
  videos[0] ||
  null;

export const fetchMovieVideos = (id) =>
  cachedGet(`movie-videos-${id}`, () =>
    tmdbAxios
      .get(ENDPOINTS.MOVIE_VIDEOS(id))
      .then((r) => pickBestVideo(r.data.results))
  );

export const fetchTVVideos = (id) =>
  cachedGet(`tv-videos-${id}`, () =>
    tmdbAxios
      .get(ENDPOINTS.TV_VIDEOS(id))
      .then((r) => pickBestVideo(r.data.results))
  );

// ─── Recommendations ──────────────────────────────────────────────────────
export const fetchMovieRecommendations = (id, page = 1) =>
  cachedGet(`movie-reco-${id}-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.MOVIE_RECOMMENDS(id), { params: { page } })
      .then(getResults)
  );

export const fetchTVRecommendations = (id, page = 1) =>
  cachedGet(`tv-reco-${id}-${page}`, () =>
    tmdbAxios
      .get(ENDPOINTS.TV_RECOMMENDS(id), { params: { page } })
      .then(getResults)
  );

// ─── Search (no cache - dynamic) ──────────────────────────────────────────
export const searchMulti = (query, page = 1) =>
  tmdbAxios
    .get(ENDPOINTS.SEARCH_MULTI, {
      params: { query, page, include_adult: false },
    })
    .then(getData);

export const searchMovies = (query, page = 1) =>
  tmdbAxios
    .get(ENDPOINTS.SEARCH_MOVIES, { params: { query, page } })
    .then(getData);

export const searchTV = (query, page = 1) =>
  tmdbAxios
    .get(ENDPOINTS.SEARCH_TV, { params: { query, page } })
    .then(getData);

// ─── Genres ───────────────────────────────────────────────────────────────
export const fetchMovieGenres = () =>
  cachedGet("movie-genres", () =>
    tmdbAxios
      .get(ENDPOINTS.MOVIE_GENRES)
      .then((r) => r.data.genres)
  );

export const fetchTVGenres = () =>
  cachedGet("tv-genres", () =>
    tmdbAxios
      .get(ENDPOINTS.TV_GENRES)
      .then((r) => r.data.genres)
  );

// ─── Discover ─────────────────────────────────────────────────────────────
export const discoverMovies = (params = {}) =>
  cachedGet(`discover-movies-${JSON.stringify(params)}`, () =>
    tmdbAxios
      .get(ENDPOINTS.DISCOVER_MOVIES, { params })
      .then(getData)
  );

export const discoverTV = (params = {}) =>
  cachedGet(`discover-tv-${JSON.stringify(params)}`, () =>
    tmdbAxios
      .get(ENDPOINTS.DISCOVER_TV, { params })
      .then(getData)
  );