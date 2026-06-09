"use client";

import { getIcon } from "@/lib/icons";

export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
  opensInNewTab?: boolean;
}

interface FooterProps {
  links: FooterLink[];
  copyright: string;
}

export function Footer({ links, copyright }: FooterProps) {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between">
        <p className="text-sm text-text-secondary">{copyright}</p>
        <div className="flex items-center gap-4">
          {links.map((link) => {
            const Icon = getIcon(link.icon);
            return (
              <a
                key={link.href}
                href={link.href}
                target={link.opensInNewTab ? "_blank" : undefined}
                rel={link.opensInNewTab ? "noopener noreferrer" : undefined}
                className="text-text-tertiary transition-colors hover:text-accent"
                aria-label={link.label}
              >
                {Icon ? <Icon size={18} /> : <span className="text-xs">{link.label}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
