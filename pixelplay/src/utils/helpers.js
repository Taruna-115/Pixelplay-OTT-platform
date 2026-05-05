import { debounce } from "lodash";

// Debounce factory (for non-hook use)
export const createDebouncedSearch = (fn, delay = 500) => debounce(fn, delay);

// Format runtime
export const formatRuntime = (minutes) => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Format currency
export const formatMoney = (n) =>
  n ? `$${(n / 1e6).toFixed(1)}M` : "N/A";

// Truncate text
export const truncate = (str, max = 150) =>
  str?.length > max ? str.slice(0, max) + "…" : str || "";

// Get YouTube thumbnail
export const getYTThumbnail = (key) =>
  key ? `https://img.youtube.com/vi/${key}/maxresdefault.jpg` : null;