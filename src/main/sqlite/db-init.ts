
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { app } from "electron";
import * as schema from "./schema"; // Import all tables

function getDatabasePath() {
    if (!app?.isPackaged) {
        // Use project root in dev
        const resources = path.join(process.cwd(), "resources", "database.db");
        return resources; // Use project root/resources in dev
    } else {
        const userDataPath = app.getPath("userData");
        const dbPath = path.join(userDataPath, "database.db");

        // Ensure the database is copied from resources on first run
        if (!fs.existsSync(dbPath)) {
            // Where the built app stores files
            const appResourcesDbPath = path.join(process.resourcesPath, "app.asar.unpacked", "resources", "database.db"); 
            if (fs.existsSync(appResourcesDbPath)) {
                fs.copyFileSync(appResourcesDbPath, dbPath);
            }
        }
        return dbPath;
    }
}

// Get the correct database path
const dbPath = getDatabasePath();

// Ensure directory exists (only for production)
if (app?.isPackaged) {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

// Open the SQLite database
const sqlite = new Database(dbPath);

// Initialize Drizzle with all schema tables
export const db = drizzle(sqlite, { schema });
