import { and, eq } from "drizzle-orm";
import { db, client, navMenuItems } from "./_db";

const HEADER = [
  { label: "About", href: "#about", icon: "user", orderIndex: 0 },
  { label: "Experience", href: "#experience", icon: "briefcase", orderIndex: 1 },
  { label: "Skills", href: "#skills", icon: "code", orderIndex: 2 },
  { label: "Projects", href: "#projects", icon: "folder", orderIndex: 3 },
  { label: "Publications", href: "#publications", icon: "file-text", orderIndex: 4 },
  { label: "Open Source", href: "#open-source", icon: "github", orderIndex: 5 },
  { label: "Awards", href: "#awards", icon: "award", orderIndex: 6 },
  { label: "Education", href: "#education", icon: "graduation-cap", orderIndex: 7 },
  { label: "Contact", href: "#contact", icon: "mail", orderIndex: 8 },
];

const FOOTER = [
  { label: "GitHub", href: "https://github.com/adhikariraju38", icon: "github", orderIndex: 0, opensInNewTab: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/adhikariraju38", icon: "linkedin", orderIndex: 1, opensInNewTab: true },
  { label: "Email", href: "mailto:itsmeerajuyadav@gmail.com", icon: "mail", orderIndex: 2, opensInNewTab: false },
];

type Loc = "header" | "footer";

async function upsertItem(item: {
  label: string;
  href: string;
  icon: string;
  location: Loc;
  orderIndex: number;
  opensInNewTab: boolean;
}) {
  const existing = await db
    .select({ id: navMenuItems.id })
    .from(navMenuItems)
    .where(and(eq(navMenuItems.location, item.location), eq(navMenuItems.href, item.href)))
    .limit(1);

  const found = existing[0];
  if (found) {
    await db
      .update(navMenuItems)
      .set({
        label: item.label,
        icon: item.icon,
        orderIndex: item.orderIndex,
        isActive: true,
        opensInNewTab: item.opensInNewTab,
        parentId: null,
        updatedAt: new Date(),
      })
      .where(eq(navMenuItems.id, found.id));
    return 0;
  }
  await db.insert(navMenuItems).values({
    label: item.label,
    href: item.href,
    icon: item.icon,
    location: item.location,
    orderIndex: item.orderIndex,
    isActive: true,
    opensInNewTab: item.opensInNewTab,
    parentId: null,
  });
  return 1;
}

async function main() {
  let inserted = 0;
  for (const it of HEADER) {
    inserted += await upsertItem({ ...it, location: "header", opensInNewTab: false });
  }
  for (const it of FOOTER) {
    inserted += await upsertItem({ ...it, location: "footer" });
  }
  console.log(`nav-menu seeded → inserted=${inserted}/${HEADER.length + FOOTER.length}`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
