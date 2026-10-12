
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
  protected imageSource = signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;

  private fileToUpload: File | null = null;

  uploadFile = output<File>();
  loading = input(false);

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

    const file = event.dataTransfer?.files[0];

    if (file && file.type.startsWith('image/')) {
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

  private previewImage(file: File) {
    const reader = new FileReader();

    reader.onload = event => {
      this.imageSource.set(event.target?.result);
    };

    reader.readAsDataURL(file);
  }

  onCancel() {
    this.fileToUpload = null;
    this.imageSource.set(null);
  }

  onUploadFile() {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload);
    }
  }
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && file.type.startsWith('image/')) {
    this.previewImage(file);
    this.fileToUpload = file;
  }
}
}
