export type PublicationType =
  | "journal"
  | "conference"
  | "sw_registration"
  | "report"
  | "thesis";

export type Publication = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  authorMemberIds: string[];
  type: PublicationType;
  isInternational: boolean;
  venue: string;
  year: number;
  month: number | null;
  doi: string | null;
  pdfUrl: string | null;
  abstract: string | null;
  keywords: string[];
  bibtex: string | null;
  researchAreaIds: string[];
  projectIds: string[];
  isFeatured: boolean;
  isPublic: boolean;
  indexType: string | null;
  volumeInfo: string | null;
};
