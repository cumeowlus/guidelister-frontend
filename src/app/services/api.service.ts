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
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.base}/auth/login`, { email, password }, { withCredentials: true });
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

  // Users
  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/auth/me`, { withCredentials: true });
  }

  // - Guides for current user
  getGuides(userId: number): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${this.base}/guides/user/${userId}`, { withCredentials: true });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  deleteUser(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  // Guides
  getGuide(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.base}/guides/${id}`, { withCredentials: true });
  }

  getAllGuides(): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${this.base}/guides`, { withCredentials: true });
  }

  getActivities(guideId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.base}/guides/${guideId}/activites`, { withCredentials: true });
  }

  createGuide(g: Guide): Observable<any> {
    return this.http.post<any>(`${this.base}/guides/new`, g);
  }

  updateGuide(id: number | string, payload: Partial<Guide>): Observable<Guide> {
    return this.http.put<Guide>(`${this.base}/guides/${id}`, payload);
  }

  deleteGuide(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.base}/guides/${id}`);
  }

  addActivityToGuide(guideId: number | string, activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.base}/guides/${guideId}/activities`, activity);
  }

  deleteActivityFromGuide(guideId: number | string, activityId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.base}/guides/${guideId}/activities/${activityId}`);
  }

  // Guides and users

  addUserToGuide(guideId: number | string, userId: number | string): Observable<Guide> {
    return this.http.post<Guide>(`${this.base}/guides/${guideId}/users/${userId}`, {});
  }
  getGuideUsers(guideId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/guides/${guideId}/users`);
  }
  deleteUserFromGuide(guideId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/guides/${guideId}/users/${userId}`);
  }

}

