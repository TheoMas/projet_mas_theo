import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Register as RegisterAction } from '../../shared/actions/auth-action';
import { AuthState } from '../../shared/states/auth-state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;
  successMessage: string = '';
  private store = inject(Store);

  // Signaux pour observer l'état du store
  isLoading: Signal<boolean> = this.store.selectSignal(AuthState.loading);
  errorMessage: Signal<string | null> = this.store.selectSignal(AuthState.error);
  isAuthenticated: Signal<boolean> = this.store.selectSignal(AuthState.isAuthenticated);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si déjà connecté, rediriger vers l'accueil
    if (this.isAuthenticated()) {
      this.router.navigate(['/accueil']);
      return;
    }

    // Initialiser le formulaire
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Vérifier la disponibilité du username en temps réel
  async checkUsernameAvailability() {
    const usernameControl = this.registerForm.get('username');
    if (usernameControl?.valid && usernameControl.value.length >= 3) {
      this.authService.checkUsernameAvailability(usernameControl.value).subscribe({
        next: (response) => {
          if (!response.available) {
            usernameControl.setErrors({ usernameTaken: true });
          }
        }
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.successMessage = '';

      const { username, email, password } = this.registerForm.value;
      
      const newUser = {
        username: username as string,
        email: email as string,
        password: password as string
      };

      // Dispatcher l'action d'inscription
      this.store.dispatch(new RegisterAction(newUser)).subscribe({
        next: () => {
          // Vérifier si l'inscription a réussi (pas d'erreur)
          if (!this.errorMessage()) {
            console.log('Inscription réussie');
            this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...';
            
            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
