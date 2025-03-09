import { eq } from "drizzle-orm";
import { db } from "../db-init";
import { users } from "../schema/user-schema";
import { avatars } from "../schema/avatar-schema";
import fs from "fs/promises";
import path from "path";
const FILES_DIR = path.join(process.cwd(), "src/main/static-assets/avatar");
/**
 * Creates a new user in the database with the provided request data.
 *
 * @param {any} request - The request object containing user data.
 * @returns {Promise<void>} A promise that resolves when the user is successfully created.
 * @throws Will throw an error if the user creation fails.
 *
 * The function attempts to retrieve a default user avatar and includes its file path
 * in the user data before inserting it into the database.
 */
export const createUser = async (request: any) => {
    const { _, ...data } = request;
    try {
        return db
            .insert(users)
            .values({ ...data, avatar_id: 1 })
            .run();
    } catch (error) {
        const errMsg = error as any;
        throw new Error(errMsg);
    }
};

/**
 * Updates a user in the database with the provided request data.
 * The function takes a request object containing user data, including the `authId`.
 * It validates that the `authId` is provided and throws an error if it is not.
 * It then updates the user in the database and returns the updated user object with a blob URL.
 * The function maps the updated user data to include the blob URL for the avatar using the `filePathToBlob` function.
 * If the update operation fails, the function logs the error and throws a new error.
 *
 * @param {any} request - The request object containing user data including `authId`.
 * @returns {Promise<object>} A promise that resolves to the updated user object with blob URL.
 * @throws Will throw an error if the update operation fails or `authId` is not provided.
 *
 * created_by :- Kawsar Bin Siraj (12/02/2025)
 */
export const updateUser = async (request: any) => {
    const { authId, ...data } = request;

    // Validate that authId is provided
    if (!authId) {
        throw new Error("authId is required for updating user.");
    }

    try {
        // Update the user in the database
        const updatedUser = await db.update(users).set(data).where(eq(users.id, authId)).returning();

        if (!updatedUser.length) {
            throw new Error("User not found or update failed.");
        }

        // Fetch the updated user with avatar details
        const userWithAvatar = await db
            .select({
                id: users.id,
                name: users.name,
                institute: users.institute,
                identification: users.identification,
                phone: users.phone,
                avatar_id: users.avatar_id,
                avatar: avatars.src,
            })
            .from(users)
            .leftJoin(avatars, eq(avatars.id, users.avatar_id))
            .where(eq(users.id, authId));

        const updated = await Promise.all(
            userWithAvatar.map(async (user) => {
                const buffer = await bufferToBlob(user.avatar);
                return { ...user, avatar: buffer };
            })
        );

        return updated[0] || updatedUser[0]; // Ensure we return at least updated user info
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
};

/**
 * Retrieves all users from the database.
 * The function maps the retrieved user data to include the blob URL for the avatar.
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of user objects with blob URLs.
 * @throws {Error} - If there is an error retrieving users.
 *
 * The function first retrieves all users from the database using the `db.select().from(users).all()` method.
 * Then, it maps the retrieved user data to include the blob URL for the avatar using the `filePathToBlob` function.
 * Finally, it returns the mapped user data.
 */
export const getAllUser = async () => {
    try {
        /**
         * Retrieves all users from the database.
         * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
         */
        const allUsers = await db
            .select({
                id: users.id,
                name: users.name,
                institute: users.institute,
                identification: users.identification,
                phone: users.phone,
                avatar_id: users.avatar_id,
                avatar: avatars.src,
            })
            .from(users)
            .leftJoin(avatars, eq(avatars.id, users.avatar_id));

        const all = await Promise.all(
            allUsers.map(async (user) => {
                const buffer = user?.avatar ? await bufferToBlob(user.avatar) : null;
                return { ...user, avatar: buffer };
            })
        );

        return all;
    } catch (error) {
        console.error("Failed to retrieve users.", error);
        throw new Error("Failed to retrieve users.");
    }
};

/**
 * Retrieves all user avatars from the file system.
 * @returns {Promise<Array>} - A promise that resolves to an array of avatar objects with file details and blob URLs
 * @throws {Error} - If there is an error retrieving avatars
 * created_by :- Kawsar Bin Siraj (12/02/2025)
 */
export const getUserAvatars = async () => {
    try {
        /**
         * Retrieves all avatars from the database.
         * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
         */
        const allAvatars = await db.select().from(avatars);
        const all = await Promise.all(
            allAvatars.map(async (a) => {
                const buffer = a?.src ? await bufferToBlob(a.src) : null;
                return { ...a, src: buffer };
            })
        );
        return all;
    } catch (error) {
        console.error("Failed to retrieve avatar.", error);
        throw new Error("Failed to retrieve avatar.");
    }
};

/**
 * Retrieves all user avatars from the file system.
 * @returns {Promise<Array>} - A promise that resolves to an array of avatar objects with file details and blob URLs
 * @throws {Error} - If there is an error retrieving avatars
 * created_by :- Kawsar Bin Siraj (12/02/2025)
 */
export const getUserAvatarsAsBuffer = async () => {
    try {
        // Read all avatar files from the file system
        const allFiles = await fs.readdir(FILES_DIR);

        // Map the avatar files to include the blob URL for each avatar
        const avatars = await Promise.all(
            allFiles.map(async (file) => {
                const filePath = path.join(FILES_DIR, file);
                const buffer = await filePathToBlob(filePath);
                return { src: buffer };
            })
        );
        return avatars;
    } catch (error) {
        console.error("Failed to retrieve avatar.", error);
        throw new Error("Failed to retrieve avatar.");
    }
};

/**
 * @desc :- Converts a file path to a blob URL.
 * @param {string} filePath - The path of the file to be converted to a blob.
 * @returns {Promise<string>} A promise that resolves to the blob URL.
 * @throws {Error} If there is an error reading the file or converting it to a blob.
 * created_by :- Kawsar Bin Siraj (12/02/2025)
 */
export const filePathToBlob = async (filePath: string): Promise<Buffer> => {
    try {
        // Read the file as a Buffer (raw binary data)
        const fileBuffer = await fs.readFile(filePath);
        // Return the Buffer directly for database storage
        return fileBuffer;
    } catch (error) {
        console.error("Failed to convert file to binary for DB", error);
        throw new Error("Failed to convert file to binary for DB");
    }
};

/**
 * @desc :- Converts a file path to a blob URL.
 * created_by :- Kawsar Bin Siraj (03/03/2025)
 */
export const bufferToBlob = async (fileBuffer: any) => {
    try {
        if (!fileBuffer) return null;
        // Convert the Buffer to a base64 string
        const base64Data = Buffer.from(fileBuffer).toString("base64");
        // Define the MIME type of the file
        const mimeType = "image/svg+xml"; // Change as needed (e.g., "image/png")
        // Construct the blob URL using the base64 string and MIME type
        const blobUrl = `data:${mimeType};base64,${base64Data}`;
        // Return the blob URL
        return blobUrl;
    } catch (error) {
        // Log the error and throw a new error
        console.error("Failed to filePathToBlob", error);
        throw new Error("Failed to filePathToBlob");
    }
};
