import { Link } from "@tanstack/react-router";
import logo from "@/assets/utg-logo.jpg";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-border">
                <img src={logo} alt="UTG Student Union" className="h-9 w-9 object-contain" />
              </span>
              <div className="font-serif text-lg font-semibold">UTGSU Academic Resources Hub</div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              The official academic resource platform of the University of The Gambia Students' Union. Past papers, lecture notes, textbooks, and study guides — organized by school, built by students for students.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/schools" className="text-foreground/80 hover:text-foreground">Schools</Link></li>
              <li><Link to="/papers" className="text-foreground/80 hover:text-foreground">All Resources</Link></li>
              <li><Link to="/upload" className="text-foreground/80 hover:text-foreground">Upload</Link></li>
              <li><Link to="/leaderboard" className="text-foreground/80 hover:text-foreground">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground">Hub</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link></li>
              <li><Link to="/request" className="text-foreground/80 hover:text-foreground">Request a Resource</Link></li>
              <li><Link to="/tips" className="text-foreground/80 hover:text-foreground">Exam Tips</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} UTG Students' Union · Academic Resources Hub</p>
          <p>Made by students, for students.</p>
        </div>
      </div>
    </footer>
  );
}
