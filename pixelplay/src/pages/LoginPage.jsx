import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { loginDemo, loginGuest, clearError } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FiUser, FiZap } from "react-icons/fi";

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/profiles";
  const { error } = useSelector((s) => s.auth);

  const [form,     setForm]     = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch(loginDemo({ email: form.email, password: form.password }));
      const saved = localStorage.getItem("pixelplay_user");
      if (saved) {
        toast.success("Welcome back! 🎬");
        navigate(from, { replace: true });
      } else {
        toast.error("Invalid credentials");
      }
      setLoading(false);
    }, 600);
  };

  const handleGuest = () => {
    dispatch(loginGuest());
    toast.success("Continuing as Guest 👤");
    navigate("/profiles");
  };

  const autofill = () => {
    setForm({ email: "demo@pixelplay.com", password: "demo123" });
    dispatch(clearError());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#080B14" }}
    >
      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #E50914 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #F5C518 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Grid pattern overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1,  y: 0   }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1
            className="font-display text-6xl tracking-widest"
            style={{ color: "#F9FAFB" }}
          >
            PIXEL
            <span style={{
              color: "#E50914",
              textShadow: "0 0 30px rgba(229,9,20,0.6)",
            }}>
              PLAY
            </span>
          </h1>
          <p
            className="mt-2 text-xs tracking-[0.3em] uppercase"
            style={{ color: "#6B7280" }}
          >
            Premium Streaming
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "rgba(13, 17, 23, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "36px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <h2
            className="text-2xl font-semibold text-center mb-2"
            style={{ color: "#F9FAFB" }}
          >
            Sign In
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: "#6B7280" }}>
            Access your PixelPlay account
          </p>

          {/* Demo autofill button */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={autofill}
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "10px 16px",
              borderRadius: "10px",
              background: "rgba(229,9,20,0.08)",
              border: "1px solid rgba(229,9,20,0.25)",
              color: "#E50914",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <FiZap />
            Use Demo Account — click to autofill
          </motion.button>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative mb-4">
              <MdEmail
                className="absolute text-xl"
                style={{
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                  zIndex: 1,
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "12px 14px 12px 44px",
                  color: "#F9FAFB",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#E50914";
                  e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="relative mb-2">
              <MdLock
                className="absolute text-xl"
                style={{
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                  zIndex: 1,
                }}
              />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "12px 44px 12px 44px",
                  color: "#F9FAFB",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#E50914";
                  e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                {showPass ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1,  y:  0 }}
                className="text-sm text-center mb-3"
                style={{ color: "#f87171" }}
              >
                ⚠ {error} — try demo@pixelplay.com / demo123
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(229,9,20,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "13px",
                borderRadius: "10px",
                background: loading
                  ? "#b80710"
                  : "linear-gradient(135deg, #E50914 0%, #b80710 100%)",
                border: "none",
                color: "#FFF5E4",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(229,9,20,0.35)",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "18px", height: "18px",
                      border: "2px solid rgba(255,245,228,0.3)",
                      borderTopColor: "#FFF5E4",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Signing in...
                </>
              ) : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "#6B7280", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Guest */}
          <motion.button
            whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGuest}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F9FAFB",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
            }}
          >
            <FiUser style={{ fontSize: "18px" }} />
            Continue as Guest
          </motion.button>

          <p className="text-center mt-5 text-sm" style={{ color: "#6B7280" }}>
            New to PixelPlay?{" "}
            <Link
              to="/signup"
              style={{ color: "#E50914", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              Create account
            </Link>
          </p>
        </motion.div>

        {/* Credentials hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
          <p style={{ color: "#4B5563", fontSize: "12px" }}>
            Demo: <span style={{ color: "#9CA3AF" }}>demo@pixelplay.com</span>
            {" / "}
            <span style={{ color: "#9CA3AF" }}>demo123</span>
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #4B5563; }
      `}</style>
    </div>
  );
}