"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={32}
      toastOptions={{
        // Inverted "engineered" pill — light in dark mode, dark in light mode
        // (via the theme-flipping --toast-* vars) so it always stands out.
        // The semantic icon (green check / red error / amber warning) carries
        // the meaning; the surface stays neutral.
        style: {
          background: "var(--toast-bg)",
          color: "var(--toast-text)",
          border: "1px solid var(--toast-border)",
          borderRadius: "14px",
          padding: "13px 16px",
          fontFamily: "var(--ff-sans)",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 18px 48px -16px rgba(0,0,0,0.45)",
        },
        classNames: {
          description: "text-(--toast-text-muted)",
          actionButton: "bg-accent text-on-accent",
          closeButton: "border-(--toast-border) bg-(--toast-bg) text-(--toast-text-muted)",
        },
      }}
    />
  );
}
