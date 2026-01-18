export class Pollution {
    id: number;
    titre: string;
    lieu: string;
    date_observation: string;
    type_pollution: string;
    description: string;
    latitude: string;
    longitude: string;
    photo_url: string;

    constructor(id: number, titre: string, lieu: string, date_observation: string, type_pollution: string, description: string, latitude: string, longitude: string, photo_url: string) {
        this.id = id;
        this.titre = titre;
        this.lieu = lieu;
        this.date_observation = date_observation;
        this.type_pollution = type_pollution;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.photo_url = photo_url;
    }
}