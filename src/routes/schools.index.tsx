import { createFileRoute } from "@tanstack/react-router";
import { FACULTIES } from "@/lib/papers-data";
import { FacultyCard } from "@/components/faculty-card";

export const Route = createFileRoute("/schools")({
  head: () => ({
    meta: [
      { title: "Schools — UTGSU Academic Resources Hub" },
      { name: "description", content: "Browse all schools at the University of The Gambia and open each school's academic resource dashboard." },
    ],
  }),
  component: SchoolsPage,
});

function SchoolsPage() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Schools</div>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Choose your school
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Every school at the University of The Gambia has its own dashboard of academic resources — past papers, notes, textbooks, outlines, and more. Pick yours to get started.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FACULTIES.map((f) => <FacultyCard key={f.slug} faculty={f} />)}
      </div>
    </section>
  );
}
