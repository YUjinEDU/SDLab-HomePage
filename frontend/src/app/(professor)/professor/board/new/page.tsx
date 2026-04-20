import { AnnouncementForm } from "@/components/board/AnnouncementForm";
import { createAnnouncement } from "@/actions/announcements";

export default function NewAnnouncementPage() {
  return (
    <AnnouncementForm
      title="새 공지 작성"
      action={createAnnouncement}
      backHref="/professor/board"
    />
  );
}
