import { getContactInfo } from "@/lib/queries";
import ContactForm from "./ContactForm";

export default async function ContactManagementPage() {
  const contact = await getContactInfo();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">연락처 관리</h1>
      <ContactForm contact={contact} />
    </div>
  );
}
