import { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { removeFromCW } from "../../features/continueWatching/continueWatchingSlice";
import { ENDPOINTS } from "../../api/endpoints";
import { FiPlay, FiX } from "react-icons/fi";

const ContinueWatchingRow = memo(function ContinueWatchingRow() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector((s) => s.continueWatching);
  if (!items.length) return null;

  return (
    <div className="px-4 md:px-8 lg:px-12">
      <h2 className="text-lg md:text-xl font-semibold mb-3 tracking-wide">▶ Continue Watching</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {items.map((item, i) => {
          const pct = Math.min((item.progress / item.duration) * 100, 100) || 30;
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex-shrink-0 group cursor-pointer"
              style={{ width: "clamp(160px, 18vw, 220px)" }}
            >
              <div className="relative rounded-xl overflow-hidden bg-pp-card aspect-video
                              hover:ring-2 hover:ring-pp-accent transition-all duration-300"
                onClick={() => navigate(`/watch/${item.media_type || "movie"}/${item.id}`)}>
                {item.poster_path ? (
                  <img src={ENDPOINTS.IMAGE(item.poster_path, "w342")} alt={item.title}
                    className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-pp-surface">🎬</div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100
                                transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                                  flex items-center justify-center">
                    <FiPlay className="text-white text-lg ml-0.5" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-pp-accent rounded-r-full"
                  />
                </div>
              </div>

              <p className="text-xs text-pp-sub mt-1.5 truncate px-0.5">{item.title}</p>

              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); dispatch(removeFromCW(item.id)); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70
                           border border-white/20 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <FiX className="text-xs" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default ContinueWatchingRow;