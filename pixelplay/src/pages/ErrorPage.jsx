import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-pixelplay-bg flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-[12rem] leading-none text-gradient opacity-20 select-none">404</h1>
        <div className="-mt-16 relative z-10">
          <h2 className="text-3xl font-semibold mb-4">Lost in the Stream?</h2>
          <p className="text-pixelplay-subtext mb-8 max-w-md mx-auto">
            The page you're looking for has gone off-air. Let's get you back to the good stuff.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate("/")} className="btn-primary px-8">Go Home</button>
            <button onClick={() => navigate(-1)} className="btn-secondary px-8">Go Back</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}