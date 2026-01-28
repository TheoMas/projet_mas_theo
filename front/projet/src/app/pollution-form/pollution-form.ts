import { Component, OnInit, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CreatePollution, UpdatePollution, GetPollutionById } from '../../shared/actions/pollution-actions';
import { PollutionState } from '../../shared/states/pollution-state';
import { Pollution, TypePollution } from '../../shared/models/pollution';

@Component({
  selector: 'app-pollution-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm implements OnInit {
  pollutionForm!: FormGroup;
  isEditMode: boolean = false;
  pollutionId: number | null = null;
  submitError: string = '';
  imagePreview: string | null = null;
  private store = inject(Store);

  // Types de pollution disponibles
  pollutionTypes: TypePollution[] = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  // Signaux pour observer l'état du store
  selectedPollution: Signal<Pollution | null> = this.store.selectSignal(PollutionState.selectedPollution);
  isLoading: Signal<boolean> = this.store.selectSignal(PollutionState.loading);
  error: Signal<string | null> = this.store.selectSignal(PollutionState.error);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialiser le formulaire réactif
    this.initializeForm();

    // Vérifier si on est en mode édition
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.pollutionId = Number(id);
        this.loadPollutionData(this.pollutionId);
      }
    });
  }

  initializeForm() {
    this.pollutionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      type_pollution: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date_observation: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
      latitude: [0, [Validators.required]],
      longitude: [0, [Validators.required]],
      photo_url: ['']
    });
  }

  loadPollutionData(id: number) {
    // Dispatcher l'action pour charger la pollution si elle n'est pas déjà dans le store
    if (!this.selectedPollution() || this.selectedPollution()?.id !== id) {
      this.store.dispatch(new GetPollutionById(id)).subscribe(() => {
        this.fillForm();
      });
    } else {
      this.fillForm();
    }
  }

  fillForm() {
    const pollution = this.selectedPollution();
    if (pollution) {
      // Remplir le formulaire avec les données existantes
      this.pollutionForm.patchValue({
        titre: pollution.titre,
        type_pollution: pollution.type_pollution,
        description: pollution.description,
        date_observation: pollution.date_observation,
        lieu: pollution.lieu,
        latitude: pollution.latitude,
        longitude: pollution.longitude,
        photo_url: pollution.photo_url || ''
      });
      // Afficher l'aperçu de l'image existante
      if (pollution.photo_url) {
        this.imagePreview = pollution.photo_url;
      }
    }
  }

  onSubmit() {
    if (this.pollutionForm.valid) {
      this.submitError = '';

      if (this.isEditMode && this.pollutionId) {
        // Mode édition - mettre à jour
        const pollutionData: Pollution = {
          id: this.pollutionId,
          ...this.pollutionForm.value
        };
        
        this.store.dispatch(new UpdatePollution(this.pollutionId, pollutionData)).subscribe({
          next: () => {
            if (!this.error()) {
              alert('Pollution modifiée avec succès!');
              this.router.navigate(['/accueil']);
            } else {
              this.submitError = this.error() || 'Erreur lors de la modification';
            }
          },
          error: () => {
            this.submitError = 'Erreur lors de la modification';
          }
        });
      } else {
        // Mode création - créer une nouvelle pollution (sans id)
        const pollutionData = this.pollutionForm.value;
        
        this.store.dispatch(new CreatePollution(pollutionData)).subscribe({
          next: () => {
            if (!this.error()) {
              alert('Pollution créée avec succès!');
              this.router.navigate(['/accueil']);
            } else {
              this.submitError = this.error() || 'Erreur lors de la création';
            }
          },
          error: () => {
            this.submitError = 'Erreur lors de la création';
          }
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.pollutionForm.controls).forEach(key => {
        this.pollutionForm.get(key)?.markAsTouched();
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Taille maximale: 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;
        this.pollutionForm.patchValue({ photo_url: base64String });
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.router.navigate(['/accueil']);
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get titre() { return this.pollutionForm.get('titre'); }
  get type_pollution() { return this.pollutionForm.get('type_pollution'); }
  get description() { return this.pollutionForm.get('description'); }
  get date_observation() { return this.pollutionForm.get('date_observation'); }
  get lieu() { return this.pollutionForm.get('lieu'); }
  get latitude() { return this.pollutionForm.get('latitude'); }
  get longitude() { return this.pollutionForm.get('longitude'); }
  get photo_url() { return this.pollutionForm.get('photo_url'); }
}
