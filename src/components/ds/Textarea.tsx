"use client";

import { useState, useCallback } from "react";

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  hint?: string;
  className?: string;
}

/**
 * Textarea — matches Input's language: mono eyebrow label, a focus
 * underline that wipes out from the center, optional character count.
 */
export function Textarea({
  label,
  value,
  defaultValue = "",
  onChange,
  placeholder,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  hint,
  required = false,
  id,
  name,
  className,
  ...rest
}: TextareaProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const v = isControlled ? value : internal;
  const [focused, setFocused] = useState(false);
  const autoId = id || name || "ds-textarea";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  const len = String(v ?? "").length;
  const borderColor = error ? "var(--red)" : focused ? "var(--accent)" : "var(--border-strong)";

  return (
    <div className={className} style={{ width: "100%", opacity: disabled ? 0.55 : 1 }}>
      {label && (
        <label
          htmlFor={autoId}
          style={{
            display: "block",
            marginBottom: 8,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: error ? "var(--red)" : focused ? "var(--accent-ink)" : "var(--text-tertiary)",
            transition: "color var(--dur-base) var(--ease-out)",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--red)" }}> *</span>}
        </label>
      )}
      <div
        style={{
          position: "relative",
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          border: "1px solid",
          borderColor,
          background: "var(--surface-3)",
          boxShadow: focused ? "var(--edge-light), var(--shadow-sm)" : "var(--edge-light)",
          transition:
            "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        }}
      >
        <textarea
          id={autoId}
          name={name}
          rows={rows}
          maxLength={maxLength}
          value={v}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-invalid={!!error}
          style={{
            display: "block",
            width: "100%",
            resize: "vertical",
            padding: "12px 14px",
            minHeight: rows * 22,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            lineHeight: 1.6,
          }}
          {...rest}
        />
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            width: "100%",
            background: error ? "var(--red)" : "var(--accent)",
            transformOrigin: "center",
            transform: `scaleX(${focused || error ? 1 : 0})`,
            transition: "transform var(--dur-base) var(--ease-out)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, padding: "0 2px" }}>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontFamily: error ? "var(--font-mono)" : "var(--font-sans)",
            color: error ? "var(--red)" : "var(--text-tertiary)",
          }}
        >
          {error || hint || ""}
        </span>
        {maxLength && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: len >= maxLength ? "var(--amber)" : "var(--text-tertiary)",
            }}
          >
            {len}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
