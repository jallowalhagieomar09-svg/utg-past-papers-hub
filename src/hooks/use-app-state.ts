import { useEffect, useState } from "react";

const KEY = "utg-theme";

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setTheme(next);
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
    try {
      localStorage.setItem(BM_KEY, JSON.stringify(next));
    } catch {}
  };

  const toggle = (id: string) => {
    save(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  };

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}
