"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: boolean;
  hint?: string;
  iconLeft?: ReactNode;
  className?: string;
}

/**
 * Input — floating label, a focus underline that wipes out from the
 * center, a shake on error, and a spring check on success.
 */
export function Input({
  label,
  value,
  defaultValue = "",
  onChange,
  type = "text",
  placeholder,
  error,
  success = false,
  disabled = false,
  hint,
  required = false,
  iconLeft,
  id,
  name,
  className,
  ...rest
}: InputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const v = isControlled ? value : internal;
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const prevError = useRef(error);
  const autoId = id || name || "ds-input";

  useEffect(() => {
    if (error && error !== prevError.current) {
      setShake(false);
      requestAnimationFrame(() => setShake(true));
    }
    prevError.current = error;
  }, [error]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  const filled = String(v ?? "").length > 0;
  const floated = focused || filled;
  const borderColor = error
    ? "var(--red)"
    : success
      ? "var(--green)"
      : focused
        ? "var(--accent)"
        : "var(--border-strong)";
  const underline = error ? "var(--red)" : success ? "var(--green)" : "var(--accent)";

  return (
    <div className={className} style={{ width: "100%" }}>
      <div
        onAnimationEnd={() => setShake(false)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--surface-3)",
          border: "1px solid",
          borderColor,
          borderRadius: "var(--r-md)",
          padding: iconLeft ? "0 14px 0 12px" : "0 14px",
          height: 52,
          boxShadow: focused ? "var(--edge-light), var(--shadow-sm)" : "var(--edge-light)",
          opacity: disabled ? 0.55 : 1,
          overflow: "hidden",
          transition:
            "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
          animation: shake ? "ds-shake 0.4s var(--ease-out)" : undefined,
        }}
      >
        {iconLeft && (
          <span
            style={{
              color: focused ? "var(--accent-ink)" : "var(--text-tertiary)",
              display: "flex",
              transition: "color var(--dur-base)",
            }}
          >
            {iconLeft}
          </span>
        )}
        <div style={{ position: "relative", flex: 1, height: "100%" }}>
          {label && (
            <label
              htmlFor={autoId}
              style={{
                position: "absolute",
                left: 0,
                top: floated ? 8 : "50%",
                transform: floated ? "translateY(0) scale(0.78)" : "translateY(-50%)",
                transformOrigin: "left center",
                color: error ? "var(--red)" : floated ? "var(--accent-ink)" : "var(--text-tertiary)",
                fontSize: "var(--text-sm)",
                fontFamily: floated ? "var(--font-mono)" : "var(--font-sans)",
                letterSpacing: floated ? "0.06em" : "0",
                textTransform: floated ? "uppercase" : "none",
                pointerEvents: "none",
                transition: "all var(--dur-base) var(--ease-out)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
              {required && <span style={{ color: "var(--red)" }}> *</span>}
            </label>
          )}
          <input
            id={autoId}
            name={name}
            type={type}
            value={v}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            required={required}
            placeholder={floated ? placeholder : ""}
            aria-invalid={!!error}
            style={{
              width: "100%",
              height: "100%",
              paddingTop: label ? 16 : 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
            }}
            {...rest}
          />
        </div>
        {success && !error && <CheckIcon />}
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            width: "100%",
            background: underline,
            transformOrigin: "center",
            transform: `scaleX(${focused || error || success ? 1 : 0})`,
            transition: "transform var(--dur-base) var(--ease-out)",
          }}
        />
      </div>
      {(error || hint) && (
        <p
          style={{
            margin: "7px 2px 0",
            fontSize: "var(--text-xs)",
            fontFamily: error ? "var(--font-mono)" : "var(--font-sans)",
            color: error ? "var(--red)" : "var(--text-tertiary)",
          }}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <span style={{ display: "flex", color: "var(--green)", animation: "ds-pop var(--dur-base) var(--ease-bounce)" }}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
