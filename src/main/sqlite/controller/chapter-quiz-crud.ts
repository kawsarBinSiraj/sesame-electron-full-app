import { eq, and, sql } from "drizzle-orm";
import { db } from "../db-init";
import { chapterQuizAnswer } from "../schema/chapter-quiz-answer-schema";
import { chapters } from "../schema/chapter-schema";
import { chapterProgress } from "../schema/chapter-progress-schema";
/**
 * Inserts or updates a quiz answer depending on the chapter_id and user_id using onConflictDoUpdate.
 *
 * @param {any} request - The request object containing user ID and quiz answer data.
 * @returns {Promise<{}>} - A promise that resolves when the quiz answer is successfully created or updated.
 * @throws {Error} - If there is an error.
 */
export const upsertQuizAnswer = async (request: any) => {
    const { authId, data } = request;

    if (!authId) {
        throw new Error("'authId' must be provided to upsertQuizAnswer.");
    }

    try {
        // Process each item in `data`
        const upsertPromises = data.map(async (item: any) => {
            // Check if an entry already exists
            const existingEntry = await db
                .select()
                .from(chapterQuizAnswer)
                .where(and(eq(chapterQuizAnswer.user_id, authId), eq(chapterQuizAnswer.chapter_id, item.chapter_id), eq(chapterQuizAnswer.quiz_id, item.quiz_id)))
                .limit(1);

            if (existingEntry.length > 0) {
                // Update existing entry
                return await db
                    .update(chapterQuizAnswer)
                    .set(item) // Update fields
                    .where(and(eq(chapterQuizAnswer.user_id, authId), eq(chapterQuizAnswer.chapter_id, item.chapter_id), eq(chapterQuizAnswer.quiz_id, item.quiz_id)));
            } else {
                // Insert new entry
                return await db
                    .insert(chapterQuizAnswer)
                    .values({ user_id: parseInt(authId, 10), ...item })
                    .returning();
            }
        });

        // Wait for all upsert operations to complete
        await Promise.all(upsertPromises);

        return { message: "All quiz answers have been upserted successfully." };
    } catch (error) {
        throw new Error("Failed to insert or update quiz answers.");
        return [];
    }
};

/**
 * Retrieves all chapters with total quiz points for the given user.
 *
 * @param {any} request - The request object containing user ID.
 * @returns {Promise<Array<any>>} - A promise that resolves to an array of chapter objects with total quiz points.
 * @throws {Error} - If there is an error retrieving chapters with quiz points.
 */
export const getChaptersWithQuizPoints = async (request: any) => {
    const { authId } = request;

    // Validate that authId is provided
    if (!authId) {
        throw new Error("'authId' must be provided to getChaptersWithQuizPoints.");
    }

    try {
        const chaptersWithQuizPoints = await db
            .select({
                id: chapters.id,
                chapter_id: chapters.id,
                user_id: chapterProgress.user_id,
                quizzes: chapters.quizzes,
                name: chapters.name,
                desc: chapters.desc,
                content: chapters.content,
                progress: chapterProgress?.progress ?? 0,
                total_points: sql<number>`SUM(${chapterQuizAnswer.point})`.as("total_points"), // Summing points
            })
            .from(chapters)
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
                    eq(chapters.id, chapterQuizAnswer.chapter_id), // Match chapters with answers
                    eq(chapterQuizAnswer.user_id, authId) // Filter for current user
                )
            )
            .groupBy(chapters.id); // Ensure each chapter appears only once

        const DATA = await Promise.all(
            chaptersWithQuizPoints.map(async (data) => {
                const content = JSON.parse(data?.content);
                const thumb = JSON.stringify(content?.[0]);
                return { ...data, thumb };
            })
        );

        return DATA;
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        return [];
    }
};

export const getSingleChapterInfoWithQuizPoints = async (request: any) => {
    const { authId, chapterId } = request;

    // Validate that authId and chapterId are provided
    if (!authId || !chapterId) {
        throw new Error("authId and chapterId are required for getSingleChapterInfoWithQuizPoints.");
    }

    try {
        const res = await db
            .select()
            .from(chapterQuizAnswer)
            .where(
                and(
                    eq(chapterId, chapterQuizAnswer.chapter_id), // Match chapters with answers
                    eq(chapterQuizAnswer.user_id, authId) // Filter for current user
                )
            )
            .orderBy(chapterQuizAnswer.quiz_index); // Order by quiz_index
        return res;
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        return [];
    }
};
