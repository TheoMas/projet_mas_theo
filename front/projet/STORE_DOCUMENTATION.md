# Architecture du Store NGXS

Ce projet utilise **NGXS** pour la gestion centralisée de l'état de l'application Angular.

## 📋 Vue d'ensemble

Le store NGXS gère trois domaines principaux :
1. **Authentification** (`AuthState`)
2. **Utilisateurs** (`UserState`)
3. **Pollutions** (`PollutionState`)

## 🏗️ Structure du Store

```
src/shared/
├── actions/
│   ├── auth-action.ts          # Actions d'authentification
│   ├── user-actions.ts         # Actions utilisateurs (CRUD)
│   └── pollution-actions.ts    # Actions pollutions (CRUD)
├── models/
│   ├── auth-state-model.ts     # Modèle d'état d'authentification
│   ├── user-state-model.ts     # Modèle d'état utilisateurs
│   └── pollution-state-model.ts # Modèle d'état pollutions
└── states/
    ├── auth-state.ts           # State d'authentification
    ├── user-state.ts           # State utilisateurs
    └── pollution-state.ts      # State pollutions
```

## 🔐 AuthState - Gestion de l'authentification

### Modèle d'état
```typescript
interface AuthStateModel {
    isAuthenticated: boolean;
    currentUser: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
```

### Actions disponibles
- `Login` - Connecter un utilisateur
- `LoginSuccess` - Connexion réussie
- `LoginFailure` - Échec de connexion
- `Logout` - Déconnecter l'utilisateur
- `Register` - Inscrire un nouvel utilisateur
- `RegisterSuccess` - Inscription réussie
- `RegisterFailure` - Échec d'inscription
- `LoadAuthFromStorage` - Charger l'état depuis localStorage

### Sélecteurs
- `isAuthenticated` - Vérifie si l'utilisateur est connecté
- `currentUser` - Récupère l'utilisateur actuel
- `token` - Récupère le token JWT
- `loading` - État de chargement
- `error` - Message d'erreur éventuel

### Exemple d'utilisation
```typescript
import { Store } from '@ngxs/store';
import { Login, Logout } from '../shared/actions/auth-action';
import { AuthState } from '../shared/states/auth-state';

// Dans le composant
private store = inject(Store);

// Signaux réactifs
isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
currentUser = this.store.selectSignal(AuthState.currentUser);

// Connexion
login(username: string, password: string) {
  this.store.dispatch(new Login(username, password));
}

// Déconnexion
logout() {
  this.store.dispatch(new Logout());
}
```

## 👥 UserState - Gestion des utilisateurs

### Modèle d'état
```typescript
interface UserStateModel {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
}
```

### Actions disponibles
- `LoadUsers` - Charger tous les utilisateurs
- `GetUserById` - Récupérer un utilisateur par ID
- `CreateUser` - Créer un nouvel utilisateur
- `UpdateUser` - Mettre à jour un utilisateur
- `DeleteUser` - Supprimer un utilisateur
- `SelectUser` - Sélectionner un utilisateur

### Sélecteurs
- `users` - Liste de tous les utilisateurs
- `selectedUser` - Utilisateur sélectionné
- `loading` - État de chargement
- `error` - Message d'erreur

### Exemple d'utilisation
```typescript
import { LoadUsers, CreateUser } from '../shared/actions/user-actions';
import { UserState } from '../shared/states/user-state';

// Signaux réactifs
users = this.store.selectSignal(UserState.users);
loading = this.store.selectSignal(UserState.loading);

// Charger les utilisateurs
ngOnInit() {
  this.store.dispatch(new LoadUsers());
}

// Créer un utilisateur
createUser(user: Omit<User, 'id'>) {
  this.store.dispatch(new CreateUser(user));
}
```

## 🌍 PollutionState - Gestion des pollutions

### Modèle d'état
```typescript
interface PollutionStateModel {
    pollutions: Pollution[];
    selectedPollution: Pollution | null;
    loading: boolean;
    error: string | null;
}
```

