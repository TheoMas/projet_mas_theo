import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthRefreshInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Attach access token from localStorage if present
    const storedAccess = localStorage.getItem('access_token');
    // Attach access token from localStorage if present (no debug logging)
    // Ensure cookies are sent for cross-site requests
    const baseReq = req.clone({ withCredentials: true });
    const authReq = storedAccess ? baseReq.clone({ setHeaders: { Authorization: `Bearer ${storedAccess}` } }) : baseReq;
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.getRefreshToken()) {
          // Tenter de rafraîchir le token
          return this.authService.refreshAccessToken().pipe(
            switchMap((refreshResponse: any) => {
              const newAccessToken = refreshResponse?.accessToken ?? refreshResponse?.token;
              const newRefreshToken = refreshResponse?.refreshToken;
              if (newRefreshToken) {
                localStorage.setItem('refresh_token', newRefreshToken);
              }
              if (newAccessToken) {
                // Rejouer la requête originale avec le nouveau token dans l'en-tête Authorization
                const replay = req.clone({ setHeaders: { Authorization: `Bearer ${newAccessToken}` }, withCredentials: true });
                return next.handle(replay);
              } else {
                this.authService.logout();
                return throwError(() => error);
              }
            }),
            catchError(refreshError => {
              this.authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
