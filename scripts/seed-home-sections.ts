import { db, client, homeSections, type SectionKey } from "./_db";

const SECTIONS: Array<{ key: SectionKey; label: string; orderIndex: number }> = [
  { key: "hero", label: "Hero", orderIndex: 0 },
  { key: "about", label: "About", orderIndex: 1 },
  { key: "experience", label: "Experience", orderIndex: 2 },
  { key: "skills", label: "Skills", orderIndex: 3 },
  { key: "projects", label: "Projects", orderIndex: 4 },
  { key: "publications", label: "Publications", orderIndex: 5 },
  { key: "open-source", label: "Open Source", orderIndex: 6 },
  { key: "awards", label: "Awards", orderIndex: 7 },
  { key: "education", label: "Education", orderIndex: 8 },
  { key: "contact", label: "Contact", orderIndex: 9 },
];

async function main() {
  for (const s of SECTIONS) {
    await db
      .insert(homeSections)
      .values({ key: s.key, label: s.label, orderIndex: s.orderIndex, isVisible: true })
      .onConflictDoUpdate({
        target: homeSections.key,
        set: { label: s.label, orderIndex: s.orderIndex, updatedAt: new Date() },
      });
  }
  console.log(`home-sections seeded → ${SECTIONS.length}`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
