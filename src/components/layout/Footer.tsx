import { Github, Linkedin, Mail } from "lucide-react";
import { CONTACT } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between">
        <p className="text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} Raju Kumar Yadav
        </p>
        <div className="flex items-center gap-4">
          <a
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary transition-colors hover:text-text"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary transition-colors hover:text-text"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-text-tertiary transition-colors hover:text-text"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
