import { Component, inject, Signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { LoadAuthFromStorage, Logout } from '../shared/actions/auth-action';
import { AuthState } from '../shared/states/auth-state';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'Gestion des Pollutions';
  private store = inject(Store);

  // Signaux pour observer l'état du store
  isLoggedIn: Signal<boolean> = this.store.selectSignal(AuthState.isAuthenticated);
  currentUser: Signal<User | null> = this.store.selectSignal(AuthState.currentUser);

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // Charger l'état d'authentification depuis le localStorage au démarrage
    this.store.dispatch(new LoadAuthFromStorage());
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }
}
