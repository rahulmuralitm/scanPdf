import { Component, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../services/socket.service';
import { Fileupload } from './services/fileupload';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styles: [`
    .upload-container {
      max-width: 500px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }

    .drop-zone {
      border: 2px dashed #e2e8f0;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8fafc;
      position: relative;
      overflow: hidden;
    }

    .drop-zone:hover, .drop-zone.dragging {
      border-color: #6366f1;
      background: #eef2ff;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.15);
    }

    .icon {
      font-size: 48px;
      margin-bottom: 16px;
      filter: grayscale(1);
      transition: all 0.3s ease;
    }

    .drop-zone:hover .icon {
      filter: grayscale(0);
      transform: scale(1.1);
    }

    h3 {
      margin: 0 0 8px;
      color: #1e293b;
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .file-info {
      display: flex;
      align-items: center;
      background: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .file-icon {
      font-size: 24px;
      margin-right: 12px;
    }

    .file-details {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
    }

    .file-name {
      font-weight: 500;
      color: #0f172a;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }

    .file-size {
      color: #94a3b8;
      font-size: 12px;
    }

    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: #f1f5f9;
      color: #ef4444;
    }

    .error-message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      background: #fef2f2;
      color: #ef4444;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class FileUploadComponent {
  showText: boolean = false;
  selectedFile: File | null = null;
  error: string | null = null;
  isUploading = false;
  uploadStatus: string | null = null;
  statusClass: 'success' | 'error' | null = null;
  isScanning = false;
  scanResult: string | null = null;
  scanText: string | null = null;
  showTextBtn: boolean = false;
  asas: string | undefined;
  showisUploading: boolean = false;
  searchText: string = '';
  pageNumber: any = undefined;
  constructor(private cdr: ChangeDetectorRef, private zone: NgZone, private fileuploadService: Fileupload) {
    // Listen for status updates
    this.fileuploadService.onUploadStatus().subscribe(status => {
      this.isUploading = false;
      this.uploadStatus = status.message;
      this.statusClass = status.success ? 'success' : 'error';
    });

    this.fileuploadService.onScanStatus().subscribe(status => {
      this.uploadStatus = status;
    });
    // this.fileuploadService.notify().subscribe(data => {
    //   console.log(data)
    // })
    this.fileuploadService.onScanResult().subscribe(result => {
      this.isScanning = false;
      this.showTextBtn = true;
      this.showisUploading = true
      this.showText = result.success;
      this.pageNumber = result.pages;

      this.scanResult = result.success
        ? 'Scan Complete!'
        : result.message || 'Scan Failed';

      if (result.success && result.text) {
        this.scanText = result.text ?? null;
        setTimeout(() => {
          this.zone.run(() => {
            // this.scanText = result.text

          });
        }, 1000);



        // alert(this.pageNumber)
        // this.asas = result.text;
        // this.addText("hi")
        // $(".upload-btn1").click()
      }

      // 🔥 THIS IS THE KEY LINE
      this.cdr.detectChanges();
    });

  }
  addText(data: string) {
    alert(data)
    this.scanText = this.scanText;
  }
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    console.log(event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  validateAndSetFile(file: File) {
    this.error = null;
    if (file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.error = 'Please select a valid PDF file.';
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.error = null;
    this.uploadStatus = null;
    this.statusClass = null;
    this.uploadStatus = null;
    this.statusClass = null;
    this.scanText = null;
    this.isScanning = false;
    this.showText = false;
  }

  uploadFile() {

    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadStatus = "Uploading...";
    this.statusClass = null;
    this.showText = false;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.fileuploadService.uploadFile(this.selectedFile!.name, base64String, this.searchText);
    };
    reader.readAsDataURL(this.selectedFile);
  }

  scanFile() {
    if (!this.selectedFile) return;
    this.isScanning = true;
    this.scanResult = null;
    this.scanText = null;
    this.showText = false;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.fileuploadService.requestScan(this.selectedFile!.name, base64String, this.searchText);
    };
    reader.readAsDataURL(this.selectedFile);
  }
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInputRef?.nativeElement.click();
  }

}