### Actions disponibles
- `LoadPollutions` - Charger toutes les pollutions
- `GetPollutionById` - Récupérer une pollution par ID
- `CreatePollution` - Créer une nouvelle pollution
- `UpdatePollution` - Mettre à jour une pollution
- `DeletePollution` - Supprimer une pollution
- `SelectPollution` - Sélectionner une pollution

### Sélecteurs
- `pollutions` - Liste de toutes les pollutions
- `selectedPollution` - Pollution sélectionnée
- `loading` - État de chargement
- `error` - Message d'erreur

### Exemple d'utilisation
```typescript
import { LoadPollutions, CreatePollution, DeletePollution } from '../shared/actions/pollution-actions';
import { PollutionState } from '../shared/states/pollution-state';

// Signaux réactifs
pollutions = this.store.selectSignal(PollutionState.pollutions);
selectedPollution = this.store.selectSignal(PollutionState.selectedPollution);

// Charger les pollutions
ngOnInit() {
  this.store.dispatch(new LoadPollutions());
}

// Créer une pollution
createPollution(pollution: Omit<Pollution, 'id'>) {
  this.store.dispatch(new CreatePollution(pollution));
}

// Supprimer une pollution
deletePollution(id: number) {
  this.store.dispatch(new DeletePollution(id)).subscribe({
    next: () => console.log('Pollution supprimée'),
    error: (err) => console.error('Erreur', err)
  });
}
```

## 🔄 Pattern d'utilisation des Signals

Tous les composants utilisent des **Signals** Angular pour observer l'état du store de manière réactive :

```typescript
import { Component, inject, Signal } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({...})
export class MyComponent {
  private store = inject(Store);
  
  // Créer des signals depuis le store
  data = this.store.selectSignal(MyState.data);
  loading = this.store.selectSignal(MyState.loading);
  
  // Utiliser dans le template
  // <div *ngIf="loading()">Chargement...</div>
  // <div>{{ data()?.name }}</div>
}
```

## 📦 Configuration

Le store est configuré dans `app.config.ts` :

```typescript
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../shared/states/auth-state';
import { UserState } from '../shared/states/user-state';
import { PollutionState } from '../shared/states/pollution-state';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    importProvidersFrom(NgxsModule.forRoot([
      AuthState,
      UserState,
      PollutionState
    ]))
  ]
};
```

## 🔒 Guards

Le guard d'authentification utilise le store :

```typescript
import { Store } from '@ngxs/store';
import { AuthState } from '../../shared/states/auth-state';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);
  
  if (isAuthenticated) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

## 💾 Persistance des données

L'état d'authentification est automatiquement persisté dans le `localStorage` :
- Token JWT dans `auth_token`
- Utilisateur actuel dans `current_user`

Au démarrage de l'application, l'état est rechargé via l'action `LoadAuthFromStorage`.

## 🎯 Composants migrés

Tous les composants ont été migrés pour utiliser le store :
- ✅ `Login` - Utilise `AuthState`
- ✅ `Register` - Utilise `AuthState`
- ✅ `Accueil` - Utilise `PollutionState`
- ✅ `Details` - Utilise `PollutionState`
- ✅ `PollutionForm` - Utilise `PollutionState`
- ✅ `App` (Header) - Utilise `AuthState`
- ✅ `authGuard` - Utilise `AuthState`

## 🚀 Avantages de cette architecture

1. **État centralisé** - Une seule source de vérité
2. **Réactivité** - Utilisation de Signals pour des mises à jour automatiques
3. **Prévisibilité** - Les actions documentent clairement les intentions
4. **Testabilité** - Facilite les tests unitaires
5. **Séparation des préoccupations** - UI séparée de la logique métier
6. **DevTools** - Support des outils de développement NGXS
7. **Type-safe** - Typage fort avec TypeScript

## 📚 Ressources

- [Documentation NGXS](https://www.ngxs.io/)
- [Angular Signals](https://angular.dev/guide/signals)
