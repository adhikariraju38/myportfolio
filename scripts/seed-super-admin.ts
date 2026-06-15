import bcrypt from "bcrypt";
import { db, client, users } from "./_db";

async function main() {
  const email = (process.env.INITIAL_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD ?? "changeme-locally";
  const name = process.env.INITIAL_ADMIN_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const [row] = await db
    .insert(users)
    .values({ email, name, passwordHash, role: "super_admin", isActive: true })
    .onConflictDoUpdate({
      target: users.email,
      set: { name, passwordHash, role: "super_admin", isActive: true, updatedAt: new Date() },
    })
    .returning({ id: users.id, email: users.email });

  console.log(`super-admin upserted → ${row?.email} (${row?.id})`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
