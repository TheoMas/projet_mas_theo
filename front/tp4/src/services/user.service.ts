import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environnements/environment.prod";
import { User } from "../models/user";


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = `${environment.apiUrl}${environment.usersEndpoint}`;
    
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {}

    // CREATE - Créer un nouvel utilisateur (inscription)
    createUser(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user, this.httpOptions);
    }

    // READ - Récupérer tous les utilisateurs
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // READ - Récupérer un utilisateur par id
    getUserById(id: string): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<User>(url);
    }

    // READ - Récupérer un utilisateur par login
    getUserByLogin(login: string): Observable<User> {
        const url = `${this.apiUrl}/login/${login}`;
        return this.http.get<User>(url);
    }

    // UPDATE - Mettre à jour un utilisateur existant (PUT complet)
    updateUser(id: string, user: User): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<User>(url, user, this.httpOptions);
    }

    // UPDATE - Mise à jour partielle (PATCH)
    patchUser(id: string, partialUser: Partial<User>): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.patch<User>(url, partialUser, this.httpOptions);
    }

    // DELETE - Supprimer un utilisateur
    deleteUser(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }

    // AUTHENTIFICATION - Connexion
    authenticate(credentials: { login: string; pass: string }): Observable<{ user: User; token?: string }> {
        const url = `${this.apiUrl}/auth/login`;
        return this.http.post<{ user: User; token?: string }>(url, credentials, this.httpOptions);
    }

    // AUTHENTIFICATION - Déconnexion
    logout(): Observable<void> {
        const url = `${this.apiUrl}/auth/logout`;
        return this.http.post<void>(url, {}, this.httpOptions);
    }

    // VÉRIFICATION - Vérifier si un login existe déjà
    checkLoginAvailability(login: string): Observable<{ available: boolean }> {
        const url = `${this.apiUrl}/check/login/${login}`;
        return this.http.get<{ available: boolean }>(url);
    }

    // RECHERCHE - Rechercher des utilisateurs par critères
    searchUsers(params: {
        nom?: string;
        prenom?: string;
    }): Observable<User[]> {
        const url = `${this.apiUrl}/search`;
        return this.http.get<User[]>(url, { params: params as any });
    }
}
