import { getNavItems, getSiteSettings } from "@/lib/queries/site";
import { Navbar, type NavItemProp } from "./Navbar";

export async function NavbarShell() {
  const [items, settings] = await Promise.all([getNavItems("header"), getSiteSettings()]);
  const navItems: NavItemProp[] = items.map((it) => ({
    label: String(it.label ?? ""),
    href: String(it.href ?? "#"),
    icon: it.icon ? String(it.icon) : undefined,
    opensInNewTab: Boolean(it.opensInNewTab),
  }));
  const brand = (settings?.brandShort as string | undefined) ?? "";
  const logoUrl = (settings?.logoImage as { url?: string } | undefined)?.url ?? null;
  return <Navbar items={navItems} brand={brand} logoUrl={logoUrl} />;
}
