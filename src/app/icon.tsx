import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/queries/site";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const s = await getSiteSettings().catch(() => null);
  const glyph = (s?.faviconGlyph as string | undefined) || "R";
  const bg = (s?.faviconBgGradient as string | undefined) || "linear-gradient(135deg, #3B82F6, #6366F1)";
  const color = (s?.faviconTextColor as string | undefined) || "#FFFFFF";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          borderRadius: 8,
          color,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: -0.5,
        }}
      >
        {glyph}
      </div>
    ),
    { ...size },
  );
}
