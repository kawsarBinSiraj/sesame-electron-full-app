import { db } from "../db-init";
import { chapterProgress } from "../schema/chapter-progress-schema";
import { chapterQuizAnswer } from "../schema/chapter-quiz-answer-schema";
import { chapters } from "../schema/chapter-schema";
import { lastSeen } from "../schema/last-seen-schema";
import { eq, and, sql } from "drizzle-orm";
/**
 * Retrieves all chapters from the database.
 *
 * @returns {Promise<Array<any>>} - A promise that resolves to an array of chapter objects.
 */
export const getAllChapters = async (request: any): Promise<Array<any>> => {
    const { authId = null, userId = null } = request;

    // Validate that authId is provided
    if (!authId && !userId) {
        throw new Error("authId is required for getAllChapters.");
    }

    // Define columns to select
    let columns = {
        id: chapters.id,
        name: chapters.name,
        desc: chapters.desc,
        content: chapters.content,
        quizzes: chapters.quizzes,
        progress: chapterProgress?.progress ?? 0, // Default progress to 0 if no progress exists
    };

    try {
        // Fetch all chapters and left join with chapter progress data
        const chaptersWithProgress = await db
            .select(columns)
            .from(chapters)
            .leftJoin(
                chapterProgress,
                and(
                    eq(chapters.id, chapterProgress.chapter_id),
                    eq(chapterProgress.user_id, authId || userId) // Move condition inside JOIN
                )
            );

        const DATA = await Promise.all(
            chaptersWithProgress.map(async (data) => {
                const content = JSON.parse(data?.content);
                const thumb = JSON.stringify(content?.[0]);
                return { ...data, thumb };
            })
        );

        return DATA;
    } catch (error) {
        console.error("Error fetching chapters with progress:", error);
        throw new Error("Failed to fetch chapters with progress.");
    }
};

/**
 * Retrieves a single chapter from the database by its ID.
 *
 * @param {number} id - The ID of the chapter to retrieve.
 * @returns {Promise<Array<any>>} - A promise that resolves to an array of chapter objects.
 */
export const getSingleChapterById = async (request: any) => {
    const { authId, chapterId } = request;

    // Validate that authId and chapterId are provided
    if (!authId || !chapterId) {
        throw new Error("authId and chapterId are required for getSingleChapterById.");
    }

    try {
        const res = await db
            .select({
                id: chapters.id,
                name: chapters.name,
                desc: chapters.desc,
                content: chapters.content, // Assuming the chapters table has a content field
                quizzes: chapters.quizzes,
                progress: chapterProgress?.progress ?? 0, // Default progress to 0 if no progress exists
                total_points: sql<number>`SUM(${chapterQuizAnswer.point})`.as("total_points"),
            })
            .from(chapters)
            .where(eq(chapters.id, chapterId))
            .leftJoin(
                chapterProgress,
                and(
                    eq(chapters.id, chapterProgress.chapter_id),
                    eq(chapterProgress.user_id, authId) // Move condition inside JOIN
                )
            )
            .leftJoin(
                chapterQuizAnswer,
                and(
                    eq(chapterId, chapterQuizAnswer.chapter_id), // Match chapters with answers
                    eq(chapterQuizAnswer.user_id, authId) // Filter for current user
                )
            )
            .groupBy(chapters.id); // Ensure each chapter appears only once

        const DATA = await Promise.all(
            res.map(async (data) => {
                const content = JSON.parse(data?.content);
                const thumb = JSON.stringify(content?.[0]);
                return { ...data, thumb };
            })
        );

        return DATA[0];
    } catch (error) {
        console.error("Error fetching single chapter:", error);
        throw new Error("Failed to fetch single chapter.");
    }
};

