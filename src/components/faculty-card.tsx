import { Link } from "@tanstack/react-router";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";
import type { Faculty } from "@/lib/papers-data";

export function FacultyCard({ faculty }: { faculty: Faculty }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-card`}>
      <div className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br ${faculty.accent} opacity-60`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{faculty.short}</div>
              <h3 className="font-serif text-lg leading-tight">{faculty.name}</h3>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{faculty.description}</p>

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary"
        >
          {open ? "Hide" : "View"} departments
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="mt-3 flex flex-wrap gap-1.5 animate-fade-in">
            {faculty.departments.map((d) => (
              <li key={d} className="rounded-md border border-border bg-background/60 px-2 py-1 text-xs text-foreground">
                {d}
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/papers"
          search={{ faculty: faculty.slug }}
          className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Browse papers →
        </Link>
      </div>
    </div>
  );
}
