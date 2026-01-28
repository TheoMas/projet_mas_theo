import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { Details } from './details/details';
import { PollutionForm } from './pollution-form/pollution-form';
import { Login } from './login/login';
import { Register } from './register/register';
import { Favorites } from './favorites/favorites';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'accueil', component: Accueil, canActivate: [authGuard] },
    { path: 'favorites', component: Favorites, canActivate: [authGuard] },
    { path: 'details/:id', component: Details, canActivate: [authGuard] },
    { path: 'pollution-form', component: PollutionForm, canActivate: [authGuard] },
    { path: 'pollution-form/:id', component: PollutionForm, canActivate: [authGuard] },
    { path: '**', redirectTo: '/login' }  // Rediriger les routes inconnues vers login
];