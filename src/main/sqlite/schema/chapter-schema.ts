import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const chapters = sqliteTable("chapters", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    desc: text("desc").notNull(),
    content: text("content").notNull(),
    quizzes: text("quizzes").notNull(),
});
