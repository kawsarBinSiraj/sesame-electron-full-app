import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const lastSeen = sqliteTable("last_seen", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    user_id : integer("user_id").notNull(),
    chapter_id: integer("chapter_id").notNull(),
    desc: text("desc").notNull(),
    progress: integer("progress").notNull(),
});
