import { Link } from "@tanstack/react-router";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import type { Faculty } from "@/lib/papers-data";

export function FacultyCard({ faculty }: { faculty: Faculty }) {
  return (
    <Link
      to="/schools/$slug"
      params={{ slug: faculty.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br ${faculty.accent} opacity-70`} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/70 text-muted-foreground transition-all group-hover:border-primary group-hover:text-primary">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {faculty.short}
          </div>
          <h3 className="mt-1.5 font-serif text-lg font-semibold leading-tight text-card-foreground">
            {faculty.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faculty.description}</p>
        </div>

        <div className="mt-5 flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {faculty.departments.length} departments
        </div>
      </div>
    </Link>
  );
}
