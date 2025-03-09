import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const chapterQuizAnswer = sqliteTable("chapter_quiz_answer", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").notNull(),
    chapter_id: integer("chapter_id").notNull(),
    quiz_id: integer("quiz_id").notNull(), 
    quiz_index: integer("quiz_index").notNull(), 
    quiz: text("quiz").notNull(), 
    answer: text("answer").notNull(), 
    point: integer("point").notNull(), 
});
 