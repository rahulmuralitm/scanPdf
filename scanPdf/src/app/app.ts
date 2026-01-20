import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'pdf-uploader';
}
