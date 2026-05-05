import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { removeFromWatchlist } from "../features/watchlist/watchlistSlice";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../api/endpoints";
import { toast } from "react-toastify";
import { FiTrash2, FiPlay, FiStar } from "react-icons/fi";

export default function MyListPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector((s) => s.watchlist);

  const handleRemove = (item) => {
    dispatch(removeFromWatchlist(item.id));
    toast.info(`"${item.title}" removed`, { autoClose: 2000 });
  };

  return (
    <motion.div
      className="min-h-screen bg-pp-bg pt-24 px-4 md:px-8 lg:px-16 page-enter"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="section-title">
              My <span className="text-gradient">List</span>
            </h1>
            <p className="text-pp-muted text-sm mt-1">
              {items.length} title{items.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              📋
            </motion.div>
            <h2 className="text-2xl font-semibold mb-3">Your list is empty</h2>
            <p className="text-pp-sub mb-8 max-w-sm">
              Add movies and shows you want to watch later. They'll appear here.
            </p>
            <button onClick={() => navigate("/browse")} className="btn-primary px-8">
              Browse Content
            </button>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      y: -30,
                      filter: "blur(8px)",
                      transition: { duration: 0.3 }
                    }}
                    transition={{
                      layout: { duration: 0.35, ease: [0.22,1,0.36,1] },
                      default: { delay: i * 0.04, duration: 0.4, ease: [0.22,1,0.36,1] }
                    }}
                    className="relative group cursor-pointer"
                    style={{ aspectRatio: "2/3" }}
                  >
                    <div
                      className="w-full h-full rounded-xl overflow-hidden bg-pp-card relative
                                 hover:ring-2 hover:ring-pp-accent/60 transition-all duration-300
                                 hover:shadow-[0_20px_60px_rgba(229,9,20,0.2)]"
                      onClick={() => navigate(`/watch/${item.media_type || "movie"}/${item.id}`)}
                    >
                      {item.poster_path ? (
                        <img
                          src={ENDPOINTS.IMAGE(item.poster_path, "w342")}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500
                                     group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-pp-surface">
                          🎬
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-card-overlay opacity-0 group-hover:opacity-100
                                      transition-opacity duration-300" />

                      {/* Hover actions */}
                      <div className="absolute bottom-0 left-0 right-0 p-3
                                      translate-y-2 group-hover:translate-y-0
                                      opacity-0 group-hover:opacity-100
                                      transition-all duration-300">
                        <p className="text-white text-xs font-semibold line-clamp-2 mb-2">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.vote_average && (
                            <span className="flex items-center gap-0.5 text-pp-gold text-xs">
                              <FiStar className="fill-current text-[10px]" />
                              {item.vote_average?.toFixed(1)}
                            </span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/watch/${item.media_type || "movie"}/${item.id}`);
                            }}
                            className="ml-auto w-7 h-7 rounded-full bg-white flex items-center justify-center
                                       hover:bg-pp-accent transition-colors"
                          >
                            <FiPlay className="text-black text-xs ml-0.5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Rating badge */}
                      {item.vote_average && (
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm
                                        rounded px-1.5 py-0.5 flex items-center gap-0.5">
                          <FiStar className="text-pp-gold text-[10px] fill-current" />
                          <span className="text-white text-[11px] font-semibold">
                            {item.vote_average?.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm
                                 border border-white/20 flex items-center justify-center text-red-400
                                 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20
                                 hover:border-red-500/50 z-10"
                      onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                    >
                      <FiTrash2 className="text-xs" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>
    </motion.div>
  );
}