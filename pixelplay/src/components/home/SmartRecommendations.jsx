import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ENDPOINTS } from "../../api/endpoints";
import { FiZap } from "react-icons/fi";

const SmartRecommendations = memo(function SmartRecommendations({ items = [] }) {
  const navigate = useNavigate();
  if (!items.length) return null;

  return (
    <div className="px-4 md:px-8 lg:px-12">
      <div className="flex items-center gap-2 mb-4">
        <FiZap className="text-pp-gold text-lg" />
        <h2 className="text-lg md:text-xl font-semibold tracking-wide">
          Recommended For You
        </h2>
        <span className="text-xs text-pp-muted bg-pp-surface border border-pp-border
                         px-2 py-0.5 rounded-full ml-2">
          AI Picks
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.slice(0, 4).map((item, i) => {
          const backdrop = ENDPOINTS.BACKDROP(item.backdrop_path);
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/watch/movie/${item.id}`)}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ aspectRatio: "16/9" }}
            >
              {backdrop ? (
                <img src={backdrop} alt={item.title} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500
                             group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-pp-surface flex items-center justify-center text-4xl">🎬</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* AI match badge */}
              <div className="absolute top-2 left-2 bg-pp-gold/20 border border-pp-gold/40
                              rounded-full px-2 py-0.5 text-pp-gold text-[10px] font-bold
                              backdrop-blur-sm flex items-center gap-1">
                <FiZap className="text-[8px]" />
                {90 + i}% Match
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-semibold line-clamp-1">
                  {item.title || item.name}
                </p>
                <p className="text-pp-sub text-xs mt-0.5 line-clamp-1">{item.overview}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default SmartRecommendations;