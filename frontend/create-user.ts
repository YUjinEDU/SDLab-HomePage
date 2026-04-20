/**
 * 멤버 계정 생성 스크립트
 * Usage: pnpm tsx create-user.ts <email> <password> [role]
 * role: member(기본) | professor | admin
 *
 * 멤버 프로필과 자동 연결: members 테이블에서 같은 email을 찾아 memberId 세팅
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, members } from "./src/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const [email, password, role = "member"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: pnpm tsx create-user.ts <email> <password> [role]");
  console.error("  role: member(기본) | professor | admin");
  process.exit(1);
}

if (!["member", "professor", "admin"].includes(role)) {
  console.error("role은 member / professor / admin 중 하나여야 합니다.");
  process.exit(1);
}

async function main() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  // 같은 email의 member 프로필 자동 연결
  const [member] = await db
    .select({ id: members.id, nameKo: members.nameKo })
    .from(members)
    .where(eq(members.email, email))
    .limit(1);

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    email,
    hashedPassword,
    role: role as "member" | "professor" | "admin",
    memberId: member?.id ?? null,
  });

  if (member) {
    console.log(`✅ 계정 생성 완료: ${email} (role: ${role})`);
    console.log(`   멤버 프로필 연결: ${member.nameKo} (id: ${member.id})`);
  } else {
    console.log(`✅ 계정 생성 완료: ${email} (role: ${role})`);
    console.log(`   ⚠️  members 테이블에서 ${email}을 찾지 못해 memberId가 null입니다.`);
    console.log(`      나중에 프로필 이메일을 맞춰주면 자동 연결됩니다.`);
  }

  await client.end();
}

main().catch((e) => {
  console.error("❌ 오류:", e.message);
  process.exit(1);
});
