import { notFound } from "next/navigation";
import { getMemberById } from "@/lib/queries/members";
import { updateMember } from "@/actions/members";
import { MemberForm } from "../../MemberForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateMember(id, formData);
  }

  return <MemberForm title="멤버 수정" member={member} action={handleUpdate} />;
}
