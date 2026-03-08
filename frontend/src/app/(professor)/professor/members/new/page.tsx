import { createMember } from "@/actions/members";
import { MemberForm } from "../MemberForm";

export default function NewMemberPage() {
  return <MemberForm title="새 멤버 추가" action={createMember} />;
}
