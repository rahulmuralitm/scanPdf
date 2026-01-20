import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io('http://localhost:3000');
    }

    uploadFile(fileName: string, fileData: string) {
        this.socket.emit('upload-file', { fileName, fileData });
    }

    onUploadStatus(): Observable<{ success: boolean; message: string }> {
        return new Observable(observer => {
            this.socket.on('upload-status', (data) => {
                observer.next(data);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
