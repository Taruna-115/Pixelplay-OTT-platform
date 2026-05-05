import { motion } from "framer-motion";

export default function ProfileCard({ profile, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(profile)}
      className="w-36 text-center cursor-pointer group"
    >
      <div
        className="w-32 h-32 rounded-xl flex items-center justify-center text-5xl
                   transition-all duration-300 mx-auto border-2 border-transparent
                   group-hover:border-white group-hover:shadow-card-hover"
        style={{ backgroundColor: profile.color + "33" }}
      >
        {profile.avatar}
      </div>
      <p className="mt-3 font-medium text-pixelplay-subtext group-hover:text-white transition-colors">
        {profile.name}
      </p>
    </motion.div>
  );
}