"use client";

import { Button as DSButton } from "@/components/ds/Button";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Public CTA wrapper over the single canonical DS Button, so its hover /
// press / magnetic / ripple motion is identical to every other button in
// the system. Hero/section CTAs use the large size.
export function Button({
  variant = "primary",
  children,
  className,
  href,
  onClick,
}: ButtonProps) {
  return (
    <DSButton
      variant={variant}
      size="lg"
      href={href}
      onClick={onClick as ((e: React.MouseEvent) => void) | undefined}
      className={className}
    >
      {children}
    </DSButton>
  );
}
