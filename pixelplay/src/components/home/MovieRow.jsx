import { useRef, memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

const MovieRow = memo(function MovieRow({ title, items = [], mediaType = "movie" }) {
  const rowRef  = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX  = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = useCallback((e) => {
    setIsDragging(false);
    dragStartX.current  = e.clientX;
    scrollStart.current = rowRef.current?.scrollLeft || 0;

    const onMove = (mv) => {
      const delta = mv.clientX - dragStartX.current;
      if (Math.abs(delta) > 5) setIsDragging(true);
      if (rowRef.current) rowRef.current.scrollLeft = scrollStart.current - delta;
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setTimeout(() => setIsDragging(false), 50);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  if (!items.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 md:px-8 lg:px-12"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-3 tracking-wide flex items-center gap-2">
        {title}
        <span className="text-pp-muted text-sm font-normal">({items.length})</span>
      </h2>

      <div
        ref={rowRef}
        onMouseDown={onMouseDown}
        className={`flex gap-3 overflow-x-auto hide-scrollbar pb-3 snap-x snap-mandatory
                    ${isDragging ? "drag-scroll select-none" : "cursor-default"}`}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
            className="snap-start flex-shrink-0"
            style={{ width: "clamp(110px, 13vw, 160px)" }}
            onClick={isDragging ? (e) => e.preventDefault() : undefined}
          >
            <MovieCard item={item} mediaType={mediaType} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export default MovieRow;