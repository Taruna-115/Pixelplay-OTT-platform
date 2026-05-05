import { memo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "../../api/endpoints";
import { FiStar, FiPlus, FiCheck, FiPlay } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../../features/watchlist/watchlistSlice";
import { toast } from "react-toastify";

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect fill='%231F2937' width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%236B7280' dominant-baseline='middle' text-anchor='middle' font-size='40'%3E🎬%3C/text%3E%3C/svg%3E`;

const MovieCard = memo(function MovieCard({ item, mediaType = "movie" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.watchlist);
  const [hovered, setHovered] = useState(false);
  const [imgErr,  setImgErr]  = useState(false);
  const hoverTimer = useRef(null);

  const inList  = items.some((i) => i.id === item?.id);
  const title   = item?.title || item?.name || "Unknown";
  const year    = (item?.release_date || item?.first_air_date || "").slice(0, 4);
  const rating  = item?.vote_average?.toFixed(1);
  const poster  = !imgErr && item?.poster_path
    ? ENDPOINTS.IMAGE(item.poster_path, "w342")
    : PLACEHOLDER;

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 300);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setHovered(false);
  };

  const handleClick  = () => navigate(`/watch/${mediaType}/${item.id}`);
  const handleList   = (e) => {
    e.stopPropagation();
    if (inList) {
      dispatch(removeFromWatchlist(item.id));
      toast.info("Removed from My List", { autoClose: 1500 });
    } else {
      dispatch(addToWatchlist({
        id: item.id, title, poster_path: item.poster_path,
        media_type: mediaType, vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
      }));
      toast.success("Added to My List ✅", { autoClose: 1500 });
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0 rounded-xl overflow-visible"
      style={{ aspectRatio: "2/3" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
    >
      {/* Card */}
      <motion.div
        className="w-full h-full rounded-xl overflow-hidden bg-pp-card relative"
        animate={hovered
          ? { scale: 1.08, zIndex: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(229,9,20,0.2)" }
          : { scale: 1,    zIndex: 1,  boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }
        }
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Poster */}
        <img
          src={poster} alt={title}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          loading="lazy"
          decoding="async"
          // fetchpriority="low"
        />

        {/* Always-visible rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm
                          rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
            <FiStar className="text-pp-gold text-[10px] fill-current" />
            <span className="text-white text-[11px] font-semibold">{rating}</span>
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-card-overlay"
            >
              {/* Cinematic neon glow at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r
                              from-pp-accent via-pp-gold to-transparent opacity-80" />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-semibold line-clamp-2 leading-tight mb-2">
                  {title}
                </p>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={handleClick}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center
                               hover:bg-pp-accent transition-colors shadow-lg"
                  >
                    <FiPlay className="text-black text-sm ml-0.5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={handleList}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                               transition-all text-sm
                               ${inList
                                 ? "bg-green-500/20 border-green-500 text-green-400"
                                 : "bg-black/40 border-white/40 text-white hover:border-white"}`}
                  >
                    {inList ? <FiCheck /> : <FiPlus />}
                  </motion.button>

                  <div className="ml-auto text-right">
                    {year && <p className="text-pp-sub text-xs">{year}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default MovieCard;