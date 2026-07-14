import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, BookOpen, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — UTGSU Academic Resources Hub" },
      { name: "description", content: "The UTGSU Academic Resources Hub is the official academic platform of the University of The Gambia Students' Union." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">About</div>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
        The official UTGSU academic platform
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        The UTGSU Academic Resources Hub is an initiative of the University of The Gambia Students' Union — a single home for the academic material students actually need. Past papers, lecture notes, textbooks, course outlines, programme brochures, and study guides, all organized by school and moderated before publication.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Value icon={<GraduationCap className="h-5 w-5" />} title="Built for every school" desc="Every UTG school has a dedicated dashboard of resource categories." />
        <Value icon={<BookOpen className="h-5 w-5" />} title="More than past papers" desc="Notes, textbooks, outlines, assignments, practicals, and useful links." />
        <Value icon={<Users className="h-5 w-5" />} title="Powered by students" desc="Contributions from students across faculties — everyone can upload." />
        <Value icon={<ShieldCheck className="h-5 w-5" />} title="Moderated for quality" desc="Every upload is reviewed by admins before it appears in the library." />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-serif text-xl font-semibold">Our mission</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          To make quality academic resources equally accessible to every UTG student — regardless of school, level, or background — and to build a community of contributors who lift each other up.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/schools" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Browse schools
          </Link>
          <Link to="/upload" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            Contribute
          </Link>
        </div>
      </div>
    </section>
  );
}

function Value({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
        {icon}
      </span>
      <h3 className="mt-3 font-serif text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
