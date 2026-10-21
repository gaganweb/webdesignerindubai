"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0b0f17" : "#f8fafc");
    };
    syncTheme();

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== "theme") return;
      const nextTheme = event.newValue === "dark" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.classList.toggle("light", nextTheme === "light");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#0b0f17" : "#f8fafc");
      syncTheme();
    };

    window.addEventListener("storage", syncAcrossTabs);
    window.addEventListener("portfolio:themechange", syncTheme);
    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
      window.removeEventListener("portfolio:themechange", syncTheme);
    };
  }, []);

  const toggle = () => {
    const nextTheme = document.documentElement.classList.contains("light") ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#0b0f17" : "#f8fafc");
    window.dispatchEvent(new Event("portfolio:themechange"));
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // The current tab still switches themes when storage is unavailable.
    }
  };

  const light = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!light}
      aria-label="Switch theme mode"
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggle}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/85 text-foreground shadow-sm backdrop-blur-md transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      data-testid="theme-toggle"
    >
      <Sun
        size={20}
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${light ? "rotate-180 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
      <Moon
        size={20}
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${light ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-50 opacity-0"}`}
      />
    </button>
  );
}