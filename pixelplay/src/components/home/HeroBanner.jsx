import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "../../api/endpoints";
import { addToWatchlist, removeFromWatchlist } from "../../features/watchlist/watchlistSlice";
import { toast } from "react-toastify";
import { FiInfo, FiPlus, FiCheck, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsPlayCircleFill } from "react-icons/bs";

const SLIDE_INTERVAL = 6000;

const HeroBanner = memo(function HeroBanner({ items = [] }) {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { items: watchlist } = useSelector((s) => s.watchlist);

  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1); // 1=next, -1=prev
  const [paused,    setPaused]    = useState(false);

  // Featured items — top 5 trending
  const featured = items.slice(0, 5);
  const item     = featured[current];

  const goTo = useCallback((idx, dir = 1) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo((current + 1) % featured.length,  1), [current, featured.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + featured.length) % featured.length, -1), [current, featured.length, goTo]);

  // Auto-slide
  useEffect(() => {
    if (paused || featured.length <= 1) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next, paused, featured.length]);

  if (!item) return (
    <div className="h-[85vh] bg-gradient-to-b from-pp-surface to-pp-bg animate-pulse" />
  );

  const type      = item.media_type || (item.title ? "movie" : "tv");
  const title     = item.title || item.name || "";
  const year      = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating    = item.vote_average?.toFixed(1);
  const backdrop  = ENDPOINTS.BACKDROP(item.backdrop_path);
  const inList    = watchlist.some((i) => i.id === item.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inList) {
      dispatch(removeFromWatchlist(item.id));
      toast.info("Removed from My List");
    } else {
      dispatch(addToWatchlist({
        id: item.id, title,
        poster_path: item.poster_path, media_type: type,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
      }));
      toast.success("Added to My List ✅");
    }
  };

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 1.02  }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.98 }),
  };

  return (
    <div
      className="relative h-[88vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background layers */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div key={`bg-${item.id}`}
          custom={direction}
          variants={slideVariants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {backdrop && (
            <img src={backdrop} alt="" loading="eager"
              className="w-full h-full object-cover scale-105"
              style={{ filter: "brightness(0.65) saturate(1.2)" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,11,20,0.97)] via-[rgba(8,11,20,0.5)] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,11,20,0.4)] to-transparent h-32" />

      {/* Dynamic color accent from poster */}
      <div className="absolute bottom-0 left-0 right-0 h-48
        bg-gradient-to-t from-pp-bg to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24 pb-16">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div key={`content-${item.id}`}
            custom={direction}
            variants={{
              enter:  (d) => ({ opacity: 0, y: 30, x: d > 0 ? 20 : -20 }),
              center: { opacity: 1, y: 0, x: 0 },
              exit:   (d) => ({ opacity: 0, y: -20, x: d > 0 ? -20 : 20 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="max-w-xl"
          >
            {/* Badge row */}
            <motion.div className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <span className="bg-pp-accent px-3 py-0.5 rounded text-xs font-bold uppercase tracking-widest
                               shadow-[0_0_12px_rgba(229,9,20,0.5)]">
                {type === "movie" ? "Movie" : "Series"}
              </span>
              {rating && (
                <span className="flex items-center gap-1 text-pp-gold text-sm font-bold
                                 drop-shadow-[0_0_8px_rgba(245,197,24,0.6)]">
                  <FiStar className="fill-current" /> {rating}
                </span>
              )}
              {year && <span className="text-pp-sub text-sm">{year}</span>}
              <span className="text-pp-muted text-xs uppercase tracking-wider">
                {item.genre_ids?.length ? `${item.genre_ids.slice(0, 2).join(" · ")}` : ""}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                         tracking-wider leading-none mb-5 drop-shadow-2xl"
            >
              {title}
            </motion.h1>

            {/* Overview */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-pp-sub text-sm md:text-base leading-relaxed mb-8 line-clamp-3 max-w-lg"
            >
              {item.overview}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(229,9,20,0.6)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/watch/${type}/${item.id}`)}
                className="btn-primary flex items-center gap-2.5 px-7 py-3 text-base rounded-xl"
              >
                <BsPlayCircleFill className="text-xl" />
                Watch Trailer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/watch/${type}/${item.id}`)}
                className="btn-secondary flex items-center gap-2 px-5 py-3 text-base rounded-xl"
              >
                <FiInfo className="text-lg" /> More Info
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleWatchlist}
                className={`btn-secondary px-4 py-3 rounded-xl text-lg
                  ${inList ? "!border-green-500/60 !text-green-400" : ""}`}
              >
                {inList ? <FiCheck /> : <FiPlus />}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10
                     flex items-center justify-center text-white hover:bg-black/70 transition-all"
        >
          <FiChevronLeft className="text-xl" />
        </motion.button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <motion.button
          whileHover={{ scale: 1.1, x: 2 }} whileTap={{ scale: 0.9 }}
          onClick={next}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10
                     flex items-center justify-center text-white hover:bg-black/70 transition-all"
        >
          <FiChevronRight className="text-xl" />
        </motion.button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, i) => (
          <motion.button key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            animate={{ width: i === current ? 24 : 6, opacity: i === current ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full bg-white"
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${current}`}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: SLIDE_INTERVAL / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-0.5 bg-pp-accent origin-left"
          style={{ width: "100%" }}
        />
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-12 right-6 md:right-16 hidden lg:flex gap-2">
        {featured.map((f, i) => {
          const posterUrl = ENDPOINTS.IMAGE(f.poster_path, "w154");
          return (
            <motion.button key={f.id}
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`relative w-14 h-20 rounded-lg overflow-hidden transition-all duration-300
                ${i === current ? "ring-2 ring-pp-accent ring-offset-2 ring-offset-transparent" : "opacity-50 hover:opacity-80"}`}
            >
              {posterUrl && <img src={posterUrl} alt="" className="w-full h-full object-cover" loading="lazy" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default HeroBanner;