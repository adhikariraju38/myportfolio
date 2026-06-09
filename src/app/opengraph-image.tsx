import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/queries/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  const s = await getSiteSettings().catch(() => null);
  const alt =
    (s?.ogTitle as string | undefined) ?? (s?.siteTitle as string | undefined) ?? "Portfolio";
  return [{ id: "default", alt, size, contentType }];
}

export default async function OGImage() {
  const s = await getSiteSettings().catch(() => null);
  const title = (s?.ogTitle as string | undefined) || (s?.brandFull as string | undefined) || "Portfolio";
  const subtitle = (s?.ogSubtitle as string | undefined) || "";
  const chips = (s?.ogChips as string[] | undefined) ?? [];
  const bg = (s?.ogBgGradient as string | undefined) || "linear-gradient(135deg, #08090C, #0D0F13)";
  const color = (s?.ogTextColor as string | undefined) || "#F2F3F5";
  const accent = (s?.ogAccentColor as string | undefined) || "#8C7CFF";
  const muted = "#8B919E";
  const hairline = "#20242D";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}26 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
          }}
        >
          <div style={{ fontSize: 20, color: accent, fontFamily: "monospace", letterSpacing: 2 }}>
            Hi, I&apos;m
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color, letterSpacing: -1 }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 28, color: muted, fontFamily: "monospace" }}>{subtitle}</div>
          )}
          {chips.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {chips.map((t) => (
                <div
                  key={t}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 999,
                    border: `1px solid ${hairline}`,
                    color: muted,
                    fontSize: 14,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
