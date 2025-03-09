import { ipcMain } from "electron";
import { getAllChapters, getSingleChapterById, updateChapterProgress, saveLastSeenData , getLastSeenData} from "./sqlite/controller/chapter-crud";
import { upsertQuizAnswer, getChaptersWithQuizPoints, getSingleChapterInfoWithQuizPoints } from "./sqlite/controller/chapter-quiz-crud";
import { createUser, updateUser, getAllUser, getUserAvatars } from "./sqlite/controller/user-crud";
/**
 * Initializes all the modules of the application.
 *
 * This function initializes various modules required for the app's operation,
 * including window management, robot position tracking, monitor tracking, file watching,
 * screenshot loop, USB device watching, and disk monitoring.
 *
 * @param {Electron.BrowserWindow} mw - The main window of the app.
 */

export const ipcHandlers = async () => {
    try {
        /**
         * @desc :- for all user model
         * created_by :- Kawsar Bin Siraj (09/03/2025)
         */
        ipcMain.handle("create-user", async (_, request) => await createUser(request));
        ipcMain.handle("update-user", async (_, request) => await updateUser(request));
        ipcMain.handle("get-users", async () => await getAllUser());
        ipcMain.handle("get-user-avatars", async () => await getUserAvatars());
        /**
         * @desc :- for all chapter model
         * created_by :- Kawsar Bin Siraj (09/03/2025)
         */
        ipcMain.handle("get-chapters", async (_, request) => await getAllChapters(request));
        ipcMain.handle("get-single-chapter", async (_, request) => await getSingleChapterById(request));
        ipcMain.handle("update-chapter-progress", async (_, request) => await updateChapterProgress(request));
        ipcMain.handle("save-last-seen-data", async (_, request) => await saveLastSeenData(request));
        ipcMain.handle("get-last-seen-data", async (_, request) => await getLastSeenData(request));

        /**
         * @desc :- for all chapter-quiz model
         * created_by :- Kawsar Bin Siraj (09/03/2025)
         */
        ipcMain.handle("upsert-quiz-answer", async (_, request) => await upsertQuizAnswer(request));
        ipcMain.handle("get-chapters-quiz-points", async (_, request) => await getChaptersWithQuizPoints(request));
        ipcMain.handle("get-single-chapter-quiz-points", async (_, request) => await getSingleChapterInfoWithQuizPoints(request));
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};
