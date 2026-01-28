import { User } from "../models/user";

export class Login {
    static readonly type = '[Auth] Login';
    constructor(public email: string, public password: string) {}
}

export class LoginSuccess {
    static readonly type = '[Auth] Login Success';
    constructor(public user: User, public token?: string) {}
}

export class LoginFailure {
    static readonly type = '[Auth] Login Failure';
    constructor(public error: string) {}
}

export class Logout {
    static readonly type = '[Auth] Logout';
}

export class Register {
    static readonly type = '[Auth] Register';
    constructor(public user: Omit<User, 'id'>) {}
}

export class RegisterSuccess {
    static readonly type = '[Auth] Register Success';
    constructor(public user: User) {}
}

export class RegisterFailure {
    static readonly type = '[Auth] Register Failure';
    constructor(public error: string) {}
}

export class LoadAuthFromStorage {
    static readonly type = '[Auth] Load Auth From Storage';
}

// Conserver pour compatibilité si nécessaire
export class AuthConnexion {
    static readonly type = '[Auth] ToggleConnexion';
    constructor(public payload: { connexion: boolean }) {}
}