import { notFound } from "next/navigation";
import { AnnouncementForm } from "@/components/board/AnnouncementForm";
import { getAnnouncementById } from "@/lib/queries/announcements";
import { updateAnnouncement } from "@/actions/announcements";

type Props = { params: Promise<{ id: string }> };

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const announcement = await getAnnouncementById(numId);
  if (!announcement) notFound();

  async function action(formData: FormData) {
    "use server";
    return updateAnnouncement(numId, formData);
  }

  return (
    <AnnouncementForm
      title="공지 수정"
      announcement={announcement}
      action={action}
      backHref="/professor/board"
    />
  );
}
