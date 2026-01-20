const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { scanPdf } = require('./utils/scanner');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8 // Increase limit to 100MB for large files
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('upload-file', (data) => {
        try {
            console.log('Receiving file:', data.fileName);

            const buffer = Buffer.from(data.fileData, 'base64');
            const filePath = path.join(uploadDir, data.fileName);

            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    console.error('File write error:', err);
                    socket.emit('upload-status', { success: false, message: 'File save failed.' });
                } else {
                    console.log('File saved successfully:', filePath);
                    socket.emit('upload-status', { success: true, message: 'File uploaded successfully!' });
                }
            });
        } catch (error) {
            console.error('Upload processing error:', error);
            socket.emit('upload-status', { success: false, message: 'Server error processing file.' });
        }
    });

    socket.on('scan-file', async (data) => {
        const { fileName, fileData, searchString } = data;
        const filePath = path.join(uploadDir, fileName);

        try {
            console.log(`Scanning file: ${fileName} with search: "${searchString}"`);

            const buffer = Buffer.from(fileData, 'base64');

            // Use promises for cleaner flow
            await fs.promises.writeFile(filePath, buffer);
            console.log('File saved successfully:', filePath);

            const { fullText, searchPages } = await scanPdf(filePath, searchString, (status) => {
                socket.emit('scan-status', status);
            });

            socket.emit('scan-result', { success: true, text: fullText, pages: searchPages });

        } catch (error) {
            console.error('Processing error:', error);
            socket.emit('scan-result', { success: false, message: 'Process failed: ' + error.message });
        } finally {
            // Always attempt deletion
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Error deleting file ${filePath}:`, err);
                    else console.log(`Successfully deleted temporary file: ${fileName}`);
                });
            }
        }
    });

    socket.on('upload-file', (data) => {
        // Obsolete but keeping for compatibility if needed, though now handled by scan-file
        console.log('Received legacy upload-file event');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3500;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
