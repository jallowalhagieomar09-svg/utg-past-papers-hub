import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { FACULTIES, SEMESTERS, YEARS } from "@/lib/papers-data";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a Past Paper — UTG Past Papers Hub" },
      { name: "description", content: "Help fellow students by uploading missing past examination papers." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <section className="container mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-serif text-3xl">Thanks for contributing!</h1>
        <p className="mt-2 text-muted-foreground">
          Your submission has been received. An admin will review and publish it shortly.
        </p>
        <Link to="/papers" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Browse papers
        </Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Contribute</div>
      <h1 className="mt-1 font-serif text-3xl md:text-4xl">Upload a missing paper</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Submit a past paper PDF. We'll review it and add it to the library.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Course code" name="code" placeholder="e.g. CSC101" required />
          <Field label="Course title" name="title" placeholder="e.g. Intro to CS" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Faculty" name="faculty" options={FACULTIES.map((f) => ({ value: f.slug, label: f.short }))} required />
          <SelectField label="Semester" name="semester" options={SEMESTERS.map((s) => ({ value: s, label: s }))} required />
          <SelectField label="Year" name="year" options={YEARS.map((y) => ({ value: String(y), label: String(y) }))} required />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground">PDF file</label>
          <div className="mt-1.5 flex items-center justify-center rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
            <div>
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-foreground">Drop file or click to choose</p>
              <p className="text-xs text-muted-foreground">PDF only, up to 20MB</p>
              <input type="file" accept="application/pdf" className="mt-3 text-xs" />
            </div>
          </div>
        </div>

        <Field label="Your name (optional)" name="name" placeholder="Anonymous" />
        <Field label="Email (optional)" name="email" type="email" placeholder="you@utg.edu.gm" />

        <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Upload className="h-4 w-4" /> Submit paper
        </button>
        <p className="text-xs text-muted-foreground">
          By submitting, you confirm you have the right to share this material.
        </p>
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
