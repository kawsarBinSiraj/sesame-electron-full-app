import { sqliteTable, blob, integer } from "drizzle-orm/sqlite-core";

export const avatars = sqliteTable("avatars", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    src: blob("src").notNull(),
});
