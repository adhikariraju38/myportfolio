import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

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
    primary: "bg-accent text-white hover:bg-accent/90",
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
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors disabled:opacity-60",
        checked ? "bg-accent" : "bg-bg-tertiary",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
