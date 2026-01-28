import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../shared/states/auth-state';

/**
 * Guard d'authentification pour protéger les routes
 * Vérifie si l'utilisateur est connecté avant d'accéder à une route
 * Si non connecté, redirige vers la page de connexion
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Vérifier si l'utilisateur est connecté via le store
  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);
  
  if (isAuthenticated) {
    return true;
  }

  // Si non connecté, rediriger vers la page de connexion
  // On passe l'URL demandée en paramètre pour y revenir après connexion
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  
  return false;
};