export const updateChapterProgress = async (request: any) => {
    const { authId: userId, id: chapterId, ...data } = request;
    const newProgress = data?.progress;

    // Validate that authId and chapterId are provided
    if (!userId || !chapterId) {
        throw new Error("authId and chapterId are required for updating progress.");
    }

    try {
        // Check if progress already exists
        const existingProgress = await db
            .select()
            .from(chapterProgress)
            .where(and(eq(chapterProgress.user_id, userId), eq(chapterProgress.chapter_id, chapterId)))
            .limit(1);

        if (existingProgress.length > 0) {
            const currentProgress = existingProgress[0].progress;

            // Only update if new progress is greater than existing progress
            if (newProgress > currentProgress) {
                return await db
                    .update(chapterProgress)
                    .set(data)
                    .where(and(eq(chapterProgress.user_id, userId), eq(chapterProgress.chapter_id, chapterId)))
                    .returning();
            } else {
                return existingProgress[0]; // Return existing progress if no update is made
            }
        } else {
            // If no progress exists, insert a new record
            return await db
                .insert(chapterProgress)
                .values({ user_id: parseInt(userId, 10), chapter_id: parseInt(chapterId, 10), ...data })
                .returning();
        }
    } catch (error) {
        console.error("Error updating or inserting progress:", error);
        throw new Error("Failed to update or insert progress.");
    }
};

/**
 * Retrieves the progress of a user on a specific chapter.
 *
 * @param {string} userId - The ID of the user to retrieve progress for.
 * @param {string} chapterId - The ID of the chapter to retrieve progress for.
 * @returns {Promise<null|any>} - A promise that resolves to the progress object if it exists, null otherwise.
 * @throws {Error} - If there is an error retrieving progress.
 */
export const getChapterProgress = async (request: any): Promise<null | any> => {
    const { authId: userId, ...data } = request;
    const chapterId = data?.id;

    if (!userId || !chapterId) {
        throw new Error("userId and chapterId are required to fetch progress.");
    }

    try {
        const progress = await db
            .select()
            .from(chapterProgress)
            .where(and(eq(chapterProgress.user_id, userId), eq(chapterProgress.chapter_id, chapterId)))
            .limit(1);

        if (progress.length > 0) return progress[0];
        return null;
    } catch (error) {
        console.error("Error fetching chapter progress:", error);
        throw new Error("Failed to fetch chapter progress.");
    }
};

/**
 * Saves the last seen data of a user in the database.
 *
 * @param {object} request - The request object containing the last seen data.
 * @param {string} request.authId - The ID of the user who made the request.
 * @param {string} request.userId - The ID of the user to save the last seen data for.
 * @param {object} request.data - The last seen data to save.
 * @returns {Promise<object>} - A promise that resolves to the saved data.
 * @throws {Error} - If there is an error saving the last seen data.
 */
export const saveLastSeenData = async (request: any): Promise<object> => {
    const { authId = null, userId = null, ...data } = request;

    // Validate that authId or userId is provided
    if (!authId && !userId) {
        throw new Error("authId or userId is required to save last seen data.");
    }

    const user_id = parseInt(authId || userId, 10);

    try {
        // Check if a last-seen record exists for the user
        const existingRecord = await db.select().from(lastSeen).where(eq(lastSeen.user_id, user_id)).limit(1);
        if (existingRecord.length > 0) {
            // Update existing record
            const response = await db.update(lastSeen).set(data).where(eq(lastSeen.user_id, user_id)).returning();
            return response;
        } else {
            // Insert new record
            const response = await db
                .insert(lastSeen)
                .values({ user_id, ...data })
                .returning();
            return response;
        }
    } catch (error) {
        console.error("Error saving last seen data:", error);
        throw new Error("Failed to save last seen data.");
    }
};

/**
 * Retrieves the last seen data of a user from the database.
 *
 * @param {object} request - The request object containing the user ID to fetch the last seen data for.
 * @param {string} request.authId - The ID of the user who made the request.
 * @param {string} request.userId - The ID of the user to fetch the last seen data for.
 * @returns {Promise<object | null>} - A promise that resolves to the last seen data object if it exists, null otherwise.
 * @throws {Error} - If there is an error fetching the last seen data.
 */
export const getLastSeenData = async (request: any): Promise<object | null> => {
    const { authId = null, userId = null } = request;

    // Validate that authId or userId is provided
    if (!authId && !userId) {
        throw new Error("authId or userId is required to fetch last seen data.");
    }

    const user_id = parseInt(authId || userId, 10);

    try {
        // Fetch the last seen data from the database
        const response = await db.select().from(lastSeen).where(eq(lastSeen.user_id, user_id)).limit(1);
        return response.length > 0 ? response[0] : null; // Return data or null if not found
    } catch (error) {
        console.error("Error fetching last seen data:", error);
        throw new Error("Failed to fetch last seen data.");
    }
};
