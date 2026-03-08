export type BoardCategory =
  | "notice"
  | "award"
  | "event"
  | "acceptance"
  | "recruitment";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: BoardCategory;
  date: string;
  isPinned: boolean;
  relatedProjectIds: string[];
  relatedPublicationIds: string[];
};
