"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import {
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminSwitch,
  AdminTextarea,
} from "@/components/ui/admin-input";
import { ImageUpload, type ImageRef } from "@/components/admin/image-upload";
import { SkeletonForm } from "@/components/shared/skeleton";
import { Tabs } from "@/components/ds/Tabs";
import { Slider } from "@/components/ds/Slider";

type Settings = Record<string, unknown>;

const ACCENTS = [
  { key: "iris", label: "Iris Violet", swatch: "#8C7CFF" },
  { key: "lime", label: "Electric Lime", swatch: "#C9F94A" },
  { key: "cyan", label: "Electric Cyan", swatch: "#2FE2E2" },
  { key: "coral", label: "Warm Coral", swatch: "#FF6A4D" },
  { key: "cobalt", label: "Cobalt Blue", swatch: "#4C7DFF" },
  { key: "magenta", label: "Hot Magenta", swatch: "#FF4D8D" },
] as const;

const FONT_SETS = [
  { key: "engineered", label: "Engineered", spec: "Bricolage · Geist · Geist Mono" },
  { key: "geometric", label: "Geometric", spec: "Sora · Jakarta · JetBrains" },
  { key: "grotesk", label: "Neo-Grotesk", spec: "Space Grotesk · Hanken · Space Mono" },
  { key: "expressive", label: "Expressive", spec: "Syne · Geist · Geist Mono" },
] as const;

const TABS = [
  "Branding",
  "SEO",
  "Contact",
  "Social",
  "Theme",
  "OG/Favicon",
  "Toggles",
  "JSON-LD",
] as const;

