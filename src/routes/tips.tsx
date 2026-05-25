import { createFileRoute } from "@tanstack/react-router";
import { Clock, BookOpen, Brain, Coffee, ListChecks, Target } from "lucide-react";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Exam Prep Tips — UTGSU Academic Resource Hub" },
      { name: "description", content: "Practical, student-tested advice for preparing for university examinations." },
    ],
  }),
  component: TipsPage,
});

const TIPS = [
  { icon: Target, title: "Start with past papers", body: "Working through real exams reveals the format, recurring topics, and the depth lecturers expect." },
  { icon: ListChecks, title: "Build a topic checklist", body: "Map syllabus topics to past questions. Tick off what you've practiced — not just what you've read." },
  { icon: Clock, title: "Time yourself", body: "Simulate exam conditions. Practicing under time pressure is the single biggest score booster." },
  { icon: Brain, title: "Active recall beats re-reading", body: "Close the notes and write what you remember. Then check. Repeat until automatic." },
  { icon: BookOpen, title: "Mix subjects daily", body: "Interleaving topics improves long-term retention more than studying one subject in long blocks." },
  { icon: Coffee, title: "Sleep, water, breaks", body: "A rested brain outperforms a crammed one. Take 5-minute breaks every 30–50 minutes." },
];

function TipsPage() {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Study smarter</div>
      <h1 className="mt-1 font-serif text-3xl md:text-4xl">Exam Prep Tips</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Tested techniques that consistently move students up a grade — without doubling study hours.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIPS.map((t) => (
          <div key={t.title} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <t.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-lg">{t.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
