export type ContactInfo = {
  labName: { ko: string; en: string };
  professor: { name: string; title: string; email: string };
  location: {
    building: string;
    professorOffice: string;
    lab: string;
    professorPhone: string;
    labPhone: string;
  };
  department: string;
  university: string;
  address: string;
  mapEmbedUrl: string | null;
};
