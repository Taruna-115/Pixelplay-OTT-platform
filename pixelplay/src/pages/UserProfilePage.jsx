import { useSelector, useDispatch } from "react-redux";
import { useNavigate }  from "react-router-dom";
import { motion }       from "framer-motion";
import { logout }       from "../features/auth/authSlice";
import { clearCW }      from "../features/continueWatching/continueWatchingSlice";
import { clearWatchlist } from "../features/watchlist/watchlistSlice";
import { toast }        from "react-toastify";
import { FiLogOut, FiUser, FiList, FiClock } from "react-icons/fi";

export default function UserProfilePage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { items: watchlist } = useSelector((s) => s.watchlist);
  const { items: cw }        = useSelector((s) => s.continueWatching);
  const { activeProfile }    = useSelector((s) => s.profile);

  const handleLogout = () => {
  dispatch(logout());
  toast.success("Signed out successfully");
  navigate("/login");
  };

  const stats = [
    { icon: <FiList />,  label: "Watchlist",        value: watchlist.length },
    { icon: <FiClock />, label: "Continue Watching", value: cw.length },
  ];

  return (
    <div className="min-h-screen bg-pixelplay-bg pt-24 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title mb-8">Account <span className="text-gradient">Settings</span></h1>

        {/* Profile Card */}
        <div className="card-glass p-8 rounded-2xl mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-pixelplay-accent flex items-center justify-center text-3xl">
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              : <FiUser />}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.displayName || "User"}</h2>
            <p className="text-pixelplay-subtext">{user?.email}</p>
            {activeProfile && (
              <p className="text-sm text-pixelplay-muted mt-1">
                Active Profile: <span className="text-pixelplay-accent">{activeProfile.avatar} {activeProfile.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="card-glass p-6 rounded-xl flex items-center gap-4">
              <span className="text-2xl text-pixelplay-accent">{s.icon}</span>
              <div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-pixelplay-subtext text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="card-glass rounded-xl overflow-hidden">
          {[
            { label: "My Watchlist", icon: <FiList />, action: () => navigate("/my-list") },
            { label: "Switch Profile", icon: <FiUser />, action: () => navigate("/profiles") },
          ].map((item) => (
            <button key={item.label} onClick={item.action}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-pixelplay-border/50 transition-colors text-left">
              <span className="text-pixelplay-accent">{item.icon}</span>
              <span>{item.label}</span>
              <span className="ml-auto text-pixelplay-muted">›</span>
            </button>
          ))}
          <div className="border-t border-pixelplay-border">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-900/20 transition-colors text-red-400 text-left">
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}