export type ResearchArea = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string | null;
  keywords: string[];
  applications: string[];
  displayOrder: number;
};
