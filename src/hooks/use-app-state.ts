import { useEffect, useState } from "react";

const KEY = "utg-theme";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(KEY)) as
      | "light"
      | "dark"
      | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(KEY, next);
  };

  return { theme, toggle };
}

const BM_KEY = "utg-bookmarks";

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BM_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: string[]) => {
    setIds(next);
    localStorage.setItem(BM_KEY, JSON.stringify(next));
  };

  const toggle = (id: string) => {
    save(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  };

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}
