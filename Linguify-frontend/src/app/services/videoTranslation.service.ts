import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoTranslationService {
  private apiUrl = 'http://localhost:5038/api/linguify/videoTranslation';
  private baseUrl = 'http://localhost:5038/api/linguify/get_video/';

  constructor(private http: HttpClient) { }

  videoTranslate(text: string, tgtLang: string): Observable<any> {
    const body = { text, tgt_lang: tgtLang };
    return this.http.post<any>(this.apiUrl, body);
  }

  getVideoUrl(videoName: string): string {
    return `${this.baseUrl}${videoName}`;
  }
}
