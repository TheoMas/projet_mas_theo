import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthStateModel } from "../models/auth-state-model";
import {
    Login,
    LoginSuccess,
    LoginFailure,
    Logout,
    Register,
    RegisterSuccess,
    RegisterFailure,
    LoadAuthFromStorage,
    AuthConnexion
} from "../actions/auth-action";
import { AuthService } from "../../services/auth.service";
import { User } from "../models/user";

@State<AuthStateModel>({
    name: "authState",
    defaults: {
        isAuthenticated: false,
        currentUser: null,
        token: null,
        loading: false,
        error: null
    }
})

@Injectable()
export class AuthState {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';

    constructor(private authService: AuthService) {}

    @Selector()
    static isAuthenticated(state: AuthStateModel) {
        return state.isAuthenticated;
    }

    @Selector()
    static currentUser(state: AuthStateModel) {
        return state.currentUser;
    }

    @Selector()
    static token(state: AuthStateModel) {
        return state.token;
    }

    @Selector()
    static loading(state: AuthStateModel) {
        return state.loading;
    }

    @Selector()
    static error(state: AuthStateModel) {
        return state.error;
    }

    // Conserver pour compatibilité
    @Selector()
    static isConnected(state: AuthStateModel) {
        return state.isAuthenticated;
    }

    @Action(LoadAuthFromStorage)
    loadAuthFromStorage(ctx: StateContext<AuthStateModel>) {
        const storedUser = localStorage.getItem(this.USER_KEY);
        const storedToken = localStorage.getItem(this.TOKEN_KEY);

        if (storedUser) {
            const user: User = JSON.parse(storedUser);
            ctx.patchState({
                isAuthenticated: true,
                currentUser: user,
                token: storedToken
            });
        }
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, { email, password }: Login) {
        ctx.patchState({ loading: true, error: null });
        
        return this.authService.login(email, password).pipe(
            tap(response => {
                const user: User = {
                    id: response.id,
                    username: response.username,
                    email: response.email,
                    password: ''
                };
                ctx.dispatch(new LoginSuccess(user, response.refreshToken));
            }),
            catchError(error => {
                let errorMessage = 'Erreur lors de la connexion';
                if (error.status === 401) {
                    errorMessage = 'Mot de passe incorrect';
                } else if (error.status === 404) {
                    errorMessage = 'Utilisateur non trouvé';
                }
                ctx.dispatch(new LoginFailure(errorMessage));
                return of(null);
            })
        );
    }

    @Action(LoginSuccess)
    loginSuccess(ctx: StateContext<AuthStateModel>, { user, token }: LoginSuccess) {
        // Stocker dans localStorage
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        // Le token ici est le refreshToken, pas le JWT
        if (token) {
            localStorage.setItem('refresh_token', token);
        }

        ctx.patchState({
            isAuthenticated: true,
            currentUser: user,
            token: null, // Le JWT n'est plus stocké côté client
            loading: false,
            error: null
        });
    }

    @Action(LoginFailure)
    loginFailure(ctx: StateContext<AuthStateModel>, { error }: LoginFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        // Supprimer du localStorage
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);

        ctx.patchState({
            isAuthenticated: false,
            currentUser: null,
            token: null,
            loading: false,
            error: null
        });
    }

    @Action(Register)
    register(ctx: StateContext<AuthStateModel>, { user }: Register) {
        ctx.patchState({ loading: true, error: null });
        
        return this.authService.register(user).pipe(
            tap(createdUser => {
                ctx.dispatch(new RegisterSuccess(createdUser));
            }),
            catchError(error => {
                ctx.dispatch(new RegisterFailure(error.message || 'Erreur lors de l\'inscription'));
                return of(null);
            })
        );
    }

    @Action(RegisterSuccess)
    registerSuccess(ctx: StateContext<AuthStateModel>, { user }: RegisterSuccess) {
        ctx.patchState({
            loading: false,
            error: null
        });
        // Après l'inscription, on peut automatiquement connecter l'utilisateur
        // ou simplement renvoyer vers la page de login
    }

    @Action(RegisterFailure)
    registerFailure(ctx: StateContext<AuthStateModel>, { error }: RegisterFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    // Conserver pour compatibilité
    @Action(AuthConnexion)
    toggleConnexion(
        { patchState }: StateContext<AuthStateModel>,
        { payload }: AuthConnexion
    ) {
        patchState({
            isAuthenticated: payload.connexion
        });
    }
}