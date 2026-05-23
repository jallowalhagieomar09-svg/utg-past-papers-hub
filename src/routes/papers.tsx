import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { PaperCard } from "@/components/paper-card";
import { FACULTIES, SEMESTERS, YEARS } from "@/lib/papers-data";
import { listPapers } from "@/lib/papers.functions";

const searchSchema = z.object({
  q: z.string().optional(),
  faculty: z.string().optional(),
  semester: z.string().optional(),
  year: z.coerce.number().optional(),
});

export const Route = createFileRoute("/papers")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse Past Papers — UTG Past Papers Hub" },
      { name: "description", content: "Filter UTG past examination papers by faculty, semester, year, and course code." },
    ],
  }),
  component: PapersPage,
});

function PapersPage() {
  const initial = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(initial.q ?? "");
  const faculty = initial.faculty;
  const semester = initial.semester;
  const year = initial.year;

  const fetchPapers = useServerFn(listPapers);
  const { data, isLoading } = useQuery({
    queryKey: ["papers"],
    queryFn: () => fetchPapers(),
  });
  const papers = data?.papers ?? [];

  const setFilter = (key: string, value: string | number | undefined) => {
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, [key]: value || undefined }) });
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return papers.filter((p) => {
      if (faculty && p.faculty !== faculty) return false;
      if (semester && p.semester !== semester) return false;
      if (year && p.year !== Number(year)) return false;
      if (
        term &&
        !p.code.toLowerCase().includes(term) &&
        !p.title.toLowerCase().includes(term) &&
        !p.department.toLowerCase().includes(term)
      )
        return false;
      return true;
    });
  }, [q, faculty, semester, year, papers]);

  const activeCount = [faculty, semester, year].filter(Boolean).length;

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-6">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Library</div>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl">Browse Past Papers</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Use the filters below to narrow down by faculty, semester, and academic year.
        </p>
      </header>

      <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-border bg-background/85 px-4 py-3 backdrop-blur md:rounded-xl md:border md:px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Course code, title, department..."
              className="h-10 flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select label="Faculty" value={faculty ?? ""} onChange={(v) => setFilter("faculty", v)} options={[{ value: "", label: "All" }, ...FACULTIES.map((f) => ({ value: f.slug, label: f.short }))]} />
            <Select label="Semester" value={semester ?? ""} onChange={(v) => setFilter("semester", v)} options={[{ value: "", label: "All" }, ...SEMESTERS.map((s) => ({ value: s, label: s }))]} />
            <Select label="Year" value={year ? String(year) : ""} onChange={(v) => setFilter("year", v ? Number(v) : undefined)} options={[{ value: "", label: "All" }, ...YEARS.map((y) => ({ value: String(y), label: String(y) }))]} />
            {activeCount > 0 && (
              <button
                onClick={() => navigate({ search: { q: q || undefined } })}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span><SlidersHorizontal className="mr-1.5 inline h-3.5 w-3.5" /> {filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-serif text-xl">No papers match your filters.</p>
          <p className="mt-2 text-sm text-muted-foreground">Try clearing filters or request the paper you need.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <PaperCard key={p.id} paper={p} />)}
        </div>
      )}
    </section>
  );
}

function Select({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string | undefined) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="h-10 bg-transparent pr-2 text-sm font-medium text-foreground focus:outline-none"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
