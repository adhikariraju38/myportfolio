"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={32}
      toastOptions={{
        // A single dark "engineered" pill — high-contrast in BOTH light and
        // dark mode. The semantic icon (green check / red error / amber
        // warning) carries the meaning; the surface stays neutral dark.
        style: {
          background: "#14161C",
          color: "#F2F3F5",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "14px",
          padding: "13px 16px",
          fontFamily: "var(--ff-sans)",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow:
            "0 18px 48px -16px rgba(0,0,0,0.55), inset 0 1px 0 0 rgba(255,255,255,0.06)",
        },
        classNames: {
          description: "text-[#8B919E]",
          actionButton: "bg-accent text-on-accent",
          closeButton: "border-white/15 bg-[#14161C] text-[#8B919E]",
        },
      }}
    />
  );
}
