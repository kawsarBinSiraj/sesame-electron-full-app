import { sqliteTable, integer, real } from "drizzle-orm/sqlite-core";

export const chapterProgress = sqliteTable("chapter_progress", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").notNull(),
    chapter_id: integer("chapter_id").notNull(),
    progress: real("progress").notNull(), // Allows float values like 5.6, 45.1
});
