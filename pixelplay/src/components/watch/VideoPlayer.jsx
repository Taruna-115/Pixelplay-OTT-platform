import { useState, memo } from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { FiMaximize, FiVolume2, FiVolumeX } from "react-icons/fi";

const VideoPlayer = memo(function VideoPlayer({ trailerKey, title }) {
  const [muted,   setMuted]   = useState(false);
  const [playing, setPlaying] = useState(true);

  if (!trailerKey) return (
    <div className="aspect-video bg-pixelplay-surface rounded-xl flex items-center justify-center">
      <p className="text-pixelplay-muted">No trailer available</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative aspect-video rounded-xl overflow-hidden shadow-card-hover bg-black group">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${trailerKey}`}
        width="100%" height="100%"
        playing={playing} muted={muted} controls={false}
        config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }}
      />

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
        <button onClick={() => setPlaying(!playing)}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => setMuted(!muted)}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-sm">
          {muted ? <FiVolumeX /> : <FiVolume2 />}
        </button>
        <span className="text-sm font-medium text-white flex-1 truncate ml-2">{title} — Official Trailer</span>
      </div>
    </motion.div>
  );
});

export default VideoPlayer;