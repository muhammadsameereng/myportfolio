"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("theme") as Theme) || "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
  localStorage.setItem("theme", theme);
}

let listeners: Array<() => void> = [];
let currentTheme: Theme = "dark";

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function setThemeExternal(theme: Theme) {
  currentTheme = theme;
  applyTheme(theme);
  listeners.forEach((l) => l());
}

/*
 * Crossfade transition: a full-screen overlay fades in,
 * the theme swaps while hidden, then the overlay fades out.
 * This avoids flickering because gradients and CSS variables
 * all change while the overlay covers everything.
 */
function crossfadeTransition(nextTheme: Theme) {
  // Determine the target background color
  const targetBg = nextTheme === "dark" ? "#09090b" : "#fafafa";

  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99998;
    pointer-events: none;
    background: ${targetBg};
    opacity: 0;
    transition: opacity 250ms ease;
  `;
  document.body.appendChild(overlay);

  // Phase 1: Fade overlay in
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  // Phase 2: At peak coverage, swap the theme
  setTimeout(() => {
    setThemeExternal(nextTheme);

    // Phase 3: Fade overlay out
    requestAnimationFrame(() => {
      overlay.style.opacity = "0";
    });

    // Phase 4: Remove overlay after fade completes
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }, 250);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getTheme();
    currentTheme = stored;
    applyTheme(stored);
    setMounted(true);
    listeners.forEach((l) => l());
  }, []);

  const toggle = useCallback(() => {
    const next = currentTheme === "dark" ? "light" : "dark";
    crossfadeTransition(next);
  }, []);

  const resolvedTheme = mounted ? theme : "dark";

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
