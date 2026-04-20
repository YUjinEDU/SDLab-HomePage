import { notFound } from "next/navigation";
import { getMemberById } from "@/lib/queries/members";
import { updateMember } from "@/actions/members";
import { MemberForm } from "../../MemberForm";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  const [member, accountRow] = await Promise.all([
    getMemberById(id),
    isNaN(numId)
      ? Promise.resolve(null)
      : db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.memberId, numId))
          .limit(1)
          .then((rows) => rows[0] ?? null),
  ]);

  if (!member) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateMember(id, formData);
  }

  return (
    <MemberForm
      title="멤버 수정"
      member={member}
      action={handleUpdate}
      hasAccount={!!accountRow}
      accountEmail={accountRow?.email ?? null}
    />
  );
}
