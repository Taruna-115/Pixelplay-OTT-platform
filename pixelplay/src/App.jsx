import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { restoreSession } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <AppRoutes />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.theme);

  useEffect(() => {
    // Theme
    const saved = localStorage.getItem("pp_theme") || "dark";
    if (saved === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");

    // Session restore — refresh pe same page
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (mode === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  }, [mode]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div
          className="min-h-screen font-body"
          style={{ background: "var(--bg)", color: "var(--text)" }}
        >
          <Navbar />
          <main className="min-h-screen">
            <AnimatedRoutes />
          </main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            theme="dark"
            toastStyle={{
              background: "#0D1117",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}