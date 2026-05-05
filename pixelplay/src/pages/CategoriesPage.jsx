import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchMovieGenres, fetchTVGenres, discoverMovies, discoverTV } from "../api/movieService";
import MovieCard from "../components/home/MovieCard";
import SkeletonCard from "../components/common/SkeletonCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useCallback } from "react";

export default function CategoriesPage() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres,    setTvGenres]    = useState([]);
  const [selected,    setSelected]    = useState({ id: 28, name: "Action", type: "movie" });
  const [items,       setItems]       = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [mediaTab,    setMediaTab]    = useState("movie");

  useEffect(() => {
    Promise.all([fetchMovieGenres(), fetchTVGenres()]).then(([mg, tg]) => {
      setMovieGenres(mg);
      setTvGenres(tg);
    });
  }, []);

  const loadItems = useCallback(async (genre, pageNum, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const fn     = genre.type === "movie" ? discoverMovies : discoverTV;
      const data   = await fn({ with_genres: genre.id, sort_by: "popularity.desc", page: pageNum });
      setItems((prev) => reset ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    setItems([]);
    loadItems(selected, 1, true);
  }, [selected]);

  const loadMore = useCallback(() => {
    if (page < totalPages) loadItems(selected, page + 1);
  }, [page, totalPages, selected, loadItems]);

  const lastRef = useInfiniteScroll(loadMore, page < totalPages);

  const genres = mediaTab === "movie" ? movieGenres : tvGenres;

  return (
    <div className="min-h-screen bg-pixelplay-bg pt-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-title mb-6">Browse <span className="text-gradient">Categories</span></h1>

        {/* Media Type Tabs */}
        <div className="flex gap-2 mb-6">
          {["movie", "tv"].map((t) => (
            <button key={t} onClick={() => { setMediaTab(t); setSelected({ ...(t === "movie" ? movieGenres[0] : tvGenres[0]), type: t }); }}
              className={`media-tab ${mediaTab === t ? "active" : ""}`}>
              {t === "movie" ? "🎬 Movies" : "📺 TV Shows"}
            </button>
          ))}
        </div>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((g) => (
            <button key={g.id} onClick={() => setSelected({ ...g, type: mediaTab })}
              className={`genre-pill ${selected.id === g.id ? "active" : ""}`}>
              {g.name}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4 text-pixelplay-subtext">
          {selected.name} <span className="text-pixelplay-muted text-sm">({mediaTab === "movie" ? "Movies" : "TV Shows"})</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, i) => (
            <div key={`${item.id}-${i}`} ref={i === items.length - 1 ? lastRef : null}>
              <MovieCard item={item} mediaType={mediaTab} />
            </div>
          ))}
          {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}