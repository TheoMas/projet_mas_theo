import { Component, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPollutions, DeletePollution, SelectPollution, LoadFavorites, AddFavorite, RemoveFavorite } from '../../shared/actions/pollution-actions';
import { PollutionState } from '../../shared/states/pollution-state';
import { AuthState } from '../../shared/states/auth-state';
import { Pollution } from '../../shared/models/pollution';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  searchTerm: string = '';
  private store = inject(Store);

  // Signaux pour observer l'état du store
  pollutions: Signal<Pollution[]> = this.store.selectSignal(PollutionState.pollutions);
  loading: Signal<boolean> = this.store.selectSignal(PollutionState.loading);
  error: Signal<string | null> = this.store.selectSignal(PollutionState.error);
  favoriteIds: Signal<number[]> = this.store.selectSignal(PollutionState.favoriteIds);
  currentUser = this.store.selectSignal(AuthState.currentUser);

  constructor(
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadPollutions();
    // Charger les favoris de l'utilisateur
    const user = this.currentUser();
    if (user) {
      this.store.dispatch(new LoadFavorites(user.id));
    }
  }

  loadPollutions() {
    // Dispatcher l'action pour charger les pollutions
    this.store.dispatch(new LoadPollutions());
  }

  viewDetails(Id: number) {
    // Sélectionner la pollution avant de naviguer
    const pollution = this.pollutions().find(p => p.id === Id);
    if (pollution) {
      this.store.dispatch(new SelectPollution(pollution));
    }
    // Navigate to details page with the pollution ID as parameter
    this.router.navigate(['/details', Id]);
  }

  createPollution() {
    // Désélectionner toute pollution avant de créer
    this.store.dispatch(new SelectPollution(null));
    // Navigate to the pollution form for creating a new pollution
    this.router.navigate(['/pollution-form']);
  }

  modifyPollution(Id: number) {
    // Sélectionner la pollution avant de naviguer
    const pollution = this.pollutions().find(p => p.id === Id);
    if (pollution) {
      this.store.dispatch(new SelectPollution(pollution));
    }
    // Navigate to the pollution form with the pollution ID
    this.router.navigate(['/pollution-form', Id]);
  }

  deletePollution(Id: number, titre: string) {
    // Confirm before deleting
    if (confirm(`Êtes-vous sûr de vouloir supprimer la pollution "${titre}" ?`)) {
      // Dispatcher l'action de suppression
      this.store.dispatch(new DeletePollution(Id)).subscribe({
        next: () => {
          console.log('Pollution supprimée avec succès');
          alert('Pollution supprimée avec succès');
        },
        error: () => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  getFilteredPollutions() {
    return this.pollutions().filter(pollution =>
      pollution.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isFavorite(pollutionId: number): boolean {
    return this.favoriteIds().includes(pollutionId);
  }

  toggleFavorite(pollutionId: number, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    const user = this.currentUser();
    if (!user) {
      alert('Vous devez être connecté pour ajouter des favoris');
      return;
    }

    if (this.isFavorite(pollutionId)) {
      this.store.dispatch(new RemoveFavorite(user.id, pollutionId));
    } else {
      this.store.dispatch(new AddFavorite(user.id, pollutionId));
    }
  }
}
