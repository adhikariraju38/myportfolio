import { NavbarShell } from "@/components/layout/NavbarShell";
import { FooterShell } from "@/components/layout/FooterShell";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { getSiteSettings } from "@/lib/queries/site";

// Public-site chrome (navbar, footer, smooth-scroll, scroll progress,
// custom cursor). Lives here — NOT in the root layout — so it never renders
// on /admin or /login.
export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSiteSettings().catch(() => null);
  const enableSmoothScroll = (s?.enableSmoothScroll as boolean | undefined) ?? true;
  const enableScrollProgress = (s?.enableScrollProgress as boolean | undefined) ?? true;
  const enableCustomCursor = (s?.enableCustomCursor as boolean | undefined) ?? true;

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      {enableSmoothScroll && <SmoothScroll />}
      {enableScrollProgress && <ScrollProgress />}
      <NavbarShell />
      <main>{children}</main>
      <FooterShell />
      {enableCustomCursor && <CustomCursor />}
    </>
  );
}
