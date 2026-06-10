import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ds/Switch";
import { Button } from "@/components/ds/Button";

export function AdminInput({
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input
        {...props}
        aria-invalid={error ? true : undefined}
        className={cn("ds-field px-3.5 py-2.5 text-sm", className)}
      />
      {error && <p className="mt-1.5 font-mono text-[11px] text-red-500">{error}</p>}
    </>
  );
}

export function AdminTextarea({
  className,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <>
      <textarea
        {...props}
        aria-invalid={error ? true : undefined}
        className={cn("ds-field px-3.5 py-2.5 text-sm leading-relaxed", className)}
      />
      {error && <p className="mt-1.5 font-mono text-[11px] text-red-500">{error}</p>}
    </>
  );
}

export function AdminSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("ds-field px-3.5 py-2.5 text-sm", className)} />;
}

export function AdminLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  // Mono, uppercase, tracked — matches the design's (floated) field label.
  return (
    <label
      {...props}
      className={cn(
        "mb-2 block font-mono text-[11px] uppercase tracking-wider text-text-tertiary",
        className,
      )}
    />
  );
}

export function AdminButton({
  className,
  variant = "primary",
  children,
  onClick,
  disabled,
  type = "button",
}: {
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  // Routed through the canonical DS Button so admin buttons share the exact
  // hover/press/magnetic/ripple motion used on the public site (compact size).
  return (
    <Button
      variant={variant}
      size="sm"
      type={type}
      disabled={disabled}
      onClick={onClick as ((e: React.MouseEvent) => void) | undefined}
      className={className}
    >
      {children}
    </Button>
  );
}

export function AdminSwitch({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  // Physical "Engineered Motion" toggle (bouncy spring + squash/stretch).
  return <Switch size="sm" checked={checked} onChange={onCheckedChange} disabled={disabled} />;
}
