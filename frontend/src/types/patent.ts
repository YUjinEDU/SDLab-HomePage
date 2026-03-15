export type PatentStatus = "등록" | "출원";

export type Patent = {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  inventors: string[];
  status: PatentStatus;
  patentNumber: string | null;
  date: string | null;
  note: string | null;
  isPublic: boolean;
};
