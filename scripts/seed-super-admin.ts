import "tsx";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  const email = (process.env.INITIAL_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD ?? "changeme-locally";
  const name = process.env.INITIAL_ADMIN_NAME ?? "Admin";

  await mongoose.connect(uri, { dbName: "myportfolio" });
  const Users = mongoose.connection.collection("users");

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();

  const res = await Users.updateOne(
    { email },
    {
      $set: {
        email,
        name,
        passwordHash,
        role: "super_admin",
        isActive: true,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  console.log(
    `super-admin upsert → matched=${res.matchedCount} upserted=${res.upsertedCount} email=${email}`,
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
