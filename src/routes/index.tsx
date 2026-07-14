import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Upload, MessageSquare, Sparkles, ArrowRight, GraduationCap, FileText, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FACULTIES } from "@/lib/papers-data";
import { listPapers } from "@/lib/papers.functions";
import { FacultyCard } from "@/components/faculty-card";
import campusBg from "@/assets/utg-campus.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UTGSU Academic Resources Hub — University of The Gambia" },
      { name: "description", content: "The official academic resource platform of the UTG Students' Union. Past papers, lecture notes, textbooks, and study guides organized by school." },
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

  // Auto-sync new Drive uploads. Loops with force=1 until caught up.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 30 && !cancelled; i++) {
        try {
          const res = await fetch("/api/public/sync-drive?force=1&max=50").then((r) => r.json());
          if (cancelled) return;
          if (res?.inserted > 0) {
            queryClient.invalidateQueries({ queryKey: ["papers"] });
          }
          if (!res || res.skipped || res.error || (res.processedThisRun ?? 0) === 0) break;
        } catch {
          break;
        }
      }
    })();
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

  const stats = {
    schools: FACULTIES.length,
    papers: papers.length,
    downloads: papers.reduce((a, p) => a + p.downloads, 0),
    contributors: new Set(papers.map((p) => p.department)).size,
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
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${campusBg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-hero opacity-90" aria-hidden />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" aria-hidden />

        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official UTG Students' Union platform</span>
            </div>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-up">
              UTGSU Academic <span className="text-[color:var(--gold)]">Resources</span> Hub
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-white/95 animate-fade-up [animation-delay:80ms]">
              Everything you need to succeed at the University of The Gambia.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base animate-fade-up [animation-delay:120ms]">
              Access past examination papers, lecture notes, textbooks, course outlines, programme brochures, study guides, and other academic resources — all organized by your school.
            </p>

            <form onSubmit={submit} className="relative mx-auto mt-8 max-w-2xl animate-fade-up [animation-delay:180ms]">
              <div className="flex items-center gap-2 rounded-full bg-background p-1.5 pl-5 shadow-elegant">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by course code, name, lecturer, or school..."
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

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 animate-fade-up [animation-delay:240ms]">
              <Link to="/schools" className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-elegant hover:bg-white/95">
                <GraduationCap className="h-4 w-4" /> Browse Your School
              </Link>
              <Link to="/upload" className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/10">
                <Upload className="h-4 w-4" /> Upload Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="container mx-auto mt-16 max-w-4xl px-4 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Welcome</div>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          The official UTGSU academic platform
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Built for every student across every school at the University of The Gambia. One home for the resources you actually need — past papers, notes, textbooks, outlines, and study guides — moderated and organized so you can focus on learning.
        </p>
      </section>

      {/* STATS */}
      <section className="container mx-auto mt-12 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-5 shadow-card md:grid-cols-4 md:gap-6 md:p-8">
          <Stat label="Schools Covered" value={stats.schools.toString()} />
          <Stat label="Academic Resources" value={stats.papers.toLocaleString() + "+"} />
          <Stat label="Downloads" value={stats.downloads.toLocaleString() + "+"} />
          <Stat label="Contributors" value={stats.contributors.toString() + "+"} />
        </div>
      </section>

      {/* SCHOOLS */}
      <section className="container mx-auto mt-20 max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <GraduationCap className="h-3 w-3" /> Schools
            </div>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">Pick your school</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Choose a school to open its dashboard of resource categories — past papers, notes, textbooks, and more.
            </p>
          </div>
          <Link to="/schools" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACULTIES.map((f) => <FacultyCard key={f.slug} faculty={f} />)}
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="container mx-auto mt-24 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            to="/papers"
            icon={<FileText className="h-5 w-5" />}
            title="Browse resources"
            desc="Filter by school, level, semester, course, and academic year."
          />
          <QuickAction
            to="/upload"
            icon={<Upload className="h-5 w-5" />}
            title="Contribute"
            desc="Share past papers, lecture notes, outlines, and study guides."
          />
          <QuickAction
            to="/leaderboard"
            icon={<Trophy className="h-5 w-5" />}
            title="Top contributors"
            desc="See the students powering the hub — climb the leaderboard."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto mt-20 max-w-5xl px-4">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-glow p-8 text-primary-foreground shadow-elegant md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Can't find what you need?</h2>
              <p className="mt-2 max-w-lg text-primary-foreground/80">
                Help your fellow students. Upload a resource you have, or request one you need — the team reviews every submission before publishing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/upload" className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-primary hover:bg-background/95">
                <Upload className="h-4 w-4" /> Upload
              </Link>
              <Link to="/request" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/10">
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
      <div className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">{label}</div>
    </div>
  );
}

function QuickAction({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
        {icon}
      </span>
      <h3 className="mt-4 font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
