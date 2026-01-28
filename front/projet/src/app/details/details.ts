import { Component, OnInit, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { GetPollutionById, SelectPollution } from '../../shared/actions/pollution-actions';
import { PollutionState } from '../../shared/states/pollution-state';
import { Pollution } from '../../shared/models/pollution';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  pollutionId: number = 0;
  private store = inject(Store);

  // Signaux pour observer l'état du store
  pollution: Signal<Pollution | null> = this.store.selectSignal(PollutionState.selectedPollution);
  isLoading: Signal<boolean> = this.store.selectSignal(PollutionState.loading);
  error: Signal<string | null> = this.store.selectSignal(PollutionState.error);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Method 2: Using observable (for dynamic parameters - recommended)
    // This will update if the parameter changes while staying on the same component
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.pollutionId = id ? Number(id) : 0;
      if (this.pollutionId) {
        this.loadPollutionDetails();
      }
    });
  }

  loadPollutionDetails() {
    // Dispatcher l'action pour charger les détails de la pollution
    this.store.dispatch(new GetPollutionById(this.pollutionId));
  }

  goBack() {
    this.router.navigate(['/accueil']);
  }

  editPollution() {
    if (this.pollutionId && this.pollution()) {
      // S'assurer que la pollution est sélectionnée dans le store
      this.store.dispatch(new SelectPollution(this.pollution()));
      this.router.navigate(['/pollution-form', this.pollutionId]);
    }
  }
}
