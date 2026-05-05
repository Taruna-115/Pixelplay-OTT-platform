import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { selectProfile } from "../features/profile/profileSlice";

export default function ProfileSelectPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profiles, activeProfile } = useSelector((s) => s.profile);
  const [selecting, setSelecting]   = useState(null);
  const [exiting,   setExiting]     = useState(false);

  const handleSelect = (profile) => {
    setSelecting(profile.id);
    // Cinematic delay before navigating
    setTimeout(() => {
      dispatch(selectProfile(profile));
      setExiting(true);
      setTimeout(() => navigate("/browse"), 500);
    }, 700);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-pp-bg flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.07)_0%,_transparent_65%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(0,212,255,0.04)_0%,_transparent_50%)]" />
            {/* Subtle scanline */}
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-pp-accent/20 to-transparent animate-scanline" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14 relative z-10"
          >
            <h1 className="font-display text-5xl md:text-6xl tracking-widest mb-3">
              Who's <span className="text-gradient">Watching?</span>
            </h1>
            <p className="text-pp-sub text-base">Select your profile to get personalized content</p>
          </motion.div>

          <div className="flex flex-wrap gap-8 justify-center max-w-4xl px-6 relative z-10">
            {profiles.map((profile, i) => {
              const isSelected = selecting === profile.id;
              const isActive   = activeProfile?.id === profile.id;

              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.7, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-center"
                >
                  <motion.div
                    onClick={() => !selecting && handleSelect(profile)}
                    whileHover={!selecting ? { y: -8, scale: 1.06 } : {}}
                    whileTap={!selecting ? { scale: 0.94 } : {}}
                    animate={isSelected ? {
                      scale: [1, 1.15, 1.1],
                      boxShadow: [`0 0 0px ${profile.color}`, `0 0 40px ${profile.color}88`, `0 0 60px ${profile.color}66`],
                    } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-32 h-32 md:w-36 md:h-36 rounded-2xl flex items-center justify-center
                               text-6xl cursor-pointer mx-auto relative overflow-hidden
                               transition-all duration-300`}
                    style={{
                      background: `${profile.color}22`,
                      border: `2px solid ${isActive || isSelected ? profile.color : profile.color + "44"}`,
                      boxShadow: isActive ? `0 0 24px ${profile.color}44` : "none",
                    }}
                  >
                    <span className="relative z-10">{profile.avatar}</span>

                    {/* Selection ripple */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{ scale: 3, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: profile.color }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Loading spinner */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center
                                     bg-black/40 backdrop-blur-sm rounded-2xl"
                        >
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white
                                          rounded-full animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active badge */}
                    {isActive && !isSelected && (
                      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-green-400
                                      border-2 border-pp-bg" />
                    )}
                  </motion.div>

                  <motion.div className="mt-3"
                    animate={isSelected ? { opacity: 0.6 } : { opacity: 1 }}>
                    <p className={`font-semibold text-sm transition-colors
                      ${isActive ? "text-white" : "text-pp-sub"}`}>
                      {profile.name}
                    </p>
                    {isActive && (
                      <p className="text-xs text-green-400 mt-0.5">Active</p>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Manage profiles link */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-pp-muted text-sm relative z-10"
          >
            Demo profiles — switch anytime from the navbar
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}