import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Sora,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Space_Grotesk,
  Hanken_Grotesk,
  Space_Mono,
  Syne,
} from "next/font/google";
import { NavbarShell } from "@/components/layout/NavbarShell";
import { FooterShell } from "@/components/layout/FooterShell";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PerformanceProvider } from "@/hooks/usePerformanceTier";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/queries/site";
import { buildThemeOverride } from "@/lib/theme";
import "./globals.css";

// ── "Engineered Motion" typeface sets (switchable via [data-font]) ──
// Engineered (default): Bricolage Grotesque · Geist · Geist Mono
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-bricolage" });
const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });
// Geometric: Sora · Plus Jakarta Sans · JetBrains Mono
const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-sora" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });
// Neo-Grotesk: Space Grotesk · Hanken Grotesk · Space Mono
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space-grotesk" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-hanken" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-space-mono" });
// Expressive: Syne · Geist · Geist Mono
const syne = Syne({ subsets: ["latin"], display: "swap", variable: "--font-syne" });

const fontVariables = [
  bricolage.variable,
  geist.variable,
  geistMono.variable,
  sora.variable,
  jakarta.variable,
  jetbrainsMono.variable,
  spaceGrotesk.variable,
  hanken.variable,
  spaceMono.variable,
  syne.variable,
].join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings().catch(() => null);
  const siteUrl = (s?.siteUrl as string | undefined) || "http://localhost:3000";
  const title = (s?.siteTitle as string | undefined) || "Portfolio";
  const titleTemplate = (s?.siteTitleTemplate as string | undefined) || `%s | ${title}`;
  const description = (s?.siteDescription as string | undefined) || "";
  const keywords = (s?.keywords as string[] | undefined) ?? [];
  const ogTitle = (s?.ogTitle as string | undefined) || title;
  const ogSubtitle = (s?.ogSubtitle as string | undefined) || description;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: titleTemplate },
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: title,
      title: ogTitle,
      description: ogSubtitle,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogSubtitle,
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
}

export async function generateViewport(): Promise<Viewport> {
  const s = await getSiteSettings().catch(() => null);
  const dark = (s?.themeDark as { themeColor?: string } | undefined)?.themeColor ?? "#08090c";
  const light = (s?.themeLight as { themeColor?: string } | undefined)?.themeColor ?? "#f6f7f3";
  return {
    themeColor: [
      { media: "(prefers-color-scheme: dark)", color: dark },
      { media: "(prefers-color-scheme: light)", color: light },
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSiteSettings().catch(() => null);
  const themeCss = buildThemeOverride(
    s?.themeDark as Record<string, unknown> | undefined,
    s?.themeLight as Record<string, unknown> | undefined,
  );
  const darkDefault = (s?.darkModeDefault as boolean | undefined) ?? true;
  const themeAccent = (s?.themeAccent as string | undefined) ?? "iris";
  const themeFont = (s?.themeFont as string | undefined) ?? "engineered";
  const enableSmoothScroll = (s?.enableSmoothScroll as boolean | undefined) ?? true;
  const enableScrollProgress = (s?.enableScrollProgress as boolean | undefined) ?? true;
  const enableCustomCursor = (s?.enableCustomCursor as boolean | undefined) ?? true;
  const jsonLd = s?.jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: (s.jsonLd as Record<string, unknown>).name,
        jobTitle: (s.jsonLd as Record<string, unknown>).jobTitle,
        url: (s.jsonLd as Record<string, unknown>).url,
        email: (s.jsonLd as Record<string, unknown>).email,
        sameAs: (s.jsonLd as Record<string, unknown>).sameAs,
        knowsAbout: (s.jsonLd as Record<string, unknown>).knowsAbout,
        alumniOf: (s.jsonLd as Record<string, unknown>).alumniOfName
          ? {
              "@type": "EducationalOrganization",
              name: (s.jsonLd as Record<string, unknown>).alumniOfName,
            }
          : undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: (s.jsonLd as Record<string, unknown>).addressLocality,
          addressCountry: (s.jsonLd as Record<string, unknown>).addressCountry,
        },
      }
    : null;

  return (
    <html
      lang="en"
      className={fontVariables}
      data-accent={themeAccent}
      data-font={themeFont}
      suppressHydrationWarning
    >
      <head>
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.add("light");else if(!t && ${!darkDefault})document.documentElement.classList.add("light")}catch(e){}})()`,
          }}
        />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body className="bg-bg text-text antialiased">
        <QueryProvider>
          <PerformanceProvider>
            <a
              href="#about"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            {enableSmoothScroll && <SmoothScroll />}
            {enableScrollProgress && <ScrollProgress />}
            <NavbarShell />
            <main>{children}</main>
            <FooterShell />
            {enableCustomCursor && <CustomCursor />}
            <Toaster />
          </PerformanceProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
