import { useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { loadHomeData } from "../features/movies/movieSlice";
import HeroBanner   from "../components/home/HeroBanner";
import MovieRow     from "../components/home/MovieRow";
import SkeletonRow  from "../components/common/SkeletonRow";
import ContinueWatchingRow from "../components/home/ContinueWatchingRow";
import SmartRecommendations from "../components/home/SmartRecommendations";

const ROWS = [
  { key: "trending",    title: "🔥 Trending Now",       type: "movie" },
  { key: "popular",     title: "🎬 Popular Movies",      type: "movie" },
  { key: "topRated",    title: "⭐ Top Rated All Time",  type: "movie" },
  { key: "nowPlaying",  title: "🎭 In Cinemas Now",      type: "movie" },
  { key: "popularTV",   title: "📺 Binge-Worthy Shows",  type: "tv"    },
  { key: "topRatedTV",  title: "🏆 Critically Acclaimed",type: "tv"    },
  { key: "airingToday", title: "📡 Airing Today",        type: "tv"    },
];

const HomePage = memo(function HomePage() {
  const dispatch = useDispatch();
  const { loading, error, trending, popular, topRated, nowPlaying,
          popularTV, topRatedTV, airingToday } = useSelector((s) => s.movies);
  const { items: cwItems } = useSelector((s) => s.continueWatching);

  useEffect(() => { dispatch(loadHomeData()); }, [dispatch]);

  const dataMap = { trending, popular, topRated, nowPlaying, popularTV, topRatedTV, airingToday };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button onClick={() => dispatch(loadHomeData())} className="btn-primary px-6">Retry</button>
      </div>
    </div>
  );

  return (
    <motion.div className="bg-pp-bg min-h-screen grain" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Hero */}
      {loading
        ? <div className="h-[88vh] skeleton-shimmer" />
        : <HeroBanner items={trending || []} />
      }

      <div className="relative z-10 -mt-28 space-y-10 pb-20">

        {/* Continue Watching */}
        {cwItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ContinueWatchingRow />
          </motion.div>
        )}

        {/* Smart Recommendations */}
        <SmartRecommendations items={popular?.slice(0, 8) || []} />

        {/* Content rows */}
        {ROWS.map(({ key, title, type }, i) =>
          loading ? (
            <SkeletonRow key={key} title={title} />
          ) : (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <MovieRow title={title} items={dataMap[key] || []} mediaType={type} />
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
});

export default HomePage;