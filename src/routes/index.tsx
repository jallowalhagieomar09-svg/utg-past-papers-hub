import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Upload, MessageSquare, Sparkles, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FACULTIES } from "@/lib/papers-data";
import { listPapers } from "@/lib/papers.functions";
import { FacultyCard } from "@/components/faculty-card";
import { PaperCard } from "@/components/paper-card";
import campusBg from "@/assets/utg-campus.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UTG Past Papers Hub — Access Past Papers Easily" },
      { name: "description", content: "Search, browse and download organized UTG past examination papers by school, course, semester, and year." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const fetchPapers = useServerFn(listPapers);
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["papers"], queryFn: () => fetchPapers() });
  const papers = data?.papers ?? [];

  // Auto-sync new Drive uploads (fire-and-forget, server throttles to once per 5 min)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/sync-drive")
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res && !res.skipped && (res.inserted ?? 0) > 0) {
          queryClient.invalidateQueries({ queryKey: ["papers"] });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [queryClient]);


  const suggestions = useMemo(() => {
    if (q.trim().length < 2) return [];
    const s = q.toLowerCase();
    return papers.filter(
      (p) =>
        p.code.toLowerCase().includes(s) ||
        p.title.toLowerCase().includes(s) ||
        p.department.toLowerCase().includes(s),
    ).slice(0, 5);
  }, [q, papers]);

  const recent = [...papers].sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt)).slice(0, 4);
  const popular = [...papers].sort((a, b) => b.downloads - a.downloads).slice(0, 4);

  const stats = {
    papers: papers.length,
    faculties: FACULTIES.length,
    downloads: papers.reduce((a, p) => a + p.downloads, 0),
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/papers", search: { q } });
  };


  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${campusBg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-hero opacity-85" aria-hidden />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" aria-hidden />
        <div className="container relative mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>UTG Student Union · Academic Support</span>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-[1.05] text-white md:text-6xl animate-fade-up">
            Access Past Papers <span className="italic text-[color:var(--gold)]">Easily</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/95 md:text-lg animate-fade-up [animation-delay:80ms]">
            Prepare smarter for exams with organized academic resources from every UTG school.
          </p>

          <form onSubmit={submit} className="relative mx-auto mt-8 max-w-2xl animate-fade-up [animation-delay:160ms]">
            <div className="flex items-center gap-2 rounded-full bg-background p-1.5 pl-5 shadow-elegant">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by course code, title or department..."
                className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Search
              </button>
            </div>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[110%] z-20 overflow-hidden rounded-2xl border border-border bg-popover text-left shadow-elegant animate-fade-in">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    to="/papers"
                    search={{ q: p.code }}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-popover-foreground hover:bg-accent"
                  >
                    <span className="flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">{p.code}</span>
                      <span>{p.title}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{p.year} · {p.semester}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-fade-up [animation-delay:240ms]">
            <Link to="/papers" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/10">
              Browse all papers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/upload" className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-sm font-medium text-[color:var(--gold-foreground)] hover:opacity-95">
              <Upload className="h-3.5 w-3.5" /> Upload missing paper
            </Link>
            <Link to="/request" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/10">
              <MessageSquare className="h-3.5 w-3.5" /> Request a paper
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto mt-12 max-w-5xl px-4">
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 shadow-card md:gap-6 md:p-6">
          <Stat label="Past Papers" value={stats.papers.toLocaleString() + "+"} />
          <Stat label="Faculties" value={stats.faculties.toString()} />
          <Stat label="Downloads" value={stats.downloads.toLocaleString() + "+"} />
        </div>
      </section>

      {/* FACULTIES */}
      <section className="container mx-auto mt-20 max-w-6xl px-4">
        <SectionHeader
          eyebrow="Browse by faculty"
          title="Find your school"
          desc="Pick a faculty to explore departments and their available papers."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACULTIES.map((f) => <FacultyCard key={f.slug} faculty={f} />)}
        </div>
      </section>

      {/* RECENT + POPULAR */}
      <section className="container mx-auto mt-20 max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow={<><Clock className="h-3.5 w-3.5" /> Recently added</>}
              title="Fresh on the shelf"
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {recent.map((p) => <PaperCard key={p.id} paper={p} />)}
            </div>
          </div>
          <div>
            <SectionHeader
              eyebrow={<><TrendingUp className="h-3.5 w-3.5" /> Most downloaded</>}
              title="Student favorites"
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {popular.map((p) => <PaperCard key={p.id} paper={p} />)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto mt-24 max-w-5xl px-4">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Can't find a paper?</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Help your fellow students. Upload one you have, or request one you need —
                our team will track it down.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/upload" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Upload className="h-4 w-4" /> Upload
              </Link>
              <Link to="/request" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent">
                <MessageSquare className="h-4 w-4" /> Request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-2xl text-foreground md:text-3xl">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground md:text-xs">{label}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow?: React.ReactNode; title: string; desc?: string }) {
  return (
    <div>
      {eyebrow && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 font-serif text-3xl md:text-4xl">{title}</h2>
      {desc && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}
