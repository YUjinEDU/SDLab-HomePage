import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./src/lib/db/schema";
import bcrypt from "bcryptjs";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: pnpm tsx create-admin.ts <email> <password>");
  process.exit(1);
}

async function main() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);
  const hashedPassword = await bcrypt.hash(password, 12);
  await db.insert(users).values({ email, hashedPassword, role: "admin" });
  console.log(`✅ Admin created: ${email}`);
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
