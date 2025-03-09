import fs from "fs/promises";
import path from "path";
const { pdfToPng } = require("pdf-to-png-converter");
const FILES_DIR = path.join(process.cwd(), "src/main/static-assets/chapters");

/**
 * Retrieves all chapter PDF files from the local file system.
 *
 * This function retrieves all PDF files from the file system and maps them to
 * an object with file details and an index.
 *
 * @returns {Promise<Array<{ fileName: string; name: string; filePath: string; idx: number }>>}
 * - A promise that resolves to an array of objects containing file details and an index.
 */
export const getAllChaptersFromLocal = async () => {
    // console.log(chapter1Json, 'chapter1Json');
    // Read all PDF files from the file system
    const allFiles = await fs.readdir(FILES_DIR);
    // Filter PDF files from the list
    const pdfFiles = allFiles.filter((file) => file.endsWith(".pdf"));

    // Map the PDF files to include the file path and an index
    const pdfFilesAsPath = pdfFiles.map((file) => path.join(FILES_DIR, file));
    const filles = await Promise.all(
        pdfFilesAsPath.map(async (filePath, idx) => {
            try {
                const fileName = path.basename(filePath);
                const name = path.parse(filePath).name;
                const chapterName = name?.split("-")?.[0] ?? "";
                const jsonFilePath = path.join(process.cwd(), "src/main/static-assets/quizzes", `${chapterName.trim()}.json`);
                await fs.access(jsonFilePath);
                const rawData = await fs.readFile(jsonFilePath, "utf8");
                return { fileName, name, filePath, quizzes: rawData, idx };
            } catch (error) {
                console.error("Error: File does not exist ->", error);
            }
        })
    );

    return filles;
};

/**
 * Converts a PDF file to a PNG buffer.
 *
 * @param {string} filePath - The path to the PDF file.
 * @param {number[]} [pagesToProcess=[]] - The subset of pages to convert (first page = 1), other pages will be skipped if specified.
 * @returns {Promise<Buffer>} - A promise that resolves to the PNG buffer.
 */
export const filePathToUnitArray = async (filePath, pagesToProcess = []) => {
    if (!filePath) return;

    // Configure the PDF to PNG converter
    const pdfToPngOptions = {
        // The function accepts PDF file path or a Buffer
        disableFontFace: true, // When `false`, fonts will be rendered using a built-in font renderer that constructs the glyphs with primitive path commands. Default value is true.
        useSystemFonts: true, // When `true`, fonts that aren't embedded in the PDF document will fallback to a system font. Default value is false.
        enableXfa: false, // Render Xfa forms if any. Default value is false.
        viewportScale: 1.0, // The desired scale of PNG viewport. Default value is 1.0 which means to display page on the existing canvas with 100% scale.
        // outputFolder: "output/folder", // Folder to write output PNG files. If not specified, PNG output will be available only as a Buffer content, without saving to a file.
        outputFileMaskFunc: (pageNumber) => `page-${pageNumber}.png`, // Output filename mask function. Example: (pageNumber) => `page_${pageNumber}.png`
        pdfFilePassword: "pa$$word", // Password for encrypted PDF.
        // pagesToProcess: [], // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
        strictPagesToProcess: false, // When `true`, will throw an error if specified page number in pagesToProcess is invalid, otherwise will skip invalid page. Default value is false.
        verbosityLevel: 0, // Verbosity level. ERRORS: 0, WARNINGS: 1, INFOS: 5. Default value is 0.
    };
    if (pagesToProcess?.length) pdfToPngOptions["pagesToProcess"] = pagesToProcess;

    // Run the PDF to PNG converter as unit8Array
    const unit8Array = await pdfToPng(filePath, pdfToPngOptions);

    // Return the PNG buffer as unit8Array
    return unit8Array;
};
