import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import CommandPalette from "../custom/CommandPalette";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const lastScrollY = lastScrollYRef.current;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 10);

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setHidden(true); //scrolling down
        } else {
          setHidden(false); //scrolling up
        }
        lastScrollYRef.current = currentScrollY;
      }, 0); // debounce interval
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-background/80 shadow-md" : "bg-transparent"
      } ${hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side: site title */}
        <h1 className="text-xl font-bold tracking-tight">
          <Link
            to="/"
            className="bg-clip-text text-transparent bg-linear-to-r from-indigo-300 to-purple-300 hover:from-purple-500 hover:to-indigo-500 transition-colors duration-300"
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
