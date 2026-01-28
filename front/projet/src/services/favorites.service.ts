import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environnements/environment.dev';
import { Pollution } from '../shared/models/pollution';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  addFavorite(userId: number, pollutionId: number): Observable<any> {
    return this.http.post(this.apiUrl, { userId, pollutionId });
  }

  removeFavorite(userId: number, pollutionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${pollutionId}`);
  }

  getUserFavorites(userId: number): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(`${this.apiUrl}/${userId}`);
  }

  isFavorite(userId: number, pollutionId: number): Observable<{ isFavorite: boolean }> {
    return this.http.get<{ isFavorite: boolean }>(`${this.apiUrl}/${userId}/${pollutionId}`);
  }
}
