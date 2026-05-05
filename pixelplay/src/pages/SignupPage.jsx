import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match!"); return; }
    if (form.password.length < 6)       { toast.error("Min 6 characters required"); return; }

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        uid: `user-${Date.now()}`,
        email: form.email,
        displayName: form.name,
        photoURL: null,
      };
      localStorage.setItem("pixelplay_user", JSON.stringify(newUser));
      dispatch({ type: "auth/restoreSession" });
      toast.success("Account created! Welcome 🎬");
      setLoading(false);
      navigate("/profiles");
    }, 700);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 14px 12px 44px",
    color: "#F9FAFB",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const FIELDS = [
    { icon: <MdPerson />,  name: "name",     type: "text",     placeholder: "Full name"     },
    { icon: <MdEmail />,   name: "email",    type: "email",    placeholder: "Email address" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#080B14" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: "absolute", top: "-160px", right: "-160px",
          width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, #E50914 0%, transparent 70%)",
          filter: "blur(60px)", opacity: 0.15,
          animation: "float 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-120px", left: "-120px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)",
          filter: "blur(80px)", opacity: 0.1,
          animation: "float 12s ease-in-out infinite reverse",
        }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-6xl tracking-widest" style={{ color: "#F9FAFB" }}>
            PIXEL
            <span style={{ color: "#E50914", textShadow: "0 0 30px rgba(229,9,20,0.6)" }}>
              PLAY
            </span>
          </h1>
          <p className="mt-2 text-xs tracking-[0.3em] uppercase" style={{ color: "#6B7280" }}>
            Join Today
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(13, 17, 23, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <h2 className="text-2xl font-semibold text-center mb-1" style={{ color: "#F9FAFB" }}>
            Create Account
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: "#6B7280" }}>
            Start your free PixelPlay journey
          </p>

          <form onSubmit={handleSubmit}>
            {/* Text + Email fields */}
            {FIELDS.map((f) => (
              <div key={f.name} className="relative mb-4">
                <span style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280", fontSize: "20px", zIndex: 1,
                  display: "flex",
                }}>
                  {f.icon}
                </span>
                <input
                  type={f.type} name={f.name}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  style={inputStyle}
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
            ))}

            {/* Password fields */}
            {["password", "confirm"].map((field) => (
              <div key={field} className="relative mb-4">
                <MdLock style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280", fontSize: "20px", zIndex: 1,
                }} />
                <input
                  type={showPass ? "text" : "password"}
                  name={field}
                  placeholder={field === "password" ? "Password (min 6 chars)" : "Confirm password"}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, paddingRight: field === "confirm" ? "44px" : "14px" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#E50914";
                    e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {field === "confirm" && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute", right: "14px", top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6B7280", background: "none", border: "none",
                      cursor: "pointer", display: "flex", fontSize: "20px",
                    }}
                  >
                    {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                )}
              </div>
            ))}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(229,9,20,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "13px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #E50914 0%, #b80710 100%)",
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
                  <span style={{
                    width: "18px", height: "18px",
                    border: "2px solid rgba(255,245,228,0.3)",
                    borderTopColor: "#FFF5E4",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Creating account...
                </>
              ) : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center mt-5 text-sm" style={{ color: "#6B7280" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#E50914", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #4B5563 !important; }
      `}</style>
    </div>
  );
}