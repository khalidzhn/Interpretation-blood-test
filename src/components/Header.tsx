import React from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggleButton: React.FC = () => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    return saved === "dark" || document.documentElement.classList.contains("dark");
  });

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    const html = document.documentElement;
    if (saved === "dark") {
      html.classList.remove("light");
      html.classList.add("dark");
      setIsDark(true);
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};

const Header: React.FC = () => (
  <header >

  </header>
);

export default Header;
