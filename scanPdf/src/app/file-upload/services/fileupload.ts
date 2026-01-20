import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Fileupload {
  private socket: Socket;

  constructor(private zone: NgZone) {
    this.socket = io('http://localhost:3500');
  }

  uploadFile(fileName: string, fileData: string, searchString: string) {
    this.socket.emit('scan-file', { fileName, fileData, searchString });
  }

  onUploadStatus(): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      this.socket.on('upload-status', (data) => {
        this.zone.run(() => observer.next(data));
      });
    });
  }

  requestScan(fileName: string, fileData: string, searchString: string) {
    this.socket.emit('scan-file', { fileName, fileData, searchString });
  }

  onScanStatus(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('scan-status', (status) => {
        this.zone.run(() => observer.next(status));
      });
    });
  }

  onScanResult(): Observable<{ success: boolean; text?: string; message?: string, pages?: number[] }> {
    return new Observable(observer => {
      this.socket.on('scan-result', (result) => {
        alert('Scan result:');
        console.log('Scan result:', result);
        this.zone.run(() => observer.next(result));
      });
    });
  }
  // notify(): Observable<{ text: any }> {
  //   return new Observable(obs => {
  //     setTimeout(() => {
  //       obs.next({ text: 'hello' })
  //     }, 1000);
  //   })

  // }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
