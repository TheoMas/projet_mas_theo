import { Component, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPollutions, LoadFavorites, RemoveFavorite, SelectPollution } from '../../shared/actions/pollution-actions';
import { PollutionState } from '../../shared/states/pollution-state';
import { AuthState } from '../../shared/states/auth-state';
import { Pollution } from '../../shared/models/pollution';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private store = inject(Store);

  // Signaux pour observer l'état du store
  pollutions: Signal<Pollution[]> = this.store.selectSignal(PollutionState.pollutions);
  favoriteIds: Signal<number[]> = this.store.selectSignal(PollutionState.favoriteIds);
  loading: Signal<boolean> = this.store.selectSignal(PollutionState.loading);
  currentUser = this.store.selectSignal(AuthState.currentUser);

  // Computed signal pour obtenir uniquement les pollutions favorites
  favoritePollutions = computed(() => {
    const allPollutions = this.pollutions();
    const favorites = this.favoriteIds();
    return allPollutions.filter(p => favorites.includes(p.id));
  });

  constructor(public router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.dispatch(new LoadPollutions());
    const user = this.currentUser();
    if (user) {
      this.store.dispatch(new LoadFavorites(user.id));
    }
  }

  viewDetails(id: number) {
    const pollution = this.pollutions().find(p => p.id === id);
    if (pollution) {
      this.store.dispatch(new SelectPollution(pollution));
    }
    this.router.navigate(['/details', id]);
  }

  removeFavorite(pollutionId: number) {
    const user = this.currentUser();
    if (user) {
      this.store.dispatch(new RemoveFavorite(user.id, pollutionId));
    }
  }
}
