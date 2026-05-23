import { Bookmark, Download, Eye } from "lucide-react";
import { useBookmarks } from "@/hooks/use-app-state";
import type { Paper } from "@/lib/papers-data";
import { FACULTIES } from "@/lib/papers-data";

export function PaperCard({ paper }: { paper: Paper }) {
  const { has, toggle } = useBookmarks();
  const facultyName = FACULTIES.find((f) => f.slug === paper.faculty)?.short ?? paper.faculty;
  const saved = has(paper.id);

  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono font-semibold text-primary">
              {paper.code}
            </span>
            <span className="text-muted-foreground">{facultyName}</span>
          </div>
          <h3 className="mt-2 font-serif text-lg leading-snug text-card-foreground">
            {paper.title}
          </h3>
        </div>
        <button
          aria-label={saved ? "Remove bookmark" : "Bookmark"}
          onClick={() => toggle(paper.id)}
          className={`grid h-8 w-8 place-items-center rounded-md border transition-colors ${
            saved
              ? "border-gold bg-gold text-gold-foreground"
              : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <div>
          <dt className="uppercase tracking-wider opacity-70">Semester</dt>
          <dd className="text-foreground">{paper.semester}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider opacity-70">Year</dt>
          <dd className="text-foreground">{paper.year}</dd>
        </div>
        <div className="col-span-2">
          <dt className="uppercase tracking-wider opacity-70">Department</dt>
          <dd className="text-foreground">{paper.department}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {paper.downloads.toLocaleString()} downloads
        </span>
        <div className="flex gap-2">
          <a
            href={paper.fileUrl}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </a>
          <a
            href={paper.fileUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>
    </article>
  );
}
