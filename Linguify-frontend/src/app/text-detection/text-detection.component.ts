import { Component, Inject } from '@angular/core';
import { DetectionService } from '../services/detection.service';
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

  constructor(@Inject(DetectionService) private detectionService: DetectionService) { }

  detectLanguage() {
    this.isLoading = true;
    this.detectedLanguage = '';
    this.errorText = '';

    const payload = { text: this.text };
    console.log('Payload:', payload);  // Debugging statement
    this.detectionService.detect_language(this.text).subscribe(
      response => {
        this.isLoading = false;
        console.log('Response:', response);  // Debugging statement
        this.detectedLanguage = response.detected_language;
      },
      error => {
        this.isLoading = false;
        console.error('Error:', error);  // Debugging statement
        this.errorText = error.error.error;
      }
    );
  }
}
