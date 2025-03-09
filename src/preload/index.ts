import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {};

// Store key from Renderer
let authId = null;

// Override `invoke` to always include `authId`
const customInvoke = (channel, ...args) => {
    return ipcRenderer.invoke(channel, { authId, ...args[0] });
};

// Function to update `authId` from Renderer
const setAuthId = (key) => {
    authId = key;
};

// Extend the existing `electronAPI`
const extendedElectronAPI = {
    ...electronAPI,
    ipcRenderer: {
        ...electronAPI.ipcRenderer,
        invoke: customInvoke, // Override `invoke`
    },
    setAuthId, // Expose function to set `authId`
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("Electron", extendedElectronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.Electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
