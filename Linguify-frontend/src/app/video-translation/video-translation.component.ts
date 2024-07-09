import { Component } from '@angular/core';
import { VideoTranslationService } from '../services/videoTranslation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-video-translation',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './video-translation.component.html',
  styleUrl: './video-translation.component.css'
})

export class VideoTranslationComponent {
  text: string = '';
  tgtLang: string = '';
  translatedVideo: string = '';
  errorText: string = '';
  isLoading: boolean = false ;
  videoError: boolean = false;

  languages: Language[] = [
    { name: 'Afrikaans', code: 'af' },
    { name: 'Albanian', code: 'sq' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Armenian', code: 'hy' },
    { name: 'Catalan', code: 'ca' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Chinese (Mandarin/China)', code: 'zh-cn' },
    { name: 'Chinese (Mandarin/Taiwan)', code: 'zh-tw' },
    { name: 'Chinese (Cantonese)', code: 'zh-yue' },
    { name: 'Croatian', code: 'hr' },
    { name: 'Czech', code: 'cs' },
    { name: 'Danish', code: 'da' },
    { name: 'Dutch', code: 'nl' },
    { name: 'English', code: 'en' },
    { name: 'English (Australia)', code: 'en-au' },
    { name: 'English (United Kingdom)', code: 'en-uk' },
    { name: 'English (United States)', code: 'en-us' },
    { name: 'Esperanto', code: 'eo' },
    { name: 'Finnish', code: 'fi' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Greek', code: 'el' },
    { name: 'Haitian Creole', code: 'ht' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Hungarian', code: 'hu' },
    { name: 'Icelandic', code: 'is' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Italian', code: 'it' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Latin', code: 'la' },
    { name: 'Latvian', code: 'lv' },
    { name: 'Macedonian', code: 'mk' },
    { name: 'Norwegian', code: 'no' },
    { name: 'Polish', code: 'pl' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Portuguese (Brazil)', code: 'pt-br' },
    { name: 'Romanian', code: 'ro' },
    { name: 'Russian', code: 'ru' },
    { name: 'Serbian', code: 'sr' },
    { name: 'Slovak', code: 'sk' },
    { name: 'Spanish', code: 'es' },
    { name: 'Spanish (Spain)', code: 'es-es' },
    { name: 'Spanish (United States)', code: 'es-us' },
    { name: 'Swahili', code: 'sw' },
    { name: 'Swedish', code: 'sv' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Thai', code: 'th' },
    { name: 'Turkish', code: 'tr' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Welsh', code: 'cy' }
  ];
  
  constructor(private videoTranslationService: VideoTranslationService) { }

  translateVideo() {
    this.isLoading = true;
    this.errorText = '';
    this.videoTranslationService.videoTranslate(this.text, this.tgtLang).subscribe(
      response => {
        this.translatedVideo = response.translated_video;
        this.isLoading = false;
      },
      error => {
        console.error('Error during translation:', error);
        this.isLoading = false;
        this.errorText = 'An error occurred during translation. Please try again.';
      }
    );
  }

  getVideoUrl(videoName: string): string {
    return this.videoTranslationService.getVideoUrl(videoName);
  }

  handleVideoError() {
    this.videoError = true;
  }

}