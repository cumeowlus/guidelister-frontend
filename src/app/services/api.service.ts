import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Guide } from '../models/guide';
import { Activity } from '../models/activity';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient) { }

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, { email, password }, { withCredentials: true });
  }
  logout(): Observable<any> {
    return this.http.post(`${this.base}/auth/logout`, {}, { withCredentials: true });
  }
  registerUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/auth/registerUser`, { email, password }, { withCredentials: true });
  }
  registerAdmin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/auth/registerAdmin`, { email, password }, { withCredentials: true });
  }

  // Current user
  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/auth/me`, { withCredentials: true });
  }

  // Guides for current user
  getGuides(userId: number): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${this.base}/guides/user/${userId}`, { withCredentials: true });
  }

  // Get single guide by id (including activities)
  getGuide(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.base}/guides/${id}`, { withCredentials: true });
  }

  // Activities per guide (if needed separate)
  getActivities(guideId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.base}/guides/${guideId}/activites`, { withCredentials: true });
  }

  // Delete helper (for admin)
  delete(path: string): Observable<any> {
    return this.http.delete(`${this.base}${path}`, { withCredentials: true });
  }
}
