import { useState, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme } from "../../features/theme/themeSlice";
import { startSwitching } from "../../features/profile/profileSlice";
import { logout } from "../../features/auth/authSlice";
import { FiSearch, FiBell, FiMenu, FiX, FiSun, FiMoon,
         FiUser, FiLogOut, FiList, FiChevronDown } from "react-icons/fi";

// Mock notifications
const NOTIFICATIONS = [
  { id: 1, text: "New season of Stranger Things is out!",  time: "2m ago",  unread: true  },
  { id: 2, text: "Your watchlist item 'Oppenheimer' is trending", time: "1h ago", unread: true },
  { id: 3, text: "Top picks updated based on your taste",  time: "3h ago",  unread: false },
  { id: 4, text: "New arrivals in Action & Thriller",       time: "1d ago",  unread: false },
];

const NAV_LINKS = [
  { label: "Home",                to: "/browse"     },
  { label: "Movies & TV Shows",   to: "/categories" },
  { label: "My List",             to: "/my-list"    },
];

const Navbar = memo(function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs,      setNotifs]      = useState(NOTIFICATIONS);

  const { isLoggedIn, user } = useSelector((s) => s.auth);
  const { activeProfile }    = useSelector((s) => s.profile);
  const { mode }             = useSelector((s) => s.theme);

  const unreadCount = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleMarkAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, unread: false })));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSwitchProfile = () => {
    dispatch(startSwitching());
    setProfileOpen(false);
    navigate("/profiles");
  };

  const HIDE_ON = ["/login", "/signup"];
  if (HIDE_ON.includes(location.pathname)) return null;

  const avatar = activeProfile?.avatar || user?.displayName?.[0]?.toUpperCase() || "U";
  const accentColor = activeProfile?.color || "#E50914";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? "bg-[rgba(8,11,20,0.97)] backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.6)] border-b border-white/5"
            : "bg-gradient-to-b from-[rgba(8,11,20,0.8)] to-transparent"}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex items-center h-16 gap-6">

          {/* Logo */}
          <Link to="/browse" className="flex-shrink-0 group">
            <span className="font-display text-2xl tracking-widest">
              PIXEL
              <span className="text-pp-accent group-hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.8)] transition-all duration-300">
                PLAY
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.to ||
                  (link.to === "/browse" && location.pathname === "/");
                return (
                  <Link key={link.label} to={link.to}
                    className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                      ${active ? "text-white" : "text-pp-sub hover:text-white"}`}
                  >
                    {active && (
                      <motion.span layoutId="nav-pill"
                        className="absolute inset-0 bg-white/8 rounded-md"
                        transition={{ type: "spring", bounce: 0.25 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Actions */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1">

              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/search")}
                className="p-2.5 rounded-full text-pp-sub hover:text-white hover:bg-white/8 transition-all"
              >
                <FiSearch className="text-lg" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleTheme())}
                className="p-2.5 rounded-full text-pp-sub hover:text-white hover:bg-white/8 transition-all"
              >
                {mode === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="relative p-2.5 rounded-full text-pp-sub hover:text-white hover:bg-white/8 transition-all"
                >
                  <FiBell className="text-lg" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-4 h-4 bg-pp-accent rounded-full
                                 text-[10px] font-bold flex items-center justify-center text-white
                                 animate-pulseGlow"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      exit={  { opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }}
                      className="absolute right-0 top-full mt-2 w-80 card-glass rounded-2xl overflow-hidden
                                 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/8"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                        <span className="font-semibold text-sm">Notifications</span>
                        <button onClick={handleMarkAllRead}
                          className="text-xs text-pp-accent hover:underline">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifs.map((n, i) => (
                          <motion.div key={n.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setNotifs((prev) =>
                              prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                            className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors
                              ${n.unread ? "bg-pp-accent/5 hover:bg-pp-accent/10" : "hover:bg-white/5"}`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                              ${n.unread ? "bg-pp-accent" : "bg-transparent"}`} />
                            <div>
                              <p className="text-sm leading-tight">{n.text}</p>
                              <p className="text-xs text-pp-muted mt-0.5">{n.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative ml-1">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/8 transition-all"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold
                                  transition-all duration-300"
                    style={{ background: `${accentColor}33`, border: `2px solid ${accentColor}66` }}>
                    {avatar}
                  </div>
                  <FiChevronDown className={`text-pp-sub text-sm transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      exit={  { opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }}
                      className="absolute right-0 top-full mt-2 w-56 card-glass rounded-2xl overflow-hidden
                                 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/8"
                    >
                      {/* Current Profile */}
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-xs text-pp-muted">Signed in as</p>
                        <p className="font-semibold text-sm truncate">
                          {activeProfile?.name || user?.displayName || "User"}
                        </p>
                      </div>

                      {[
                        { icon: <FiUser />,   label: "Profile",        action: () => navigate("/profile")     },
                        { icon: <FiList />,   label: "My List",        action: () => navigate("/my-list")     },
                        { icon: <span>👤</span>, label: "Switch Profile", action: handleSwitchProfile          },
                      ].map((item) => (
                        <button key={item.label} onClick={item.action}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-pp-sub hover:text-white hover:bg-white/8 transition-all text-left">
                          <span className="text-pp-accent">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}

                      <div className="border-t border-white/8">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                     text-red-400 hover:bg-red-500/10 transition-all text-left">
                          <FiLogOut />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2.5 rounded-full hover:bg-white/8"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"  className="btn-secondary text-sm px-4 py-2">Sign In</Link>
              <Link to="/signup" className="btn-primary  text-sm px-4 py-2">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={  { opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/8 bg-[rgba(8,11,20,0.98)]"
            >
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}
                  className="flex items-center px-6 py-3.5 text-pp-sub hover:text-white
                             hover:bg-white/5 transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-40"
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </>
  );
});

export default Navbar;