import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoToTextService {

  private apiUrl = 'http://localhost:5038/api/linguify/video-to-text'; // Adjust if your endpoint URL is different

  constructor(private http: HttpClient) { }

  transcribeVideo(videoUrl: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { video_url: videoUrl });
  }
}
