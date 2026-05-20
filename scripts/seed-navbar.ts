import mongoose from "mongoose";

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

const FOOTER: Array<{ label: string; href: string; icon: string; orderIndex: number; opensInNewTab?: boolean }> = [
  { label: "GitHub", href: "https://github.com/adhikariraju38", icon: "github", orderIndex: 0, opensInNewTab: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/adhikariraju38", icon: "linkedin", orderIndex: 1, opensInNewTab: true },
  { label: "Email", href: "mailto:itsmeerajuyadav@gmail.com", icon: "mail", orderIndex: 2 },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri, { dbName: "myportfolio" });
  const col = mongoose.connection.collection("navmenuitems");
  const now = new Date();

  let upserts = 0;
  for (const it of HEADER) {
    const r = await col.updateOne(
      { location: "header", href: it.href },
      {
        $set: {
          label: it.label,
          href: it.href,
          icon: it.icon,
          location: "header",
          orderIndex: it.orderIndex,
          isActive: true,
          opensInNewTab: false,
          parentId: null,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
    if (r.upsertedCount) upserts += 1;
  }
  for (const it of FOOTER) {
    const r = await col.updateOne(
      { location: "footer", href: it.href },
      {
        $set: {
          label: it.label,
          href: it.href,
          icon: it.icon,
          location: "footer",
          orderIndex: it.orderIndex,
          isActive: true,
          opensInNewTab: it.opensInNewTab ?? false,
          parentId: null,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
    if (r.upsertedCount) upserts += 1;
  }
  console.log(`nav-menu seed → upserted=${upserts}/${HEADER.length + FOOTER.length}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
