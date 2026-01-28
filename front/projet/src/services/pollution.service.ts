import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environnements/environment.prod";
import { Pollution } from "../shared/models/pollution";


@Injectable({
    providedIn: 'root'
})
export class PollutionService {
    private readonly apiUrl = `${environment.apiUrl}${environment.pollutionsEndpoint}`;
    
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {}

    // CREATE - Créer une nouvelle pollution
    createPollution(pollution: Omit<Pollution, 'id'>): Observable<Pollution> {
        return this.http.post<Pollution>(this.apiUrl, pollution, this.httpOptions);
    }

    // READ - Récupérer toutes les pollutions
    getPollutions(): Observable<Pollution[]> {
        return this.http.get<Pollution[]>(this.apiUrl, { ...this.httpOptions });
    }

    // READ - Récupérer une pollution par id
    getPollutionById(id: number): Observable<Pollution> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Pollution>(url, { ...this.httpOptions });
    }

    // UPDATE - Mettre à jour une pollution existante (PUT complet)
    updatePollution(id: number, pollution: Pollution): Observable<Pollution> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Pollution>(url, pollution, this.httpOptions);
    }

    // UPDATE - Mise à jour partielle (PATCH)
    patchPollution(id: number, partialPollution: Partial<Pollution>): Observable<Pollution> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.patch<Pollution>(url, partialPollution, this.httpOptions);
    }

    // DELETE - Supprimer une pollution
    deletePollution(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url, { ...this.httpOptions });
    }

    // RECHERCHE - Rechercher des pollutions par critères
    searchPollutions(params: {
        nom?: string;
        lieu?: string;
        typePollution?: string;
        dateDebut?: string;
        dateFin?: string;
    }): Observable<Pollution[]> {
        const url = `${this.apiUrl}/search`;
        return this.http.get<Pollution[]>(url, { params: params as any, ...this.httpOptions });
    }
}
