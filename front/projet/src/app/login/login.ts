import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login as LoginAction } from '../../shared/actions/auth-action';
import { AuthState } from '../../shared/states/auth-state';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  private store = inject(Store);
  
  // Signaux pour observer l'état du store
  isLoading: Signal<boolean> = this.store.selectSignal(AuthState.loading);
  errorMessage: Signal<string | null> = this.store.selectSignal(AuthState.error);
  isAuthenticated: Signal<boolean> = this.store.selectSignal(AuthState.isAuthenticated);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    // Si déjà connecté, rediriger vers l'accueil
    if (this.isAuthenticated()) {
      this.router.navigate(['/accueil']);
      return;
    }

    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Dispatcher l'action de login
      this.store.dispatch(new LoginAction(email, password)).subscribe({
        next: () => {
          // Vérifier si la connexion a réussi
          if (this.isAuthenticated()) {
            console.log('Connexion réussie');
            this.router.navigate(['/accueil']);
          }
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
