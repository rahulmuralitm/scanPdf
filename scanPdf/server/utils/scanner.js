const { createWorker } = require('tesseract.js');
const { pdfToImg } = require('pdftoimg-js');
const fs = require('fs');

/**
 * Scans a PDF file and returns the extracted text from all pages.
 * @param {string} filePath - Path to the PDF file.
 * @param {function} onProgress - Optional callback for status updates.
 * @returns {Promise<string>} - The extracted text.
 */
async function scanPdf(filePath, searchString = '', onProgress = () => { }) {
    let worker;
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found at path: ' + filePath);
        }

        onProgress('Converting PDF to images...');
        // pdftoimg-js returns an array of buffers by default
        const imageBuffers = await pdfToImg(filePath);

        if (!imageBuffers || imageBuffers.length === 0) {
            throw new Error('Failed to convert PDF to images or PDF is empty.');
        }

        onProgress('Initializing Tesseract worker...');
        worker = await createWorker('eng');

        let fullText = '';
        let searchPages = []
        for (let i = 0; i < imageBuffers.length; i++) {
            onProgress(`Scanning page ${i + 1}/${imageBuffers.length}...`);
            const { data: { text } } = await worker.recognize(imageBuffers[i]);
            // console.log("text.toLowerCase()", text.toLowerCase());
            console.log("textsearchString.toLowerCase()", searchString.toLowerCase());


            if (searchString && text.toLowerCase().includes(searchString.toLowerCase())) {
                searchPages.push(i + 1)
            }
            fullText += `--- Page ${i + 1} ---\n${text}\n\n`;
        }

        return { fullText, searchPages };
    } catch (error) {
        console.error('OCR Error in scanPdf:', error);
        throw error;
    } finally {
        if (worker) {
            await worker.terminate();
        }
    }
}

module.exports = { scanPdf };
