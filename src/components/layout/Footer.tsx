"use client";

import { getIcon } from "@/lib/icons";
import { IconButton } from "@/components/ds/IconButton";
import { Tooltip } from "@/components/ds/Tooltip";

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
        <p className="font-mono text-xs text-text-tertiary">{copyright}</p>
        <div className="flex items-center gap-2">
          {links.map((link) => {
            const Icon = getIcon(link.icon);
            const target = link.opensInNewTab ? "_blank" : undefined;
            const rel = link.opensInNewTab ? "noopener noreferrer" : undefined;
            // Icon links → DS soft IconButton (matches the contact socials);
            // text-only links stay as a simple accent-hover link.
            if (Icon) {
              return (
                <Tooltip key={link.href} label={link.label}>
                  <IconButton label={link.label} variant="soft" size="sm" href={link.href} target={target} rel={rel}>
                    <Icon size={16} />
                  </IconButton>
                </Tooltip>
              );
            }
            return (
              <a
                key={link.href}
                href={link.href}
                target={target}
                rel={rel}
                className="link-underline px-1 text-sm text-text-secondary transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
