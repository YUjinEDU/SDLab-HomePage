import {
  pgTable, serial, text, integer, boolean,
  timestamp, real, jsonb
} from "drizzle-orm/pg-core";

export const researchAreas = pgTable("research_areas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  icon: text("icon"),
  image: text("image"),
  keywords: text("keywords").array(),
  applications: text("applications").array(),
  displayOrder: integer("display_order").default(0),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameKo: text("name_ko").notNull(),
  nameEn: text("name_en"),
  group: text("group").notNull(),
  position: text("position"),
  department: text("department"),
  image: text("image"),
  email: text("email"),
  links: jsonb("links"),
  researchKeywords: text("research_keywords").array(),
  bio: text("bio"),
  education: jsonb("education"),
  career: jsonb("career"),
  displayOrder: integer("display_order").default(0),
  nasFolderName: text("nas_folder_name"),  // NAS 개인 폴더 이름 (예: "김민건")
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  category: text("category"),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  organization: text("organization"),
  programType: text("program_type"),
  budget: integer("budget"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  thumbnail: text("thumbnail"),
  tags: text("tags").array(),
  demoUrl: text("demo_url"),
  isFeatured: boolean("is_featured").default(false),
  isPublic: boolean("is_public").default(true),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  type: text("type").notNull(),
  isInternational: boolean("is_international").default(false),
  venue: text("venue"),
  year: integer("year").notNull(),
  month: integer("month"),
  doi: text("doi"),
  pdfUrl: text("pdf_url"),
  abstract: text("abstract"),
  keywords: text("keywords").array(),
  bibtex: text("bibtex"),
  isFeatured: boolean("is_featured").default(false),
  isPublic: boolean("is_public").default(true),
  indexType: text("index_type"),
  volumeInfo: text("volume_info"),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary"),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  isPinned: boolean("is_pinned").default(false),
});

export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  labNameKo: text("lab_name_ko"),
  labNameEn: text("lab_name_en"),
  professorName: text("professor_name"),
  professorTitle: text("professor_title"),
  professorEmail: text("professor_email"),
  professorPhone: text("professor_phone"),
  professorOffice: text("professor_office"),
  labRoom: text("lab_room"),
  labPhone: text("lab_phone"),
  building: text("building"),
  department: text("department"),
  university: text("university"),
  address: text("address"),
  mapEmbedUrl: text("map_embed_url"),
});

// Join tables
export const projectMembers = pgTable("project_members", {
  projectId: integer("project_id").notNull().references(() => projects.id),
  memberId: integer("member_id").notNull().references(() => members.id),
});

export const projectResearchAreas = pgTable("project_research_areas", {
  projectId: integer("project_id").notNull().references(() => projects.id),
  researchAreaId: integer("research_area_id").notNull().references(() => researchAreas.id),
});

export const publicationAuthors = pgTable("publication_authors", {
  publicationId: integer("publication_id").notNull().references(() => publications.id),
  memberId: integer("member_id").notNull().references(() => members.id),
  authorOrder: integer("author_order").notNull(),
});

export const publicationResearchAreas = pgTable("publication_research_areas", {
  publicationId: integer("publication_id").notNull().references(() => publications.id),
  researchAreaId: integer("research_area_id").notNull().references(() => researchAreas.id),
});

export const publicationProjects = pgTable("publication_projects", {
  publicationId: integer("publication_id").notNull().references(() => publications.id),
  projectId: integer("project_id").notNull().references(() => projects.id),
});

export const newsProjects = pgTable("news_projects", {
  newsId: integer("news_id").notNull().references(() => news.id),
  projectId: integer("project_id").notNull().references(() => projects.id),
});

export const newsPublications = pgTable("news_publications", {
  newsId: integer("news_id").notNull().references(() => news.id),
  publicationId: integer("publication_id").notNull().references(() => publications.id),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  authorId: integer("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
