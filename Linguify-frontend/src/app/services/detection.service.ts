import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private apiUrl = 'http://localhost:5038/api/linguify/text-detection';

  constructor(private http: HttpClient) { }

  detect_language(text: string): Observable<any> {
    const body = { text };
    console.log(`Sending request to ${this.apiUrl} with body:`, body);  // Debugging statement
    return this.http.post<any>(this.apiUrl, body);
  }
}
