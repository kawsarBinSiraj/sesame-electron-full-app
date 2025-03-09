import { db } from "../db-init";
import { chapters } from "../schema/chapter-schema";
import { avatars } from "../schema/avatar-schema";
import { getUserAvatarsAsBuffer } from "../controller/user-crud";
import { getAllChaptersFromLocal, filePathToUnitArray } from "../../utils";

/**
 * Fetches chapter data from local PDF files, processes the data to extract content,
 * and inserts the processed data into the database.
 *
 * @async
 * @throws Will throw an error if the seeding process fails.
 */
async function fetchAndInsertChapters() {
    try {
        // Fetch chapters from local files
        const chaptersFromLocal = await getAllChaptersFromLocal();

        // Process chapters and extract content
        const chapterData = await Promise.all(
            chaptersFromLocal.map(async (chapter: any) => {
                const buffer = await filePathToUnitArray(chapter?.filePath);
                const contents = buffer.map((value: any) => value?.content);
                const [name = "", desc = ""] = chapter?.name?.split("-");

                // Extract name and description from filename
                return {
                    name: name.trim(),
                    desc: desc.trim(),
                    // Store the entire PDF content as a JSON string
                    content: JSON.stringify(contents),
                    // Store quizzes as a JSON string
                    quizzes: chapter?.quizzes,
                };
            })
        );

        // Insert both static and dynamic data into the database
        await db.insert(chapters).values([...chapterData]);
    } catch (error) {
        console.error("Error fetching and inserting chapters:", error);
    }
}

/**
 * Fetches user avatars from local files and inserts them into the database.
 *
 * @async
 * @throws Will throw an error if the seeding process fails.
 */
const fetchAndInsertAvatars = async () => {
    try {
        // Fetch avatars from local files
        const sources = await getUserAvatarsAsBuffer();

        // Insert the avatars into the database
        await db.insert(avatars).values([...sources]);
    } catch (error) {
        console.error("Error fetching and inserting avatars:", error);
    }
};

/**
 * Seeds the database with chapter data from local files.
 *
 * This function retrieves chapter data from local PDF files, processes the data
 * to extract content, and inserts the processed data into the database. Each chapter
 * includes information such as name, description, thumbnail, content, and quizzes.
 *
 * @async
 * @throws Will throw an error if the seeding process fails.
 */

async function seed() {
    try {
        // Fetch and insert chapters and avatars
        await Promise.all([fetchAndInsertAvatars(), fetchAndInsertChapters()]);
    } catch (err) {
        console.error("Seeding failed:", err);
    }
}

seed();
