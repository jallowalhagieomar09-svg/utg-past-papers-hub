import { Link } from "@tanstack/react-router";
import { Mail, Facebook, Twitter, Instagram, GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="font-serif text-lg">UTG Past Papers Hub</div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              An academic support initiative by the UTG Student Union — helping students
              prepare smarter with organized, accessible past examination papers.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/papers" className="hover:text-foreground">Browse Papers</Link></li>
              <li><Link to="/upload" className="hover:text-foreground">Upload a Paper</Link></li>
              <li><Link to="/request" className="hover:text-foreground">Request a Paper</Link></li>
              <li><Link to="/tips" className="hover:text-foreground">Exam Prep Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> studentunion@utg.edu.gm
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a aria-label="Facebook" href="#" className="hover:text-foreground"><Facebook className="h-4 w-4" /></a>
                <a aria-label="Twitter" href="#" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
                <a aria-label="Instagram" href="#" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} UTG Student Union · Academic Support</p>
          <p>Made by students, for students.</p>
        </div>
      </div>
    </footer>
  );
}
