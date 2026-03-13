import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Raju Kumar Yadav — Full Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#3B82F6",
              fontFamily: "monospace",
              letterSpacing: 2,
            }}
          >
            Hi, I&apos;m
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#F0F0F5",
              letterSpacing: -1,
            }}
          >
            Raju Kumar Yadav
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#A0A0B8",
              fontFamily: "monospace",
            }}
          >
            Full Stack Engineer
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 12,
            }}
          >
            {["React", "Next.js", "FastAPI", "AWS", "TypeScript"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: "1px solid #1E1E2A",
                  color: "#A0A0B8",
                  fontSize: 14,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
