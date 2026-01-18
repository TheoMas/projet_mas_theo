export class User {
    id: string;
    nom: string;
    prenom: string;
    login: string;
    pass: string;

    constructor(id: string, nom: string, prenom: string, login: string, pass: string) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.login = login;
        this.pass = pass;
    }
}
