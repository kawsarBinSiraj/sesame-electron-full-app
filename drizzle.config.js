/**
 * @desc :- drizzle config for database migrations
 * created_by :- Kawsar Bin Siraj (03/02/2025)
 */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: [
        "./src/main/sqlite/schema/user-schema.ts",
        "./src/main/sqlite/schema/avatar-schema.ts",
        "./src/main/sqlite/schema/chapter-schema.ts",
        "./src/main/sqlite/schema/last-seen-schema.ts",
        "./src/main/sqlite/schema/chapter-progress-schema.ts",
        "./src/main/sqlite/schema/chapter-quiz-answer-schema.ts",
    ],
    out: "./src/main/sqlite/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: "./resources/database.db", // Use env vars, fallback for dev
    },
});
