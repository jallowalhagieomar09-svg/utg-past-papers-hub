import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  FileText, BookOpen, Library, ClipboardList, FileBadge, PenLine,
  FlaskConical, Video, LinkIcon, Boxes, ChevronRight, GraduationCap, Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import { FACULTIES } from "@/lib/papers-data";
import { listPapers } from "@/lib/papers.functions";
import { PaperCard } from "@/components/paper-card";

export const Route = createFileRoute("/schools/$slug")({
  loader: ({ params }) => {
    const faculty = FACULTIES.find((f) => f.slug === params.slug);
    if (!faculty) throw notFound();
    return { faculty };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.faculty.name} — UTGSU Academic Resources Hub` },
          { name: "description", content: `Academic resources for ${loaderData.faculty.name}: past papers, lecture notes, textbooks, outlines, and more.` },
        ]
      : [{ title: "School — UTGSU Academic Resources Hub" }, { name: "robots", content: "noindex" }],
  }),
  component: SchoolPage,
  notFoundComponent: () => (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-serif text-3xl font-semibold">School not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The school you're looking for doesn't exist.</p>
      <Link to="/schools" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Back to schools
      </Link>
    </div>
  ),
});

type Category = {
  key: string;
  label: string;
  desc: string;
  icon: ReactNode;
  live?: boolean;
};

const CATEGORIES: Category[] = [
  { key: "past-papers", label: "Past Examination Papers", desc: "Previous exam questions to practise with.", icon: <FileText className="h-5 w-5" />, live: true },
  { key: "lecture-notes", label: "Lecture Notes", desc: "Notes from your lecturers, term by term.", icon: <BookOpen className="h-5 w-5" /> },
  { key: "textbooks", label: "Textbooks", desc: "Core and recommended textbooks.", icon: <Library className="h-5 w-5" /> },
  { key: "course-outlines", label: "Course Outlines", desc: "Syllabi and course expectations.", icon: <ClipboardList className="h-5 w-5" /> },
  { key: "programme-brochure", label: "Programme Brochure", desc: "Programme information and structure.", icon: <FileBadge className="h-5 w-5" /> },
  { key: "assignments", label: "Assignments & Tutorials", desc: "Past assignments and tutorial questions.", icon: <PenLine className="h-5 w-5" /> },
  { key: "practicals", label: "Practical Manuals", desc: "Lab and practical guides.", icon: <FlaskConical className="h-5 w-5" /> },
  { key: "recorded-lectures", label: "Recorded Lectures", desc: "Video and audio recordings.", icon: <Video className="h-5 w-5" /> },
  { key: "useful-links", label: "Useful Links", desc: "Curated external resources.", icon: <LinkIcon className="h-5 w-5" /> },
  { key: "other", label: "Other Resources", desc: "Everything else that helps you learn.", icon: <Boxes className="h-5 w-5" /> },
];

function SchoolPage() {
  const { faculty } = Route.useLoaderData();
  const fetchPapers = useServerFn(listPapers);
  const { data } = useQuery({ queryKey: ["papers"], queryFn: () => fetchPapers() });
  const papers = (data?.papers ?? []).filter((p) => p.faculty === faculty.slug).slice(0, 6);

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/schools" className="hover:text-foreground">Schools</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{faculty.short}</span>
      </nav>

      {/* Header */}
      <header className={`relative mt-4 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft md:p-10`}>
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${faculty.accent} opacity-80`} />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{faculty.short}</div>
              <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">{faculty.name}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{faculty.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {faculty.departments.map((d) => (
              <span key={d} className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs text-foreground">
                {d}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="mt-10">
        <h2 className="font-serif text-xl font-semibold tracking-tight md:text-2xl">Resource categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick a category to explore what's available for {faculty.short}.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.key} category={c} facultySlug={faculty.slug} />
          ))}
        </div>
      </div>

      {/* Recent papers preview */}
      {papers.length > 0 && (
        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-semibold tracking-tight md:text-2xl">Recent past papers</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest additions for this school.</p>
            </div>
            <Link to="/papers" search={{ faculty: faculty.slug }} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {papers.map((p) => <PaperCard key={p.id} paper={p} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function CategoryCard({ category, facultySlug }: { category: Category; facultySlug: string }) {
  if (category.live && category.key === "past-papers") {
    return (
      <Link
        to="/papers"
        search={{ faculty: facultySlug }}
        className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          {category.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-semibold">{category.label}</h3>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Live</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{category.desc}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Open <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-dashed border-border bg-card/60 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
        {category.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-base font-semibold text-foreground/80">{category.label}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{category.desc}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            No resources yet
          </span>
          <Link to="/upload" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Upload className="h-3 w-3" /> Contribute
          </Link>
        </div>
      </div>
    </div>
  );
}
