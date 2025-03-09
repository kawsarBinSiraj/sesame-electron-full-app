import { app, shell, BrowserWindow, screen, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { ipcHandlers } from "./init";
import ICON_PNG from "../../resources/icon.png?asset";
import ICON_ICO from "../../resources/icon.ico?asset";

// Store the reference for the main window
let mainWindow: BrowserWindow | null = null;

/**
 * Create the main window for the app
 *
 * This function creates a new BrowserWindow instance with the specified options,
 * sets up event listeners for the window, and loads the content based on the
 * environment (development or production).
 */
const isDebug = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
(async () => {
    const electronDebug = await import("electron-debug");
    electronDebug.default();
})();

/**
 * Installs React Developer Tools if not already installed.
 *
 * @returns {Promise<void>} - A promise that resolves when the installation is complete.
 */
const installExtensions = async (): Promise<void> => {
    const installer = await import("electron-devtools-installer");
    const extensions = ["REACT_DEVELOPER_TOOLS"];

    await Promise.all(extensions.map((name) => installer[name]))
        .then(installer.default)
        .catch(console.log);
};

/**
 * Creates a new BrowserWindow instance with the specified options.
 * @param {Boolean} isDebug - Whether the app is in debug mode.
 * @returns {Promise<void>} - A promise that resolves when the window is created.
 */
const createWindow = async (): Promise<void> => {
    try {
        if (isDebug) await installExtensions();

        // Get the screen width and height
        // const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
        const screenHeight = screen.getPrimaryDisplay().workAreaSize.height;

        // Get the screen height to set initial values and dynamically adjust later

        const height = screenHeight - 100;
        // Calculate width based on the 16:10 ratio (height * 16 / 10)
        const width = Math.round(height * (16 / 10));

        mainWindow = new BrowserWindow({
            width, // The width of the window
            height, // The height of the window
            show: false, // Whether to show the window immediately
            frame: false,
            titleBarStyle: "hidden",
            trafficLightPosition: { x: 25, y: 20 },
            autoHideMenuBar: true, // Whether to hide the menu bar
            ...(process.platform === "linux" ? { ICON_PNG } : { ICON_ICO }),
            webPreferences: {
                preload: join(__dirname, "../preload/index.js"), // Path to the preload script
                sandbox: false, // Whether to enable sandboxing
                contextIsolation: true, // ✅ Keep this enabled
                nodeIntegration: false, // ✅ Security best practice
            },
        });

        // Set minimum size for the window
        mainWindow.setMinimumSize(1000, height - 50);
        // Set maximum size for the window
        // mainWindow.setMaximumSize(screenWidth, screenHeight);

        mainWindow.on("ready-to-show", () => {
            if (!mainWindow) {
                throw new Error("mainWindow is not defined");
            }
            if (process.env.START_MINIMIZED) {
                mainWindow.minimize();
            } else {
                mainWindow.show();
            }
        });

        mainWindow.webContents.setWindowOpenHandler((details: Electron.HandlerDetails) => {
            shell.openExternal(details.url);
            return { action: "deny" };
        });

        const rendererURL = process.env["ELECTRON_RENDERER_URL"];
        if (is.dev && rendererURL) {
            await mainWindow.loadURL(rendererURL);
        } else {
            await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
        }
    } catch (error) {
        console.error("Error creating main window:", error);
    }
};

/**
 * Initialize the app after it is ready
 */
app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.electron");

    // Handle window creation and optimization
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // Create the main window
    createWindow().then(() => {
        if (mainWindow) {
            /**
             * @desc :- for window close, minimize and maximize
             * created_by :- Kawsar Bin Siraj (25/02/2025)
             */
            ipcMain.on("window-close", () => {
                if (mainWindow) mainWindow.close();
            });

            ipcMain.on("window-minimize", () => {
                if (mainWindow) mainWindow.minimize();
            });

            ipcMain.on("window-maximize", () => {
                if (mainWindow) {
                    if (mainWindow.isMaximized()) mainWindow.unmaximize();
                    else mainWindow.maximize();
                }
            });

            /**
             * @desc :- for ipc handlers
             * created_by :- Kawsar Bin Siraj (09/03/2025)
             */
            ipcHandlers();
        } else {
            console.error("Failed to create the main window");
        }
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

/**
 * Quit app when all windows are closed (except on macOS)
 */
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
