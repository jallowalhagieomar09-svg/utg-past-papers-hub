import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageSquare, Upload } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — UTGSU Academic Resources Hub" },
      { name: "description", content: "Get in touch with the UTGSU Academic Resources Hub team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Contact</div>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">Get in touch</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
        Questions, feedback, or a partnership idea? Reach the team behind the UTGSU Academic Resources Hub.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:jallowalhagieomar09@gmail.com"
          className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Mail className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-base font-semibold">Email us</h3>
            <p className="mt-1 break-all text-sm text-muted-foreground">jallowalhagieomar09@gmail.com</p>
          </div>
        </a>

        <Link
          to="/request"
          className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-base font-semibold">Request a resource</h3>
            <p className="mt-1 text-sm text-muted-foreground">Missing something? Ask the team to track it down.</p>
          </div>
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-primary to-primary-glow p-6 text-primary-foreground shadow-card md:p-8">
        <h2 className="font-serif text-xl font-semibold">Want to contribute?</h2>
        <p className="mt-2 max-w-lg text-primary-foreground/85">
          Upload past papers, lecture notes, outlines, and study guides — every contribution helps a fellow student.
        </p>
        <Link to="/upload" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-background/95">
          <Upload className="h-4 w-4" /> Upload a resource
        </Link>
      </div>
    </section>
  );
}
