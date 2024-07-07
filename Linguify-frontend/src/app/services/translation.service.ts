import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'http://localhost:5038/api/linguify/translate';

  constructor(private http: HttpClient) { }

  translate(text: string, srcLang: string, tgtLang: string): Observable<any> {
    const body = { text, src_lang: srcLang, tgt_lang: tgtLang };
    return this.http.post<any>(this.apiUrl, body);
  }
}
