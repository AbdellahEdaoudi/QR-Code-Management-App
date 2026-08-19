"use client";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "./Icons";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-300 cursor-pointer select-none overflow-hidden group
        bg-white/80 border-slate-300 hover:border-purple-400/60
        dark:bg-slate-800/80 dark:border-slate-700 dark:hover:border-purple-500/50"
    >
      {/* Sun icon — shown in dark mode (clicking switches to light) */}
      <Sun
        className={`w-4.5 h-4.5 absolute transition-all duration-300 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100 text-amber-400"
            : "opacity-0 rotate-90 scale-50 text-amber-400"
        }`}
      />
      {/* Moon icon — shown in light mode (clicking switches to dark) */}
      <Moon
        className={`w-4.5 h-4.5 absolute transition-all duration-300 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100 text-indigo-500"
            : "opacity-0 -rotate-90 scale-50 text-indigo-400"
        }`}
      />
    </button>
  );
}
