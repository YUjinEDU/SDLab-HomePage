import {
  pgTable, uuid, text, timestamp, integer
} from "drizzle-orm/pg-core";
import { members } from "./content";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role", { enum: ["member", "professor", "admin"] })
    .notNull()
    .default("member"),
  memberId: integer("member_id").references(() => members.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