type Tab = (typeof TABS)[number];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Settings | null>({
    queryKey: queryKeys.settings(),
    queryFn: () => apiClient.get<Settings | null>("/api/admin/settings"),
  });
  const [draft, setDraft] = useState<Settings>({});
  const [tab, setTab] = useState<Tab>("Branding");

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  // Live-preview accent + typeface on the admin shell (which reads the same
  // tokens). On unmount, restore whatever the server rendered.
  const accent = (draft.themeAccent as string) ?? "iris";
  const font = (draft.themeFont as string) ?? "engineered";
  useEffect(() => {
    const root = document.documentElement;
    const prevAccent = root.getAttribute("data-accent");
    const prevFont = root.getAttribute("data-font");
    root.setAttribute("data-accent", accent);
    root.setAttribute("data-font", font);
    return () => {
      if (prevAccent) root.setAttribute("data-accent", prevAccent);
      if (prevFont) root.setAttribute("data-font", prevFont);
    };
  }, [accent, font]);

  const mutate = useMutation({
    mutationFn: (patch: Settings) => apiClient.patch<Settings>("/api/admin/settings", patch),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: queryKeys.settings() });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (k: string, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
  const setNested = (k: string, child: string, v: unknown) =>
    setDraft((d) => ({ ...d, [k]: { ...((d[k] as Record<string, unknown>) ?? {}), [child]: v } }));

  if (isLoading) return <SkeletonForm />;

  const themeDark = (draft.themeDark as Record<string, string>) ?? {};
  const themeLight = (draft.themeLight as Record<string, string>) ?? {};
  const jsonLd = (draft.jsonLd as Record<string, unknown>) ?? {};
  const socials = (draft.socials as { platform: string; url: string; label?: string; icon?: string }[]) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">Site settings</h1>
        <AdminButton onClick={() => mutate.mutate(draft)} disabled={mutate.isPending}>
          {mutate.isPending ? "Saving…" : "Save"}
        </AdminButton>
      </div>

      <div className="overflow-x-auto">
        <Tabs
          tabs={TABS as unknown as string[]}
          value={tab}
          onChange={(id) => setTab(id as Tab)}
        />
      </div>

      <div className="rounded-xl border border-border bg-bg-secondary p-5">
        {tab === "Branding" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Site title">
              <AdminInput
                value={(draft.siteTitle as string) ?? ""}
                onChange={(e) => set("siteTitle", e.target.value)}
              />
            </Field>
            <Field label="Title template (use %s)">
              <AdminInput
                value={(draft.siteTitleTemplate as string) ?? ""}
                onChange={(e) => set("siteTitleTemplate", e.target.value)}
              />
            </Field>
            <Field label="Brand short (wordmark)">
              <AdminInput
                value={(draft.brandShort as string) ?? ""}
                onChange={(e) => set("brandShort", e.target.value)}
              />
            </Field>
            <Field label="Brand full">
              <AdminInput
                value={(draft.brandFull as string) ?? ""}
                onChange={(e) => set("brandFull", e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Tagline">
                <AdminTextarea
                  rows={2}
                  value={(draft.tagline as string) ?? ""}
                  onChange={(e) => set("tagline", e.target.value)}
                />
              </Field>
            </div>
            <ImageUpload
              label="Logo (optional)"
              value={draft.logoImage as ImageRef}
              onChange={(v) => set("logoImage", v ?? {})}
            />
          </div>
        )}

        {tab === "SEO" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Site URL">
              <AdminInput
                value={(draft.siteUrl as string) ?? ""}
                onChange={(e) => set("siteUrl", e.target.value)}
              />
            </Field>
            <Field label="Twitter handle">
              <AdminInput
                value={(draft.twitterHandle as string) ?? ""}
                onChange={(e) => set("twitterHandle", e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <AdminTextarea
                  rows={3}
                  value={(draft.siteDescription as string) ?? ""}
                  onChange={(e) => set("siteDescription", e.target.value)}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Keywords (comma-separated)">
                <AdminInput
                  value={((draft.keywords as string[]) ?? []).join(", ")}
                  onChange={(e) =>
                    set(
                      "keywords",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
              </Field>
            </div>
          </div>
        )}

        {tab === "Contact" && (
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Email">
              <AdminInput
                value={(draft.contactEmail as string) ?? ""}
                onChange={(e) => set("contactEmail", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <AdminInput
                value={(draft.contactPhone as string) ?? ""}
                onChange={(e) => set("contactPhone", e.target.value)}
              />
            </Field>
            <Field label="Location">
              <AdminInput
                value={(draft.contactLocation as string) ?? ""}
                onChange={(e) => set("contactLocation", e.target.value)}
              />
            </Field>
          </div>
        )}

        {tab === "Social" && (
          <div className="space-y-3">
            {socials.map((s, i) => (
              <div key={i} className="grid items-end gap-2 md:grid-cols-[1fr_2fr_1fr_1fr_auto]">
                <Field label="Platform">
                  <AdminInput
                    value={s.platform}
                    onChange={(e) => {
                      const arr = [...socials];
                      arr[i] = { ...s, platform: e.target.value };
                      set("socials", arr);
                    }}
                  />
                </Field>
                <Field label="URL">
                  <AdminInput
                    value={s.url}
                    onChange={(e) => {
                      const arr = [...socials];
                      arr[i] = { ...s, url: e.target.value };
                      set("socials", arr);
                    }}
                  />
                </Field>
                <Field label="Label">
                  <AdminInput
                    value={s.label ?? ""}
                    onChange={(e) => {
                      const arr = [...socials];
                      arr[i] = { ...s, label: e.target.value };
                      set("socials", arr);
                    }}
                  />
                </Field>
                <Field label="Icon">
                  <AdminInput
                    value={s.icon ?? ""}
                    onChange={(e) => {
                      const arr = [...socials];
                      arr[i] = { ...s, icon: e.target.value };
                      set("socials", arr);
                    }}
                  />
                </Field>
                <AdminButton
                  variant="ghost"
                  onClick={() => set("socials", socials.filter((_, j) => j !== i))}
                >
                  ×
                </AdminButton>
              </div>
            ))}
            <AdminButton
              variant="secondary"
              onClick={() =>
                set("socials", [
                  ...socials,
                  { platform: "", url: "", label: "", icon: "" },
                ])
              }
            >
              + Add social
            </AdminButton>
          </div>
        )}

        {tab === "Theme" && (
          <div className="space-y-5">
            {/* ── Appearance: switchable accent + typeface (DB-driven) ── */}
            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                Appearance
              </p>
              <p className="mb-3 text-xs text-text-secondary">
                Accent retints the entire site; the typeface set reflows all
                display/body/mono text. Saved to the database and applied to the
                public site.
              </p>

              <AdminLabel>Accent</AdminLabel>
              <div className="mb-4 flex flex-wrap gap-2">
                {ACCENTS.map((a) => {
                  const active = accent === a.key;
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => set("themeAccent", a.key)}
                      className={
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors " +
                        (active
                          ? "border-accent bg-accent/10 text-text"
                          : "border-border text-text-secondary hover:border-border-strong hover:text-text")
                      }
                      aria-pressed={active}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: a.swatch }}
                      />
                      {a.label}
                    </button>
                  );
                })}
              </div>

              <AdminLabel>Typeface</AdminLabel>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {FONT_SETS.map((f) => {
                  const active = font === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => set("themeFont", f.key)}
                      className={
                        "rounded-lg border p-3 text-left transition-colors " +
                        (active
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-border-strong")
                      }
                      aria-pressed={active}
                    >
                      <span className="block font-display text-lg font-bold text-text">
                        Ag
                      </span>
                      <span className="mt-1 block text-[11px] font-medium text-text">
                        {f.label}
                      </span>
                      <span className="block text-[10px] text-text-tertiary">
                        {f.spec}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {(["themeDark", "themeLight"] as const).map((tk) => {
              const tokens = tk === "themeDark" ? themeDark : themeLight;
              return (
                <div key={tk}>
                  <p className="mb-2 text-xs font-medium text-text">
                    {tk === "themeDark" ? "Dark mode" : "Light mode"}
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      "background",
                      "backgroundSecondary",
                      "backgroundTertiary",
                      "foreground",
                      "foregroundSecondary",
                      "foregroundTertiary",
                      "accentBlue",
                      "accentAmber",
                      "accentEmerald",
                      "border",
                      "themeColor",
                    ].map((key) => (
                      <Field key={key} label={key}>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={tokens[key] ?? "#000000"}
                            onChange={(e) => setNested(tk, key, e.target.value)}
                            className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                          />
                          <AdminInput
                            value={tokens[key] ?? ""}
                            onChange={(e) => setNested(tk, key, e.target.value)}
                          />
                        </div>
                      </Field>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "OG/Favicon" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="OG title">
              <AdminInput
                value={(draft.ogTitle as string) ?? ""}
                onChange={(e) => set("ogTitle", e.target.value)}
              />
            </Field>
            <Field label="OG subtitle">
              <AdminInput
                value={(draft.ogSubtitle as string) ?? ""}
                onChange={(e) => set("ogSubtitle", e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="OG chips (comma-separated)">
                <AdminInput
                  value={((draft.ogChips as string[]) ?? []).join(", ")}
                  onChange={(e) =>
                    set(
                      "ogChips",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
              </Field>
            </div>
            <Field label="OG background gradient (CSS)">
              <AdminInput
                value={(draft.ogBgGradient as string) ?? ""}
                onChange={(e) => set("ogBgGradient", e.target.value)}
              />
            </Field>
            <Field label="OG accent color">
              <AdminInput
                value={(draft.ogAccentColor as string) ?? ""}
                onChange={(e) => set("ogAccentColor", e.target.value)}
              />
            </Field>
            <Field label="Favicon glyph (1-4 chars)">
              <AdminInput
                value={(draft.faviconGlyph as string) ?? ""}
                onChange={(e) => set("faviconGlyph", e.target.value)}
              />
            </Field>
            <Field label="Favicon background gradient (CSS)">
              <AdminInput
                value={(draft.faviconBgGradient as string) ?? ""}
                onChange={(e) => set("faviconBgGradient", e.target.value)}
              />
            </Field>
            <Field label="Favicon text color">
              <AdminInput
                value={(draft.faviconTextColor as string) ?? ""}
                onChange={(e) => set("faviconTextColor", e.target.value)}
              />
            </Field>
          </div>
        )}

        {tab === "Toggles" && (
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["enable3dHero", "Enable 3D hero scene"],
              ["enable3dContact", "Enable 3D contact mesh"],
              ["enableSmoothScroll", "Smooth scroll (Lenis)"],
              ["enableCustomCursor", "Custom cursor"],
              ["enableScrollProgress", "Scroll progress bar"],
              ["darkModeDefault", "Dark mode default"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-md border border-border bg-bg p-3"
              >
                <span className="text-xs text-text-secondary">{label}</span>
                <AdminSwitch
                  checked={Boolean(draft[key as keyof typeof draft])}
                  onCheckedChange={(v) => set(key as string, v)}
                />
              </div>
            ))}

            <div className="md:col-span-2 rounded-md border border-border bg-bg p-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                3D scene density
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                <Slider
                  label="Hero particles"
                  min={0}
                  max={200}
                  step={5}
                  showValue
                  format={(v) => `${Math.round(v)}%`}
                  value={(draft.heroParticleDensity as number) ?? 100}
                  onChange={(v) => set("heroParticleDensity", v)}
                />
                <Slider
                  label="Contact mesh"
                  min={0}
                  max={200}
                  step={5}
                  showValue
                  format={(v) => `${Math.round(v)}%`}
                  value={(draft.contactMeshDensity as number) ?? 100}
                  onChange={(v) => set("contactMeshDensity", v)}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Field label="Footer copyright template ({year} {name})">
                <AdminInput
                  value={(draft.footerCopyrightTemplate as string) ?? ""}
                  onChange={(e) => set("footerCopyrightTemplate", e.target.value)}
                />
              </Field>
            </div>
          </div>
        )}

        {tab === "JSON-LD" && (
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ["name", "Name"],
                ["jobTitle", "Job title"],
                ["url", "URL"],
                ["email", "Email"],
                ["alumniOfName", "Alumni of"],
                ["addressLocality", "City"],
                ["addressCountry", "Country"],
              ] as const
            ).map(([k, label]) => (
              <Field key={k} label={label}>
                <AdminInput
                  value={(jsonLd[k] as string) ?? ""}
                  onChange={(e) => setNested("jsonLd", k, e.target.value)}
                />
              </Field>
            ))}
            <div className="md:col-span-2">
              <Field label="sameAs URLs (comma-separated)">
                <AdminInput
                  value={((jsonLd.sameAs as string[]) ?? []).join(", ")}
                  onChange={(e) =>
                    setNested(
                      "jsonLd",
                      "sameAs",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="knowsAbout (comma-separated)">
                <AdminInput
                  value={((jsonLd.knowsAbout as string[]) ?? []).join(", ")}
                  onChange={(e) =>
                    setNested(
                      "jsonLd",
                      "knowsAbout",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
