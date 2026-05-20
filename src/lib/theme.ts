// Font name allowlist (admin UI restricts selection to these).
// Actual `next/font/google` calls live in app/layout.tsx with the 3 default
// families. next/font/google requires literal call-site arguments, so adding
// new families = adding to layout.tsx alongside.
export const FONT_ALLOWED = [
  "Inter",
  "Space Grotesk",
  "JetBrains Mono",
] as const;
export type AllowedFontName = (typeof FONT_ALLOWED)[number];

const KEBAB: Record<string, string> = {
  background: "background",
  backgroundSecondary: "background-secondary",
  backgroundTertiary: "background-tertiary",
  foreground: "foreground",
  foregroundSecondary: "foreground-secondary",
  foregroundTertiary: "foreground-tertiary",
  accentBlue: "accent-blue",
  accentAmber: "accent-amber",
  accentEmerald: "accent-emerald",
  border: "border",
};

export function themeVarsCss(tokens: Record<string, unknown> | undefined): string {
  if (!tokens) return "";
  return Object.entries(tokens)
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([k, v]) => `--${KEBAB[k] ?? k}: ${v as string};`)
    .join("");
}

export function buildThemeOverride(
  themeDark?: Record<string, unknown>,
  themeLight?: Record<string, unknown>,
): string {
  const dark = themeVarsCss(themeDark);
  const light = themeVarsCss(themeLight);
  let out = "";
  if (dark) out += `:root{${dark}}`;
  if (light) out += `.light{${light}}`;
  return out;
}
