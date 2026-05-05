import axios from "axios";

const tmdbAxios = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "en-US",
  },
  timeout: 10000,
});

// Request interceptor — log in dev
tmdbAxios.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[TMDB] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unified error handling
tmdbAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.status_message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default tmdbAxios;