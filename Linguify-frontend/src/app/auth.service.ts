// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private baseUrl = 'http://localhost:5038/api/linguify';

//   constructor(private http: HttpClient) { }

//   signup(username: string, password: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/signup`, { username, password });
//   }

//   login(username: string, password: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
//       tap((response: any) => {
//         if (response && response.message === "Login successful") {
//           sessionStorage.setItem('user', username);
//         }
//       })
//     );
//   }

//   logout(): Observable<any> {
//     return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
//       tap((response: any) => {
//         if (response && response.message === "Logout successful") {
//           sessionStorage.removeItem('user');
//         }
//       })
//     );
//   }

//   checkAuth(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/check-auth`);
//   }
// }
