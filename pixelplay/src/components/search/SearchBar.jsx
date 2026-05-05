import { useRef } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({ value, onChange, onClear }) {
  const inputRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center"
    >
      <FiSearch className="absolute left-4 text-pixelplay-muted text-lg pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies, TV shows, actors..."
        autoFocus
        className="input-field pl-12 pr-10 py-4 text-base rounded-xl"
      />
      {value && (
        <button onClick={() => { onClear(); inputRef.current?.focus(); }}
          className="absolute right-4 text-pixelplay-muted hover:text-white transition-colors">
          <FiX className="text-lg" />
        </button>
      )}
    </motion.div>
  );
}