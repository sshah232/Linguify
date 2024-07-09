import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoToTextService } from '../services/video-to-text.service';

@Component({
  selector: 'app-video-to-text',
  standalone: true,
  templateUrl: './video-to-text.component.html',
  styleUrls: ['./video-to-text.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class VideoToTextComponent {
  videoUrl: string = '';
  transcribedText: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private videoToTextService: VideoToTextService, private http: HttpClient) {}

  transcribeVideo() {
    this.loading = true;
    this.error = '';
    this.transcribedText = '';
  
    this.videoToTextService.transcribeVideo(this.videoUrl).subscribe(
      response => {
        this.transcribedText = response.transcribed_text;
        this.loading = false;
      },
      error => {
        this.error = 'An error occurred while transcribing the video.';
        console.error('Error during transcription:', error);
        this.loading = false;
      }
    );
  }
}
