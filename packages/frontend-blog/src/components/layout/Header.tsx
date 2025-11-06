import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;

          // Prevent weird behavior when tab isn't visible
          if (document.visibilityState === "visible") {
            setScrolled(currentScrollY > 10);

            // Only update if scroll difference is meaningful
            const diff = currentScrollY - lastScrollY;
            if (diff > 15 && currentScrollY > 100) {
              setShrunk(true);
            } else if (diff < -15) {
              setShrunk(false);
            }

            lastScrollYRef.current = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        scrolled
          ? "bg-background/80 shadow-lg border border-border/90"
          : "bg-transparent border-transparent"
      } ${shrunk ? "top-3 py-0 scale-[0.92]" : "top-0 py-4 scale-100"}`}
    >
      <div className="flex items-center justify-between px-6 transition-all duration-300">
        <h1
          className={`font-bold transition-all duration-300 ${shrunk ? "text-lg" : "text-xl"}`}
        >
          <Link
            to="/"
            className={`bg-clip-text text-transparent transition-all duration-300 ${
              shrunk
                ? "bg-linear-to-r from-indigo-400 to-purple-400"
                : "bg-linear-to-r from-indigo-300 to-purple-300"
            } hover:from-purple-500 hover:to-indigo-500`}
          >
            Daktilo Blog
          </Link>
        </h1>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
