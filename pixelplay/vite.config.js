import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":   ["react", "react-dom"],
          "vendor-router":  ["react-router-dom"],
          "vendor-redux":   ["@reduxjs/toolkit", "react-redux"],
          "vendor-motion":  ["framer-motion"],
          "vendor-swiper":  ["swiper"],
          "vendor-ui":      ["react-toastify", "react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 700,
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@reduxjs/toolkit", "framer-motion"],
  },
  server: {
    hmr: { overlay: true },
  },
});