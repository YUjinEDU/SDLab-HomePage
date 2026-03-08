export type ProjectStatus = "planned" | "active" | "completed" | "archived";

export type Project = {
  id: string;
  slug: string;
  title: string;
  status: ProjectStatus;
  category: string;
  shortDescription: string;
  fullDescription: string | null;
  organization: string;
  programType: string | null;
  budget: string | null;
  startDate: string;
  endDate: string | null;
  thumbnail: string | null;
  tags: string[];
  memberIds: string[];
  publicationIds: string[];
  researchAreaIds: string[];
  demoUrl: string | null;
  isFeatured: boolean;
};
