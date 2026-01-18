# Système d'authentification Frontend

## Vue d'ensemble

Le système d'authentification permet aux utilisateurs de se connecter avec un identifiant (login) et un mot de passe (pass) pour accéder aux fonctionnalités de l'application.

## Architecture

### 1. AuthService (`src/services/auth.service.ts`)

Service principal qui gère l'état d'authentification de l'utilisateur.

**Fonctionnalités principales :**
- ✅ `login(login, pass)` : Authentifie l'utilisateur via l'API
- ✅ `logout()` : Déconnecte l'utilisateur et nettoie le localStorage
- ✅ `isLoggedIn()` : Vérifie si un utilisateur est connecté
- ✅ `getToken()` : Récupère le token d'authentification
- ✅ `register(user)` : Inscrit un nouvel utilisateur
- ✅ `checkLoginAvailability(login)` : Vérifie si un identifiant est disponible

**État réactif :**
```typescript
// BehaviorSubject pour suivre l'utilisateur courant
private currentUserSubject: BehaviorSubject<User | null>
public currentUser$: Observable<User | null>
```

**Stockage :**
- `localStorage.setItem('auth_token', token)` : Token JWT
- `localStorage.setItem('current_user', JSON.stringify(user))` : Données utilisateur

### 2. Login Component (`src/app/login/`)

Composant de connexion avec formulaire réactif.

**Structure :**
- `login.ts` : Logique du composant
- `login.html` : Template avec formulaire
- `login.css` : Styles (design moderne avec gradient violet)

**Fonctionnalités :**
- Formulaire réactif avec validation (login ≥ 3 caractères, password ≥ 6 caractères)
- Affichage des erreurs de validation
- Gestion des erreurs d'authentification (401, 404, 500)
- Redirection automatique vers `/accueil` après connexion réussie
- Redirection si déjà connecté

**Code clé :**
```typescript
onSubmit() {
  if (this.loginForm.valid) {
    this.authService.login(login, pass).subscribe({
      next: (response) => this.router.navigate(['/accueil']),
      error: (error) => this.errorMessage = 'Erreur...'
    });
  }
}
```

### 3. Auth Guard (`src/app/guards/auth.guard.ts`)

Guard fonctionnel qui protège les routes nécessitant une authentification.

**Fonctionnement :**
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;  // Accès autorisé
  }

  // Rediriger vers /login avec l'URL de retour
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
```

### 4. Routes protégées (`src/app/app.routes.ts`)

Configuration des routes avec protection par guard :

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'login', component: Login },  // Non protégée
  { path: 'accueil', component: Accueil, canActivate: [authGuard] },
  { path: 'details/:id', component: Details, canActivate: [authGuard] },
  { path: 'pollution-form', component: PollutionForm, canActivate: [authGuard] },
  { path: 'pollution-form/:id', component: PollutionForm, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
```

### 5. Navigation Header (`src/app/app.ts` et `app.html`)

Header affiché uniquement quand l'utilisateur est connecté.

**Fonctionnalités :**
- Affichage du nom de l'utilisateur connecté
- Menu de navigation (Accueil, Signaler une pollution)
- Bouton de déconnexion
- Responsive design

**Code clé :**
```typescript
export class App {
  currentUser: User | null = null;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
```

## Flow d'authentification

### Connexion
1. Utilisateur accède à `/login`
2. Saisit identifiant et mot de passe
3. Soumission du formulaire → `authService.login()`
4. API POST `/api/users/auth/login`
5. Réception du token et des données utilisateur
6. Stockage dans localStorage
7. Mise à jour du BehaviorSubject
8. Redirection vers `/accueil`

### Navigation
1. Utilisateur tente d'accéder à une route protégée
2. `authGuard` vérifie `authService.isLoggedIn()`
3. Si connecté → accès autorisé
4. Si non connecté → redirection vers `/login`

### Déconnexion
1. Utilisateur clique sur "Déconnexion"
2. `authService.logout()`
3. Suppression du token et des données du localStorage
4. Mise à jour du BehaviorSubject (null)
5. Redirection vers `/login`

### Session persistante
- Au démarrage de l'app, `AuthService` vérifie le localStorage
- Si token et user trouvés → restauration de la session
- Le user reste connecté même après rafraîchissement de la page

## API Backend

### Endpoint d'authentification

**POST** `/api/users/auth/login`

**Body :**
```json
{
  "login": "john_doe",
  "pass": "password123"
}
```

**Réponse (200) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nom": "Doe",
    "prenom": "John",
    "login": "john_doe"
  }
}
```

**Erreurs :**
- `404` : Utilisateur non trouvé
- `401` : Mot de passe incorrect
- `500` : Erreur serveur

## Sécurité

### Bonnes pratiques implémentées
- ✅ Validation côté client (longueur min des champs)
- ✅ Validation côté serveur (voir `utilisateur.controllers.js`)
- ✅ Token stocké dans localStorage (devrait être httpOnly cookie en production)
- ✅ Mot de passe envoyé via HTTPS (en production)
- ✅ Guard pour protéger les routes
- ✅ Vérification de l'état de connexion à chaque navigation

### Améliorations possibles
- 🔒 Hasher les mots de passe côté backend (bcrypt)
- 🔒 Utiliser httpOnly cookies au lieu de localStorage
- 🔒 Implémenter refresh tokens
- 🔒 Ajouter un système d'expiration de session
- 🔒 Implémenter CSRF protection
- 🔒 Rate limiting sur les tentatives de connexion

## Tests

### Test manuel du flow
1. **Accès non authentifié** : Aller sur `http://localhost:4200/` → doit rediriger vers `/login`
2. **Connexion** : Entrer identifiant et mot de passe valides → doit rediriger vers `/accueil`
3. **Navigation** : Header visible avec nom utilisateur, menu fonctionnel
4. **Déconnexion** : Cliquer sur "Déconnexion" → retour au login, header disparaît
5. **Session persistante** : Rafraîchir la page après connexion → reste connecté
6. **Route protégée** : Après déconnexion, tenter d'accéder à `/accueil` → redirection vers login

### Credentials de test
Pour tester, créez d'abord un utilisateur via l'API :

```bash
POST http://localhost:3000/api/users
{
  "nom": "Test",
  "prenom": "User",
  "login": "testuser",
  "pass": "password123"
}
```

Puis connectez-vous avec :
- **Login** : `testuser`
- **Password** : `password123`

## Fichiers créés/modifiés

### Nouveaux fichiers
- ✅ `src/services/auth.service.ts` (95 lignes)
- ✅ `src/app/login/login.ts` (71 lignes)
- ✅ `src/app/login/login.html` (70 lignes)
- ✅ `src/app/login/login.css` (135 lignes)
- ✅ `src/app/guards/auth.guard.ts` (24 lignes)

### Fichiers modifiés
- ✅ `src/app/app.ts` (ajout logique d'authentification)
- ✅ `src/app/app.html` (ajout header de navigation)
- ✅ `src/app/app.css` (styles du header)
- ✅ `src/app/app.routes.ts` (protection des routes + route login)

## Commandes utiles

```bash
# Lancer l'application
cd front/tp4
npm start

# Accéder à l'app
http://localhost:4200

# Vérifier les erreurs
npm run build
```

## Support

En cas de problème :
1. Vérifier que le backend est démarré
2. Vérifier la console du navigateur (F12)
3. Vérifier l'onglet Network pour les appels API
4. Vérifier le localStorage (`Application > Local Storage`)
5. Vérifier les logs du serveur Express
