export type TypePollution = 'Plastique' | 'Chimique' | 'Dépôt sauvage' | 'Eau' | 'Air' | 'Autre';

export class Pollution {
    id: number;
    titre: string;
    type_pollution: TypePollution;
    description: string;
    date_observation: string;
    lieu: string;
    latitude: number;
    longitude: number;
    photo_url?: string;
    created_at?: string;
    updated_at?: string;

    constructor(
        id: number, 
        titre: string, 
        type_pollution: TypePollution, 
        description: string, 
        date_observation: string, 
        lieu: string, 
        latitude: number, 
        longitude: number, 
        photo_url?: string,
        created_at?: string,
        updated_at?: string
    ) {
        this.id = id;
        this.titre = titre;
        this.type_pollution = type_pollution;
        this.description = description;
        this.date_observation = date_observation;
        this.lieu = lieu;
        this.latitude = latitude;
        this.longitude = longitude;
        this.photo_url = photo_url;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}