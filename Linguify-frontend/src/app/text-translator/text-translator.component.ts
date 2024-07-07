import { Component } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private translationService: TranslationService) { }

  translateText() {
    this.translationService.translate(this.text, this.srcLang, this.tgtLang).subscribe(
      response => {
        this.translatedText = response.translated_text;
      },
      error => {
        console.error('Error during translation:', error);
      }
    );
  }
}