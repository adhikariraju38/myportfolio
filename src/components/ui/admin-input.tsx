import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ds/Switch";

export function AdminInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent disabled:opacity-60",
        className,
      )}
    />
  );
}

export function AdminTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent disabled:opacity-60",
        className,
      )}
    />
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
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60";
  const variants = {
    primary: "bg-accent text-on-accent hover:bg-accent-hover",
    secondary: "border border-border bg-bg-secondary text-text hover:bg-bg-tertiary",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-text-secondary hover:text-text",
  };
  return <button {...props} className={cn(base, variants[variant], className)} />;
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
