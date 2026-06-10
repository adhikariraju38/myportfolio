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
        className={cn(
          "w-full rounded-md border bg-bg-secondary px-3 py-2 text-sm text-text outline-none transition-[border-color,box-shadow] disabled:opacity-60",
          error
            ? "animate-[ds-shake_0.4s_var(--ease-out)] border-red-500"
            : "border-border focus:border-accent focus:shadow-(--glow-accent-sm)",
          className,
        )}
      />
      {error && <p className="mt-1 font-mono text-[11px] text-red-500">{error}</p>}
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
        className={cn(
          "w-full rounded-md border bg-bg-secondary px-3 py-2 text-sm text-text outline-none transition-[border-color,box-shadow] disabled:opacity-60",
          error
            ? "animate-[ds-shake_0.4s_var(--ease-out)] border-red-500"
            : "border-border focus:border-accent focus:shadow-(--glow-accent-sm)",
          className,
        )}
      />
      {error && <p className="mt-1 font-mono text-[11px] text-red-500">{error}</p>}
    </>
  );
}

export function AdminSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent",
        className,
      )}
    />
  );
}

export function AdminLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn("mb-1 block text-xs font-medium text-text-secondary", className)}
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
