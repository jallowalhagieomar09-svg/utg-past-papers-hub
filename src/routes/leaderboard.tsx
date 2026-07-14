import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Medal, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { listPapers } from "@/lib/papers.functions";
import { FACULTIES } from "@/lib/papers-data";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — UTGSU Academic Resources Hub" },
      { name: "description", content: "Top schools and departments powering the UTGSU Academic Resources Hub." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const fetchPapers = useServerFn(listPapers);
  const { data } = useQuery({ queryKey: ["papers"], queryFn: () => fetchPapers() });
  const papers = data?.papers ?? [];

  const bySchool = FACULTIES.map((f) => {
    const list = papers.filter((p) => p.faculty === f.slug);
    return {
      slug: f.slug,
      name: f.name,
      short: f.short,
      count: list.length,
      downloads: list.reduce((a, p) => a + p.downloads, 0),
    };
  }).sort((a, b) => b.count - a.count || b.downloads - a.downloads);

  return (
    <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Trophy className="h-3 w-3" /> Leaderboard
        </div>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">Top schools</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Ranked by resources contributed and total downloads. Upload to help your school climb.
        </p>
      </header>

      {papers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-serif text-xl">No contributions yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Be the first to upload a resource for your school.</p>
          <Link to="/upload" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" /> Upload
          </Link>
        </div>
      ) : (
        <ol className="space-y-3">
          {bySchool.map((s, i) => (
            <li key={s.slug} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                i === 0 ? "bg-[color:var(--gold)] text-[color:var(--gold-foreground)]"
                : i === 1 ? "bg-muted text-foreground"
                : i === 2 ? "bg-primary/10 text-primary"
                : "border border-border text-muted-foreground"
              }`}>
                {i < 3 ? <Medal className="h-4 w-4" /> : i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{s.short}</div>
                <div className="truncate font-serif text-base font-semibold">{s.name}</div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-xs text-muted-foreground">Resources</div>
                <div className="font-semibold">{s.count}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Downloads</div>
                <div className="font-semibold">{s.downloads.toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
