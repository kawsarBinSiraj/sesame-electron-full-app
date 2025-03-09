import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    avatar_id: integer("avatar_id").notNull(),
    name: text("name").notNull(),
    institute: text("institute").notNull(),
    identification: text("identification").unique(),
    phone: text("phone").notNull().unique(),
});
