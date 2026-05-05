import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import TrailerModal from "../components/watch/TrailerModal";
import { loadMediaDetails, clearCurrentMedia } from "../features/movies/movieSlice";
import { addToWatchlist, removeFromWatchlist } from "../features/watchlist/watchlistSlice";
import { updateProgress } from "../features/continueWatching/continueWatchingSlice";
import CastSection from "../components/watch/CastSection";
import RecommendationSection from "../components/watch/RecommendationSection";
import { ENDPOINTS } from "../api/endpoints";
import { FiPlus, FiCheck, FiArrowLeft, FiStar, FiCalendar, FiClock, FiX } from "react-icons/fi";
import { BsPlayCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

export default function WatchPage() {
  const { type, id } = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();

  const { currentMedia: media, currentCredits, currentVideo,
          currentRecommendations, detailLoading } = useSelector((s) => s.movies);
  const { items: watchlist } = useSelector((s) => s.watchlist);
  const isInWatchlist = watchlist.some((i) => i.id === Number(id));

  const [trailerOpen, setTrailerOpen] = useState(false);
  // const [trailerReady, setTrailerReady] = useState(false);

  useEffect(() => {
    dispatch(loadMediaDetails({ id, type }));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => dispatch(clearCurrentMedia());
  }, [id, type, dispatch]);

  // Save to continue watching
  useEffect(() => {
    if (media) {
      dispatch(updateProgress({
        id: media.id,
        title: media.title || media.name,
        poster_path: media.poster_path,
        media_type: type,
        progress: 45,
        duration: 120,
      }));
    }
  }, [media, type, dispatch]);

  const handleWatchlist = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(Number(id)));
      toast.info("Removed from My List");
    } else {
      dispatch(addToWatchlist({
        id: media.id,
        title: media.title || media.name,
        poster_path: media.poster_path,
        media_type: type,
        vote_average: media.vote_average,
        release_date: media.release_date || media.first_air_date,
      }));
      toast.success("Added to My List ✅");
    }
  };

  const openTrailer = () => {
  if (!currentVideo?.key) {
    toast.error("No trailer available for this title.");
    return;
  }
  setTrailerOpen(true);
};

  if (detailLoading) return (
    <div className="min-h-screen bg-pp-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pp-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-pp-sub">Loading...</p>
      </div>
    </div>
  );

  if (!media) return null;

  const backdropUrl = ENDPOINTS.BACKDROP(media.backdrop_path);
  const posterUrl   = ENDPOINTS.IMAGE(media.poster_path, "w342");
  const year    = (media.release_date || media.first_air_date || "").slice(0, 4);
  const runtime = media.runtime || media.episode_run_time?.[0];
  const rating  = media.vote_average?.toFixed(1);
  const genres  = media.genres?.slice(0, 4).map((g) => g.name) || [];

  return (
    <motion.div
      className="min-h-screen bg-pp-bg page-enter"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {/* Backdrop */}
      <div className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        {backdropUrl && (
          <motion.img
            src={backdropUrl} alt=""
            initial={{ scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-full object-cover"
            loading="eager"
            style={{ filter: "brightness(0.5) saturate(1.1)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pp-bg via-pp-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-pp-bg/60 to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 btn-secondary flex items-center gap-2 text-sm py-2 px-4"
        >
          <FiArrowLeft /> Back
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative -mt-60 z-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
            className="hidden md:block flex-shrink-0 w-52 lg:w-64"
          >
            <img src={posterUrl} alt={media.title || media.name}
              className="w-full rounded-2xl cinematic-shadow"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              loading="lazy"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22,1,0.36,1] }}
            className="flex-1 pt-2"
          >
            {/* Type badge */}
            <span className="inline-block bg-pp-accent/15 border border-pp-accent/40
                             text-pp-accent text-xs font-bold uppercase tracking-widest
                             px-3 py-1 rounded-full mb-4">
              {type === "movie" ? "🎬 Movie" : "📺 Series"}
            </span>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                           tracking-wider leading-tight mb-4 drop-shadow-2xl">
              {media.title || media.name}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-pp-sub mb-4">
              {rating && (
                <span className="flex items-center gap-1.5 text-pp-gold font-bold text-base">
                  <FiStar className="fill-current" /> {rating}
                  <span className="text-pp-muted text-xs font-normal">/ 10</span>
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-pp-muted" /> {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1.5">
                  <FiClock className="text-pp-muted" /> {Math.floor(runtime / 60)}h {runtime % 60}m
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {genres.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full text-xs font-medium
                                           bg-white/6 border border-white/10 text-pp-sub">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="text-pp-sub leading-relaxed max-w-2xl mb-7 text-base line-clamp-4">
              {media.overview}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(229,9,20,0.6)" }}
                whileTap={{ scale: 0.96 }}
                onClick={openTrailer}
                className="btn-primary flex items-center gap-2.5 px-8 py-3 text-base rounded-xl"
              >
                <BsPlayCircleFill className="text-xl" />
                Watch Trailer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleWatchlist}
                className={`btn-secondary flex items-center gap-2 px-6 py-3 text-base rounded-xl
                  ${isInWatchlist ? "!border-green-500/60 !text-green-400" : ""}`}
              >
                {isInWatchlist ? <><FiCheck /> In My List</> : <><FiPlus /> My List</>}
              </motion.button>
            </div>

            {/* Additional info */}
            {(media.budget > 0 || media.revenue > 0) && (
              <div className="flex gap-6 mt-6 pt-6 border-t border-white/8">
                {media.budget > 0 && (
                  <div>
                    <p className="text-pp-muted text-xs uppercase tracking-wider">Budget</p>
                    <p className="text-white font-semibold mt-0.5">
                      ${(media.budget / 1e6).toFixed(0)}M
                    </p>
                  </div>
                )}
                {media.revenue > 0 && (
                  <div>
                    <p className="text-pp-muted text-xs uppercase tracking-wider">Revenue</p>
                    <p className="text-pp-gold font-semibold mt-0.5">
                      ${(media.revenue / 1e6).toFixed(0)}M
                    </p>
                  </div>
                )}
                {media.vote_count > 0 && (
                  <div>
                    <p className="text-pp-muted text-xs uppercase tracking-wider">Votes</p>
                    <p className="text-white font-semibold mt-0.5">
                      {(media.vote_count / 1000).toFixed(1)}K
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Cast */}
        {currentCredits && <CastSection credits={currentCredits} />}

        {/* Recommendations */}
        {currentRecommendations?.length > 0 && (
          <RecommendationSection items={currentRecommendations} mediaType={type} />
        )}
      </div>

      {/* ===== TRAILER MODAL ===== */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={currentVideo?.key}
        title={media?.title || media?.name || ""}
      />
    </motion.div>
  );
}