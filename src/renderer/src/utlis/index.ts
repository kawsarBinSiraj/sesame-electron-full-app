/**
 * @desc :- getLoggedUserData
 * created_by :- Kawsar Bin Siraj (12/02/2025)
 * @returns Logged user data or null if not found
 */
export const getLoggedUserData = (): { [key: string]: any } | null => {
    const loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) {
        try {
            return JSON.parse(loggedUser);
        } catch (error) {
            console.error("Error parsing logged user data:", error);
            return null;
        }
    }
    return null;
};

/**
 * Converts a Uint8Array, represented as a JSON string, to a Blob URL.
 *
 * @param {any} thumb - The JSON string representing the Uint8Array data.
 * @returns {string} A Blob URL representing the image.
 */
export const convertUnit8ArrayToBlob = (thumb: any): string => {
    // Parse the JSON string to get the data
    const data = JSON.parse(thumb).data;
    // Create a new Blob from the Uint8Array data
    const blob = new Blob([new Uint8Array(data)], { type: "image/jpeg" });
    // Create and return a Blob URL from the Blob
    return URL.createObjectURL(blob);
};

/**
 * @desc :- formatNumber
 * created_by :- Kawsar Bin Siraj (03/03/2025)
 */
export const formatNumber = (number: any) => {
    const value = Number(number);
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
};

/**
 * @desc :- bufferToBlobUrl
 * created_by :- Kawsar Bin Siraj (03/03/2025)
 */
export const bufferToBlobUrl = (buffer: any) => {
    const fileBuffer = new Uint8Array(buffer); // Convert Buffer to Uint8Array
    const blob = new Blob([fileBuffer], { type: "image/svg+xml" });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
};
