import { Component } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-text-translator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './text-translator.component.html',
  styleUrl: './text-translator.component.css'
})
export class TextTranslatorComponent {
  text: string = '';
  srcLang: string = '';
  tgtLang: string = '';
  translatedText: string = '';
  errorText: string = '';
  isLoading: boolean = false ;

  languages: Language[] = [
    { name: 'Arabic', code: 'ar' },
    { name: 'Bulgarian', code: 'bg' },
    { name: 'German', code: 'de' },
    { name: 'Modern Greek', code: 'el' },
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Italian', code: 'it' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Polish', code: 'pl' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Russian', code: 'ru' },
    { name: 'Swahili', code: 'sw' },
    { name: 'Thai', code: 'th' },
    { name: 'Turkish', code: 'tr' },
    { name: 'Urdu', code: 'ur' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Chinese', code: 'zh' }
  ];

  constructor(private translationService: TranslationService) { }

  translateText() {
    this.isLoading = true;
    this.translationService.translate(this.text, this.srcLang, this.tgtLang).subscribe(
      response => {
        this.translatedText = response.translated_text;
        this.isLoading = false;
      },
      error => {
        console.error('Error during translation:', error);
        this.isLoading = false;
      }
    );
  }
}