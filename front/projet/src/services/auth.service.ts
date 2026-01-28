import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../environnements/environment.prod";
import { User } from "../shared/models/user";

interface LoginResponse {
    id: number;
    username: string;
    email: string;
    refreshToken?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}${environment.usersEndpoint}`;
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'current_user';
    
    // Observable pour suivre l'état de connexion
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;
    
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        // Charger l'utilisateur depuis le localStorage au démarrage
        const storedUser = localStorage.getItem(this.USER_KEY);
        const user = storedUser ? JSON.parse(storedUser) : null;
        this.currentUserSubject = new BehaviorSubject<User | null>(user);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    // Getter pour obtenir l'utilisateur actuel
    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    // Connexion
    login(email: string, password: string): Observable<LoginResponse> {
        const credentials = { email, password };
        const url = `${this.apiUrl}/auth/login`;
        return this.http.post<LoginResponse>(url, credentials, { ...this.httpOptions, withCredentials: true }).pipe(
            tap(response => {
                    // Stocker accessToken et refreshToken côté client
                    if ((response as any).accessToken) {
                        localStorage.setItem('access_token', (response as any).accessToken);
                    }
                    if (response.refreshToken) {
                        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
                    }
                const user: User = {
                    id: response.id,
                    username: response.username,
                    email: response.email,
                    password: '' // Ne pas stocker le mot de passe
                };
                localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    // Déconnexion
    logout(): void {
        // Appeler l'API pour supprimer le refresh token côté serveur
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }, { ...this.httpOptions, withCredentials: true }).subscribe();
        }
        // Supprimer les données du localStorage
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        // Mettre à jour le BehaviorSubject
        this.currentUserSubject.next(null);
    }

    // Vérifier si l'utilisateur est connecté
    isLoggedIn(): boolean {
        return this.currentUserValue !== null;
    }

    // Obtenir le refresh token
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    // Rafraîchir le JWT via le refresh token
    refreshAccessToken(): Observable<any> {
        const url = `${this.apiUrl}/auth/refresh`;
        const refreshToken = this.getRefreshToken();
        return this.http.post(url, { refreshToken }, { ...this.httpOptions }).pipe(
            tap((res: any) => {
                if (res?.accessToken) {
                    localStorage.setItem('access_token', res.accessToken);
                }
                if (res?.refreshToken) {
                    localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
                }
            })
        );
    }

    // Inscription (optionnel)
    register(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user, this.httpOptions);
    }

    // Vérifier si un username est disponible
    checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
        const url = `${this.apiUrl}/check/username/${username}`;
        return this.http.get<{ available: boolean }>(url);
    }
}
