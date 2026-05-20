import mongoose from "mongoose";

const SECTIONS = [
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
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri, { dbName: "myportfolio" });
  const col = mongoose.connection.collection("homesections");
  const now = new Date();

  let upserts = 0;
  for (const s of SECTIONS) {
    const r = await col.updateOne(
      { key: s.key },
      {
        $set: { label: s.label, orderIndex: s.orderIndex, isVisible: true, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
    if (r.upsertedCount) upserts += 1;
  }
  console.log(`home-sections seed → upserted=${upserts}/${SECTIONS.length}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
