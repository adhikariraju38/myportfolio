import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PerformanceProvider } from "@/hooks/usePerformanceTier";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f8f8fa" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rajukumaryadav.com"),
  title: {
    default: "Raju Kumar Yadav | Full Stack Engineer",
    template: "%s | Raju Kumar Yadav",
  },
  description:
    "Full Stack Engineer with 3.5+ years of experience building production-grade microservices platforms, React/Next.js frontends, and cloud infrastructure with AWS + Terraform.",
  keywords: [
    "Full Stack Engineer",
    "Software Engineer",
    "React Developer",
    "Next.js",
    "FastAPI",
    "Python",
    "TypeScript",
    "Portfolio",
    "Nepal",
  ],
  authors: [{ name: "Raju Kumar Yadav" }],
  creator: "Raju Kumar Yadav",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rajukumaryadav.com",
    siteName: "Raju Kumar Yadav Portfolio",
    title: "Raju Kumar Yadav | Full Stack Engineer",
    description:
      "Full Stack Engineer specializing in microservices, React/Next.js, and cloud architecture.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raju Kumar Yadav | Full Stack Engineer",
    description:
      "Full Stack Engineer specializing in microservices, React/Next.js, and cloud architecture.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.add("light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <PerformanceProvider>
          <a
            href="#about"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CustomCursor />
          <Analytics />
          <SpeedInsights />
        </PerformanceProvider>
      </body>
    </html>
  );
}
