import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-pixelplay-bg/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <motion.h1
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl tracking-widest text-pixelplay-accent mb-8"
      >
        PIXELPLAY
      </motion.h1>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div key={i}
            animate={{ scaleY: 1.5 }}
            initial={{ scaleY: 1 }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.08
            }}
            className="w-1.5 h-6 bg-pixelplay-accent rounded-full will-change-transform"
          />
        ))}
      </div>
    </div>
  );
}