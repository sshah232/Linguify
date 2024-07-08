import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-detection',
  standalone: true,
  templateUrl: './text-detection.component.html',
  styleUrls: ['./text-detection.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class TextDetectionComponent {
  text: string = '';
  detectedLanguage: string = '';
  errorText: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  detectLanguage() {
    this.isLoading = true;
    this.detectedLanguage = '';
    this.errorText = '';

    const payload = { text: this.text };

    this.http.post<any>('http://localhost:5038/api/linguify/detect-language', payload).subscribe(
      response => {
        this.isLoading = false;
        this.detectedLanguage = response.detected_language;
      },
      error => {
        this.isLoading = false;
        this.errorText = error.error.error;
      }
    );
  }
}
