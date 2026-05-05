import { Link, useLocation } from "react-router-dom";

const HIDE_ON = ["/login", "/signup", "/profiles"];

export default function Footer() {
  const { pathname } = useLocation();
  if (HIDE_ON.includes(pathname)) return null;

  return (
    <footer className="bg-pixelplay-surface border-t border-pixelplay-border mt-20 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl tracking-widest text-pixelplay-accent mb-4">PIXELPLAY</h3>
            <p className="text-pixelplay-muted text-sm leading-relaxed">
              Premium streaming experience for movies and TV shows worldwide.
            </p>
          </div>
          {[
            { title: "Browse",   links: ["Home", "Movies", "TV Shows", "My List"] },
            { title: "Account",  links: ["Sign In", "Sign Up", "Profile", "Settings"] },
            { title: "Support",  links: ["Help Center", "Contact Us", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-pixelplay-subtext mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="text-pixelplay-muted text-sm hover:text-white cursor-pointer transition-colors">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-pixelplay-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-pixelplay-muted text-sm">© 2025 PixelPlay. All rights reserved.</p>
          <p className="text-pixelplay-muted text-xs">Powered by TMDB · Built with React + Vite</p>
        </div>
      </div>
    </footer>
  );
}