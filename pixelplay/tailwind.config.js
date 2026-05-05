/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        pp: {
          bg:      "#080B14",
          surface: "#0D1117",
          card:    "#111827",
          border:  "#1F2937",
          accent:  "#E50914",
          gold:    "#F5C518",
          neon:    "#00D4FF",
          muted:   "#6B7280",
          text:    "#F9FAFB",
          sub:     "#9CA3AF",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "hero-overlay":  "linear-gradient(to right, rgba(8,11,20,0.97) 35%, rgba(8,11,20,0.5) 70%, transparent 100%)",
        "card-overlay":  "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.7) 40%, transparent 100%)",
        "cinematic":     "linear-gradient(135deg, #080B14 0%, #0D1B2A 50%, #080B14 100%)",
        "gold-shine":    "linear-gradient(105deg, transparent 40%, rgba(245,197,24,0.15) 50%, transparent 60%)",
      },
      animation: {
        "shimmer":    "shimmer 2s infinite linear",
        "float":      "float 6s ease-in-out infinite",
        "pulseGlow":  "pulseGlow 2s ease-in-out infinite",
        "scanline":   "scanline 8s linear infinite",
        "fadeIn":     "pageEnter 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};