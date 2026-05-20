import { getNavItems, getSiteSettings } from "@/lib/queries/site";
import { Footer, type FooterLink } from "./Footer";

export async function FooterShell() {
  const [items, settings] = await Promise.all([getNavItems("footer"), getSiteSettings()]);
  const year = new Date().getFullYear();
  const name = (settings?.brandFull as string | undefined) ?? "";
  const template =
    (settings?.footerCopyrightTemplate as string | undefined) ?? "© {year} {name}";
  const copyright = template.replace("{year}", String(year)).replace("{name}", name);
  const links: FooterLink[] = items.map((it) => ({
    label: String(it.label ?? ""),
    href: String(it.href ?? ""),
    icon: it.icon ? String(it.icon) : undefined,
    opensInNewTab: Boolean(it.opensInNewTab),
  }));
  return <Footer links={links} copyright={copyright} />;
}
