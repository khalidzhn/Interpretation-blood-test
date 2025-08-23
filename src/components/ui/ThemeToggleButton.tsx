import React from "react";

const ThemeToggleButton: React.FC = () => {
const [isDark, setIsDark] = React.useState(() =>
  typeof window !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false
);

React.useEffect(() => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
    setIsDark(true);
  } else {
    document.documentElement.classList.remove("dark");
    setIsDark(false);
  }
}, []);

const toggleTheme = () => {
  const html = document.documentElement;
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setIsDark(false);
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setIsDark(true);
  }
};

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg border bg-background text-medical-blue shadow hover:bg-blue-50 transition"
      aria-label="Toggle theme"
    >
      {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggleButton;