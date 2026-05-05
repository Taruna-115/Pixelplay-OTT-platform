export const TMDB_IMAGE_SIZES = {
  poster:   { sm: "w154", md: "w342", lg: "w500", xl: "w780", original: "original" },
  backdrop: { sm: "w300", md: "w780", lg: "w1280", original: "original" },
  profile:  { sm: "w45",  md: "w185", lg: "h632"  },
};

export const MEDIA_TYPES = { MOVIE: "movie", TV: "tv", PERSON: "person" };

export const SORT_OPTIONS = [
  { value: "popularity.desc",    label: "Most Popular"   },
  { value: "vote_average.desc",  label: "Top Rated"      },
  { value: "release_date.desc",  label: "Latest Release" },
  { value: "revenue.desc",       label: "Box Office"     },
];

export const TOAST_CONFIG = {
  position: "bottom-right",
  autoClose: 3000,
  theme: "dark",
};