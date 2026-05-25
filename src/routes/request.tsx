import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { FACULTIES, SEMESTERS, YEARS } from "@/lib/papers-data";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Request a Past Paper — UTGSU Academic Resource Hub" },
      { name: "description", content: "Can't find the past paper you need? Submit a request and our team will source it." },
    ],
  }),
  component: RequestPage,
});

function RequestPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <section className="container mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-serif text-3xl">Request received</h1>
        <p className="mt-2 text-muted-foreground">
          We'll notify you by email if we can source this paper.
        </p>
        <Link to="/papers" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Browse papers
        </Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Need help?</div>
      <h1 className="mt-1 font-serif text-3xl md:text-4xl">Request a paper</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us what you need and we'll try to source it from staff or alumni.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Course code" name="code" placeholder="e.g. ACC201" required />
          <Field label="Course title" name="title" placeholder="e.g. Financial Accounting" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Faculty" name="faculty" options={FACULTIES.map((f) => ({ value: f.slug, label: f.short }))} required />
          <SelectField label="Semester" name="semester" options={SEMESTERS.map((s) => ({ value: s, label: s }))} required />
          <SelectField label="Year" name="year" options={YEARS.map((y) => ({ value: String(y), label: String(y) }))} required />
        </div>

        <label className="block">
          <span className="text-xs font-medium text-foreground">Additional notes</span>
          <textarea
            rows={4}
            placeholder="Any context that may help us find it…"
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <Field label="Your email" name="email" type="email" placeholder="you@utg.edu.gm" required />

        <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <MessageSquare className="h-4 w-4" /> Send request
        </button>
      </form>
    </section>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <input
        {...rest}
        className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
