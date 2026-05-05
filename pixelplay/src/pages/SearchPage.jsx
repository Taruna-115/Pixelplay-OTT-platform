import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { performSearch, setQuery, setFilters, clearSearch } from "../features/search/searchSlice";
import { useDebounce }         from "../hooks/useDebounce";
import { useInfiniteScroll }   from "../hooks/useInfiniteScroll";
import SearchBar   from "../components/search/SearchBar";
import FilterPanel from "../components/search/FilterPanel";
import MovieCard   from "../components/home/MovieCard";
import SkeletonCard from "../components/common/SkeletonCard";

export default function SearchPage() {
  const dispatch = useDispatch();
  const { query, results, loading, page, totalPages, filters } = useSelector((s) => s.search);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      dispatch(performSearch({ query: debouncedQuery, page: 1 }));
    } else {
      dispatch(clearSearch());
    }
  }, [debouncedQuery, dispatch]);

  const loadMore = useCallback(() => {
    if (debouncedQuery && page < totalPages && !loading) {
      dispatch(performSearch({ query: debouncedQuery, page: page + 1 }));
    }
  }, [debouncedQuery, page, totalPages, loading, dispatch]);

  const lastRef = useInfiniteScroll(loadMore, page < totalPages);

  const filtered = results.filter((item) => {
    if (filters.type === "movie") return item.media_type === "movie";
    if (filters.type === "tv")    return item.media_type === "tv";
    return item.media_type !== "person";
  });

  return (
    <div className="min-h-screen bg-pixelplay-bg pt-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="section-title mb-6">
          Search <span className="text-gradient">PixelPlay</span>
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={(v) => dispatch(setQuery(v))}
              onClear={() => dispatch(clearSearch())}
            />
          </div>
          <FilterPanel filters={filters} onChange={(f) => dispatch(setFilters(f))} />
        </div>

        {!query && (
          <div className="text-center py-20 text-pixelplay-muted">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">Search for movies, TV shows, and more...</p>
          </div>
        )}

        <AnimatePresence>
          {filtered.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: (i % 18) * 0.03 }}
                  ref={i === filtered.length - 1 ? lastRef : null}>
                  <MovieCard item={item} mediaType={item.media_type || "movie"} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {query && !loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-xl text-pixelplay-subtext">No results for "{query}"</p>
            <p className="text-pixelplay-muted mt-2">Try different keywords or adjust filters</p>
          </div>
        )}
      </div>
    </div>
  );
}