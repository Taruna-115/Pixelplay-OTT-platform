import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("react-router-dom")) {
              return "vendor-router";
            }
            if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
              return "vendor-redux";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("swiper")) {
              return "vendor-swiper";
            }
            if (id.includes("react-toastify") || id.includes("react-icons")) {
              return "vendor-ui";
            }
            return "vendor"; // fallback
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "framer-motion",
    ],
  },
  server: {
    hmr: { overlay: true },
  },
});
