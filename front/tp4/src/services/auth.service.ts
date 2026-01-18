import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../environnements/environment.prod";
import { User } from "../models/user";

interface LoginResponse {
    id: string;
    nom: string;
    prenom: string;
    login: string;
    token?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}${environment.usersEndpoint}`;
    private readonly TOKEN_KEY = 'auth_token';
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
    login(login: string, pass: string): Observable<LoginResponse> {
        const credentials = { login, pass };
        const url = `${this.apiUrl}/auth/login`;
        
        return this.http.post<LoginResponse>(url, credentials, this.httpOptions).pipe(
            tap(response => {
                // Stocker le token et l'utilisateur
                if (response.token) {
                    localStorage.setItem(this.TOKEN_KEY, response.token);
                }
                
                const user: User = {
                    id: response.id,
                    nom: response.nom,
                    prenom: response.prenom,
                    login: response.login,
                    pass: '' // Ne pas stocker le mot de passe
                };
                
                localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    // Déconnexion
    logout(): void {
        // Supprimer les données du localStorage
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        
        // Mettre à jour le BehaviorSubject
        this.currentUserSubject.next(null);
    }

    // Vérifier si l'utilisateur est connecté
    isLoggedIn(): boolean {
        return this.currentUserValue !== null;
    }

    // Obtenir le token d'authentification
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Inscription (optionnel)
    register(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user, this.httpOptions);
    }

    // Vérifier si un login est disponible
    checkLoginAvailability(login: string): Observable<{ available: boolean }> {
        const url = `${this.apiUrl}/check/login/${login}`;
        return this.http.get<{ available: boolean }>(url);
    }
}
