import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertCircle } from "react-icons/fi";

export default function TrailerModal({ isOpen, onClose, videoKey, title }) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setLoaded(false);
      setError(false);
    }
  }, [isOpen, videoKey]);

  // Esc key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Block body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  // YouTube embed URL — autoplay=1, mute=0 ensures sound
  const embedUrl = videoKey
    ? `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0&color=red&iv_load_policy=3`
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ padding: "16px" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            onClick={onClose}
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 48 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={  { scale: 0.85, opacity: 0, y: 48  }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full"
            style={{ maxWidth: "960px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between mb-3"
              style={{ padding: "0 4px" }}
            >
              <div>
                <p style={{ color: "#6B7280", fontSize: "11px",
                           textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Official Trailer
                </p>
                <h3 className="font-display text-2xl tracking-wider"
                  style={{ color: "#F9FAFB", marginTop: "2px" }}>
                  {title}
                </h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90, background: "rgba(229,9,20,0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#F9FAFB",
                  transition: "all 0.2s",
                }}
              >
                <FiX style={{ fontSize: "18px" }} />
              </motion.button>
            </div>

            {/* Video container */}
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",  /* 16:9 ratio */
                borderRadius: "16px",
                overflow: "hidden",
                background: "#000",
                boxShadow: "0 40px 120px rgba(0,0,0,0.95), 0 0 60px rgba(229,9,20,0.15)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Loading skeleton */}
              {!loaded && !error && (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 5,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "#0D1117",
                }}>
                  <div style={{
                    width: "56px", height: "56px",
                    border: "3px solid rgba(229,9,20,0.2)",
                    borderTopColor: "#E50914",
                    borderRadius: "50%",
                    animation: "trailerSpin 0.8s linear infinite",
                    marginBottom: "16px",
                  }} />
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>Loading trailer...</p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 5,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "#0D1117", textAlign: "center", padding: "24px",
                }}>
                  <FiAlertCircle style={{ fontSize: "48px", color: "#E50914", marginBottom: "16px" }} />
                  <p style={{ color: "#F9FAFB", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                    Trailer unavailable
                  </p>
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    This title doesn't have a playable trailer right now.
                  </p>
                  <button onClick={onClose}
                    style={{
                      marginTop: "20px", padding: "10px 24px", borderRadius: "8px",
                      background: "#E50914", color: "#FFF5E4",
                      border: "none", cursor: "pointer", fontWeight: 600,
                    }}>
                    Close
                  </button>
                </div>
              )}

              {/* The actual iframe — most reliable method */}
              {embedUrl && !error && (
                <iframe
                  key={videoKey}
                  src={embedUrl}
                  title={`${title} — Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setLoaded(true)}
                  onError={() => setError(true)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                />
              )}

              {/* No video key */}
              {!embedUrl && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0D1117", textAlign: "center", padding: "24px",
                }}>
                  <div>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎬</div>
                    <p style={{ color: "#9CA3AF" }}>No trailer found for this title.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <p style={{
              textAlign: "center", marginTop: "10px",
              color: "#374151", fontSize: "11px",
            }}>
              Press ESC or click outside to close
            </p>
          </motion.div>

          <style>{`
            @keyframes trailerSpin { to { transform: rotate(360deg); } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}