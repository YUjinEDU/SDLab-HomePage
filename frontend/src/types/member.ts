export type MemberGroup =
  | "professor"
  | "phd"
  | "ms"
  | "undergraduate"
  | "alumni";

export type Member = {
  id: string;
  slug: string;
  nameKo: string;
  nameEn: string;
  group: MemberGroup;
  position: string;
  department: string;
  image: string | null;
  email: string | null;
  links: {
    github?: string;
    scholar?: string;
    homepage?: string;
    orcid?: string;
    dblp?: string;
  };
  researchKeywords: string[];
  bio: string | null;
  education: {
    degree: string;
    institution: string;
    field: string;
    year: string;
  }[];
  career: {
    period: string;
    role: string;
    organization: string;
    category?: "career" | "award" | "academic_service";
  }[];
  displayOrder: number;
};
